'use strict';
(()=>{
const P=window.PROTOCOLS||{},put=(p,id,text,choices=[],question=false,page=1,criteria='')=>p.nodes[id]={...(p.nodes[id]||{}),id,text,choices:choices.map(([label,to])=>({label,to})),question,page,criteria,contextNodes:[],incomplete:false};
const q=(p,id,text,c,criteria='',page=1)=>put(p,id,text,c,true,page,criteria),a=(p,id,text,to,page=1)=>put(p,id,text,[['Continuar',to]],false,page),t=(p,id,text,page=1)=>put(p,id,text,[],false,page);
const note=(p,id,text,page=1)=>{p.nodes[id].warnings=[...(p.nodes[id].warnings||[]),{title:'Ponto documental para validação',text,page}];};
{
 const p=P['adulto-raio-x-horarios-de-atendimento-do-servico-de-raio-x-nas-upas'];if(p){
 const rows=[
 ['Boa Vista','Avenida Paraná, 3654, Bacacheri','24 h','Segunda a sexta: 07h30–12h e 13h–17h'],
 ['Boqueirão','Rua Professora Maria de Assumpção, 2590, Boqueirão','24 h','Segunda a sexta: 13h–17h'],
 ['Cajuru','Rua Engenheiro Benedito Mario da Silva, 555, Cajuru','24 h','Segunda e quarta: 13h30–17h30. Terça, quinta e sexta: 07h30–13h30'],
 ['Campo Comprido','Rua Monsenhor Ivo Zanlorenzi, 3495, Campo Comprido','Não possui','Não possui'],
 ['Cidade Industrial','Rua Senador Accioly Filho, 3370, Cidade Industrial de Curitiba','24 h','Segunda a sexta: 13h–17h'],
 ['Fazendinha','Rua Carlos Klemtz, 1883, Fazendinha','24 h','Segunda a sexta: 10h–14h'],
 ['Pinheirinho','Rua Leon Nícolas, 2081, Capão Raso','Não possui','Não possui'],
 ['Sítio Cercado','Rua Dr. Levy Buquera, 700, Sítio Cercado','24 h','Terça, quarta e quinta: 09h–15h30'],
 ['Tatuquara','Rua Jornalista Emílio Zolá Florenzano, 835, Tatuquara','Segunda a sábado: 07h–23h. Domingos e feriados: 07h–00h','Segunda a sexta aparece na última linha, mas as horas e o restante dessa linha estão cortados no arquivo original']
 ];
 q(p,'rx-unit','Qual UPA deseja consultar?',rows.map((r,i)=>[r[0],'rx-'+i]),'Horários impressos em 25/05/2023. O documento contém dois quadros sob o título “Raio-X clínico e odontológico”, mas não identifica separadamente a modalidade de cada quadro. Os dois horários são apresentados sem atribuir modalidade por suposição. A vigência atual não foi confirmada por esse documento datado.');
 rows.forEach(([name,address,first,second],i)=>t(p,'rx-'+i,'UPA '+name+' — '+address+'.\nHorário do primeiro quadro: '+first+'.\nHorário do segundo quadro: '+second+'.\nReferência operacional municipal de 25/05/2023; modalidade por quadro e vigência atual pendentes de validação.'));
 p.entries=[{to:'rx-unit',page:1,label:'Consultar unidade e horários documentados'}];p.warning=null;
 }}
{
 const p=P['adulto-sangramento-genital-feminino'];if(p){const n=p.nodes;
 const severe='Sangramento em grande quantidade com sinais de choque hipovolêmico: PAS <90 mmHg; FC >100 bpm; FR >22 irpm; TEC >3 s; rebaixamento da consciência; oligúria.';
 const alerts='Sangramento em grande quantidade sem sinais de choque: FC >100 bpm; PAS <120 e >90 mmHg; palidez cutânea; fraqueza/astenia; pulso filiforme.';
 n['ob-start'].text='Há sangramento em grande quantidade com sinais de choque hipovolêmico?';n['ob-start'].criteria='Investigar dor abdominal; amenorreia/atraso menstrual; gestação; parto/aborto recente; mudança no padrão menstrual; trauma; febre; violência sexual; medicações contínuas.\n'+severe;
 n['ob-alert'].criteria=alerts;n['ob-ref'].text='Discutir com regulação do SAMU 3360-4980 e realizar o manejo inicial abaixo por história de violência sexual.';
 a(p,'ob-preg','Discutir com regulação do SAMU 3360-4980 e realizar o manejo inicial abaixo. Se gestante: decúbito lateral esquerdo e BCF a cada 20 min.','bleed-maternity');
 q(p,'bleed-maternity','A gestante já está vinculada a uma maternidade?',[['Sim','bleed-bound'],['Não','bleed-origin']]);
 t(p,'bleed-bound','Referenciar para a maternidade de vínculo. Para gestantes da região metropolitana vinculadas no município de origem, referenciar à respectiva maternidade.');
 q(p,'bleed-origin','Sem vínculo/pré-natal iniciado: qual a origem?',[['Região metropolitana','bleed-ht'],['Curitiba ou outra localidade','bleed-samu192']]);
 t(p,'bleed-ht','Gestante da região metropolitana sem vínculo com maternidade/sem iniciar pré-natal: referência ao Hospital do Trabalhador, conforme a regra específica da fonte.');
 t(p,'bleed-samu192','Gestante de Curitiba ou outra localidade, sem vínculo com maternidade/sem iniciar pré-natal: regulação via SAMU 192.');
 note(p,'bleed-origin','A regra específica da região metropolitana aponta Hospital do Trabalhador; o item seguinte usa “Curitiba ou outra localidade” e aponta SAMU 192, expressão que pode se sobrepor à região metropolitana. Apresentadas as duas regras, sem inventar exclusão territorial.');
 a(p,'ob-trauma-care','Realizar exame físico da genitália externa e exame especular, pesquisando lacerações.','bleed-laceration');
 q(p,'bleed-laceration','Foram identificadas lacerações?',[['Sim','bleed-laceration-samu'],['Não','bleed-trauma-gap']]);
 t(p,'bleed-laceration-samu','Presença de lacerações: discutir com regulação do SAMU 3360-4980.');
 t(p,'bleed-trauma-gap','Exame sem laceração: o ramo de trauma termina no exame e não define encaminhamento adicional nessa situação. O manejo subsequente permanece para validação clínica.');
 q(p,'ob-low','Foram excluídos abortamento e sangramento com repercussão hemodinâmica?',[['Sim','bleed-aps'],['Não ou ainda não definido','bleed-exclusion-pending']]);
 t(p,'bleed-aps','Após excluir abortamento e repercussão hemodinâmica: encaminhar à APS. A fonte descreve ibuprofeno 600 mg, sem frequência/duração nem via; validar a posologia individual.');
 t(p,'bleed-exclusion-pending','A condição para o encaminhamento à APS ainda não foi confirmada. A fonte não define outra conduta nesse ramo; validar a avaliação clínica, sem presumir exclusão de abortamento ou repercussão hemodinâmica.');
 n['ob-bhcg'].choices=n['ob-bhcg'].choices.map(c=>c.label==='Indeterminado'?{...c,to:'bleed-hcg-pending'}:c);
 t(p,'bleed-hcg-pending','Beta-hCG indeterminado: o documento contempla apenas positivo e negativo. Conduta para esse resultado pendente de validação; não se atribuiu indicação automática de SAMU apenas pelo resultado indeterminado.');
 a(p,'ob-positive','Beta-hCG positivo: discutir com regulação do SAMU 3360-4980. Aplicar a orientação de referência da gestante conforme vínculo e origem.','bleed-maternity');
 q(p,'ob-negative','Na reavaliação após beta-hCG negativo, qual situação descreve os exames?',[['Anemia intensa: Hb <7 g/dL','bleed-clm'],['Coagulopatia','bleed-clm'],['Ambas','bleed-clm'],['Exames normais','bleed-aps-normal'],['Outras alterações / faixa não definida','bleed-labs-gap']],'Reavaliar após hemograma, beta-hCG e TAP. Não equiparar qualquer exame alterado a exame normal.');
 t(p,'bleed-clm','Anemia intensa com Hb <7 g/dL e/ou coagulopatia: cadastrar na CLM.');
 t(p,'bleed-aps-normal','Com exames normais: referenciar à APS e prescrever ibuprofeno 600 mg, conforme o documento. Frequência, via e duração não informadas; validar a posologia.');
 t(p,'bleed-labs-gap','O documento não define encaminhamento para anemia sem Hb <7 g/dL ou outras alterações fora das condições listadas. Validar especificamente os achados; não presumir exames normais nem indicação automática de CLM.');
 }}
{
const p=P['adulto-sepse-em-adultos'];if(p){const n=p.nodes;
 const exams='Hemograma, proteína C reativa, glicose, função renal, função hepática, bilirrubinas, gasometria arterial, lactato, TAP/TTPa, eletrólitos, parcial de urina, urocultura, radiografia de tórax quando possível e ECG.';
 const etiologies='ACHADOS E HIPÓTESES DA TABELA: diarreia — infecção intestinal; convulsão/irritação meníngea/confusão — meningite, encefalite, lesões SNC, púrpura trombocitopênica (PTT); palidez — hemólise aguda (infecções anaeróbias graves), malária, AIDS; dispneia/tosse/crepitações — pneumonia, pneumocistose, tuberculose, COVID-19; icterícia — leptospirose, dengue, febre amarela, malária, colecistite, colangite, abscesso hepático; sonda/cateter — infecção do sítio de inserção, endocardite; disúria/Giordano — pielonefrite, abscesso perirrenal; dor pélvica/corrimento — DIP, endometrite, abscesso tubo-ovariano; esplenomegalia — malária, mononucleose aguda, salmonelose septicêmica; sopro cardíaco — endocardite; peritonismo — apendicite, pancreatite, diverticulite, perfuração de alças; lesões de pele — celulite, erisipela, fasciíte; petéquias/púrpuras/rash — meningococcemia, dengue, choque tóxico estrepto/estafilocócico, endocardite, sífilis, exantema por drogas.';
 const oxygen='Oxigênio: cateter nasal até 6 L/min, com estimativa impressa de aumento de FiO₂ de 3% por litro; máscara com reservatório acima de 6 L/min, com estimativa impressa de 10% por litro. Indicações de IOT: rebaixamento de consciência, inabilidade de proteger vias aéreas ou instabilidade hemodinâmica. As estimativas de FiO₂ não foram transformadas em valores medidos ou cálculo automático.';
 a(p,'sp-severe','SEPSE GRAVE: monitorar dados vitais e coração, dois acessos venosos calibrosos, oxigênio visando SO₂ >92% (DPOC 88–92%), sonda vesical de demora. Ressuscitação com SF 0,9% ou Ringer lactato 30 mL/kg IV nas primeiras 3 h, com cuidado de congestão pulmonar.\nColetar: '+exams+'\nApós coleta dos exames, iniciar antibiótico empírico NA PRIMEIRA HORA segundo o foco. A escolha do antibiótico abaixo antecede a reavaliação de três horas.\n'+oxygen,'sp-s-focus');
 const labels=[['Pulmonar','pulm'],['Urinário','urine'],['Abdominal','abdom'],['Pele e partes moles','skin'],['Sistema nervoso central','cns'],['Sem foco definido','undefined'],['Outro foco sem esquema no quadro','other']];
 for(const severe of [false,true]){
 const prefix=severe?'sp-s-':'sp-',next=severe?'sp-pressure':'sp-followup';
 a(p,prefix+'focus','Avaliação clínica com anamnese e exame físico para buscar ou reavaliar o foco. Se ainda não coletados, colher: '+exams+'\n'+etiologies,prefix+'antibiotic',2);
 q(p,prefix+'antibiotic','Qual foco suspeito orienta iniciar ou ajustar o antibiótico empírico?',labels.map(([l,k])=>[l,prefix+k]),'Esquemas da tabela municipal de 2024, após coleta de exames. Para sepse grave, iniciar na primeira hora, sem aguardar a reavaliação de três horas. Duração não especificada na tabela; alternativas por peso sem população/teto explicitados. A reavaliação não implica repetir automaticamente uma dose já administrada.',2);
 q(p,prefix+'pulm','Qual situação do quadro pulmonar se aplica?',[['Esquema geral',''+prefix+'pulm-usual'],['DPOC com possibilidade de medicação VO',prefix+'pulm-dpoc'],['Impossibilidade de medicação VO',prefix+'pulm-no-vo']],'A indicação de ciprofloxacino por impossibilidade de VO está impressa abaixo do esquema de DPOC, sem explicitar o alcance da substituição.',2);
 a(p,prefix+'pulm-usual','Pulmonar: ceftriaxona 2 g IV 1x/dia OU 100 mg/kg/dia + azitromicina 500 mg, 1 comprimido VO/dia.',next,2);
 a(p,prefix+'pulm-dpoc','Pulmonar, se DPOC: ceftriaxona 2 g EV 1x/dia + levofloxacino 500 mg, 1 comprimido VO/dia.',next,2);
 a(p,prefix+'pulm-no-vo','Impossibilidade de medicação VO: o quadro imprime ciprofloxacino 200 mg (apresentação), dose 400 mg IV de 12/12 h. Validar o alcance da substituição e das associações, que não são explicitados nessa linha.',next,2);
 q(p,prefix+'urine','Qual alternativa do foco urinário será prescrita?',[['Ceftriaxona',prefix+'urine-cef'],['Ciprofloxacino',prefix+'urine-cipro']],'A tabela apresenta as alternativas com OU.',2);
 a(p,prefix+'urine-cef','Urinário: ceftriaxona 2 g IV 1x/dia OU 100 mg/kg/dia.',next,2);
 a(p,prefix+'urine-cipro','Urinário: ciprofloxacino 400 mg IV de 12/12 h.',next,2);
 a(p,prefix+'abdom','Abdominal: ceftriaxona 2 g IV 1x/dia OU 100 mg/kg/dia + metronidazol 500 mg IV de 8/8 h OU 40 mg/kg/dia de 8/8 h + gentamicina 5–7 mg/kg/dia IV a cada 24 h. Alternativas por peso não têm população/teto definidos.',next,2);
 a(p,prefix+'skin','Pele/partes moles: cefazolina 2 g IV de 8/8 h OU 50–100 mg/kg/dia de 8/8 h.',prefix+'skin-necrosis',2);
 q(p,prefix+'skin-necrosis','Há sinais de necrose?',[['Sim',prefix+'skin-cipro'],['Não',next]],'',2);
 a(p,prefix+'skin-cipro','Se necrose: associar ciprofloxacino 400 mg IV de 12/12 h.',next,2);
 a(p,prefix+'cns','Sistema nervoso central: ceftriaxona 2 g IV 1x/dia OU 100 mg/kg/dia é o esquema impresso. A adequação desse esquema específico ao foco SNC permanece para validação clínica.',next,2);
 t(p,prefix+'other','A tabela relaciona hipóteses que não têm esquema específico entre os seis focos terapêuticos. Validar o regime para o foco identificado; não o classificar automaticamente como sem foco definido. Na sepse grave, a fonte exige antibiótico na primeira hora após coleta de exames; esta lacuna não autoriza aguardar a reavaliação de três horas.',2);
 a(p,prefix+'undefined','Sem foco definido: ceftriaxona 2 g IV 1x/dia OU 100 mg/kg/dia + metronidazol 500 mg IV de 8/8 h OU 40 mg/kg/dia de 8/8 h. Investigar o foco e ajustar a prescrição.',next,2);
 }
 a(p,'sp-shock','CHOQUE SÉPTICO: obter acesso venoso central; norepinefrina 2 mg/2 mL IV, 0,1–2 mcg/kg/min em BIC, aumentando a infusão a cada 10 min conforme necessidade.','sp-after-norepi');
 q(p,'sp-after-norepi','Após o manejo com norepinefrina, ainda persiste PAS <90 mmHg?',[['Sim','sp-hydrocortisone'],['Não','sp-perfusion']]);
 a(p,'sp-hydrocortisone','Se ainda PAS <90 mmHg: associar hidrocortisona 200 mg IV em BIC em 24 h.','sp-after-hydrocortisone');
 q(p,'sp-after-hydrocortisone','Após a associação indicada, ainda persiste PAS <90 mmHg?',[['Sim','sp-epinephrine'],['Não','sp-perfusion']]);
 a(p,'sp-epinephrine','Associar adrenalina: o original imprime “1:1000: 1–2 mcg/kg/min”, sem via ou preparo nessa linha. A dose e o preparo exigem validação específica antes da execução; não foi presumido 0,1–2 nem outra dose.','sp-refractory');
 note(p,'sp-epinephrine','Faixa de adrenalina impressa de 1–2 mcg/kg/min, sem preparo/velocidade de diluição e sem via explícita. Validar esse regime específico; não foi corrigido por inferência.');
 q(p,'sp-refractory','Há refratariedade após manejo indicado com doses progressivas e associativas de vasoativos?',[['Sim','sp-clm-refractory'],['Não','sp-perfusion']]);
 t(p,'sp-clm-refractory','Acionar CLM em protocolo de sepse por refratariedade ao manejo. Manter monitorização e reavaliação.');
 q(p,'sp-perfusion','Houve melhora da PAS, mas persiste má perfusão (TEC >3 s) ou lactato elevado?',[['Sim','sp-perfusion-care'],['Não','sp-followup']]);
 a(p,'sp-perfusion-care','Avaliar necessidade de mais volume. Associar dobutamina conforme o quadro: o original imprime “12,5 mg IV; 2,5–5 mcg/kg/min em BIC”. A apresentação/volume associada a 12,5 mg não é esclarecida: não interpretar como bolus. Validar a preparação. O volume e velocidade de uma nova expansão não estão especificados. As duas medidas estão listadas no quadro, sem regra de exclusividade.','sp-followup');
 a(p,'sp-followup','Cadastrar na CLM; reavaliação constante e ajuste de antimicrobianos sempre que possível. Manter glicemia <180 mg/dL; profilaxia de TEP: heparina 5.000 UI SC de 12/12 h; profilaxia de úlcera de estresse: omeprazol 40 mg IV a cada 24 h.\nNos casos de sepse grave/choque: reavaliar a cada 6 h o estado volêmico, perfusão e lactato; calcular SOFA e registrar evolução na CLM. Reavaliar o componente neurológico pela escala de coma de Glasgow, usada no SOFA.\nMetas impressas no choque: PAS >90 mmHg; FC <100 bpm; diurese >0,5 mL/kg/h; TEC <3 s; normalização do lactato. “Excesso de base <-5 mEq/L” aparece como meta na fonte e permanece para validação, sem ser convertido em alvo automático.','sp-monitor-end');
 t(p,'sp-monitor-end','Manter monitorização, reavaliação constante e registro de evolução na CLM. O documento não estabelece alta nesse desfecho.');
 note(p,'sp-followup','A meta impressa “excesso de base <-5 mEq/L” requer validação do comparador e do objetivo; não foi substituída por outro alvo.');
 if(window.SCORE_CALCULATORS){const d=window.SCORE_CALCULATORS.definitions.sofa;d.nodes=d.nodes.filter(id=>!['sp-pulm','sp-urine','sp-abdom','sp-skin','sp-cns','sp-undefined'].includes(id));d.nodes.push('sp-followup');}
}}
})();
