# Lote 7 — dor abdominal e pélvica

15/10/2026. Conferência individual visual e textual das quatro páginas dos três PDFs oficiais, com SHA-256 igual ao manifesto. Revisadas as reconstruções anteriores, mantendo decisões corretas e completando conteúdo e alternativas.

| Protocolo | Páginas | Trabalho realizado | Trajetórias |
|---|---:|---|---:|
| Dor abdominal em gestantes | 1 | Anamnese completa; critérios e diagnósticos diferenciais; manejo na maternidade, BCF a cada 20 min e fluidos explícitos; ligação navegável ao parto e aos fluxos de gravidade | 8 |
| Dor abdominal no adulto | 2 | Entrada na avaliação inicial antes da instabilidade; critérios vasculares, tipos de abdome e exames nas telas; analgesia/escalonamento; achados de oclusão e condição de sondagem explícitos | 24 |
| Dor pélvica na mulher | 1 | Critérios e investigação, manejo completo, beta-HCG preservado, peritonite com esquema documental, escolhas específicas de causas ginecológicas e não ginecológicas | 14 |

As bifurcações já corretas foram preservadas. Remissões a páginas substituídas por conteúdo. Encaminhamentos a outros fluxos agora possuem botões de navegação, com teste dos destinos de parto, dor abdominal em gestante e hemorragia digestiva.

## Pendências clínicas precisas

Gestante: idade gestacional >20 semanas aparece como item isolado de gravidade; a fonte não esclarece critério suficiente versus contexto da síndrome hipertensiva. Restaurado no quadro, sem atribuir lógica clínica nova. Dipirona e metoclopramida são concentrações sem doses/volumes. Não foi mantido o resumo anterior de Malinas, pois o protocolo completo já revisado é acessível pelo botão.

Adulto: concentrações sem dose/volume de dipirona, cetoprofeno, metoclopramida e tramadol. Morfina possui dose explícita 2–4 mg IV, preservada. Repetição de fluido não especifica teto nem critérios completos de reidratação; preservada cautela ICC/DRC. Oclusão radiográfica requer SAMU conforme quadro da página 1. A condição de sondagem é oclusão com vômitos OU HDA, sem converter em indicação universal.

Pélvica: ceftriaxona 100 mg/kg/dia sem teto e metronidazol 40 mg/kg/dia de 8/8 h com divisão ambígua. Regimes fixos transcritos sem inventar alternativas por peso. Dose de ceftriaxona 250 mg IM para DIP é a da edição 25/06/2024 e requer validação de adequação atual. Sintomáticos sem intervalos/volumes/duração não receberam preenchimento presumido. Beta-HCG indeterminado não foi convertido em negativo.

## Testes e deploy

PASS: sintaxe de app.js e review-batch-07.js; test-review-batch-07.cjs, 46 trajetórias completas pela interface, fixtures de todas as decisões e três navegações entre protocolos. O teste de navegação inicialmente usou o campo de etapa para procurar o identificador do protocolo; a asserção foi corrigida para conferir a etapa de entrada do destino. Aguardando commit, Actions e conferência dos arquivos publicados antes do lote 8.

Confirmação: commit `73eaf4d40d8c507dd6253eef17481ae504f455fb`, Actions [38673727071](https://github.com/JeffElder/GeradorFluxosConduta/actions/runs/38673727071) completed/success. Todos os arquivos alterados do site comparados byte a byte com a publicação: iguais.
