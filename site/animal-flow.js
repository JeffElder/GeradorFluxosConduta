'use strict';
(() => {
  // Correção manual da navegação — SMS Curitiba, "Acidente por animais peçonhentos", v.1, 24/06/2024, pp. 1–8.
  // Os oito painéis da fonte são fluxos distintos, não etapas sequenciais.
  const id = 'adulto-acidente-por-animais-peconhentos';
  const p = window.PROTOCOLS && window.PROTOCOLS[id];
  if (!p) return;
  const node = (id, page, text, question = false, choices = [], criteria = '') => {
    p.nodes[id] = { id, page, text, question, choices, incomplete: false };
    if (criteria) p.nodes[id].criteria = criteria;
  };
  const C = (label, to) => ({ label, to });
  const ask = (id, page, text, choices, criteria = '') => node(id, page, text, true, choices, criteria);
  const result = (id, page, text) => node(id, page, text);
  const continueTo = (id, page, text, to) => node(id, page, text, false, [C('Próxima etapa', to)]);
  const ciatox = 'Acionar CIATOX: 0800-410148.';
  const context = ''; // Conteúdo clínico incorporado nas etapas abaixo.

  // P. 1 — Aranha-marrom (Loxosceles).
  ask('af-marrom', 1, 'Qual forma ou gravidade do acidente por aranha-marrom?', [
    C('Leve — lesão incaracterística, sem comprometimento geral', 'af-marrom-leve'),
    C('Moderado — lesão sugestiva ou placa marmórea menor que 3 cm', 'af-marrom-moderado'),
    C('Grave — lesão característica, placa marmórea maior que 3 cm', 'af-marrom-grave'),
    C('Forma cutâneo-visceral (hemolítica)', 'af-marrom-hemolitica')
  ], 'Leve: lesão incaracterística sem comprometimento do estado geral.\nModerado: lesão provável ou característica com placa marmórea < 3 cm, com ou sem comprometimento geral.\nGrave: placa marmórea > 3 cm, com ou sem comprometimento geral.\nA forma hemolítica apresenta anemia, icterícia, hemoglobinúria e possível alteração da coagulação.');
  result('af-marrom-leve', 1, 'ACIDENTE LEVE — ARANHA-MARROM\nTratamento domiciliar conforme avaliação: compressa fria, limpeza local e sintomáticos indicados na fonte.\nOrientar retorno imediato se houver piora.\n' + context);
  result('af-marrom-moderado', 1, 'ACIDENTE MODERADO — ARANHA-MARROM\nTratamento domiciliar, sintomáticos e corticoterapia.\n' + ciatox + '\nReferenciar à APS para reavaliação a cada 24 horas nas primeiras 72 horas. Orientar retorno imediato se houver piora.\n' + context);
  continueTo('af-marrom-grave', 1, 'ACIDENTE GRAVE — ARANHA-MARROM\nO fluxograma prevê exames laboratoriais, contato com o CIATOX, manejo clínico e soro antiloxoscélico ou antiaracnídico (5 ampolas IV no quadro grave cutâneo). Após essa etapa, verificar sinais de hemólise.\n' + context, 'af-marrom-hemolise');
  ask('af-marrom-hemolise', 1, 'Os exames ou a evolução apresentam sinais de hemólise?', [
    C('Sim', 'af-marrom-hemolitica'), C('Não', 'af-marrom-moderado')
  ]);
  result('af-marrom-hemolitica', 1, 'FORMA CUTÂNEO-VISCERAL (HEMOLÍTICA) — ARANHA-MARROM\nCadastrar na CLM; realizar exames laboratoriais para hemólise, coagulação e função renal; ' + ciatox + '\nMonitorizar e realizar manejo clínico. O documento indica soro antiloxoscélico ou antiaracnídico (10 ampolas IV).\n' + context);

  // P. 2 — Aranha-armadeira (Phoneutria).
  ask('af-armadeira', 2, 'Qual a gravidade do acidente por aranha-armadeira?', [
    C('Leve — manifestações locais predominantes', 'af-armadeira-leve'),
    C('Moderado — sinais autonômicos ou vômitos ocasionais', 'af-armadeira-idade'),
    C('Grave — manifestações sistêmicas intensas, EAP ou choque', 'af-armadeira-grave')
  ], 'Leve: dor, edema, eritema, sudorese ou parestesia local.\nModerado: sudorese, taquicardia, vômitos ocasionais, agitação ou hipertensão.\nGrave: prostração, sudorese profusa, hipotensão, arritmia, dispneia, edema pulmonar, convulsões ou choque.');
  result('af-armadeira-leve', 2, 'ACIDENTE LEVE — ARANHA-ARMADEIRA\nObservação por 6 horas, manejo clínico analgésico e ' + ciatox + '\nApós a observação, seguir com tratamento domiciliar e orientação de retorno se piorar. O texto destaca não usar anti-histamínicos bloqueadores H1.\n' + context);
  ask('af-armadeira-idade', 2, 'Em caso moderado, a criança tem menos de 7 anos?', [
    C('Sim — criança menor de 7 anos', 'af-armadeira-moderado-crianca'),
    C('Não — 7 anos ou mais', 'af-armadeira-moderado-outros')
  ], 'O fluxograma condiciona a soroterapia do acidente moderado à idade inferior a 7 anos.');
  result('af-armadeira-moderado-crianca', 2, 'ACIDENTE MODERADO — ARANHA-ARMADEIRA, CRIANÇA MENOR DE 7 ANOS\nCadastrar na CLM, ' + ciatox + '\nExames laboratoriais, manejo clínico e soro antiaracnídico (3 ampolas IV), conforme fonte.\n' + context);
  result('af-armadeira-moderado-outros', 2, 'ACIDENTE MODERADO — ARANHA-ARMADEIRA, 7 ANOS OU MAIS\nCadastrar na CLM, ' + ciatox + '\nExames laboratoriais e manejo clínico. Na forma moderada, a indicação municipal reserva a indicação de 3 ampolas de soro antiaracnídico às crianças menores de 7 anos.\n' + context);
  result('af-armadeira-grave', 2, 'ACIDENTE GRAVE — ARANHA-ARMADEIRA\nCadastrar na CLM, ' + ciatox + '\nExames gerais, manejo clínico e soroterapia com soro antiaracnídico (6 ampolas IV no documento).\n' + context);

  // P. 3 — Escorpião.
  ask('af-escorpiao', 3, 'Qual a gravidade do acidente escorpiônico?', [
    C('Leve — dor local, sem sintomas sistêmicos relevantes', 'af-escorpiao-leve'),
    C('Moderado — dor intensa com manifestações sistêmicas', 'af-escorpiao-moderado'),
    C('Grave — vômitos incoercíveis, arritmia ou edema pulmonar', 'af-escorpiao-grave')
  ], 'Leve: dor local e eventual taquicardia relacionada à dor.\nModerado: vômitos ocasionais, sudorese, agitação, taquicardia, taquipneia, hipertensão ou hipoglicemia.\nGrave: sudorese profusa, vômitos incoercíveis, edema agudo de pulmão, bradicardia, arritmias ou hipoglicemia.');
  result('af-escorpiao-leve', 3, 'ACIDENTE LEVE — ESCORPIÃO\n' + ciatox + '\nManejo clínico se necessário; a fonte prevê compressa morna, limpeza local, analgesia e orientações de retorno.\n' + context);
  result('af-escorpiao-moderado', 3, 'ACIDENTE MODERADO — ESCORPIÃO\nCadastrar na CLM, ' + ciatox + '\nExames gerais e manejo clínico. Indicação municipal: soro antiaracnídico ou antiescorpiônico (2 a 3 ampolas IV).\n' + context);
  result('af-escorpiao-grave', 3, 'ACIDENTE GRAVE — ESCORPIÃO\nCadastrar na CLM, ' + ciatox + '\nExames gerais e manejo clínico. Indicação municipal: soro antiaracnídico ou antiescorpiônico (4 a 6 ampolas IV).\n' + context);

  // P. 4 — Lonomia.
  ask('af-lonomia', 4, 'Qual a gravidade do acidente com taturana Lonomia?', [
    C('Leve — dor e edema, coagulação normal', 'af-lonomia-leve'),
    C('Moderado — alterações de coagulação ou sangramento de pele/mucosas', 'af-lonomia-moderado'),
    C('Grave — hemorragia visceral ou alteração renal', 'af-lonomia-grave')
  ], 'O documento orienta contato com CIATOX e exames, inclusive tempo de coagulação.\nLeve: manifestações locais e coagulação normal.\nModerado: náuseas, mal-estar, sangramento de pele/mucosas e coagulação alterada, sem risco de vida.\nGrave: hemorragia visceral ou intracraniana, alterações renais ou risco de vida.');
  result('af-lonomia-leve', 4, 'ACIDENTE LEVE — LONOMIA\n' + ciatox + '\nConferir exames laboratoriais. O fluxo prevê tratamento domiciliar, orientação sobre sinais de sangramento e reavaliação diária com coagulograma a cada 24 horas até completar 72 horas do acidente.\n' + context);
  result('af-lonomia-moderado', 4, 'ACIDENTE MODERADO — LONOMIA\n' + ciatox + '\nExames de coagulação e função renal; cadastrar na CLM e realizar manejo clínico com repouso, monitorização e coagulograma a cada 12 horas, conforme fonte.\n' + context);
  result('af-lonomia-grave', 4, 'ACIDENTE GRAVE — LONOMIA\n' + ciatox + '\nExames de coagulação e função renal. Acionar protocolo do SAMU (3360-4980) e instituir manejo clínico conforme o documento.\n' + context);

  // P. 5 — Quadro tabular de outros animais; transformar as linhas em opções explícitas.
  ask('af-outros', 5, 'Qual animal ou grupo causou o acidente?', [
    C('Aranha de jardim (Lycosa)', 'af-outros-lycosa'),
    C('Outras lagartas / lepidópteros', 'af-outros-lagartas'),
    C('Abelhas, vespas ou formigas', 'af-outros-anafilaxia')
  ]);
  result('af-outros-lycosa', 5, 'ARANHA DE JARDIM (LYCOSA)\nReação local geralmente discreta: dor, edema e eritema leve. O quadro da página 5 apresenta compressas frias, limpeza local e tratamento sintomático conforme avaliação.\n' + context);
  result('af-outros-lagartas', 5, 'OUTRAS LAGARTAS (LEPIDÓPTEROS)\nO quadro apresenta tratamento sintomático de dermatite urticante. Se houver dúvida sobre identificação de Lonomia, recomenda monitorização e controle por até dois dias após o contato, orientando retorno se houver sangramento.\n' + context);
  ask('af-outros-anafilaxia', 5, 'Há sinais de anafilaxia após picada de abelha, vespa ou formiga?', [
    C('Sim', 'af-outros-com-anafilaxia'), C('Não', 'af-outros-sem-anafilaxia')
  ], 'O documento descreve manifestações sistêmicas de instalação rápida, como dispneia, opressão torácica e taquipneia.');
  result('af-outros-com-anafilaxia', 5, 'ABELHAS, VESPAS OU FORMIGAS — COM ANAFILAXIA\nO documento prevê atendimento emergencial de anafilaxia, incluindo adrenalina intramuscular e suporte conforme quadro, além de cuidados específicos. \n' + context);
  result('af-outros-sem-anafilaxia', 5, 'ABELHAS, VESPAS OU FORMIGAS — SEM ANAFILAXIA\nO documento prevê compressas frias, limpeza local e tratamento sintomático conforme avaliação. Em acidentes com enxame de abelhas, recomenda remoção de ferrões por raspagem, não por pinçamento.\n' + context);

  // P. 6 — Jararaca: primeiro responder à presença de envenenamento, depois reavaliar.
  ask('af-jararaca', 6, 'Há clínica de envenenamento botrópico?', [
    C('Sim', 'af-jararaca-gravidade'), C('Não', 'af-jararaca-observar')
  ]);
  continueTo('af-jararaca-observar', 6, 'SEM CLÍNICA DE ENVENENAMENTO NA ADMISSÃO\nPode haver apenas marca de mordida, dor e edema discretos ou ausentes. O fluxograma determina observação por 12 horas antes de reavaliar.\n' + context, 'af-jararaca-evolucao');
  ask('af-jararaca-evolucao', 6, 'Após 12 horas, evoluiu para clínica de envenenamento?', [
    C('Sim', 'af-jararaca-gravidade'), C('Não', 'af-jararaca-alta')
  ]);
  result('af-jararaca-alta', 6, 'JARARACA — SEM EVOLUÇÃO PARA ENVENENAMENTO\nO fluxograma indica alta domiciliar após observação por 12 horas e reavaliação.\n' + context);
  ask('af-jararaca-gravidade', 6, 'Qual é a gravidade do acidente botrópico?', [
    C('Leve — edema e dor discretos, sem manifestações sistêmicas', 'af-jararaca-leve'),
    C('Moderado — edema e dor evidentes ou sinais de hemorragia', 'af-jararaca-moderado'),
    C('Grave — manifestações intensas, choque ou lesão renal', 'af-jararaca-grave')
  ], 'O documento exige contato com CIATOX e hemograma, TAP, KPTT, coagulação, ureia, creatinina e urina.\nA gravidade depende da intensidade local, hemorragias e manifestações sistêmicas.');
  for (const [level, doses] of [['leve','3'],['moderado','6'],['grave','12']]) {
    result('af-jararaca-' + level, 6, 'ACIDENTE ' + level.toUpperCase() + ' — JARARACA\n' + ciatox + '\nCadastrar na CLM, realizar exames e manejo clínico. O documento indica soro antibotrópico (SAB), ' + doses + ' ampolas IV.\nReavaliar coagulação após soroterapia.\n' + context);
  }

  // P. 7 — Cascavel.
  ask('af-cascavel', 7, 'Qual é a gravidade do acidente crotálico?', [
    C('Leve — fácies miastênica discreta, mialgia ausente ou discreta', 'af-cascavel-leve'),
    C('Moderado — fácies miastênica evidente e mialgia', 'af-cascavel-moderado'),
    C('Grave — miastenia intensa, insuficiência respiratória ou lesão renal', 'af-cascavel-grave')
  ], 'A ausência de dor importante ou edema intenso não afasta gravidade. O documento orienta contato com o CIATOX e exames laboratoriais, incluindo função renal e CPK.');
  for (const [level, doses] of [['leve','5'],['moderado','10'],['grave','20']]) {
    result('af-cascavel-' + level, 7, 'ACIDENTE ' + level.toUpperCase() + ' — CASCAVEL\n' + ciatox + '\nCadastrar na CLM, realizar exames e manejo clínico. O documento indica soro anticrotálico (SAC) ou antibotrópico-crotálico (SABC), ' + doses + ' ampolas IV.\n' + context);
  }

  // P. 8 — Coral verdadeira.
  ask('af-coral', 8, 'Qual é a gravidade do acidente por coral verdadeira?', [
    C('Leve — manifestações locais sem sinais miastênicos', 'af-coral-observar'),
    C('Moderado — sinais de miastenia sem paralisia', 'af-coral-moderado'),
    C('Grave — fraqueza intensa, paralisia ou comprometimento respiratório', 'af-coral-grave')
  ], 'O protocolo ressalta que acidentes com manifestações clínicas devem ser considerados potencialmente graves.\nModerado: ptose e perda de força sem paralisia.\nGrave: disfagia, fraqueza importante, paralisia e/ou dificuldade respiratória.');
  continueTo('af-coral-observar', 8, 'ACIDENTE LEVE — CORAL VERDADEIRA\nCadastrar na CLM e observar por 24 horas antes de reavaliar sinais de miastenia.\n' + context, 'af-coral-evolucao');
  ask('af-coral-evolucao', 8, 'Evoluiu com sinais de miastenia durante a observação?', [
    C('Sim', 'af-coral-moderado'), C('Não', 'af-coral-alta')
  ]);
  result('af-coral-alta', 8, 'CORAL VERDADEIRA — SEM EVOLUÇÃO\nO fluxograma indica alta domiciliar após observação por 24 horas e ausência de sinais de miastenia.\n' + context);
  result('af-coral-moderado', 8, 'ACIDENTE MODERADO — CORAL VERDADEIRA\n' + ciatox + '\nCadastrar na CLM, realizar exames e manejo clínico. O documento indica soro antielapídico (SAEla), 5 ampolas IV.\n' + context);
  result('af-coral-grave', 8, 'ACIDENTE GRAVE — CORAL VERDADEIRA\n' + ciatox + '\nAcionar protocolo do SAMU (3360-4980), realizar manejo clínico e considerar suporte respiratório. O documento indica soro antielapídico (SAEla), 10 ampolas IV.\n' + context);


  // Conferência individual em 14/10/2026: pp.1–8, mesmo SHA-256 do manifesto.
  // Concentrações/apresentações não são transformadas em doses inferidas.
  const add = (id, text) => { p.nodes[id].text += '\n\n' + text; };
  const exams = {
    marrom: 'Hemograma, bilirrubinas total e frações, gama-GT, creatinina, ureia, eletrólitos, TAP, KPTT, CPK, TGO, PCR, DHL e parcial de urina.',
    geral: 'Hemograma, PCR, glicose, gasometria, eletrólitos, creatinina, parcial de urina, radiografia de tórax e eletrocardiograma.',
    lonomia: 'Hemograma, TAP, KPTT, ureia, creatinina, tempo de coagulação e parcial de urina.',
    jararaca: 'Hemograma, TAP, KPTT, tempo de coagulação, ureia, creatinina e parcial de urina.',
    cascavel: 'Hemograma, creatinina, ureia, eletrólitos, TAP, KPTT, CPK, TGO, TGP, PCR, DHL, tempo de coagulação, gasometria e parcial de urina.',
    coral: 'Hemograma, creatinina, ureia, eletrólitos, TAP, KPTT, CPK, TGO, TGP, PCR, tempo de coagulação, gasometria e parcial de urina.'
  };
  const homeAnalgesia = 'Analgésicos listados: dipirona 500 mg/mL; paracetamol 500 mg ou 200 mg/mL; ibuprofeno 600 mg. São apresentações listadas; não há esquema posológico domiciliar completo definido.';
  const antihistamines = 'Anti-histamínicos listados: loratadina 10 mg; dexclorfeniramina 2 mg/5 mL.';
  const steroids = 'Prednisona 1 mg/kg/dia (máximo 60 mg) ou prednisolona 1 mg/kg/dia para crianças.';
  const serum = 'SOROTERAPIA: investigar hipersensibilidade antes da aplicação. Infundir IV em 20–60 minutos. Volume máximo para crianças: 20 mL/kg/h.';
  const hydration = 'Hidratação: SF 0,9% 20–30 mL/kg; repetir conforme necessidade, com cuidado em cardiopatas e nefropatas.';
  const symptomatic = 'Dipirona (apresentação 500 mg/mL): 15 mg/kg/dose IV ou IM. Cetoprofeno IM em adultos: a apresentação escrita como 100 mg/mL não define volume/dose administrada; posologia pendente de validação com CIATOX.';
  const analgesia = symptomatic + ' Para dipirona, intervalo de 6/6 h. O texto registra cetoprofeno de 12/12 h, sem resolver a dose. Escalonamento 1: tramadol 50 mg IV ou 1–2 mg/kg para crianças, de 8/8 h. Escalonamento 2: morfina 2,5–10 mg ou 0,1–0,2 mg/kg/dose a cada 4–6 h; via não especificada neste quadro. Bloqueio local ou troncular com lidocaína 2% sem vasoconstritor: 0,5–1 mL em crianças, 1–4 mL em adultos; pode repetir se necessário, duração da analgesia de 2–8 h. A fonte registra limite de 2 mg/kg/dia: confirmar limite e repetição com CIATOX antes de administrar.';
  add('af-marrom-leve', homeAnalgesia + '\n' + antihistamines);
  add('af-marrom-moderado', 'Compressas frias e limpeza local.\n' + homeAnalgesia + '\n' + steroids);
  const brownManagement = 'Monitorizar dados vitais. ' + hydration + '\n' + symptomatic + '\nCorticoterapia: prednisona 1 mg/kg/dia (máximo 60 mg) ou prednisolona 1 mg/kg/dia. Se impossibilidade de VO: metilprednisolona IV 40 mg de 6/6 h (máximo 160 mg/dia) ou 2 mg/kg/dia divididos de 12/12 h.';
  for (const id of ['af-marrom-grave','af-marrom-hemolitica']) add(id,'EXAMES: '+exams.marrom+'\n'+brownManagement+'\n'+serum+' Observar por no mínimo 2 horas após aplicação.');
  p.nodes['af-marrom'].criteria += '\nGrave cutâneo: sem sinais de hemólise. Lesão incaracterística: bolha serosa, edema, calor e rubor, com ou sem queimação. Sugestiva: endurecimento, equimose, bolha e queimação. Característica: queimação, lesões hemorrágicas focais, isquemia/placa marmórea e necrose. Hemólise: anemia, icterícia e hemoglobinúria geralmente nas primeiras 24 h; petéquias/equimoses relacionadas à CIVD e possível insuficiência renal aguda. A classificação não define placa de exatamente 3 cm: pendência de validação, sem atribuição automática de gravidade.';
  add('af-armadeira-leve', analgesia+'\nApós 6 horas: compressas frias, limpeza local. '+homeAnalgesia+' Codeína 30 mg também listada. Retorno imediato se piora. Não usar anti-histamínicos bloqueadores H1.');
  for(const id of ['af-armadeira-moderado-crianca','af-armadeira-moderado-outros','af-armadeira-grave']) add(id,'EXAMES: '+exams.geral+'\n'+analgesia+'\nNão usar anti-histamínicos bloqueadores H1.'+(id.endsWith('outros')?'':'\n'+serum));
  p.nodes['af-armadeira'].criteria += '\nGrave também inclui priapismo, diarreia, bradicardia, contraturas e cianose. Sinais de choque: extremidades frias, enchimento capilar lento e redução da amplitude do pulso. A dor é imediata, intensa e pode irradiar até a raiz do membro; edema não endurecido e fasciculações locais podem ocorrer.';
  add('af-escorpiao-leve', homeAnalgesia+' Codeína 30 mg também listada.\n'+antihistamines+'\nManejo da dor, se necessário: '+analgesia+'\nRetorno imediato se piora.');
  for(const id of ['af-escorpiao-moderado','af-escorpiao-grave']) add(id,'EXAMES: '+exams.geral+'\n'+analgesia+'\n'+serum);
  p.nodes['af-escorpiao'].criteria += '\nAs manifestações sistêmicas podem surgir em minutos a 2–3 horas, principalmente em crianças: alterações de temperatura, sudorese, náuseas, vômitos, sialorreia, dor abdominal, diarreia, dispneia, agitação, sonolência, confusão, hipertonia e tremores. O escorpião preto Bothriurus bonariensis pode causar reação local/hipersensibilidade ou quadro assintomático; o tratamento descrito é sintomático com analgésicos e anti-histamínicos.';
  p.nodes['af-lonomia'].criteria += '\nAntes de classificar: '+ciatox+' EXAMES: '+exams.lonomia+'\nSe lagarta não identificada ou Lonomia, verificar hemorragias e tempo de coagulação. Discrasia sanguínea pode surgir em 1–48 h, e hemorragias em 8–72 h. Moderado inclui náuseas, vômitos, mal-estar e febre, sem risco de vida; grave inclui sangramento visceral, risco de vida e alteração renal.';
  add('af-lonomia-leve','Compressas frias e limpeza local. '+homeAnalgesia+' Codeína 30 mg também listada. '+antihistamines+' Dexametasona tópica; se reação alérgica importante, via oral: '+steroids+'\nRetorno diário na UPA até 72 horas do acidente.');
  for(const id of ['af-lonomia-moderado','af-lonomia-grave']) add(id,'EXAMES: '+exams.lonomia+'\nManter repouso e evitar traumas. Coagulograma a cada 12 h. Monitorizar sinais vitais. '+hydration+'\n'+analgesia+'\nPENDÊNCIA ESPECÍFICA: o quadro municipal inclui ácido tranexâmico 500 mg IV (50 mg/min) no acidente por Lonomia e não apresenta soroterapia antilonômica. Essa conduta exige validação com CIATOX; não foi inferido um tratamento substituto.');
  add('af-outros-lycosa',homeAnalgesia+'\n'+antihistamines+' Dexametasona tópica. Pode ocorrer necrose superficial. Diagnóstico diferencial: loxoscelismo.');
  for(const id of ['af-outros-lagartas','af-outros-sem-anafilaxia']) add(id,'Compressas frias e limpeza local. '+homeAnalgesia+' Codeína 30 mg também listada. '+antihistamines+' Dexametasona tópica; se reação alérgica importante: '+steroids);
  add('af-outros-lagartas','Dermatite urticante: dor em queimação, edema, eritema, prurido e possíveis vesículas; pode ocorrer infarto ganglionar regional. Raramente mal-estar, náuseas, vômitos e diarreia. Regressão descrita em 2–3 dias. Orientar sinais de sangramento e retorno imediato se presentes.');
  add('af-outros-com-anafilaxia','Adrenalina 1:1000: 0,3–0,5 mL IM ou 0,01 mL/kg/dose IM. Metilprednisolona: 125 mg IV ou 2 mg/kg/dose. Prometazina: 25 mg IM ou 0,5 mg/kg/dose. Salbutamol 100 mcg/dose se broncoespasmo; número de doses não definido na tabela. A tabela não estabelece limites pediátricos ou repetição de adrenalina: pendência específica de validação com CIATOX. Em enxames, retirar ferrões por raspagem, sem pinçar.');
  p.nodes['af-outros-anafilaxia'].criteria += '\nInício sistêmico descrito em 2–3 minutos: cefaleia, vertigem, calafrios, agitação psicomotora, opressão torácica, dispneia, taquipneia e diarreia. Reações locais: dor, hiperemia, prurido e edema. Reações regionais podem aumentar em 24–48 h.';
  p.nodes['af-jararaca'].criteria = 'Dor, edema e equimose progressivos; bolhas serosas/hemorrágicas, necrose e infecção secundária; síndrome compartimental. Sangramento de pele/mucosas, gengivorragia e equimoses à distância; hematúria, hematêmese, enterorragia, sangramento no SNC, hipotensão, choque, injúria renal e septicemia.';
  p.nodes['af-jararaca-gravidade'].criteria = ciatox+'\nEXAMES: '+exams.jararaca+'\nLeve: edema, eritema e dor discretos, sem manifestações sistêmicas. Moderado: edema, eritema e dor evidentes atingindo segmento superior, com manifestações sistêmicas ausentes ou hemorragias. Grave: equimose, bolhas/necrose intensas; hipotensão, choque, hemorragia grave, IRA/alteração da função renal. O tempo de coagulação pode estar normal ou alterado em qualquer gravidade.';
  for(const level of ['leve','moderado','grave']) {
    add('af-jararaca-'+level,'EXAMES: '+exams.jararaca+'\nRepouso e elevação do membro, remover adornos, não fazer curativo compressivo nem puncionar o membro acometido. Monitorizar sinais vitais e débito urinário. Profilaxia do tétano para todos. '+hydration+' '+symptomatic+' Tramadol 50 mg IV ou 1–2 mg/kg em crianças de 8/8 h. Antibioticoterapia somente se evidência de infecção secundária.\n'+serum+'\nMedir tempo de coagulação em 12 e 24 horas após o fim da infusão.');
    p.nodes['af-jararaca-'+level].choices=[C('Avaliar controle de coagulação após soroterapia','af-jararaca-controle')];
  }
  ask('af-jararaca-controle',6,'Há incoagulabilidade no exame de 12 horas e/ou qualquer alteração da coagulação em 24 horas?',[
    C('Sim','af-jararaca-complemento'),C('Não — controles de 12 e 24 horas avaliados','af-jararaca-controle-normal')
  ],'Contar o tempo após o término da aplicação de SAB. O controle de 24 horas permanece necessário mesmo se o de 12 horas estiver normal.');
  result('af-jararaca-complemento',6,'SOROTERAPIA COMPLEMENTAR: 2 ampolas de SAB. '+serum+' O quadro não define novo ciclo nem alta após esta complementação.');
  result('af-jararaca-controle-normal',6,'Controles de 12 e 24 horas sem os critérios de soroterapia complementar. O quadro encerra o controle descrito e não determina alta neste ramo.');
  p.nodes['af-cascavel'].criteria += '\nAntes de classificar: '+ciatox+' EXAMES: '+exams.cascavel+'\nEm todas as formas, reação local pode ser ausente ou discreta e coagulação normal ou alterada. Grave: fácies miastênica e mialgia evidentes, oligúria/anúria, insuficiência respiratória e alteração renal. Fácies miastênica: ptose, flacidez facial, oftalmoplegia, visão turva/diplopia e midríase. Pode haver disfagia, redução do reflexo do vômito, rabdomiólise e mioglobinúria.';
  for(const level of ['leve','moderado','grave']) add('af-cascavel-'+level,'EXAMES: '+exams.cascavel+'\nRepouso e elevação do membro, remover adornos, evitar punção no membro acometido. Monitorizar sinais vitais e débito urinário; suporte ventilatório se necessário. '+hydration+' Meta descrita de débito urinário: 1–2 mL/kg/h em crianças e 30–40 mL/h em adultos. '+symptomatic+'\nPENDÊNCIAS ESPECÍFICAS: furosemida pediátrica registrada como 1 mL/kg/dose IV, sem concentração; não há dose em mg calculável. O quadro de bicarbonato registra meta de pH sérico >7,5; validar essa desigualdade e a alcalinização com CIATOX. Não foram inferidas dose pediátrica ou meta corrigidas.');
  p.nodes['af-coral'].criteria += '\nAntes de classificar: '+ciatox+' EXAMES: '+exams.coral+'\nAs manifestações sistêmicas podem começar em 1–3 h. Grave: fraqueza/paralisia evidente, dificuldade para levantar/deambular, disfagia, sialorreia, respiração superficial até paralisia respiratória.';
  for(const id of ['af-coral-moderado','af-coral-grave']) add(id,'EXAMES: '+exams.coral+'\nMonitorizar sinais vitais e débito urinário. '+hydration+' Meta descrita de débito urinário: 1–2 mL/kg/h em crianças e 30–40 mL/h em adultos. Se insuficiência respiratória: ventilar com bolsa-válvula-máscara, proceder IOT e ventilação mecânica. '+symptomatic+' Tramadol 50 mg IV ou 1–2 mg/kg em crianças de 8/8 h.\n'+serum);

  // Apresentar a seleção real do animal antes de qualquer pergunta de gravidade.
  p.entries = [
    { to: 'af-marrom', page: 1, label: 'Aranha-marrom (Loxosceles)' },
    { to: 'af-armadeira', page: 2, label: 'Aranha-armadeira (Phoneutria)' },
    { to: 'af-escorpiao', page: 3, label: 'Escorpião' },
    { to: 'af-lonomia', page: 4, label: 'Taturana (Lonomia)' },
    { to: 'af-outros', page: 5, label: 'Outros insetos e aranhas' },
    { to: 'af-jararaca', page: 6, label: 'Jararaca (Bothrops)' },
    { to: 'af-cascavel', page: 7, label: 'Cascavel (Crotalus)' },
    { to: 'af-coral', page: 8, label: 'Coral verdadeira (Micrurus)' }
  ];
})();