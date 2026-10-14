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
    // Do not expose isolated protocolo municipal diagrams as alternate starting points.
    p.entries=[{to:'ob-'+entry,page:1,label:'Iniciar avaliação conforme protocolo municipal'}];
    p.nodes={...p.nodes,...nodes};
    p.warning=[p.warning, 'Fluxo de navegação revisado a partir de documento municipal. Doses e critérios exigem conferência por responsável clínico; ferramenta ainda não validada para uso assistencial.',notes].filter(Boolean).join(' ');
    p.obstetricReview={source:p.source||null,date:'2026-10-14'};
  }
  const q=(id,title,choices,criteria='')=>[id,true,title,choices,1];
  const a=(id,title,to)=>[id,false,title,[['Próxima etapa',to]],1];
  const end=(id,text,page=1)=>[id,false,text,[],page];
  install('adulto-assistencia-ao-trabalho-de-parto-na-upa','start',[
    a('start','CONTRAÇÕES UTERINAS DOLOROSAS REGULARES / AMNIORREXE. Aferir sinais vitais, idade gestacional e BCF, colocar em decúbito lateral esquerdo; Realizar toque vaginal: avaliar integridade das membranas; se rotas, há quanto tempo e aspecto do líquido amniótico. Avaliar sangramento vaginal e características; dilatação, comprimento, consistência, posição e apagamento cervical; altura, situação, posição e apresentação fetal. Calcular o escore de Malinas.','score'),
    q('score','QUAL A FAIXA DO ESCORE DE MALINAS CALCULADO?', [['Menor que 5','low'],['Entre 5 e 7','medium'],['Maior que 7','expulsive']]),
    end('low','ESCORE < 5: orientar procurar maternidade de referência; avaliar risco social e necessidade de acionar CTS para transporte.'),
    end('medium','ESCORE ENTRE 5 E 7: contato com maternidade de referência e acionar SAMU 192; decúbito lateral esquerdo, acesso venoso, verificar BCF a cada 20 minutos e avaliar dinâmica uterina.'),
    q('expulsive','COM ESCORE > 7, HÁ PERÍODO EXPULSIVO?', [['Sim','birth'],['Não','medium']]),
    end('birth','PREPARO DA EQUIPE PARA PARTO IMINENTE: tranquilizar e preservar privacidade, estimular respiração controlada, evitar toques fora das contrações, verificar BCF a cada 5 minutos e realizar manobra para desprendimento fetal. Avaliar respiração do bebê, aquecer, secar e colocar em contato pele a pele; Após nascimento: aguardar 1 a 2 minutos para clampear o cordão; administrar ocitocina 10 UI IM à mãe; realizar tração controlada do cordão até dequitação completa; encaminhar a placenta à maternidade junto à mãe e ao bebê; administrar vitamina K 1 mg IM no recém-nascido. Acionar SAMU 192 para transferência após o parto e contatar maternidade de referência. Se gestação ≤ 34 semanas, solicitar ambulância neonatal.')
  ],'ESCORE DE MALINAS — some cinco critérios, cada um com 0/1/2 pontos: partos prévios (1 / 2 / mais de 2); duração do trabalho de parto (menos de 3 h / 3 a 5 h / mais de 6 h); duração das contrações (menos de 1 min / 1 min / mais de 1 min); intervalo entre contrações (mais de 5 min / 3 a 5 min / menos de 3 min, ao menos duas em 5 min); amniorrexe (nega / há menos de 1 h / há mais de 1 h). As faixas de horas entre 5 e 6 são ambíguas na classificação apresentada e exigem julgamento clínico.');
  {
    const p=protocols['adulto-assistencia-ao-trabalho-de-parto-na-upa'];
    if(p){
      p.nodes['ob-score'].criteria='ESCORE DE MALINAS — cada critério recebe 0 / 1 / 2 pontos, respectivamente.\nPartos prévios: 1 / 2 / >2.\nDuração do trabalho de parto: <3 h / 3–5 h / >6 h.\nDuração das contrações: <1 min / 1 min / >1 min.\nIntervalo: >5 min / 3–5 min / <3 min (ao menos 2 em 5 min).\nAmniorrexe: nega / <1 h / >1 h.\nLacunas da tabela: zero partos prévios, duração >5 e ≤6 horas e amniorrexe de exatamente 1 hora não têm pontuação definida. Não calcular pontuação por inferência; validar classificação com a maternidade/regulação.';
      p.nodes['ob-expulsive'].criteria='PERÍODO EXPULSIVO: dilatação total do colo (10 cm); esforço expulsivo materno (puxos); sensação de preenchimento retal; bebê visível/palpável.';
      for(const key of ['ob-low','ob-medium','ob-birth'])p.nodes[key].text+=' Maternidade de referência: a indicada na carteirinha/UBS da gestante.';
      p.nodes['ob-medium'].text+=' Avaliar contratilidade, intensidade e frequência das contrações.';
    }
  }
  install('adulto-sindrome-hipertensiva-na-gestacao','start',[
    a('start','Aferir dados vitais, idade gestacional e BCF; identificar sinais de gravidade de pré-eclâmpsia/eclâmpsia e posicionar a gestante em decúbito lateral esquerdo para avaliação médica.','bp'),
    q('bp','QUAL A CLASSIFICAÇÃO PRESSÓRICA E DE GRAVIDADE?',[
      ['PA ≥ 160×110 mmHg OU sinais de gravidade','severe'],
      ['PA ≥ 140×90 e < 160×110 mmHg, SEM sinais de gravidade','moderate'],
      ['Faixa apresentada como PA ≥ 130×90 e < 140×90 mmHg, SEM sinais de gravidade','mild'],
      ['Nenhuma faixa descrita / dados indeterminados','unknown']
    ]),
    q('severe','NO RAMO GRAVE, QUAL A IDADE GESTACIONAL E A PRESENÇA DE SINAIS DE GRAVIDADE?',[
      ['Idade gestacional < 20 semanas, ou sem sinais de gravidade (conforme texto da orientação municipal)','severe-early'],
      ['Idade gestacional > 20 semanas, com PA grave ou sinais de gravidade','severe-late'],
      ['Exatamente 20 semanas, ou classificação incerta','severe-uncertain']
    ]),
    end('severe-early','ENCAMINHAR À MATERNIDADE DE REFERÊNCIA E ACIONAR SAMU 192; acesso venoso, decúbito lateral esquerdo e verificação de BCF a cada 20 minutos. O protocolo municipal descreve manejo com nifedipino, aferições seriadas e controle gradual da PA; A orientação municipal descreve nifedipino 10 mg VO sem mastigar ou usar via sublingual, controle da PA a cada 5 minutos por 20 minutos e, caso persista PA acima de 155×105 mmHg, repetição de 10 mg a cada 30 minutos até 30 mg. Meta descrita: reduzir a PA em 15% a 25% sem queda brusca, visando 140–150 mmHg de sistólica e 90–100 mmHg de diastólica. Exige prescrição e vigilância médica.'),
    end('severe-late','ENCAMINHAR À MATERNIDADE DE REFERÊNCIA E ACIONAR SAMU 192; acesso venoso, decúbito lateral esquerdo e BCF a cada 20 minutos. A orientação municipal descreve nifedipino 10 mg VO e sulfato de magnésio 10% para pré-eclâmpsia grave/eclâmpsia, além de cateterismo vesical de demora. O esquema de sulfato de magnésio está em anexo separado não reproduzido nesse documento; não calcular nem inferir sua infusão sem protocolo institucional de administração e monitorização. Monitorar PA, BCF e condições maternas, e acionar SAMU 192 para maternidade de referência.'),
    end('severe-uncertain','O protocolo municipal distingue < 20 e > 20 semanas, sem definir explicitamente a igualdade a 20 semanas. NÃO inferir a medicação por este fluxo. Discutir imediatamente com regulação/equipe obstétrica; manter o encaminhamento à maternidade e medidas de estabilização previstas para o ramo grave.'),
    end('moderate','CONSULTA MÉDICA; avaliar queixas, PA e BCF a cada 20 minutos, decúbito lateral esquerdo. Encaminhar à maternidade de referência, acionando SAMU 192 para transferência.'),
    end('mild','CONSULTA MÉDICA; avaliar queixas, PA e BCF e encaminhar à maternidade de referência, conforme os critérios clínicos.'),
    end('unknown','Faixa ou contexto não coberto de modo inequívoco no diagrama municipal. Não presumir ausência de risco; solicitar avaliação médica e acionar a equipe obstétrica e a regulação para decisão individualizada.')
  ],'A faixa escrita na avaliação como ≥ 130×90 e < 140×90 apresenta ambiguidade; não equivale a diagnóstico automático.');
  install('adulto-infeccao-do-trato-urinario-em-gestantes','start',[
    q('start','OS SINAIS E SINTOMAS SÃO COMPATÍVEIS COM QUAL QUADRO?',[
      ['Pielonefrite: febre/calafrios, dor lombar ou costovertebral, Giordano positivo, possível náusea ou vômito','pyelo'],
      ['Cistite: disúria, polaciúria, urgência miccional e/ou dor hipogástrica','cystitis'],
      ['Quadro indefinido ou ambos','uncertain']
    ]),
    end('pyelo','PIELONEFRITE: comunicar maternidade de referência e discutir com regulação do SAMU 3360-4980. Encaminhar à maternidade, decúbito lateral esquerdo, acesso venoso, BCF a cada 20 minutos, hidratação e sintomáticos segundo critérios da orientação municipal. O antibiótico é iniciado na maternidade. Para hipotensão/desidratação, a orientação municipal descreve SF 0,9% 20 mL/kg; para dor ou febre, dipirona IV; para dor em cólica, hioscina IV; para vômitos, metoclopramida IV. Administrar somente mediante avaliação e prescrição, considerando contraindicações.'),
    a('cystitis','CISTITE: realizar urofita (leucocitúria e nitrito), solicitar urocultura quando houver alteração na fita; após coleta, prescrever sintomáticos e antibioticoterapia segundo avaliação e protocolo, e referenciar à APS para reavaliação em 2 a 3 dias.','cystitis-final'),
    end('cystitis-final','CISTITE — ORIENTAÇÕES E SEGUIMENTO: Opções municipais de antibioticoterapia para cistite, sujeitas a prescrição e adequação pela urocultura: fosfomicina trometamol 3 g em dose única (dissolver em 50–75 mL de água, ingerir imediatamente em jejum, preferencialmente à noite após esvaziar a bexiga); nitrofurantoína 100 mg de 6/6 h por 7 dias (até 36 semanas); ou cefalexina 500 mg de 6/6 h por 7 dias. Para alívio da dor, paracetamol 500 mg de 6/6 h. Orientar hidratação, manter medicações crônicas, avaliar urocultura na APS em 48–72 h e procurar maternidade se febre ou sintomas persistirem após 48 h de antibiótico, fraqueza extrema, incapacidade de ingestão ou sonolência excessiva. Reavaliar urocultura na APS, e orientar procurar maternidade para febre persistente, fraqueza extrema, incapacidade de alimentar-se/hidratar-se, sonolência excessiva ou persistência dos sintomas.'),
    end('uncertain','A avaliação contempla dois ramos (pielonefrite/cistite). Sem classificação segura, NÃO presumir tratamento de cistite simples. Reavaliar clinicamente e consultar maternidade/regulação conforme sinais de gravidade.')
  ]);
  install('adulto-emergencias-psiquiatricas-em-gestantes','start',[
    q('start','GESTAÇÃO CONHECIDA OU POSSÍVEL A IDENTIFICAÇÃO PELA CLÍNICA + EXAME FÍSICO (FUNDO UTERINO PALPÁVEL) COM QUADRO DE URGÊNCIA/ EMERGÊNCIA PSIQUIÁTRICA?',[
      ['Sim','management'],['Não','not-confirmed']
    ]),
    a('not-confirmed','GESTAÇÃO NÃO IDENTIFICADA NA AVALIAÇÃO INICIAL NÃO EXCLUI GRAVIDEZ. Questionar possibilidade gestacional, uso de anticoncepção e data da última menstruação (DUM); examinar e investigar conforme suspeita, sem atrasar estabilização psiquiátrica.','pregnancy-check'),
    q('pregnancy-check','APÓS A AVALIAÇÃO COMPLEMENTAR, HÁ GESTAÇÃO CONFIRMADA OU AINDA SUSPEITA?',[
      ['Sim, confirmada ou ainda possível','management'],['Não, gestação afastada pela avaliação clínica','general-psych'],['Ainda indeterminado','management']
    ]),
    end('general-psych','Gestação afastada após avaliação: considerar o fluxo geral de emergências psiquiátricas da UPA. Não classificar automaticamente apenas pela resposta negativa à pergunta inicial.'),
    a('management','MANEJO CLÍNICO — decúbito lateral esquerdo se possível; acesso venoso; verificar BCF a cada 20 minutos se mais de 12 semanas. Avaliar risco de auto/heteroagressão, contenção pelo menor tempo necessário e tratamento da agitação conforme condições e precauções da orientação municipal. O documento municipal descreve haloperidol 5 mg IM a cada 30 minutos, até seis doses na crise; para pacientes não agressivas, haloperidol VO 5 mg de uma a quatro vezes por dia, com máximo descrito de 40 mg/dia; em sintomas extrapiramidais, biperideno 3 a 5 mg a cada 6 horas. Para proteção em risco suicida, descreve carbonato de lítio 300 mg no primeiro dia, 600 mg no segundo e 900 mg do terceiro em diante, com advertência de evitar no primeiro trimestre e avaliar risco-benefício. Esses esquemas transcritos exigem avaliação obstétrica/psiquiátrica e conferência de segurança, especialmente na gestação, antes da prescrição.','secondary'),
    a('secondary','AFASTAR CAUSAS SECUNDÁRIAS — SEM EXAMES PRÉVIOS DE PRÉ-NATAL: solicitar hemograma, glicose, eletrólitos, creatinina, parcial de urina, urocultura, anti-HIV 1 e 2, anti-HCV, HBsAg, rastreamento de sífilis por quimioluminescência e eletrocardiograma (ECG). COM ACOMPANHAMENTO PRÉ-NATAL: solicitar hemograma, glicose, eletrólitos, creatinina, ureia, parcial de urina e ECG. SE ABSTINÊNCIA ALCOÓLICA: acrescentar CPK, ureia, lipase, TGO, TGP, RNI e bilirrubinas. SE NECESSITAR DE ECOGRAFIA OBSTÉTRICA ANTES DE UEP/CAPS E NÃO POSSUIR MATERNIDADE VINCULADA: contatar equipe Mãe Curitibana, telefone 3350-9451, para discutir o caso. Investigar causas de agitação: delirium, surto psicótico, hipóxia, traumatismo cranioencefálico, intoxicação por cocaína/psicoestimulantes ou álcool, abstinência alcoólica, ataque de pânico e transtornos de personalidade.','bond'),
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
    q('destination','QUAL DESTINO CORRESPONDE AOS CRITÉRIOS CLÍNICOS APRESENTADOS?',[
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
    q('gravity','HÁ SINAIS DE GRAVIDADE: PA ≥160×110 mmHg, edema generalizado, icterícia, rebaixamento de consciência, convulsões, equimoses, sangramento vaginal com choque (PAS <90 mmHg, FC >100 bpm, FR >22 irpm ou TEC >3 segundos)?', [['Sim','severe'],['Não','obstetric']]),
    end('severe','Discutir com regulação do SAMU 3360-4980 e avaliar se há síndrome hipertensiva grave (PA ≥160×110 mmHg, alteração visual, cefaleia, epigastralgia, convulsões) ou hemorragia genital importante (PAS <90 mmHg, FC >100 bpm, perfusão periférica lenta, rebaixamento de consciência). Posicionar em decúbito lateral esquerdo, obter acesso venoso e avaliar BCF; acionar SAMU 192 e maternidade de referência conforme gravidade.'),
    q('obstetric','HÁ SUSPEITA DE CAUSA OBSTÉTRICA?', [['Sim','abruption'],['Não','alerts']]),
    q('abruption','HÁ SUSPEITA DE ABORTAMENTO, DESCOLAMENTO PREMATURO DE PLACENTA (DPP) OU TRABALHO DE PARTO PREMATURO?', [['Sim','maternity'],['Não','labor']]),
    q('labor','HÁ TRABALHO DE PARTO?', [['Sim','labor-ref'],['Não','simple']]),
    end('labor-ref','TRABALHO DE PARTO: avaliar contrações, possível perda de líquido, sinais vitais, idade gestacional, BCF, membranas e dilatação. Calcular escore de Malinas (partos anteriores, horas em trabalho de parto, duração e intervalo das contrações, tempo de amniorrexe). Escore <5: orientar maternidade; 5–7: contatar maternidade e SAMU 192; >7 com período expulsivo (dilatação completa de 10 cm, puxos, preenchimento retal ou bebê visível): preparar assistência ao parto iminente e acionar transferência.'),
    end('simple','Prescrever sintomáticos conforme avaliação e orientar procurar maternidade de referência ou APS, após excluir sinais de gravidade.'),
    q('alerts','HÁ SINAIS DE ALERTA (PERITONITE, FEBRE, HIPOTENSÃO, CALAFRIOS, VÔMITOS, GIORDANO POSITIVO OU DOR EM HIPOCÔNDRIO DIREITO)?', [['Sim','maternity'],['Não','other']]),
    end('maternity','ENCAMINHAR À MATERNIDADE. Discutir com regulação SAMU 3360-4980; decúbito lateral esquerdo, acesso venoso e BCF seriado. Hidratação, analgesia e sintomáticos conforme critérios da orientação municipal; a fonte indica antibioticoterapia na maternidade.'),
    q('other','QUAL HIPÓTESE NÃO OBSTÉTRICA É CONSIDERADA?', [['Infecção do trato urinário','uti'],['Gastroenterite ou constipação','diet'],['Outra hipótese/incerta','review']]),
    end('uti','AVALIAR ITU EM GESTANTE: sintomas de cistite (disúria, polaciúria, urgência, dor hipogástrica) ou pielonefrite (febre, calafrios, dor lombar/costovertebral, Giordano positivo, náuseas/vômitos). Pielonefrite: contatar maternidade e regulação SAMU 3360-4980, acesso venoso, decúbito lateral esquerdo e BCF a cada 20 minutos; antibioticoterapia será iniciada na maternidade. Cistite: urofita para leucócitos/nitrito, urocultura se alterada e avaliação médica para antibioticoterapia; controle pela APS em 48–72 horas.'),
    end('diet','Orientar dieta, prescrever sintomáticos conforme avaliação e orientar procurar maternidade de referência ou APS.'),
    end('review','As orientações municipais não estabelecem outro desfecho específico nesta bifurcação. Reavaliar e consultar maternidade ou regulação conforme quadro clínico.')
  ]);
  install('adulto-dor-pelvica-na-mulher','start',[
    q('start','HÁ SINAIS DE GRAVIDADE?', [['Sim','severe'],['Não','pregnant']]),
    end('severe','Discutir com regulação SAMU 3360-4980 e iniciar manejo clínico conforme fonte, considerando gestação e contraindicações.'),
    q('pregnant','DOR PÉLVICA EM GESTANTE?', [['Sim','preg-ref'],['Não','acute']]),
    end('preg-ref','DOR PÉLVICA NA GESTANTE: avaliar início, localização, intensidade e evolução da dor, náuseas/vômitos, diarreia, disúria, febre, sangramento/perda de líquido, sinais vitais, idade gestacional e BCF; investigar hipertensão grave (≥160×110 mmHg), choque, convulsões, icterícia e alteração de consciência. Se gravidade, contatar regulação SAMU 3360-4980; se suspeita de abortamento, descolamento de placenta ou parto prematuro, encaminhar à maternidade. Se sinais de infecção, peritonite ou pielonefrite, maternidade e estabilização clínica.'),
    q('acute','A DOR PÉLVICA É AGUDA (MENOS DE 3 MESES)?', [['Sim','tests'],['Não','chronic']]),
    end('chronic','Sintomáticos e referência à APS após excluir gestação e sinais de gravidade.'),
    a('tests','Propedêutica complementar: beta-HCG, hemograma, PCR e parcial de urina.','hcg'),
    q('hcg','QUAL O RESULTADO DO BETA-HCG?', [['Positivo','hcg-pos'],['Negativo','peritonitis'],['Indeterminado','review']]),
    end('hcg-pos','Discutir com regulação do SAMU 3360-4980 e iniciar manejo clínico previsto, considerando possível gestação.'),
    q('peritonitis','HÁ PERITONITE?', [['Sim','perit'],['Não','cause']]),
    end('perit','Cadastrar na CLM e avaliar antibioticoterapia e condução hospitalar conforme protocolo e médico responsável.'),
    q('cause','QUAL GRUPO DE CAUSAS FOI IDENTIFICADO?', [['Ginecológicas','gyneco'],['Não ginecológicas','non-gyneco'],['Indefinida','undefined']]),
    end('gyneco','CAUSAS GINECOLÓGICAS: dismenorreia — controle sintomático domiciliar e APS, após exclusão de gravidez; neoplasia — encaminhar para avaliação hospitalar; doença inflamatória pélvica (DIP) — esquema municipal: ceftriaxona 250 mg IM dose única, doxiciclina 100 mg VO de 12/12 h por 14 dias e metronidazol 500 mg VO de 12/12 h por 14 dias, além de sintomáticos e APS. Doses transcritas de edição de 2024: conferir diretriz vigente, gestação e contraindicações antes da prescrição.'),
    end('non-gyneco','CAUSAS NÃO GINECOLÓGICAS: ITU — avaliar disúria, polaciúria e urgência miccional, realizar parcial de urina e considerar urocultura; litíase — avaliar cólica renal e sinais de obstrução/infecção; neoplasia — encaminhar para avaliação hospitalar; constipação — orientar dieta rica em fibras, hidratação e sintomáticos conforme avaliação.'),
    end('undefined','Encaminhar para avaliação hospitalar e ultrassonografia, conforme avaliação clínica.'),
    end('review','Beta-HCG não conclusivo: não assumir o ramo negativo; confirmar avaliação diagnóstica e considerar maternidade/regulação.')
  ]);
  install('adulto-sangramento-genital-feminino','start',[
    q('start','HÁ SINAIS DE GRAVIDADE (SANGRAMENTO INTENSO, PAS <90 mmHg, FC >100 bpm, FR >22 irpm, TEC >3 segundos, rebaixamento de consciência OU OLIGÚRIA)?', [['Sim','severe'],['Não','pregnant']]),
    end('severe','Discutir com regulação do SAMU 3360-4980 e manejo clínico conforme avaliação clínica. Se gestante, considerar restrições medicamentosas e monitorização fetal.'),
    q('pregnant','O SANGRAMENTO OCORRE EM GESTANTE?', [['Sim','preg'],['Não','violence']]),
    end('preg','Discutir com regulação SAMU 3360-4980 e manejo clínico; decúbito lateral esquerdo, verificar BCF a cada 20 minutos e referenciar maternidade de acordo com vínculo e regulação. Evitar fármacos assinalados como contraindicados em gestantes.'),
    q('violence','HÁ HISTÓRIA DE VIOLÊNCIA SEXUAL?', [['Sim','ref'],['Não','trauma']]),
    end('ref','Discutir com regulação do SAMU e realizar manejo clínico; garantir acolhimento e acionamento da rede pertinente.'),
    q('trauma','HOUVE TRAUMA GENITAL?', [['Sim','trauma-care'],['Não','alert']]),
    end('trauma-care','Exame físico externo e especular para pesquisar lacerações; se presentes, discutir com regulação do SAMU, conforme os critérios clínicos.'),
    q('alert','HÁ SINAIS DE ALERTA?', [['Sim','tests'],['Não','low']]),
    end('low','Após excluir abortamento e repercussão hemodinâmica, encaminhar à APS. A orientação municipal cita ibuprofeno 600 mg para pacientes não gestantes após excluir abortamento e instabilidade; avaliar risco, contraindicações e necessidade de prescrição.'),
    a('tests','Manejo clínico e investigação laboratorial: hemograma, beta-HCG e TAP; reavaliar após exames.','bhcg'),
    q('bhcg','O BETA-HCG É POSITIVO?', [['Sim','positive'],['Não','negative'],['Indeterminado','ref']]),
    end('positive','Discutir com regulação do SAMU 3360-4980 conforme os critérios clínicos.'),
    end('negative','Se anemia intensa (Hb < 7 g/dL) ou coagulopatia: cadastrar CLM. Se exames normais: APS e sintomáticos previstos na avaliação, conforme avaliação.')
  ]);
})();