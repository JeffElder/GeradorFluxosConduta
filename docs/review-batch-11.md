# Lote 11 — icterícia no adulto, ITU em gestantes e ITU no adulto

16/10/2026. Conferência individual textual e visual das sete páginas originais da SMS Curitiba (3 + 2 + 2), incluindo setas, quadros terapêuticos e cartas de orientação. Fontes e SHA-256 estão no registro. Esta conferência documental não equivale a validação clínica.

| Protocolo | Problemas e correções | Testes de caminhos |
|---|---|---|
| Icterícia no adulto | Condutas da página 2 e West-Haven da página 3 estavam fora do percurso. Desdobrados anemia/icterícia intermitente, causas, padrões da colestase, Maddrey, encefalopatia, hepatite fulminante e intoxicação por paracetamol. Preservados encaminhamento à emergência/sepse, APS e avaliação hospitalar. Incluído acesso navegável ao protocolo citado de leptospirose. | 52 |
| ITU em gestantes | Manejo condicionado à hipotensão/desidratação, dor/febre e vômitos convertido em escolhas; vínculo territorial de maternidade explicitado. Coleta antes do antibiótico, preparo completo da fosfomicina, limite de 36 semanas, alternativas e orientações de retorno incorporados. | 40 |
| ITU no adulto | Critérios de gravidade/alerta/urgência/risco incluídos nas perguntas. Recuperadas nota sobre sonda, opções por síndrome, exames, carta à APS e sinais para retorno. Mantido seguimento do ramo de risco para todas as alternativas. | 24 |

## Pendências documentais para validação clínica

- Icterícia: fluxo de anemia citado não integra o acervo de 73; não foi presumido tratamento. Fonte não define casos indiretos sem anemia/intermitência, transaminases exatamente 1000 ou evolução colestática fora das duas alternativas. A definição de hepatite fulminante exclui hepatopatia prévia, mas o segundo critério a admite. Unidade de bilirrubina na fórmula de Maddrey ausente; sem calculadora automática. Duração/contraindicações de prednisona, dose da tiamina, ampola/indicação de diazepam, concentração de lactulose e doses/volumes de sintomáticos incompletos; não se transformaram concentrações em doses. Ceftriaxona na colestase sem via/duração; indicação por etiologia não delimitada. Preservada a grafia inconsistente “TGO e TGO” como pendência, sem inventar exame.
- Gestantes: fita negativa/inconclusiva não possui ramo no documento; não induz tratamento automático. Prazo APS diverge: 3 dias na página 1, 2–3 dias na carta, 48 h nas orientações. Anexo de pactuação por bairro não acompanha o arquivo; confirmar destino pela regulação. Dipirona/metoclopramida têm concentração sem dose/volume. Nenhum regime foi inventado.
- ITU adulto: pielonefrite tem 10–14 dias no ramo versus 7–10 no quadro; registrar duração validada. Urocultura nos ramos versus hemocultura no cabeçalho terapêutico: alcance da exigência pendente. Ceftriaxona/ciprofloxacino em ampolas sem apresentação; ceftriaxona de prostatite sem frequência. “Hipotensão PAS >90” não delimita teto; PAS exatamente 90 não coberta. Oligúria/confusão se sobrepõem a gravidade/alerta. Concentrações de analgésicos/antiemético sem dose; repetição de hidratação sem limite, com atenção a IC/DRC conforme fonte.

## Verificação

`node scripts/test-review-batch-11.cjs`: 116 trajetórias completas, renderizando e acionando cada alternativa até seu destino. Fixtures independentes das principais bifurcações e critérios conferidos nos PDFs; verificação de ausência de ciclos/nós quebrados. Encerramentos documentais e pontos de validação são distinguidos no texto; ausência de prescrição não é convertida em alta.

Pipeline completo executado localmente antes da publicação. Deploy ainda não confirmado no momento deste commit; a confirmação será registrada somente após Actions e comparação dos arquivos publicados.
