'use strict';
(()=>{
const P=window.PROTOCOLS||{},put=(p,id,text,choices=[],question=false,page)=>p.nodes[id]={...(p.nodes[id]||{}),id,text,choices:choices.map(([label,to])=>({label,to})),question,page:page||p.nodes[id]?.page||1,contextNodes:[],incomplete:false};
const q=(p,id,text,c,criteria='',page)=>{put(p,id,text,c,true,page);p.nodes[id].criteria=criteria;},a=(p,id,text,to,page)=>put(p,id,text,[['Continuar',to]],false,page),t=(p,id,text,page)=>put(p,id,text,[],false,page);
const p=P['infantil-sindrome-inflamatoria-multissistemica-pediatrica'];if(p){const n=p.nodes;
a(p,'p1n4','Entrada municipal:0–21anos com critérios de Kawasaki OUchoque tóxico OUfebre axilar≥38°Cpor≥3dias+≥1manifestação:GI(dor abdominal,vômitos,diarreia);neurológica(cefaleia,letargia,confusão,irritabilidade);rashdifuso;conjuntivite;mucosaoral(fissura/eritemalabial,língua em framboesa);extremidades(eritema/edema mãos/pés);linfonodomegalia cervical. PesquisarSARS-CoV2(RT-PCR/antígeno recente) oucontatoCOVID19;“recente”sem janela definida,não excluirSIM-P automaticamente por teste ausente. Fora do escopo,validar protocolo aplicável,sem atribuir baixa probabilidade pelo não enquadramento.','p1n9');
n.p1n4.supportTables=[
{title:'Kawasaki — critérios municipais',rows:[['Definição','Critérios'],['Completa','Febre inexplicada≥4dias+4dos5critérios clínicos'],['Incompleta','Febre inexplicada≥5dias+2–3dos5critérios'],['1','Conjuntivite bilateral bulbar não exsudativa'],['2','Eritema/edema mãos/pés na fase aguda;descamação periungueal convalescente'],['3','Eritema/fissura labial,hiperemia orofaríngea,língua em framboesa'],['4','Exantema polimorfo,não vesicular'],['5','≥1linfonodo cervical>1,5cm']]},
{title:'Choque tóxico estafilocócico — quadro clínico municipal',rows:[['Critérios','Detalhes'],['Clínicos','Febre≥38,9°C;rashmacular difuso eritrodérmico;descamação1–2semanas apósrash;hipotensão'],['Multissistêmico','≥3órgãos afetados nos itens abaixo'],['GI','Vômitos/diarreia no início'],['Muscular','Mialgia intensa ouCPK>2×limite normal'],['Mucosas','Vaginal/orofaríngea ouhiperemia conjuntival'],['Renal','Ureia/creatinina>2×limite normal oupiúria>5leucócitos/campo semITU'],['Hepático','Bilirrubina/transaminases>2×limite normal'],['Hematológico','Plaquetas<100.000/mm³'],['SNC','Desorientação/consciência alterada semfocalidade,fora de febre/hipotensão']]}
];
n.p1n9.criteria='Choque/hipotensão/disfunção cardíaca;perfusão lentificada;consciência alterada;taquipneia/dispneia;estertores;galope;arritmia. A fonte fornece FR normal e não um limiar separado de taquipneia;sem definir automaticamente “>limite normal” como novo critério.';
n.p1n9.supportTables=[
{title:'Hipotensão por PAS',rows:[['Idade','PASmmHg'],['0–28dias','<60'],['1–12meses','<70'],['1–10anos','<70+2×idade emanos'],['>10anos','<90']]},
{title:'FC/FR normais — referência municipal',rows:[['FCbpm','FRirpm'],['RN–3meses80–200','<1ano30–60'],['3meses–2anos100–190','1–2anos24–40'],['2–5anos80–140','Pré-escolar22–34'],['5–10anos60–120','Escolar18–30'],['>10anos60–100','Adolescente12–16']]}
];
const care='Manejo inicial:2acessosIVperiféricos;O₂2L/minseSpO₂<92%;monitorizar vitais;SF0,9%20mL/kgem30min,repetir conformenecessidade. Dor/febre:dipirona500mg/mL15mg/kg/DOSE IVouIM. Metilprednisolona2mg/kg/DIA IVdivididos12/12h(totaldiário,não2mg/kgpor tomada). Fonte não define tetos,duração,limite de expansão/intervalo da dipirona ou contraindicações dos esquemas;validar prescrição e reavaliação.';
a(p,'p1n11','DiscutirSAMU3360-4980.\n'+care,'simp-samu-kaw');
q(p,'p1n16','A avaliação preenche Kawasaki completa ou incompleta?',[['Completa','p1n14'],['Incompleta','p1n14'],['Não preenche','p1n17'],['Dados insuficientes / classificação indeterminada','simp-kaw-pending']],'Completa:fonte escreve≥4dias de febre inexplicada+4/5critérios;incompleta:≥5dias+2–3/5. Aplicar quadro completo da entrada,não diagnosticar por febre ouimagem isolada. Ausência de dados não equivale a “não”.');
n.p1n16.supportTables=[n.p1n4.supportTables[0]];
t(p,'simp-kaw-pending','Classificação de Kawasaki indeterminada:concluir avaliação dos cinco critérios e duração da febre. Fonte não define ramo incerto;validar destino,sem assumir ausência nem baixa probabilidade.');
a(p,'p1n14','Kawasaki completa/incompleta:discutirSAMU3360-4980.\n'+care,'simp-samu-asa-kaw');
a(p,'p1n17','Hemograma,PCR(proteínaC-reativa),urina parcial,RXtórax;investigarSARS-CoV2/influenza;avaliar outros focos de febre. Fluxo geral respiratório citado não integra73documentos,sem substituição por outro escopo.','p1n20');
n.p1n22.text='Foco identificado:fonte descreve probabilidade baixa deSIM-P;conduzir conforme foco,reavaliar e observar novos sinais/sintomas,pois COINFECÇÃOÉPOSSÍVEL. Não excluiSIM-P automaticamente. Sem esquema específico,intervalo de observação ou critério de alta definidos neste quadro.';
q(p,'p1n24','A proteínaC-reativa está elevada?',[['Sim','p1n26'],['Não','p1n28'],['Resultado ausente / indeterminado','simp-crp-pending']],'Documento não fornece corte numérico/unidade para “elevada”;interpretar resultado com referência laboratorial/avaliação clínica. Exame ausente não equivale a normal.');
t(p,'simp-crp-pending','PCR não interpretável/indisponível:validar investigação e destino;sem classificar como baixa probabilidade por falta do exame.');
a(p,'p1n26','CadastrarCLM.\n'+care,'simp-clm-kaw');
for(const dest of ['samu','clm']){
q(p,'simp-'+dest+'-kaw','Há manifestações de doença de Kawasaki para o ramo doAAS?',[['Sim','simp-'+dest+'-asa-kaw'],['Não','simp-'+dest+'-asa-no'],['Indeterminadas','simp-'+dest+'-asa-pending']],'Não confundir manifestações com diagnóstico automático;fonte usa estes dois rótulos para definir o esquema,não fornece contraindicações/tetos.');
n['simp-'+dest+'-kaw'].supportTables=[n.p1n4.supportTables[0]];
t(p,'simp-'+dest+'-asa-kaw',(dest==='samu'?'Manter discussãoSAMU3360-4980.':'Manter cadastroCLM.')+' Com manifestações deKawasaki:AAS30–50mg/kg/DIA VOdivididos6/6h. Manter manejo inicial validado;sem teto/duração/critérios de contraindicação definidos.');
t(p,'simp-'+dest+'-asa-no',(dest==='samu'?'Manter discussãoSAMU3360-4980.':'Manter cadastroCLM.')+' Sem manifestações deKawasaki:AAS3–5mg/kg/DIA VO;fracionamento,teto,duração/contraindicações não especificados. Manter manejo inicial validado.');
t(p,'simp-'+dest+'-asa-pending',(dest==='samu'?'Manter discussãoSAMU3360-4980.':'Manter cadastroCLM.')+' Manifestações indeterminadas:validar enquadramento antes de escolher oAAS;não assumir ramo sem manifestações por campo vazio. Manter suporte/manejo já indicados.');
}
n.p1n28.text='Fonte descreve baixa probabilidade deSIM-P:tratamento sintomático e reavaliação24–48hpara novos sinais/sintomas. Não equivale a exclusão definitiva;agente/dose sintomática e critérios de retorno imediato não definidos neste quadro,sem extrapolar automaticamente o esquemaIVdos ramosSAMU/CLM.';
for(const node of Object.values(n))node.contextNodes=[];
}
// Segunda conferência visual integral de farmacodermias e febre: dados/condutas
// do lote23 válidos preservados. Completa apenas o acesso ao foco pulmonar,
// cujo protocolo integral foi confirmado no lote24.
const f=P['infantil-febre-em-pediatria'];if(f)f.nodes.p1n16.linkedEntries.push({protocol:'infantil-pneumonia-em-pediatria',entry:'p2n4',label:'Pneumonia pediátrica'});
})();
