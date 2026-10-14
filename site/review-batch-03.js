'use strict';
(()=>{
 const all=window.PROTOCOLS||{};
 const helper=p=>({q:(id,text,choices,criteria='',page=1)=>p.nodes[id]={id,text,page,question:true,choices:choices.map(([label,to])=>({label,to})),criteria,contextNodes:[],incomplete:false},t:(id,text,page=1)=>p.nodes[id]={id,text,page,question:false,choices:[],contextNodes:[],incomplete:false},link:(id,to)=>p.nodes[id].choices=[{label:'Continuar',to}]});
 const tb=all['adulto-avaliacao-do-paciente-com-tuberculose-na-upa'];
 if(tb){const n=tb.nodes,{q,t,link}=helper(tb);
  n.p1n4.text+=' Providenciar máscara simples para sintomático respiratório.';
  link('p1n7','tb-result');link('p1n9','tb-result');
  q('tb-result','Qual o resultado do TRM-TB?',[['Detectável e sensível à rifampicina','tb-sensitive'],['Detectável e resistente à rifampicina','tb-repeat'],['Traços','tb-traces'],['Não detectável','tb-symptoms']]);
  t('tb-repeat','Repetir coleta de escarro.');link('tb-repeat','tb-resistance');
  q('tb-resistance','Foi confirmada resistência à rifampicina?',[['Sim','tb-resistant'],['Não','tb-sensitive']]);
  const initial='No início do tratamento de todos os casos: teste rápido para HIV (preferencialmente) ou sorologia, glicemia de jejum e provas hepáticas (TGO/TGP, fosfatase alcalina, gama-GT, bilirrubinas totais e frações).';
  const rx='Radiografia suspeita: cavidades, nódulos, consolidações, massas, padrão intersticial/miliar, derrame pleural e alargamento de mediastino. Sequela: bandas, retrações parenquimatosas e calcificações.';
  t('tb-sensitive','Radiografia de tórax; manter isolamento; iniciar esquema básico RHZE por peso; notificar e encaminhar ficha ao distrito sanitário de abrangência. '+rx+'\n'+initial);link('tb-sensitive','tb-treatment');
  t('tb-resistant','RESISTÊNCIA CONFIRMADA: radiografia de tórax e cultura de BAAR, se ainda não realizada. Notificar e encaminhar ficha ao distrito sanitário. '+rx+'\n'+initial+'\nPENDÊNCIA CLÍNICA ESPECÍFICA: o ramo de resistência confirmada à rifampicina também manda iniciar RHZE. Esse conflito não foi resolvido por inferência; definir esquema com referência especializada antes de prescrever. Não apresentar o esquema básico como tratamento resolvido da resistência.');
  q('tb-traces','No resultado “traços”, existe alguma das condições listadas?',[['HIV, criança <10 anos ou suspeita de TB extrapulmonar','tb-traces-positive'],['Nenhuma dessas condições','tb-traces-repeat']],'A fonte considera positivo se houver qualquer uma dessas condições. O título e a tabela de tratamento são ≥10 anos; o ramo que cita criança <10 anos exige validação sem extrapolar doses.');
  t('tb-traces-repeat','Repetir coleta de escarro para TRM-TB e solicitar cultura de BAAR.');
  t('tb-traces-positive','Considerar teste positivo; notificar e enviar ficha ao distrito sanitário. A fonte indica RHZE. '+initial+'\nO esquema tabulado é exclusivamente para tuberculose pulmonar ≥10 anos; idade <10 anos e TB extrapulmonar requerem definição específica antes de usar essa tabela.');link('tb-traces-positive','tb-treatment');
  q('tb-symptoms','Mantém sintomas?',[['Sim','tb-investigate'],['Não','tb-unlikely']]);
  t('tb-investigate','Continuar investigação; solicitar cultura para BAAR no GAL.');t('tb-unlikely','TB improvável, conforme desfecho da investigação descrita.');
  const source=all['adulto-avaliacao-do-paciente-com-hiv-e-tuberculose-na-upa'];
  // Página 2 dos dois documentos é a mesma tabela, reconferida visualmente.
  q('tb-treatment','Qual a situação de encaminhamento/continuidade?',[['Necessita internamento','tb-admit'],['Alta em situação de rua','tb-street'],['Alta com seguimento na unidade de saúde','tb-aps']],source.nodes['tb-hiv-discharge'].criteria,2);
  for(const [key,from]of [['tb-admit','tb-hiv-admit'],['tb-street','tb-hiv-street'],['tb-aps','tb-hiv-aps']])t(key,source.nodes[from].text,2);
 }
 const headache=all['adulto-cefaleia'];
 if(headache){const n=headache.nodes,{q,t}=helper(headache);
  n.p1n5.criteria=n.p1n4.text+'\n'+n.p1n6.text;n.p1n11.criteria=n.p1n31.text;n.p1n19.criteria=n.p1n15.text+'\n'+n.p1n16.text;
  for(const key of ['p1n7','p1n10','p1n23'])n[key].text+='\n'+n.p1n22.text+'\nAs concentrações em mg/mL desse quadro não especificam volume/dose administrada; não converter em dose por inferência. Validar posologia. Em salvas, o quadro escreve O2 100%, sem fluxo/duração.';
  q('p1n18','Com dor persistente após reavaliação em até 2 horas, a cefaleia é primária ou secundária?',[['Primária','ceph-persistent-primary'],['Secundária','p1n20']],n.p1n15.text+'\n'+n.p1n16.text);
  t('ceph-persistent-primary','Avaliar necessidade de tomografia de crânio e acionar CTS.');
 }
 const shock=all['adulto-choque'];
 if(shock){const n=shock.nodes,{q,t,link}=helper(shock);
  n.p2n4.text=n.p1n4.text;
  n.p2n5.text=n.p2n5.text.replace('(VER P.1)','')+'\n'+n.p1n18.text+'\n'+n.p2n30.text+'\nOxigênio: cateter nasal até 6 L/min; máscara com reservatório; avaliar IOT se rebaixamento da consciência, incapacidade de proteger vias aéreas ou instabilidade hemodinâmica. A fonte estima aumento fixo de FiO2 por litro (3% no cateter, 10% na máscara) e máscara acima de 6 L/min: essas estimativas/fluxo exigem validação conforme dispositivo; não usar como calculadora de FiO2.\n'+n.p2n29.text;
  n.p2n8.criteria=n.p1n5.text;
  q('p2n10','Qual causa de hipovolemia está presente?',[['Trauma ou queimadura','shock-trauma'],['Sangramento ativo não traumático','shock-bleed'],['Hiperglicemia','shock-glucose'],['Demais causas','shock-other-volume']], 'As causas podem coexistir; avaliar todas as aplicáveis.',2);
  t('shock-trauma','Discutir com regulação SAMU 3360-4980; otimizar ressuscitação volêmica e reavaliar após expansão.',2);
  t('shock-bleed','Discutir com regulação SAMU 3360-4980; otimizar ressuscitação volêmica e reavaliar após expansão. A fonte registra ácido tranexâmico 500 mg IV, 50 mg/min, para sangramento não traumático sem distinguir etiologia: indicação abrangente pendente de validação clínica, sem substituição inferida.',2);
  t('shock-glucose','Encaminhamento para o fluxo de emergências hiperglicêmicas. Reavaliar após expansão.',2);
  t('shock-other-volume','Otimizar ressuscitação volêmica e reavaliar após expansão.',2);
  q('p2n14','Na congestão pulmonar, qual é a pressão arterial sistólica?',[['PAS <90 mmHg','shock-low-bp'],['PAS 90–100 mmHg','shock-mid-bp'],['PAS >100 mmHg','shock-high-bp']],'Avaliar também fibrilação atrial e sinais de IAM no ECG.',2);
  t('shock-low-bp','Norepinefrina: apresentação descrita 2 mg/2 mL; infusão 0,1–2 mcg/kg/min IV em BIC.',2);
  t('shock-mid-bp','Dobutamina: infusão 2,5 mcg/kg/min IV em BIC, ajustar a cada 10 minutos. O quadro registra “12,5 mg IV” antes da infusão, sem esclarecer concentração/volume; não interpretar como bolus.',2);
  t('shock-high-bp','Furosemida 1 mg/kg IV em bolus; suspender ou reduzir betabloqueador à metade da dose habitual; nitroglicerina 10–20 mcg/min IV em BIC, ajustar a cada 15 minutos.',2);
  for(const k of ['shock-low-bp','shock-mid-bp','shock-high-bp'])link(k,'shock-af');
  q('shock-af','Há fibrilação atrial?',[['Sim','shock-af-action'],['Não','shock-ecg']],'A página apresenta FA como condição adicional no quadro de congestão.',2);
  t('shock-af-action','A fonte lista deslanosídeo 0,4 mg IV, ataque “2 ampolas de 6/6 h” e manutenção “1 ampola de 12/12 h”. Dose acumulada, apresentação e duração do ataque precisam de validação antes da administração; não foi inferida dose corrigida.',2);link('shock-af-action','shock-ecg');
  q('shock-ecg','O ECG apresenta sinais sugestivos de IAM?',[['Sim','shock-acs'],['Não','shock-monitor']], '',2);
  t('shock-acs','Encaminhamento para o fluxo de síndrome coronariana aguda.',2);
  t('shock-monitor',n.p2n30.text+'\n'+n.p2n29.text,2);
  q('p2n19','Qual conjunto de achados acompanha a dispneia?',[['Estase jugular, bulhas abafadas, atrito pericárdico ou pulso paradoxal','shock-tamponade'],['Dor torácica, MV abolido, hipertimpanismo e desvio contralateral da traqueia','shock-pneumothorax'],['Hipoxemia sem causa aparente','shock-pe']],'As condições são as listadas no quadro; avaliar todas as aplicáveis. A fonte não define saída para dispneia sem esses achados.',2);
  t('shock-tamponade','Tamponamento cardíaco: discutir com regulação SAMU 3360-4980 e avaliar pericardiocentese se houver condições técnicas.',2);
  t('shock-pneumothorax','Pneumotórax: encaminhamento para fluxo de dor torácica ventilatório-dependente.',2);
  t('shock-pe','TEP: encaminhamento para fluxo de tromboembolismo pulmonar.',2);
  n.p2n27.text='Outras situações: individualizar e manejar conforme classificação de choque.\n'+n.p1n5.text;
 }
})();
