# Lote 14 — pneumonia no adulto, PEP HIV consentida, rebaixamento da consciência

Conferidas individualmente em texto/imagem as cinco páginas dos três PDFs municipais (2 + 2 + 1), com novos downloads e SHA-256 idênticos ao registro. Pneumonia v.3/25-06-2024; PEP consentida v.1/02-2026 e referências v.1/12-2025; rebaixamento v.2/25-06-2024. Calculadoras e mudanças focais anteriores foram conferidas no contexto integral, sem contar testes estruturais como revisão individual.

| Protocolo | Problemas e correções |
|---|---|
| Pneumonia no adulto | Anamnese, gravidade e critérios adicionais agora visíveis nas perguntas. Integrada calculadora CRB-65 em ambas as decisões, com 1 ponto por componente, adicional não pontuado e encaminhamento compatível. PSI e pH decimal preservados. Tratamento domiciliar separa comorbidades/antibiótico nos últimos 3 meses e três alternativas por grupo. CLM separa as duas alternativas de corticoterapia e três esquemas antibióticos. Preservadas setas sepsis, manejo inicial, PSI e tratamento domiciliar. |
| PEP sexual consentida ao HIV | Não tinha entrada nem decisões navegáveis. Reconstruídos contexto da exposição, janela de 72 h, teste HIV, interações com quatro fármacos, esquemas padrão/dolutegravir 12/12 h, duração 28 dias, formulário e seguimento UBS. Contracepção de emergência avaliada explicitamente, com alternativas da fonte e limites ausentes registrados. Incorporados endereços, telefones, faixas etárias e horários das referências de violência sexual/ocupacional da página 2. |
| Rebaixamento da consciência | Manejo de dados vitais e ECG eram blocos sem escolhas. Agora permite selecionar a causa e obter a conduta/ligação correspondente, incluindo condições simultâneas sem inventar prioridade. Critérios neurológicos e todos os exames visíveis nas perguntas. Tratamento conforme causa permanece encerramento legítimo, com lista integral de hipóteses; sem causa, SAMU preservado. Corrigidas ligações por singular/plural para crises convulsivas, intoxicações e síndromes coronarianas. |

## Pendências clínicas precisas

**Pneumonia:** o PDF municipal usa FR >30/PAD <60 no CRB-65; NICE NG250 confirma 1 ponto por componente, mas usa FR ≥30/PAD ≤60. As fronteiras 30 irpm/60 mmHg estão em divergência e o municipal foi preservado. Fonte NICE: https://www.nice.org.uk/guidance/ng250/chapter/recommendations. A pergunta exige critério adicional junto de CRB ≥1; idade <50 sem adicionais mantém o ramo ambulatorial. Fluxograma envia classes PSI ≥III à CLM, mas tabela manda reavaliar III/alta se estável/SAD/CLM se piorar, IV/V CLM e V considerar UTI: discrepância não resolvida por invenção. Duração da metilprednisolona ausente, via da prednisona e da clindamicina não explícitas. Ceftriaxona 100 mg/kg/dia sem população/divisão definida. Levofloxacino domiciliar sem frequência; ceftriaxona domiciliar “1x ao” truncado e duração ausente. Não foram preenchidas lacunas por suposição.

**PEP:** fonte não especifica ajuste por função renal/idade/peso/condições especiais nem decisão para teste indisponível ou inconclusivo. Mantidos os dois resultados definidos e a indicação do esquema de 28 dias. Contracepção: janela/critério clínico de indicação não descritos; alternativa 0,75 mg de 12/12 h sem número total de doses explícito, não presumido como repetição irrestrita nem preenchido por inferência. A página 2 imprime “acima de 12 anos” e “até 11 anos”, omitindo 12 exatos. Serviços/endereço/telefone apresentados como os impressos em 12/2025; a fonte não define prioridade entre os três serviços para mulheres acima de 12. Contextos de violência/ocupacional conduzem às referências e não receberam automaticamente o regime da exposição consentida. Formulário de prescrição acessível por link próprio; os critérios clínicos e doses estão em tela, sem instrução para consultar PDF clínico.

**Rebaixamento:** PAS >90 e <120 para expansão; volume/velocidade/repetição ausentes. Hipotensão severa impressa como “PAS ,90”, operador indefinido, sem limiar automático. Exatos 90/120 e outras alterações não especificadas ficam identificados para validação. Glicose 50% 50 mL IV é dose fixa adulta no documento, sem velocidade/intervalo de repetição. ECG descreve isquemia e taqui/bradiarritmia, sem ordem se coexistem nem regime para outras alterações. Exames anormais: tratar causa é término da fonte, sem algoritmo farmacológico detalhado para cada hipótese; não se inventou um esquema.

## Testes e publicação

`test-review-batch-14.cjs`: 43 trajetórias de pneumonia + 10 PEP + 18 rebaixamento =71, todas enumeradas e percorridas na interface com eventos e voltar. Testa 16 combinações CRB-65 e 32 combinações com adicional, ausência de dado adicional, critérios estritos municipais, rotas PSI com pH em vírgula, tratamentos e transições, interações/28 dias, referências e links para três protocolos. Regressões PSI (aritmética e três entradas), HEART, navegação e lote 13 passam; teste geral das calculadoras agora cobre 21 telas.

Fontes e SHA-256 preservados no registro central:
- Pneumonia: `0e6c5b48789c9fbe1dc8e18609f29b36b607be704f1e3737c9f7ce8059943571`.
- PEP: `32c3165c3e27eda0bbcfe6e4cb02203c409778779f4c1122f5f8a644bcf393d0`.
- Rebaixamento: `cd1831ed428bb1b6ca4e08e261ef41f63880d80cdf76a22c96e0aa895db2fa42`.

Publicação confirmada: commit `32cf56c1d0f002f056487d38ab1d88fb5e8b958b`, Actions `39091327428`, Publicar concluído com sucesso em 18/10/2026 02:50:14Z. index.html, app.js, score-calculators.js e review-batch-14.js conferidos byte a byte; version.json correto. Lote 15 liberado somente após a confirmação.
