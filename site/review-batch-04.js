'use strict';
(()=>{
 const all=window.PROTOCOLS||{};
 function api(p){return {q:(id,text,choices,criteria='')=>p.nodes[id]={id,text,page:1,question:true,choices:choices.map(([label,to])=>({label,to})),criteria,contextNodes:[],incomplete:false},t:(id,text)=>p.nodes[id]={id,text,page:1,question:false,choices:[],contextNodes:[],incomplete:false},link:(id,to)=>p.nodes[id].choices=[{label:'Continuar',to}]};}
 const renal=all['adulto-colica-renal'];
 if(renal){const n=renal.nodes,{q,t,link}=api(renal);
  n.p1n5.criteria=n.p1n6.text;n.p1n10.criteria=n.p1n11.text;
  n.p1n12.text='Manejo clínico e fita urinária.\n'+n.p1n15.text+'\nDipirona, cetoprofeno, metoclopramida e tramadol estão listados como concentrações sem volume/dose: validar posologia, sem inferir quantidade administrada.';
  link('p1n12','renal-imaging');
  q('renal-imaging','Gestante ou nefrolitíase já conhecida por outro método de imagem?',[['Sim — não realizar raio-X de abdome','p1n10'],['Não — realizar raio-X de abdome AP','renal-xray']]);
  t('renal-xray','Realizar raio-X de abdome AP.');link('renal-xray','p1n10');
  q('p1n22','Cadastrar na CLM. Qual alteração foi identificada?',[['Infecção urinária associada à nefrolitíase','renal-infection'],['Alteração da função renal','renal-function'],['Ambas','renal-both']]);
  t('renal-infection','Cadastrar na CLM e seguir fluxo de infecção urinária.');t('renal-function','Cadastrar na CLM e seguir fluxo de urgências dialíticas.');t('renal-both','Cadastrar na CLM; seguir fluxos de infecção urinária e de urgências dialíticas conforme as duas condições presentes.');
  const discharge=n.p1n16.text.split('SE DOR RECORRENTE:')[0];q('p1n16','Há dor recorrente?',[['Sim','renal-recurring'],['Não','renal-discharge']],'Na ausência de sinais de alerta, o desfecho é APS e alta com sintomáticos.');
  t('renal-discharge',discharge);t('renal-recurring',discharge+' Dor recorrente: doxazosina 2 mg, 2–4 mg/dia, retirar na APS.');
 }
 const seizure=all['adulto-crises-convulsivas'];
 if(seizure){const n=seizure.nodes,{q,t,link}=api(seizure);
  n.p1n15.criteria=n.p1n17.text;n.p1n39.criteria=n.p1n45.text;
  const causes=n.p1n33.text.replace('EM PACIENTES QUE USAM ANTICONVULSIVANTES, TRATAR HIPONATREMIA SOMENTE SE SÓDIO < 120.','PENDÊNCIA: a fonte restringe o tratamento da hiponatremia em usuários de anticonvulsivantes a sódio <120, sem unidade, contexto clínico ou distinção de sintomas. Essa restrição precisa de validação; não foi inferida conduta substituta.');
  n.p1n26.text+='\n'+causes;n.p1n32.text+='\n'+causes;
  n.p1n4.text=n.p1n4.text.replace('SE DEXTRO < 60mg/Dl: ADMINISTRAR GLICOSE 50% 50ML IV','');link('p1n4','seizure-glucose');
  q('seizure-glucose','Glicemia capilar <60 mg/dL?',[['Sim','seizure-correct-glucose'],['Não','p1n5']]);t('seizure-correct-glucose','Administrar glicose 50%, 50 mL IV, conforme ramo adulto.');link('seizure-correct-glucose','p1n5');
  q('p1n10','Há acesso venoso para o manejo da crise persistente?',[['Sim','seizure-iv'],['Não','seizure-no-iv']]);
  t('seizure-iv','Diazepam: 10 mg IV (5 mg/mL) OU 0,2–0,5 mg/kg/dose IV em 2 minutos. A fonte não define teto para a alternativa por peso; validar limite antes de administrar.');link('seizure-iv','seizure-five');
  t('seizure-no-iv','Midazolam 0,2 mg/kg/dose IM ou intranasal; alternativa listada: diazepam via retal 0,3 mg/kg. A fonte não define dose máxima dessas alternativas.');link('seizure-no-iv','seizure-five');
  q('seizure-five','Persiste crise após 5 minutos?',[['Sim','seizure-repeat'],['Não — seguir avaliação do fluxo principal','p1n15']]);
  t('seizure-repeat','Repetir a dose utilizada na etapa anterior, conforme sequência do manejo municipal.');link('seizure-repeat','seizure-five-again');
  q('seizure-five-again','Persiste após mais 5 minutos?',[['Sim','seizure-phenytoin'],['Não — seguir avaliação do fluxo principal','p1n15']]);
  t('seizure-phenytoin','Fenitoína 50 mg/mL: calcular 20 mg/kg, diluir em 250 mL de SF 0,9%, velocidade máxima 50 mg/min. Acesso venoso calibroso; não fazer em extremidades pelo risco de necrose cutânea. Monitor cardíaco por risco de hipotensão/bradicardia; separar material de IOT.');link('seizure-phenytoin','seizure-refractory');
  q('seizure-refractory','Persiste crise após fenitoína?',[['Sim — estado refratário','seizure-intubation'],['Não — seguir avaliação do fluxo principal','p1n15']],'PENDÊNCIA TEMPORAL: a seta municipal está rotulada “persiste após 60 minutos?”. Esse intervalo exige validação e não deve ser interpretado como instrução de aguardar 60 minutos com crise ativa. Não foi criado temporizador ou prazo substituto.');
  t('seizure-intubation','ESTADO DE MAL-CONVULSIVO REFRATÁRIO: proceder IOT; midazolam (5 mg/mL), ataque 0,2 mg/kg IV, manutenção 0,1–0,2 mg/kg/h; discutir com regulação SAMU 3360-4980.');
 }
 const hypertension=all['adulto-crise-hipertensiva'];
 if(hypertension){const n=hypertension.nodes,{q,t,link}=api(hypertension);
  n.p1n4.criteria=n.p1n5.text;n.p1n30.criteria=n.p1n31.text;
  const management=n.p1n33.text.replace(/NITROGLICERINA 5MG\/ML: 5 A 10MCG\/KG\/MIN EM BIC/g,'NITROGLICERINA: unidade mcg/kg/min e faixa de dose da fonte pendentes de validação; não inferir dose corrigida.').replace('# NA SUSPEITA DE AVE, NÃO BAIXAR PA ABAIXO DE 220X120mmHg','PENDÊNCIA: a regra de PA 220×120 mmHg na suspeita de AVE não distingue tipo de AVC ou elegibilidade para reperfusão; validar aplicação no fluxo específico.');
  n.p1n33.text=management;
  n.p1n12.text+='\n'+management;
  n.p1n32.text=n.p1n32.text.replace('NITROGLICERINA 5MG/ML: 5 A 10 MCG/KG/MIN EM BIC','NITROGLICERINA: dose/unidade mcg/kg/min da fonte pendente de validação; não administrar por inferência.');
  n.p1n32.text+='\nSUPORTE: monitorizar sinais vitais, SO2 e diurese; avaliar via aérea; O2 se SO2 <90%; decúbito elevado; exames laboratoriais (não enumerados na fonte), ECG e raio-X de tórax. A via da morfina não está explicitada nesse quadro. A fonte prevê isossorbida somente se PAS >140 mmHg.';
  q('p1n6','Após acalmar o paciente e aliviar dor se necessário, foi afastada pseudocrise hipertensiva?',[['Sim — urgência hipertensiva','htn-urgency'],['Não — pseudocrise não afastada','htn-unresolved']]);
  t('htn-unresolved','A indicação medicamentosa deste quadro é condicionada a afastar pseudocrise. A fonte não descreve outro tratamento para essa situação; manter avaliação clínica sem atribuir automaticamente urgência hipertensiva.');
  t('htn-urgency','Urgência hipertensiva: anlodipino 5 mg OU enalapril 10 mg. Objetivo documental: reduzir PA em 25% no primeiro dia; referenciar para APS.');link('htn-urgency','htn-risk');
  q('htn-risk','Há risco aumentado de evolução adversa em curto prazo?',[['Sim — reavaliar sinais de alerta','p1n4'],['Não','htn-aps']],'A fonte manda voltar ao fluxo, mas não define critérios de risco nem o ponto exato de retorno. A navegação retorna à avaliação de sinais de alerta, sem criar critério clínico.');
  t('htn-aps','Referenciar paciente para APS.');
  q('p1n36','Há suspeita de hipertensão maligna?',[['Sim','htn-malignant'],['Não','htn-management']],management);
  t('htn-management',management);t('htn-malignant',management+' Associar atenolol 50 mg OU anlodipino 5 mg.');
 }
})();
