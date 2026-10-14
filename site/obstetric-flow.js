'use strict';
(() => {
  const protocols=window.PROTOCOLS||{};
  const c=(label,to)=>({label,to});
  function install(id, entry, specs, notes='') {
    const p=protocols[id];if(!p)return;
    const nodes={};
    for(const [key,question,text,options,page=1] of specs){
      nodes['ob-'+key]={id:'ob-'+key,page,text,question,choices:(options||[]).map(([label,to])=>c(label,'ob-'+to)),contextNodes:[],incomplete:false};
    }
    // Do not expose isolated PDF diagrams as alternate starting points.
    p.entries=[{to:'ob-'+entry,page:1,label:'Iniciar avaliação conforme PDF'}];
    p.nodes={...p.nodes,...nodes};
    p.warning=[p.warning, 'Fluxo de navegação revisado com o PDF municipal. Conferir condutas, doses e critérios com responsável clínico; ferramenta ainda não validada para uso assistencial.',notes].filter(Boolean).join(' ');
    p.obstetricReview={source:p.source||null,date:'2026-10-14'};
  }
  const q=(id,title,choices,criteria='')=>[id,true,title,choices,1];
  const a=(id,title,to)=>[id,false,title,[['Próxima etapa',to]],1];
  const end=(id,text,page=1)=>[id,false,text,[],page];
  install('adulto-assistencia-ao-trabalho-de-parto-na-upa','start',[
    a('start','CONTRAÇÕES UTERINAS DOLOROSAS REGULARES / AMNIORREXE. Aferir sinais vitais, idade gestacional e BCF, colocar em decúbito lateral esquerdo; avaliar toque vaginal conforme fonte e calcular o escore de Malinas.','score'),
    q('score','QUAL A FAIXA DO ESCORE DE MALINAS CALCULADO?', [['Menor que 5','low'],['Entre 5 e 7','medium'],['Maior que 7','expulsive']]),
    end('low','ESCORE < 5: orientar procurar maternidade de referência; avaliar risco social e necessidade de acionar CTS para transporte.'),
    end('medium','ESCORE ENTRE 5 E 7: contato com maternidade de referência e acionar SAMU 192; decúbito lateral esquerdo, acesso venoso, verificar BCF a cada 20 minutos e avaliar dinâmica uterina.'),
    q('expulsive','COM ESCORE > 7, HÁ PERÍODO EXPULSIVO?', [['Sim','birth'],['Não','medium']]),
    end('birth','PREPARO DA EQUIPE PARA PARTO IMINENTE: tranquilizar e preservar privacidade, estimular respiração controlada, evitar toques fora das contrações, verificar BCF a cada 5 minutos e acompanhar parto conforme protocolo. Avaliar respiração do bebê, aquecer, secar e colocar em contato pele a pele; consultar no PDF cuidados com clampeamento, ocitocina, dequitação e vitamina K. Acionar SAMU 192 e maternidade de referência após o parto. Se gestação ≤ 34 semanas, solicitar ambulância neonatal.')
  ],'O escore deve ser calculado com a tabela integral da página 1, disponível na referência em texto.');
  install('adulto-sindrome-hipertensiva-na-gestacao','start',[
    a('start','Aferir dados vitais, idade gestacional e BCF; identificar sinais de gravidade de pré-eclâmpsia/eclâmpsia e posicionar a gestante em decúbito lateral esquerdo para avaliação médica.','bp'),
    q('bp','QUAL A CLASSIFICAÇÃO PRESSÓRICA E DE GRAVIDADE?',[
      ['PA ≥ 160×110 mmHg OU sinais de gravidade','severe'],
      ['PA ≥ 140×90 e < 160×110 mmHg, SEM sinais de gravidade','moderate'],
      ['Faixa descrita na fonte como PA ≥ 130×90 e < 140×90 mmHg, SEM sinais de gravidade','mild'],
      ['Nenhuma faixa descrita / dados indeterminados','unknown']
    ]),
    q('severe','NO RAMO GRAVE, QUAL A IDADE GESTACIONAL E A PRESENÇA DE SINAIS DE GRAVIDADE?',[
      ['Idade gestacional < 20 semanas, ou sem sinais de gravidade (conforme texto do PDF)','severe-early'],
      ['Idade gestacional > 20 semanas, com PA grave ou sinais de gravidade','severe-late'],
      ['Exatamente 20 semanas, ou classificação incerta','severe-uncertain']
    ]),
    end('severe-early','ENCAMINHAR À MATERNIDADE DE REFERÊNCIA E ACIONAR SAMU 192; acesso venoso, decúbito lateral esquerdo e verificação de BCF a cada 20 minutos. O PDF descreve manejo com nifedipino, aferições seriadas e controle gradual da PA; conferir dose, contraindicações e metas na fonte e no protocolo vigente.'),
    end('severe-late','ENCAMINHAR À MATERNIDADE DE REFERÊNCIA E ACIONAR SAMU 192; acesso venoso, decúbito lateral esquerdo e BCF a cada 20 minutos. A fonte descreve nifedipino e sulfato de magnésio 10% (anexo da página 2), com monitorização rigorosa e cateterismo vesical. Conferir anexo e protocolo vigente antes de prescrição.'),
    end('severe-uncertain','O PDF distingue < 20 e > 20 semanas, sem definir explicitamente a igualdade a 20 semanas. NÃO inferir a medicação por este fluxo. Discutir imediatamente com regulação/equipe obstétrica; manter o encaminhamento à maternidade e medidas de estabilização previstas para o ramo grave.'),
    end('moderate','CONSULTA MÉDICA; avaliar queixas, PA e BCF a cada 20 minutos, decúbito lateral esquerdo. Encaminhar à maternidade de referência, acionando SAMU 192 para transferência.'),
    end('mild','CONSULTA MÉDICA; avaliar queixas, PA e BCF e encaminhar à maternidade de referência, conforme PDF.'),
    end('unknown','Faixa ou contexto não coberto de modo inequívoco no diagrama municipal. Não presumir ausência de risco; solicitar avaliação médica e verificar PDF e protocolo obstétrico vigente.')
  ],'A faixa escrita no PDF como ≥ 130×90 e < 140×90 apresenta ambiguidade; não equivale a diagnóstico automático.');
  install('adulto-infeccao-do-trato-urinario-em-gestantes','start',[
    q('start','OS SINAIS E SINTOMAS SÃO COMPATÍVEIS COM QUAL QUADRO?',[
      ['Pielonefrite: febre/calafrios, dor lombar ou costovertebral, Giordano positivo, possível náusea ou vômito','pyelo'],
      ['Cistite: disúria, polaciúria, urgência miccional e/ou dor hipogástrica','cystitis'],
      ['Quadro indefinido ou ambos','uncertain']
    ]),
    end('pyelo','PIELONEFRITE: comunicar maternidade de referência e discutir com regulação do SAMU 3360-4980. Encaminhar à maternidade, decúbito lateral esquerdo, acesso venoso, BCF a cada 20 minutos, hidratação e sintomáticos segundo critérios do PDF. A fonte prevê início de antibióticos na maternidade.'),
    a('cystitis','CISTITE: realizar urofita (leucocitúria e nitrito), solicitar urocultura quando houver alteração na fita; após coleta, prescrever sintomáticos e antibioticoterapia segundo avaliação e protocolo, e referenciar à APS para reavaliação em 2 a 3 dias.','cystitis-final'),
    end('cystitis-final','CISTITE — ORIENTAÇÕES E SEGUIMENTO: conferir opções terapêuticas e limitações por idade gestacional na página 1; utilizar orientações de retorno da página 2. Reavaliar urocultura na APS, e orientar procurar maternidade para febre persistente, fraqueza extrema, incapacidade de alimentar-se/hidratar-se, sonolência excessiva ou persistência dos sintomas.'),
    end('uncertain','A fonte apresenta dois ramos (pielonefrite/cistite). Sem classificação segura, NÃO presumir tratamento de cistite simples. Reavaliar clinicamente e consultar maternidade/regulação conforme sinais de gravidade.')
  ]);
  install('adulto-emergencias-psiquiatricas-em-gestantes','start',[
    q('start','GESTAÇÃO CONHECIDA OU POSSÍVEL A IDENTIFICAÇÃO PELA CLÍNICA + EXAME FÍSICO (FUNDO UTERINO PALPÁVEL) COM QUADRO DE URGÊNCIA/ EMERGÊNCIA PSIQUIÁTRICA?',[
      ['Sim','management'],['Não','not-confirmed']
    ]),
    end('not-confirmed','Gestação não identificada nesta avaliação NÃO exclui gravidez. O PDF orienta questionar sobre possibilidade gestacional, uso de anticoncepção e data da última menstruação (DUM) em toda mulher em idade fértil com urgência/emergência psiquiátrica. Prosseguir avaliação clínica e investigação conforme suspeita; não atribuir automaticamente o diagnóstico de não gestante.'),
    a('management','MANEJO CLÍNICO — decúbito lateral esquerdo se possível; acesso venoso; verificar BCF a cada 20 minutos se mais de 12 semanas. Avaliar risco de auto/heteroagressão, contenção pelo menor tempo necessário e tratamento da agitação conforme condições e precauções do PDF. Conferir as doses e contraindicações medicamentosas na fonte antes de prescrever.','secondary'),
    a('secondary','AFASTAR CAUSAS SECUNDÁRIAS COM PROPEDÊUTICA COMPLEMENTAR — verificar existência de pré-natal; selecionar exames previstos pelo PDF para gestantes com ou sem exames prévios. Acrescentar exames indicados em abstinência alcoólica; avaliar necessidade de ecografia obstétrica antes de CAPS/UEP.','bond'),
    q('bond','QUAL É A SITUAÇÃO DE VINCULAÇÃO DA GESTANTE?',[
      ['Em situação de rua sem vínculo com maternidade','street'],
      ['Sem vínculo com maternidade, mas vinculada a unidade de saúde','health'],
      ['Já vinculada à maternidade','maternity'],
      ['Sem vínculo conhecido ou situação incerta','unlinked']
    ]),
    a('street','ACIONAR CONSULTÓRIO NA RUA da área para iniciar vínculo: Equipe 1 (Matriz/Santa Felicidade/Boa Vista) 98535-0789; Equipe 2 (Portão/Pinheirinho/CIC/Tatuquara) 99951-0844; Equipe 4 (Boqueirão/Cajuru/Bairro Novo) 99968-2109. Caso precise de ecografia obstétrica antes de UEP/CAPS e não tenha maternidade vinculada, contatar Mãe Curitibana (3350-9451).','destination'),
    a('health','A coordenação de assistência da UPA deve contatar a coordenação de assistência do distrito sanitário de referência para vinculação à maternidade e busca ativa. Se precisar de ecografia obstétrica antes de UEP/CAPS, contatar Mãe Curitibana (3350-9451).','destination'),
    a('maternity','Confirmar vínculo e coordenar o encaminhamento e os cuidados obstétricos conforme avaliação da equipe.','destination'),
    a('unlinked','Verificar com a equipe da UPA a unidade de referência e providenciar vinculação à maternidade. Se ecografia obstétrica for necessária antes do encaminhamento, discutir com Mãe Curitibana (3350-9451).','destination'),
    q('destination','QUAL DESTINO CORRESPONDE AOS CRITÉRIOS CLÍNICOS DO PDF?',[
      ['UEP: estabilização, delirium tremens, agitação grave refratária ou comportamento disruptivo sem resposta inicial','uep'],
      ['CAPS: descompensação, desintoxicação/abstinência, observação ou ajuste/monitoramento sem suporte familiar','caps'],
      ['Há suspeita de risco de suicídio: calcular IRIS','iris'],
      ['Critérios sobrepostos ou não esclarecidos','overlap']
    ]),
    end('uep','VAGA UEP — estabilização de urgência/emergência psiquiátrica, delirium tremens após exames, agitação psicomotora grave não controlada com medidas iniciais ou comportamento disruptivo sem resposta ao manejo inicial.'),
    end('caps','VAGA CAPS — descompensação psiquiátrica, desintoxicação/prevenção de abstinência, observação após descarte de condição clínica ou ajuste/monitorização sem suporte familiar.'),
    q('iris','CALCULE O IRIS — ÍNDICE DE RISCO DE SUICÍDIO (TABELA DA PÁGINA 2).',[
      ['Continuar conforme risco reduzido (IRIS < 5)','iris-low'],
      ['Continuar conforme risco intermediário (IRIS ≥ 5 e < 10)','iris-mid'],
      ['Continuar conforme risco elevado (IRIS ≥ 10)','iris-high']
    ]),
    end('iris-low','IRIS < 5: risco reduzido na escala da fonte. Referenciar para APS conforme avaliação clínica.'),
    end('iris-mid','IRIS ≥ 5 e < 10: risco intermediário na escala da fonte. Solicitar avaliação do CAPS.'),
    end('iris-high','IRIS ≥ 10: risco elevado na escala da fonte. Segunda a sexta, das 08:00 às 18:00, contatar Central de Retaguarda em Saúde Mental (CRSM); nos demais horários, NIR da UEP. Garantir avaliação e proteção imediatas quando houver risco atual.'),
    end('overlap','Se houver critérios simultâneos de UEP e CAPS, discutir definição do destino com a equipe e a regulação; a fonte não define prioridade automática.')
  ],'A calculadora IRIS da página 2 deve ser usada como apoio à avaliação, nunca como critério isolado de alta.');
  install('adulto-dor-abdominal-em-gestantes','start',[
    a('start','Anamnese da dor e sintomas associados; aferir sinais vitais, idade gestacional e BCF; decúbito lateral esquerdo especialmente após 24 semanas.','gravity'),
    q('gravity','HÁ SINAIS DE GRAVIDADE DESCRITOS NA FONTE?', [['Sim','severe'],['Não','obstetric']]),
    end('severe','Discutir com regulação do SAMU 3360-4980 e consultar os fluxos específicos de síndrome hipertensiva na gestação ou sangramento genital feminino conforme o quadro clínico.'),
    q('obstetric','HÁ SUSPEITA DE CAUSA OBSTÉTRICA?', [['Sim','abruption'],['Não','alerts']]),
    q('abruption','HÁ SUSPEITA DE ABORTAMENTO, DESCOLAMENTO PREMATURO DE PLACENTA (DPP) OU TRABALHO DE PARTO PREMATURO?', [['Sim','maternity'],['Não','labor']]),
    q('labor','HÁ TRABALHO DE PARTO?', [['Sim','labor-ref'],['Não','simple']]),
    end('labor-ref','CONSULTAR FLUXO DE ASSISTÊNCIA AO TRABALHO DE PARTO NA UPA, conforme encaminhamento expresso na fonte.'),
    end('simple','Prescrever sintomáticos conforme avaliação e orientar procurar maternidade de referência ou APS, após excluir sinais de gravidade.'),
    q('alerts','HÁ SINAIS DE ALERTA (PERITONITE, FEBRE, HIPOTENSÃO, CALAFRIOS, VÔMITOS, GIORDANO POSITIVO OU DOR EM HIPOCÔNDRIO DIREITO)?', [['Sim','maternity'],['Não','other']]),
    end('maternity','ENCAMINHAR À MATERNIDADE. Discutir com regulação SAMU 3360-4980; decúbito lateral esquerdo, acesso venoso e BCF seriado. Hidratação, analgesia e sintomáticos conforme critérios do PDF; a fonte indica antibioticoterapia na maternidade.'),
    q('other','QUAL HIPÓTESE NÃO OBSTÉTRICA É CONSIDERADA?', [['Infecção do trato urinário','uti'],['Gastroenterite ou constipação','diet'],['Outra hipótese/incerta','review']]),
    end('uti','VER FLUXO DE INFECÇÃO DO TRATO URINÁRIO EM GESTANTES.'),
    end('diet','Orientar dieta, prescrever sintomáticos conforme avaliação e orientar procurar maternidade de referência ou APS.'),
    end('review','O documento não estabelece outro desfecho específico nesta bifurcação. Reavaliar e consultar fonte, maternidade ou regulação conforme quadro clínico.')
  ]);
  install('adulto-dor-pelvica-na-mulher','start',[
    q('start','HÁ SINAIS DE GRAVIDADE?', [['Sim','severe'],['Não','pregnant']]),
    end('severe','Discutir com regulação SAMU 3360-4980 e iniciar manejo clínico conforme fonte, considerando gestação e contraindicações.'),
    q('pregnant','DOR PÉLVICA EM GESTANTE?', [['Sim','preg-ref'],['Não','acute']]),
    end('preg-ref','VER FLUXO DE DOR ABDOMINAL EM GESTANTES.'),
    q('acute','A DOR PÉLVICA É AGUDA (MENOS DE 3 MESES)?', [['Sim','tests'],['Não','chronic']]),
    end('chronic','Sintomáticos e referência à APS conforme PDF, após excluir gestação e sinais de gravidade.'),
    a('tests','Propedêutica complementar: beta-HCG, hemograma, PCR e parcial de urina.','hcg'),
    q('hcg','QUAL O RESULTADO DO BETA-HCG?', [['Positivo','hcg-pos'],['Negativo','peritonitis'],['Indeterminado','review']]),
    end('hcg-pos','Discutir com regulação do SAMU 3360-4980 e iniciar manejo clínico previsto, considerando possível gestação.'),
    q('peritonitis','HÁ PERITONITE?', [['Sim','perit'],['Não','cause']]),
    end('perit','Cadastrar na CLM e avaliar antibioticoterapia e condução hospitalar conforme protocolo e médico responsável.'),
    q('cause','QUAL GRUPO DE CAUSAS FOI IDENTIFICADO?', [['Ginecológicas','gyneco'],['Não ginecológicas','non-gyneco'],['Indefinida','undefined']]),
    end('gyneco','Ver quadro de causas ginecológicas e respectivas condutas no PDF (dismenorreia, neoplasia e doença inflamatória pélvica).'),
    end('non-gyneco','Ver quadro de causas não ginecológicas no PDF (ITU/litíase urinária, neoplasia e constipação).'),
    end('undefined','Encaminhar para avaliação hospitalar e ultrassonografia, conforme fonte.'),
    end('review','Beta-HCG não conclusivo: não assumir o ramo negativo; confirmar avaliação diagnóstica e considerar maternidade/regulação.')
  ]);
  install('adulto-sangramento-genital-feminino','start',[
    q('start','HÁ SINAIS DE GRAVIDADE (SANGRAMENTO COM CHOQUE OU OUTROS CRITÉRIOS DO PDF)?', [['Sim','severe'],['Não','pregnant']]),
    end('severe','Discutir com regulação do SAMU 3360-4980 e manejo clínico conforme fonte. Se gestante, considerar restrições medicamentosas e monitorização fetal.'),
    q('pregnant','O SANGRAMENTO OCORRE EM GESTANTE?', [['Sim','preg'],['Não','violence']]),
    end('preg','Discutir com regulação SAMU 3360-4980 e manejo clínico; decúbito lateral esquerdo, verificar BCF conforme PDF e referenciar maternidade de acordo com vínculo e regulação. Evitar fármacos assinalados como contraindicados em gestantes.'),
    q('violence','HÁ HISTÓRIA DE VIOLÊNCIA SEXUAL?', [['Sim','ref'],['Não','trauma']]),
    end('ref','Discutir com regulação do SAMU e realizar manejo clínico; garantir acolhimento e acionamento da rede pertinente.'),
    q('trauma','HOUVE TRAUMA GENITAL?', [['Sim','trauma-care'],['Não','alert']]),
    end('trauma-care','Exame físico externo e especular para pesquisar lacerações; se presentes, discutir com regulação do SAMU, conforme PDF.'),
    q('alert','HÁ SINAIS DE ALERTA?', [['Sim','tests'],['Não','low']]),
    end('low','Após excluir abortamento e repercussão hemodinâmica, encaminhar à APS e consultar sintomáticos previstos na fonte.'),
    a('tests','Manejo clínico e investigação laboratorial: hemograma, beta-HCG e TAP; reavaliar após exames.','bhcg'),
    q('bhcg','O BETA-HCG É POSITIVO?', [['Sim','positive'],['Não','negative'],['Indeterminado','ref']]),
    end('positive','Discutir com regulação do SAMU 3360-4980 conforme PDF.'),
    end('negative','Se anemia intensa (Hb < 7 g/dL) ou coagulopatia: cadastrar CLM. Se exames normais: APS e sintomáticos previstos no PDF, conforme avaliação.')
  ]);
})();