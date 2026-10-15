'use strict';
(()=>{
 const all=window.PROTOCOLS||{};
 function api(p){return {q:(id,text,choices,criteria='',page=1)=>p.nodes[id]={id,text,page,question:true,choices:choices.map(([label,to])=>({label,to})),criteria,contextNodes:[],incomplete:false},t:(id,text,page=1)=>p.nodes[id]={id,text,page,question:false,choices:[],contextNodes:[],incomplete:false},link:(id,to)=>p.nodes[id].choices=[{label:'Continuar',to}]};}
 const focal=all['adulto-deficit-focal-agudo'];
 if(focal){const n=focal.nodes,{q,t,link}=api(focal);
  n.p1n4.text='Avaliar déficit focal: triagem inicial pela escala de Cincinnati e avaliação neurológica NIHSS. Excluir paralisia facial periférica (Bell).\nCINCINNATI: pedir para sorrir e verificar desvio da boca; levantar braços a 90° sentado ou 45° deitado, verificando queda por perda de força; pedir para repetir uma frase e verificar alteração da fala. Alteração de um ou mais testes é sugestiva de AVE.\nNIHSS: itens e pontuações documentais abaixo; não há cálculo automático devido às inconsistências da edição municipal.';
  n.p1n4.contextNodes=['p2n4',...Array.from({length:15},(_,i)=>'p2n'+(i+14))];
  n.p2n4.text+='\nPENDÊNCIAS: 17 aparece nas faixas moderada e grave. O item 11 enumera 0/2/3; motor usa 9 para amputação/fusão e disartria usa 3 para intubação/barreira. Validar esses códigos e sua utilização na soma antes de calcular; não foi criado escore corrigido.';
  link('p1n4','focal-bell');q('focal-bell','A avaliação clínica identificou paralisia facial periférica (Bell)?',[['Sim','p1n23'],['Não — prosseguir com avaliação de déficit focal','p1n5']],'A fonte orienta excluir paralisia facial periférica, mas não fornece critérios para diferenciá-la da causa central; não inferir Bell apenas pela assimetria facial.');
  for(const key of ['p1n11','p1n22','p1n24'])n[key].text+='\n'+n.p1n43.text;
  n.p1n11.text='ECG, hemograma, eletrólitos (sódio/potássio), glicose, creatinina, ureia, TGO, TGP, parcial de urina e tomografia de crânio. Excluir causas não neurológicas.';link('p1n11','focal-duration');
  q('focal-duration','Qual o tempo de evolução do déficit persistente?',[['Menos de 48 horas','focal-clm'],['Mais de 48 horas','focal-hospital'],['Exatamente 48 horas ou tempo indeterminado','focal-time-undefined']]);
  t('focal-clm','Cadastrar na CLM.');t('focal-hospital','Considerar avaliação hospitalar.');t('focal-time-undefined','A fonte não define classificação para exatamente 48 horas ou tempo indeterminado. Validar encaminhamento com a regulação; não atribuir faixa por inferência.');
  n.p1n12.text+='\nPENDÊNCIA: regra pressórica 220×120 não distingue tipo de AVC/reperfusão; a janela documental <4 horas não resolve início desconhecido. Não excluir possibilidades terapêuticas com base apenas nessa transcrição.';
 }
 const delirium=all['adulto-delirium'];
 if(delirium){const n=delirium.nodes,{q,t,link}=api(delirium);
  delirium.entries=[{to:'p1n9',page:1,label:'Avaliação de delirium e continuidade do manejo'}];
  q('p1n9','Estão presentes os critérios 1 E 2, mais pelo menos um dos critérios 3 OU 4?',[['Sim','p1n10'],['Não ou dados insuficientes','delirium-unconfirmed']], '1. Mudança aguda do estado mental basal e curso flutuante; 2. Desatenção; 3. Pensamento desorganizado/incoerente; 4. Alteração do nível de consciência (agitação ou letargia).\n'+n.p1n4.text+'\n'+n.p1n5.text+'\n'+n.p1n6.text.replace('(VER P.3)','')+'\n'+n.p1n7.text);
  t('delirium-unconfirmed','Critérios documentais de delirium não confirmados. A fonte não fornece um desfecho diagnóstico alternativo; prosseguir avaliação clínica sem rotular automaticamente delirium.');
  link('p1n10','p2n5');n.p1n10.text+='\n'+n.p1n12.text+'\n'+n.p1n13.text;
  n.p2n9.criteria=n.p2n10.text;n.p2n14.text='Foi identificado fator precipitante?';n.p2n14.criteria=n.p1n8.text;n.p2n18.criteria=n.p2n22.text;
  const basics='Ajustar luminosidade pela manhã e escuro à noite; manter ambiente calmo; familiar/acompanhante junto; manejar causa orgânica. O quadro municipal inclui haloperidol 1 mg VO para hipoatividade e 0,5–5 mg VO/IM duas vezes ao dia para hiperatividade, e biperideno 5 mg/mL se distonia. A indicação no hipoativo e o biperideno sem dose/volume necessitam validação; não inferir uso automático.';
  for(const k of ['p2n11','p2n16'])n[k].text+='\n'+basics;
  q('p2n7','Qual alteração deve ser corrigida?',[['Hipoglicemia <60 mg/dL','del-glucose'],['Hiperglicemia','del-hyperglycemia'],['Hipóxia ou taquipneia','del-respiratory'],['PAS >90 e <120 mmHg','del-volume'],['PAS <90 mmHg e/ou hipoperfusão','del-shock'],['Emergência hipertensiva','del-pressure']],'Corrigir todas as alterações presentes. A fonte deixa PAS exatamente 90 mmHg sem faixa explícita quando não há hipoperfusão.',2);
  const actions=[['del-glucose','Aplicar glicose 50%, 50 mL IV.'],['del-hyperglycemia','Seguir fluxo de emergências hiperglicêmicas.'],['del-respiratory','Seguir fluxo de insuficiência respiratória aguda.'],['del-volume','Expansão volêmica com SF 0,9%; volume não especificado no documento.'],['del-shock','Seguir fluxo de choque.'],['del-pressure','Seguir fluxo de crise hipertensiva.']];
  for(const [key,text]of actions){t(key,text+' Retornar à avaliação após correção, se necessário.',2);link(key,'p2n9');}
  n.p2n20.text+='\nPENDÊNCIAS: “1 ampola IV” de diazepam sem apresentação explícita e tiamina IM sem dose; não converter em quantidades por inferência.';
  const gds=[['Está satisfeito com sua vida?',0,1],['Deixou muitos interesses e atividades?',1,0],['Sente que sua vida está vazia?',1,0],['Aborrece-se com frequência?',1,0],['Está de bom humor a maior parte do tempo?',0,1],['Tem medo de que algo de mal vá acontecer?',1,0],['Sente-se feliz a maior parte do tempo?',0,1],['Sente que sua situação não tem saída?',1,0],['Prefere ficar em casa a sair e fazer coisas novas?',1,0],['Sente mais problemas de memória que a maioria?',1,0],['Acha maravilhoso estar vivo?',0,1],['Sente-se inútil nas atuais circunstâncias?',1,0],['Sente-se cheio de energia?',0,1],['Sente que sua situação é sem esperança?',1,0],['Sente que a maioria das pessoas está melhor que você?',1,0]];
  const scale='ESCALA DE DEPRESSÃO GERIÁTRICA: somar os pontos das 15 respostas.\n'+gds.map(([text,yes,no],i)=>`${i+1}. ${text} Sim=${yes}; Não=${no}.`).join('\n')+'\nFaixas documentais: 0–5 normal/sem depressão; 6–10 leve/possível depressão; 11–15 severa. O escore é uma triagem e a fonte não esclarece sua validade durante confusão aguda; validar aplicação clínica.';
  q('p2n23','Qual a faixa de pontuação na avaliação de depressão em idoso?',[['0–5 pontos','p2n27'],['6–10 pontos','del-depression-aps'],['11–15 pontos','del-depression-caps'],['Escala não aplicável ou não avaliável','del-scale-undefined']],scale,3);
  t('del-depression-aps','Referenciar para APS.',3);t('del-depression-caps','Encaminhar para avaliação do CAPS.',3);t('del-scale-undefined','A fonte não define encaminhamento por escore quando a escala não é aplicável ou não pode ser respondida. Validar avaliação clínica; não atribuir pontuação por inferência.',3);
 }
 const hf=all['adulto-descompensacao-aguda-da-insuficiencia-cardiaca'];
 if(hf){const n=hf.nodes,{q,t,link}=api(hf);
  const fram='FRAMINGHAM — maiores: dispneia paroxística noturna, turgência jugular a 45°, refluxo hepatojugular, estertores crepitantes, cardiomegalia ao RX, edema pulmonar agudo, galope de B3. Menores: edema bilateral de tornozelo, tosse noturna, dispneia aos mínimos esforços, derrame pleural, taquicardia. A fonte escreve diagnóstico com 2 maiores E 1 menor OU 1 maior E 2 menores; essa primeira combinação requer validação. Menores só considerados sem outra condição que os justifique. Não foi inferida fórmula corrigida.';
  const monitoring='REAVALIAÇÃO: FC, FR, Glasgow e oximetria continuamente; balanço hídrico parcial de 6/6 h; ureia, creatinina, sódio e potássio a cada 6–12 h durante descongestão intensa; lactato venoso: a tabela apresenta “12/12 h (se alterado) / a cada 24 h”, sem explicitar a associação de cada intervalo — validar frequência; RX de tórax, ECG 12 derivações, PCR e hemograma a cada 24 h; troponina a cada 24 h se positiva.';
  const risk=n.p2n1.text+'\nPENDÊNCIA: lactato ≥2 mmol/dL tem unidade a validar. Não converter em mmol/L por inferência.';
  n.p1n5.criteria=n.p1n4.text.replace(/\(VER P\.2\)/g,'')+'\n'+n.p1n6.text+'\n'+fram+'\n'+risk+'\n'+n.p2n19.text;
  const profiles='Perfil A: sem baixa perfusão e sem congestão (quente/seco). B: sem baixa perfusão, com congestão (quente/úmido). L: baixa perfusão sem congestão (frio/seco). C: baixa perfusão e congestão (frio/úmido).';
  for(const key of ['p1n34','p1n37','p1n42'])n[key].criteria=profiles;
  q('p1n52','PAS está acima de 90 mmHg?',[['Sim','p1n34'],['Não ou indeterminada','hf-bp-undefined']], 'A fonte só desenha entrada PAS >90 neste ponto. PAS ≤90 sem o conjunto de sinais de choque não tem saída própria definida.');
  t('hf-bp-undefined','Faixa não coberta pelo ramo de perfis da fonte. Reavaliar sinais de choque e definir encaminhamento com regulação, sem atribuir perfil por pressão isolada.');
  const basic=n.p1n36.text.replace(/\(VER P\.2\)/g,'')+'\n'+monitoring+'\n'+n.p1n50.text;
  n.p1n35.text='PERFIL C: furosemida 1 mg/kg IV em bolus; suspender betabloqueador ou reduzir à metade da dose habitual; nitroglicerina 10–20 mcg/min IV em BIC, ajustar a cada 15 minutos.\n'+basic;link('p1n35','hf-c-af');
  q('hf-c-af','Há fibrilação atrial no perfil C?',[['Sim','hf-c-digitalis'],['Não','hf-low-output']]);
  t('hf-c-digitalis','A fonte registra deslanosídeo 0,4 mg IV, ataque de 2 ampolas a cada 6 h e manutenção de 1 ampola a cada 12 h. Validar apresentação/dose acumulada e duração do ataque antes de administrar; sem dose substituta inferida.');link('hf-c-digitalis','hf-low-output');
  q('hf-low-output','Melhorou o baixo débito?',[['Sim','hf-monitor'],['Não','hf-dobutamine']]);
  t('hf-dobutamine','Dobutamina 2,5 mcg/kg/min em BIC; ajuste a cada 10 minutos. O “12,5 mg IV” que antecede a infusão não esclarece apresentação/volume e não deve ser interpretado como bolus.\n'+basic);
  n.p1n38.text='PERFIL B: furosemida 1 mg/kg IV em bolus e isossorbida 5 mg SL; pode repetir medidas 2–3 vezes (intervalo não especificado). Nitroglicerina 10–20 mcg/min IV em BIC, ajustar a cada 15 minutos.\n'+basic;link('p1n38','hf-b-af');
  q('hf-b-af','Há fibrilação atrial no perfil B?',[['Sim','hf-b-digitalis'],['Não','hf-b-breathing']]);t('hf-b-digitalis','Deslanosídeo 0,4 mg IV, conforme quadro do perfil B.');link('hf-b-digitalis','hf-b-breathing');
  q('hf-b-breathing','Há desconforto respiratório acentuado?',[['Sim','hf-vni'],['Não','hf-monitor']]);t('hf-vni','Ventilação não invasiva antes de IOT, conforme quadro.\n'+basic);
  n.p1n43.text='PERFIL L: afastar dose excessiva de diuréticos; prova de volume 250 mL IV e reavaliação a cada 30 minutos; alta suspeição de infecção associada. A concentração aparece como “SF ,09%”: validar a grafia antes de prescrever; não corrigida por inferência. Após volume pode migrar para A ou C.\n'+basic;link('p1n43','hf-after-volume');
  q('hf-after-volume','Qual o perfil após a reavaliação do volume?',[['Migrou para A','p1n46'],['Migrou para C','p1n35'],['Permanece L ou não classificável','hf-volume-undefined']],profiles);
  t('hf-volume-undefined','A fonte cita migração para A ou C, mas não define conduta específica se permanece L. Manter reavaliação; se refratário às medidas, discutir com regulação SAMU 3360-4980.\n'+basic);
  q('p1n48','Após pesquisar outras causas, está sem instabilidade E sem dispneia?',[['Sim','hf-aps'],['Não','hf-a-undefined']],'Pesquisar TEP, DPOC, pneumonia, COVID-19 e outras causas dos sintomas.');t('hf-aps','Referenciar para APS.');t('hf-a-undefined','O quadro só define APS na ausência de instabilidade e dispneia. Não atribuir alta automática; investigar a causa e individualizar encaminhamento.');
  t('hf-monitor',basic);
 }
 for(const p of [focal,delirium,hf])if(p)for(const node of Object.values(p.nodes)){
   for(const key of ['text','criteria'])if(node[key])node[key]=node[key].replace(/\(?VER P\.[123]\)?/gi,'');
 }
})();
