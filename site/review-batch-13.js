'use strict';
(()=>{
 const P=window.PROTOCOLS||{};
 const put=(p,id,text,choices=[],question=false,page=1,criteria='')=>p.nodes[id]={id,text,choices:choices.map(([label,to])=>({label,to})),question,page,criteria,contextNodes:[],incomplete:false};
 const q=(p,id,text,choices,criteria='',page=1)=>put(p,id,text,choices,true,page,criteria);
 const a=(p,id,text,to,page=1)=>put(p,id,text,[['Continuar',to]],false,page);
 const t=(p,id,text,page=1)=>put(p,id,text,[],false,page);
 const note=(p,node,text,page=1)=>{p.nodes[node].warnings=[...(p.nodes[node].warnings||[]),{title:'Ponto documental para validação clínica',text,page}];};
 {
 const p=P['adulto-nauseas-e-vomitos'];if(p){const n=p.nodes;
 n.p1n9.criteria=n.p1n11.text;n.p1n24.criteria=n.p1n21.text;
 const symptoms='Sintomáticos do quadro municipal: metoclopramida 5 mg/mL IV OU dimenidrato 50 mg/mL IM; dipirona 500 mg/mL IV ou IM. São concentrações/apresentações: a dose e o volume de administração não são informados nesse quadro e exigem validação antes da prescrição.';
 const hydration='Dois acessos venosos calibrosos; monitorar dados vitais. Expansão: SF 0,9% 30 mL/kg em 30 minutos; repetir até reidratação, reavaliando sinais vitais a cada fase. Manutenção em 24 h: SG 5% + SF 0,9% na proporção 4:1; volume descrito de 1.500 mL + 20 mL/kg do peso que exceder 20 kg. Em nefropatas/cardiopatas: hidratação cautelosa, 250 mL IV e reavaliação a cada 30 minutos; a concentração escrita nesse trecho é “SF ,09%” e precisa ser validada antes da administração, sem inferir 0,9%.';
 const exams='Exames: hemograma, função renal, função hepática, gama-GT, lipase, eletrólitos, beta-hCG para mulheres em idade fértil e parcial de urina.';
 t(p,'p1n22','MANEJO DA DESIDRATAÇÃO MODERADA/GRAVE.\n'+hydration+'\n'+symptoms+'\n'+exams+'\nReavaliar clinicamente após o manejo e a cada fase de expansão. A fonte encerra esse ramo no manejo/reavaliação e não define novo encaminhamento ou critério adicional de alta.');
 n.p1n12.text=n.p1n12.text.replace('SINTOMÁTICOS**',symptoms);
 note(p,'p1n12','O quadro de suspeita de meningismo imprime ceftriaxona 2 g IV 1x/dia OU 100 mg/kg/dia, sem delimitar população ou divisão do esquema por peso. Validar esse esquema específico; não foi inventado ajuste de posologia.');
 note(p,'p1n22','A concentração “SF ,09%” do ramo de nefropatia/cardiopatia diverge do SF 0,9% usado no restante do quadro. As concentrações dos sintomáticos não definem doses. Esses pontos permanecem para validação.');
 note(p,'p1n26','O texto orienta repetir a mesma dose se houver vômito antes de 40 min, mas não delimita fármaco, número de repetições nem dose máxima. Validar especificamente a repetição antes de aplicá-la; não foi criada repetição automática. Dipirona e paracetamol também aparecem sem posologia completa.');
 n.p1n15.text='Seguir fluxo de HEMORRAGIA DIGESTIVA por hematêmese presenciada.';
 n.p1n19.text='Seguir fluxo de DOR ABDOMINAL associado a náuseas/vômitos.';
 }}
 {
 const p=P['adulto-obesidade-morbida'];if(p){const n=p.nodes;
 n['rv-assessment'].text='Paciente com obesidade mórbida: o documento descreve “150 kg e/ou IMC >40”. Avaliar comorbidades: insuficiência renal crônica, insuficiência cardíaca, diabetes mellitus, hipertensão arterial e asma.';
 n['rv-unstable'].criteria=n.p1n13.text;
 n['rv-unstable'].text='Possui algum dos critérios de instabilidade abaixo?';
 a(p,'rv-observe','SEM INSTABILIDADE: cadastrar paciente na CLM. Durante o internamento, reavaliar o aparecimento dos mesmos critérios clínicos.','obesity-recheck');
 q(p,'obesity-recheck','Durante o internamento apareceu algum critério de instabilidade?',[['Sim','rv-transfer'],['Não','obesity-stable']],n.p1n13.text);
 t(p,'obesity-stable','Manter o cadastro na CLM e a observação durante o internamento. Se surgir instabilidade, discutir com regulação do SAMU 3360-4980.');
 note(p,'rv-assessment','O peso de “150 kg” é impresso sem operador de comparação; o IMC é explicitamente >40. Foi retirado o ≥ que a versão anterior acrescentava ao peso sem fundamento na fonte. Validar a abrangência desse limite de peso.');
 }}
 {
 const p=P['adulto-parada-cardio-respiratoria-pcr'];if(p){const n=p.nodes;
 const causes=n.p1n49.text.replace('**CAUSAS REVERSÍVEIS','CAUSAS REVERSÍVEIS');
 const adultQuality=n.p1n11.text;
 const childQuality='QUALIDADE DA RCP PEDIÁTRICA: 100–120 compressões/min; permitir retorno total do tórax; minimizar interrupções; evitar ventilação excessiva; alternar quem comprime a cada 2 min ou antes se houver cansaço. Sem via aérea avançada: 15:2. Com via aérea avançada: compressões contínuas e uma ventilação a cada 2–3 s. Profundidade: a fonte imprime “metade do diâmetro torácico”; esse valor está pendente de validação clínica e não foi convertido em outro valor.';
 const adultAmio='Amiodarona no quadro municipal: 1ª dose 300 mg IV em bolus; 2ª dose 150 mg IV em bolus. A tabela não define uma terceira dose: não extrapolar a sequência por causa da repetição do ciclo.';
 const childDrugs='Adrenalina: 0,01 mg/kg; repetir a cada 3–5 min. A fonte não explicita a via da dose de 0,01 mg/kg. Sem acesso IV, descreve via endotraqueal 0,1 mg/kg, seguida de “0,1 mL da ampola de 1 mg/mL”, volume sem /kg; validar esse volume, sem inferi-lo. Amiodarona: o original imprime “5 mg em bolus”, repetível até 3x, sem /kg e sem via; essa dose precisa de validação antes de usar e não foi transformada em 5 mg/kg.';
 n.p2n11.text=childQuality;n.p2n47.text=childDrugs;n.p1n48.text=adultAmio;
 for(const prefix of ['p1','p2']){
 const page=prefix==='p1'?1:2;
 n[prefix+'n7'].choices=[{label:'Reavaliar pulso após 2 minutos',to:prefix+'n5'}];
 for(const id of [prefix+'n12',prefix+'n17',prefix+'n18',prefix+'n19',prefix+'n26',prefix+'n27',prefix+'n35',prefix+'n36'])if(n[id]?.question)n[id].criteria='Ritmo chocável: fibrilação ventricular (FV) ou taquicardia ventricular sem pulso (TVSP). Não chocável: assistolia ou atividade elétrica sem pulso (AESP). Checar o ritmo após cada ciclo de 2 minutos.';
 const ids=prefix==='p1'?['p1n9','p1n15','p1n16','p1n19','p1n23','p1n29']:['p2n9','p2n16','p2n17','p2n20','p2n24','p2n30'];
 for(const id of ids)n[id].text+='\n'+(prefix==='p1'?adultQuality:childQuality);
 for(const id of prefix==='p1'?['p1n19','p1n29']:['p2n20','p2n30'])n[id].text+='\n'+causes;
 if(prefix==='p1')n.p1n29.text+='\n'+adultAmio;
 else for(const id of ['p2n17','p2n24','p2n30']){n[id].text+='\n'+childDrugs;note(p,id,'O original imprime amiodarona 5 mg em bolus sem /kg e sem via, e o volume endotraqueal de adrenalina não traz /kg. Essas informações exigem validação específica; não foi inventada dose de substituição.',2);}
 n[prefix+'n9'].choices=[{label:'Checar ritmo após 2 minutos de RCP',to:prefix+'n12'}];
 }
 n.p1n51.text+='\nSe assistolia: checar conexão dos eletrodos e aumentar ganho do monitor cardíaco.';
 n.p2n14.text+='\nSe assistolia: checar conexão dos eletrodos e aumentar ganho do monitor cardíaco.';
 // The circled 3 on page 2 points to the shock immediately preceding amiodarone.
 for(const id of ['p2n39','p2n41']){n[id].text='Ritmo passou a chocável: seguir o conector 3 do fluxograma (choque anterior ao ciclo com amiodarona).';n[id].choices=[{label:'Seguir conector 3',to:'p2shock27'}];note(p,id,'O conector 3 conduz ao ciclo com amiodarona, mas a fonte não esclarece o número de choques prévios em quem converte de ritmo não chocável. Validar essa transição clínica; não se inventou outro conector.',2);}
 for(const id of ['p2shock15','p2shock18','p2shock27'])n[id].text+='\nEscolher a energia pelo número de choques efetivamente já aplicados nesta PCR, sem reiniciar a contagem ao mudar de ramo.';
 for(const id of ['p2n9','p2n16','p2n17','p2n20','p2n24','p2n30'])note(p,id,'Profundidade pediátrica impressa como metade do diâmetro torácico. A orientação está pendente de validação, sem presumir profundidade alternativa. O documento também usa uma ventilação/6 s com pulso (p.2) e uma/2–3 s com via aérea avançada durante RCP; são situações distintas e foram mantidas.',2);
 n.p3n10.text='Discutir com regulação do SAMU 3360-4980 e realizar manejo até a transferência.\n'+n.p3n14.text;
 note(p,'p3n5','A faixa-alvo de SpO₂ pós-PCR é 92–98% (DPOC ≥88%) na estabilização; o quadro de manejo imprime DPOC 88–92%. Foram preservados os contextos. A fonte não delimita o esquema de amiodarona de manutenção por faixa etária.',3);
 note(p,'p3n10','O trecho de dobutamina traz “12,5 mg IV: 2,5 mcg/kg/min em BIC”, sem esclarecer apresentação/volume. Não interpretar 12,5 mg como bolus. A formulação requer validação; a titulação impressa é a cada 10 min.',3);
 }}
})();
