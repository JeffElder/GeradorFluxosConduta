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
  const context = 'Conferir no texto integral do protocolo os critérios, exames, medicamentos, contraindicações e condições de soroterapia; este resumo não substitui a avaliação clínica.';

  // P. 1 — Aranha-marrom (Loxosceles).
  ask('af-marrom', 1, 'Qual forma ou gravidade do acidente por aranha-marrom?', [
    C('Leve — lesão incaracterística, sem comprometimento geral', 'af-marrom-leve'),
    C('Moderado — lesão sugestiva ou placa marmórea menor que 3 cm', 'af-marrom-moderado'),
    C('Grave — lesão característica, placa marmórea maior que 3 cm', 'af-marrom-grave'),
    C('Forma cutâneo-visceral (hemolítica)', 'af-marrom-hemolitica')
  ], 'Leve: lesão incaracterística sem comprometimento do estado geral.\nModerado: lesão provável ou característica com placa marmórea < 3 cm, com ou sem comprometimento geral.\nGrave: placa marmórea > 3 cm, com ou sem comprometimento geral.\nA forma hemolítica apresenta anemia, icterícia, hemoglobinúria e possível alteração da coagulação.');
  result('af-marrom-leve', 1, 'ACIDENTE LEVE — ARANHA-MARROM\nTratamento domiciliar conforme avaliação: compressa fria, limpeza local e sintomáticos indicados na fonte.\nOrientar retorno imediato se houver piora.\n' + context);
  result('af-marrom-moderado', 1, 'ACIDENTE MODERADO — ARANHA-MARROM\nTratamento domiciliar, sintomáticos e corticoterapia conforme o PDF.\n' + ciatox + '\nReferenciar à APS para reavaliação a cada 24 horas nas primeiras 72 horas. Orientar retorno imediato se houver piora.\n' + context);
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
  result('af-armadeira-leve', 2, 'ACIDENTE LEVE — ARANHA-ARMADEIRA\nObservação por 6 horas, manejo clínico analgésico e ' + ciatox + '\nApós a observação, o PDF apresenta tratamento domiciliar e orientação de retorno se piorar. O texto destaca não usar anti-histamínicos bloqueadores H1.\n' + context);
  ask('af-armadeira-idade', 2, 'Em caso moderado, a criança tem menos de 7 anos?', [
    C('Sim — criança menor de 7 anos', 'af-armadeira-moderado-crianca'),
    C('Não — 7 anos ou mais', 'af-armadeira-moderado-outros')
  ], 'O fluxograma condiciona a soroterapia do acidente moderado à idade inferior a 7 anos.');
  result('af-armadeira-moderado-crianca', 2, 'ACIDENTE MODERADO — ARANHA-ARMADEIRA, CRIANÇA MENOR DE 7 ANOS\nCadastrar na CLM, ' + ciatox + '\nExames laboratoriais gerais, manejo clínico e soro antiaracnídico (3 ampolas IV), conforme fonte.\n' + context);
  result('af-armadeira-moderado-outros', 2, 'ACIDENTE MODERADO — ARANHA-ARMADEIRA, 7 ANOS OU MAIS\nCadastrar na CLM, ' + ciatox + '\nExames laboratoriais gerais e manejo clínico. Na forma moderada, o PDF reserva a indicação de 3 ampolas de soro antiaracnídico às crianças menores de 7 anos.\n' + context);
  result('af-armadeira-grave', 2, 'ACIDENTE GRAVE — ARANHA-ARMADEIRA\nCadastrar na CLM, ' + ciatox + '\nExames gerais, manejo clínico e soroterapia com soro antiaracnídico (6 ampolas IV no documento).\n' + context);

  // P. 3 — Escorpião.
  ask('af-escorpiao', 3, 'Qual a gravidade do acidente escorpiônico?', [
    C('Leve — dor local, sem sintomas sistêmicos relevantes', 'af-escorpiao-leve'),
    C('Moderado — dor intensa com manifestações sistêmicas', 'af-escorpiao-moderado'),
    C('Grave — vômitos incoercíveis, arritmia ou edema pulmonar', 'af-escorpiao-grave')
  ], 'Leve: dor local e eventual taquicardia relacionada à dor.\nModerado: vômitos ocasionais, sudorese, agitação, taquicardia, taquipneia, hipertensão ou hipoglicemia.\nGrave: sudorese profusa, vômitos incoercíveis, edema agudo de pulmão, bradicardia, arritmias ou hipoglicemia.');
  result('af-escorpiao-leve', 3, 'ACIDENTE LEVE — ESCORPIÃO\n' + ciatox + '\nManejo clínico se necessário; a fonte prevê compressa morna, limpeza local, analgesia e orientações de retorno.\n' + context);
  result('af-escorpiao-moderado', 3, 'ACIDENTE MODERADO — ESCORPIÃO\nCadastrar na CLM, ' + ciatox + '\nExames gerais e manejo clínico. O PDF indica soro antiaracnídico ou antiescorpiônico (2 a 3 ampolas IV).\n' + context);
  result('af-escorpiao-grave', 3, 'ACIDENTE GRAVE — ESCORPIÃO\nCadastrar na CLM, ' + ciatox + '\nExames gerais e manejo clínico. O PDF indica soro antiaracnídico ou antiescorpiônico (4 a 6 ampolas IV).\n' + context);

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
  result('af-outros-com-anafilaxia', 5, 'ABELHAS, VESPAS OU FORMIGAS — COM ANAFILAXIA\nO documento prevê atendimento emergencial de anafilaxia, incluindo adrenalina intramuscular e suporte conforme quadro, além de cuidados específicos. Conferir o quadro integral de tratamento da página 5.\n' + context);
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
    result('af-jararaca-' + level, 6, 'ACIDENTE ' + level.toUpperCase() + ' — JARARACA\n' + ciatox + '\nCadastrar na CLM, realizar exames e manejo clínico. O documento indica soro antibotrópico (SAB), ' + doses + ' ampolas IV.\nInclui acompanhamento da coagulação após soroterapia, conforme critérios do PDF.\n' + context);
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