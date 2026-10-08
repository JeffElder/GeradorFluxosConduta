"""Convert source panels into native text and explicit, inspectable navigation.
PDF geometry extraction is stored as source material, never used at runtime.
The output is a transcription aid, not a clinically validated device.
"""
import json,re,unicodedata,sys
from pathlib import Path
import fitz
ROOT=Path(__file__).resolve().parents[1];WORK=ROOT.parent
norm=lambda s:''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
clean=lambda s:re.sub(r'\s+',' ',s).strip()
# Explicit corrections to geometrical extraction, checked against source arrows.
ADD={
 # The ischemia panel is supporting context, not a mandatory action screen.
 'adulto-sindromes-coronarianas':[(1,6,12,'Avaliar o ECG')],
 'infantil-dor-abdominal-em-pediatria-due':[(1,21,23,'Reavaliar após manejo')],
 'infantil-infeccao-do-trato-urinario-em-pediatria':[(1,20,33,'Reavaliar após manejo')],
 'adulto-diarreia-aguda':[(1,11,5,'Reavaliar após manejo')],
 'adulto-intoxicacoes-exogenas':[(1,7,9,'Reavaliar após manejo inicial')],
 'adulto-delirium':[(2,7,9,'Reavaliar após correção')],
 'adulto-choque':[(2,20,12,'Sim')],
 'adulto-hematuria-macroscopica':[(1,36,38,'Sim')],
 'adulto-avaliacao-do-paciente-com-hiv-na-upa':[(1,12,14,'Não')],
 'infantil-choque-em-pediatria':[(2,12,13,'Sim'),(2,17,18,'Sim')],
}
WARNINGS={
 'infantil-infeccao-do-trato-urinario-em-pediatria':'A dose/frequência de ceftriaxona no documento requer validação farmacológica. O valor suspeito foi ocultado da transcrição.',
 'adulto-dor-toracica':'O trecho de dor vascular contém uma unidade de infusão de nitroglicerina que requer conferência farmacológica. A dose não foi convertida em instrução executável.',
 'infantil-emergencias-respiratorias-em-pediatria':'O teto de dose de adrenalina no PDF requer conferência da unidade. Esse valor não foi convertido em instrução executável.',
 'adulto-parada-cardio-respiratoria-pcr':'O PDF reúne páginas de adulto, pediatria e pós-PCR. Selecione a população correta. A transcrição pediátrica apresenta inconsistências de unidade/redação que exigem validação clínica.',
 'adulto-emergencias-hiperglicemicas':'Fluidos, insulina, potássio e bicarbonato são componentes do mesmo manejo, não alternativas mutuamente exclusivas. As diluições e unidades do documento exigem conferência antes da prescrição.'
}
def safe_text(s,id):
 if id=='adulto-dor-toracica':s=re.sub(r'NITROGLICERINA 5MG/ML: 5 A 10MCG/KG/MIN EM BIC','NITROGLICERINA — unidade de infusão do documento pendente de validação farmacológica.',s,flags=re.I)
 if id=='infantil-emergencias-respiratorias-em-pediatria':s=re.sub(r'ATÉ O MÁX DE 0,3mg/kg','[LIMITE MÁXIMO NO PDF COM UNIDADE A CONFERIR]',s,flags=re.I)
 if id=='adulto-parada-cardio-respiratoria-pcr':
  s=re.sub(r'5MG/G EM BOLUS', '[DOSE DE AMIODARONA NO DOCUMENTO PENDENTE DE VALIDAÇÃO]',s,flags=re.I)
  s=re.sub(r'≥ METADE DO DIÂMETRO TORACICO', '[PROFUNDIDADE NO DOCUMENTO PENDENTE DE VALIDAÇÃO]',s,flags=re.I)
 if id=='infantil-infeccao-do-trato-urinario-em-pediatria':
  s=re.sub(r'100MG/Kg 12/12H', '[DOSE/FREQUÊNCIA PENDENTE DE VALIDAÇÃO]',s,flags=re.I)
 return s
protocols={};report=[]
for f in sorted((WORK/'tmp/graphs').glob('*.json')):
 id=f.stem;pages=json.loads(f.read_text());doc=fitz.open(WORK/'tmp/pdfs'/(id+'.pdf'));nodes={};pageinfo=[];entries=[]
 for p in pages:
  pn=p['page'];key=lambda i:f'p{pn}n{i}';lookup={n['id']:n for n in p['nodes']};edges=p['edges'][:]
  for ep,fr,to,label in ADD.get(id,[]):
   if ep==pn:edges.append({'from':fr,'to':to,'label':label})
  # Complete a binary label only when both arrow targets are present and one label is explicit.
  for n in p['nodes']:
   es=[e for e in edges if e['from']==n['id']]
   if n['diamond'] and len(es)==2 and sum(bool(e['label']) for e in es)==1:
    known=next(e['label'] for e in es if e['label'])
    if known in ['Sim','Não']:next(e for e in es if not e['label'])['label']='Não' if known=='Sim' else 'Sim'
   if id=='adulto-deficit-focal-agudo' and pn==1 and n['id']==15:
    for e in es:
     if e['to']==21:e['label']='Sim'
   if id=='infantil-dor-abdominal-em-pediatria-due' and pn==1 and n['id']==38:
    for e in es:
     if e['to']==40:e['label']='Sim'
   text=n['text'];text=re.sub(r'^(SIM|NÃO)\s+(?=\S)','',text) if n['diamond'] else text
   if n['diamond']:text=re.sub(r'\?\s*(SIM|NÃO|Ver P\.2 • C).*','?',text,flags=re.I)
   nodes[key(n['id'])]={'id':key(n['id']),'page':pn,'text':safe_text(text,id),'question':n['diamond'],'choices':[{'label':e['label'],'to':key(e['to'])} for e in es], 'sourceBox':n['rect']}
  inbound={e['to'] for e in edges};outbound={e['from'] for e in edges}
  roots=[n for n in p['nodes'] if n['id'] in outbound and n['id'] not in inbound]
  roots.sort(key=lambda n:(n['rect'][1],n['rect'][0]))
  if roots:entries.append({'to':key(roots[0]['id']),'page':pn,'label':clean(p['text'].split('\n')[0])})
  notes=[key(n['id']) for n in p['nodes'] if n['id'] not in inbound|outbound]
  # Preserve table columns in the native text reference instead of flattening dose tables.
  pdfpage=doc[pn-1];tables=[]
  try:
   for table in pdfpage.find_tables().tables:
    rows=table.extract()
    if table.row_count>=2 and table.col_count>=2 and len(rows)>1:
     tables.append({'rect':list(table.bbox),'rows':[[safe_text(clean(c or ''),id) for c in row] for row in rows]})
  except Exception:pass
  blocks=[]
  for b in pdfpage.get_text('blocks',sort=True):
   if b[6]!=0 or b[1]<85:continue
   rect=fitz.Rect(b[:4]);center=(rect.tl+rect.br)/2
   if any(fitz.Rect(t['rect']).contains(center) for t in tables):continue
   text=clean(b[4])
   if text and text not in ['SIM','NÃO'] and not re.fullmatch(r'P\.?\s*\d+',text):blocks.append({'text':safe_text(text,id),'y':b[1]})
  pageinfo.append({'page':pn,'heading':clean(p['text'].split('\n')[0]),'notes':notes,'blocks':blocks,'tables':tables})
 # Explicit source-specific routing where the PDF uses icons or tables, not boxed text.
 def node(k,text,question=False,choices=None,page=1):nodes[k]={'id':k,'page':page,'text':text,'question':question,'choices':choices or []}
 def choice(label,to):return {'label':label,'to':to}
 if id=='adulto-sindromes-coronarianas':
  # Start at the first clinical question. The pain/ECG panels are references.
  entries=[{'to':'p1n7','page':1,'label':'Suspeita de síndrome coronariana'}]
  pageinfo[0]['notes']=[]
  for k in ['p1n1','p1n5']:nodes[k]['choices']=[]
  nodes['p1n7']['contextNodes']=['p1n1']
  nodes['p1n6']['contextNodes']=['p1n5']
  # Expand the source's numbered routes into explicit yes/no clinical criteria.
  nodes['p1n12']['text']='O ECG apresenta supradesnivelamento do segmento ST?'
  nodes['p1n12']['contextNodes']=['p1n5']
  nodes['p1n12']['choices']=[choice('Sim','p1n15'),choice('Não','new-bundle-block')]
  node('new-bundle-block','A dor é tipo A e há bloqueio de ramo esquerdo (BRE) ou direito (BRD) novo ou supostamente novo?',True,
       [choice('Sim','p1n15'),choice('Não','very-high-risk')])
  nodes['new-bundle-block']['contextNodes']=['p1n1']
  node('very-high-risk','Há dor tipo A ou B associada a algum fator de muito alto risco abaixo?',True,
       [choice('Sim','p1n15'),choice('Não','p1n17')])
  nodes['very-high-risk']['criteria']=nodes['p1n14']['text'].split('FATORES DE MUITO ALTO RISCO:',1)[1].strip().replace('','•')
  nodes['very-high-risk']['contextNodes']=['p1n1']
  nodes['p1n19']['text']='A dor tem menos de 6 horas de duração?'
  nodes['p1n19']['choices']=[choice('Sim','p1n25'),choice('Não','ischemic-ecg')]
  node('ischemic-ecg','O ECG apresenta infradesnivelamento de ST ou inversão de onda T?',True,
       [choice('Sim','p1n25'),choice('Não','elevated-troponin')])
  nodes['ischemic-ecg']['contextNodes']=['p1n5']
  node('elevated-troponin','A primeira troponina ultrassensível está elevada?',True,
       [choice('Sim','p1n25'),choice('Não','heart-risk')])
  nodes['elevated-troponin']['contextNodes']=['p2n29']
  node('heart-risk','O HEART score é maior ou igual a 4?',True,
       [choice('Sim','p1n25'),choice('Não','p1n21')])
  nodes['p1n9']['text']=nodes['p1n9']['text'].replace(' (ROTA 4)','')
  nodes['p1n21']['text']=re.sub(r'^ROTA 3\s*','Critérios para considerar alta: ',nodes['p1n21']['text'])
  # Page 1: perform the second troponin/ECG, then select its clinical outcome.
  # Keep this decision separate so the UI does not call its branches complementary.
  nodes['p1n25']['text']=re.sub(r'^SIM\s+','',nodes['p1n25']['text'])
  node('reassessment','Após a segunda troponina e o novo ECG, qual resultado corresponde à reavaliação?',True,
       [choice(nodes[k]['text'],k) for k in ['p1n27','p1n28','p1n29']])
  nodes['p1n25']['choices']=[choice('Reavaliar após os exames','reassessment')]
 if id=='adulto-emergencias-hiperglicemicas':
  nodes['p1n8']['choices'].insert(0,choice('Sim','metabolic'))
  node('metabolic','Qual conjunto de critérios está presente?',True,[choice(nodes['p1n12']['text'],'p1n12'),choice(nodes['p1n11']['text'],'p1n11')])
 if id=='adulto-sincope':
  node('cause','Qual causa foi estabelecida?',True,[choice('Síncope reflexa','reflex'),choice('Síncope postural','postural'),choice('Síncope cardíaca','cardiac')])
  node('reflex','TRANQUILIZAR E ORIENTAR PACIENTE SOBRE O QUADRO. EVITAR FATORES PRECIPITANTES.')
  node('postural','TRANQUILIZAR E ORIENTAR PACIENTE SOBRE O QUADRO. EVITAR FATORES PRECIPITANTES. SE CAUSA MEDICAMENTOSA: ENCAMINHAR À APS PARA REVER MEDICAÇÕES.')
  node('cardiac','IDENTIFICADA A CAUSA, MANEJAR DE FORMA INDIVIDUALIZADA.')
  nodes['p1n13']['choices'].insert(0,choice('Sim','cause'))
 if id=='adulto-parada-cardio-respiratoria-pcr':
  entries=[{'to':'p1n4','page':1,'label':'PCR — adulto'},{'to':'p2n4','page':2,'label':'PCR — pediatria'},{'to':'p3n4','page':3,'label':'Cuidados após retorno da circulação espontânea'}]
  nodes['p1n12']['choices'].insert(0,choice('Sim','p1n14'))
  nodes['p2n9']['choices']=[choice('Checar ritmo após 2 minutos','p2n12')]
  for pn, pairs,roscn in [(1,[(14,15),(17,23),(26,29)],44),(2,[(15,16),(18,24),(27,30)],43)]:
   energy=nodes[f'p{pn}n'+str(50 if pn==1 else 49)]['text']
   for fr,to in pairs:
    shock=f'p{pn}shock{fr}';node(shock,'APLICAR CHOQUE. '+energy,choices=[choice('Continuar',f'p{pn}n{to}')],page=pn)
    if fr in [14,15]:nodes[f'p{pn}n{fr}']['choices']=[choice('Choque',shock)]
    else:
     for c in nodes[f'p{pn}n{fr}']['choices']:
      if c['label']=='Sim':c['to']=shock
   check=f'p{pn}roscheck';node(check,'Houve retorno da circulação espontânea?',True,[choice('Sim','p3n4'),choice('Não',f'p{pn}n'+str(51 if pn==1 else 14))],page=pn)
   nodes[f'p{pn}n{roscn}']['text']='Reavaliar os sinais de retorno da circulação espontânea.';nodes[f'p{pn}n{roscn}']['choices']=[choice('Reavaliar',check)]
   for k in [38,41] if pn==1 else [39,41]:nodes[f'p{pn}n{k}']['choices']=[choice('Continuar no ramo chocável',f'p{pn}n'+str(14 if pn==1 else 15))]
 # Complete navigation-only labels using the full destination condition, never invent a yes/no branch.
 for n in list(nodes.values()):
  if len(n['choices'])==1 and not n['question'] and not n['choices'][0]['label']:n['choices'][0]['label']='Próxima etapa'
  elif len(n['choices'])>1:
   groups={}
   for c in n['choices']:groups.setdefault(c['label'],[]).append(c)
   for label,cs in groups.items():
    if label in ['Sim','Não'] and len(cs)>1:
     g=n['id']+'-'+norm(label);node(g,'Qual achado corresponde ao caso?',True,[choice(nodes[c['to']]['text'],c['to']) for c in cs],n['page'])
     n['choices']=[c for c in n['choices'] if c not in cs]+[choice(label,g)]
   for c in n['choices']:
    if not c['label']:c['label']=nodes[c['to']]['text']
  n['incomplete']=n['question'] and len(n['choices'])<2
 # A page-only reference continues to that source page's flow when it has one.
 for n in nodes.values():
  if not n['choices']:
   m=re.fullmatch(r'(?:MANEJO CLÍNICO\s*\()?VER P\.?\s*(\d+)\)?',n['text'],re.I)
   if m:
    dest=next((e['to'] for e in entries if e['page']==int(m[1])),None)
    if dest:n['choices']=[choice('Continuar neste protocolo',dest)]
 for n in nodes.values():
  assert all(c['to'] in nodes for c in n['choices']),(id,n['id'])
 report.append({'id':id,'nodes':len(nodes),'questions':sum(n['question'] for n in nodes.values()),'unresolved':[n['id'] for n in nodes.values() if n.get('incomplete')]})
 protocols[id]={'id':id,'entries':entries,'nodes':nodes,'pages':pageinfo,'warning':WARNINGS.get(id),'status':'transcribed-not-clinically-validated'}
(ROOT/'site/protocols.js').write_text('window.PROTOCOLS = '+json.dumps(protocols,ensure_ascii=False,separators=(',',':'))+';\n')
(ROOT/'conversion-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('Protocols',len(protocols),'questions',sum(x['questions'] for x in report),'unresolved',sum(len(x['unresolved']) for x in report))
for x in report:
 if x['unresolved']:print(x['id'],x['unresolved'])
