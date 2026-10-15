# Lote 6 — conferência individual documental

15/10/2026. PDFs oficiais obtidos dos URLs do source-manifest.json, SHA-256 conferidos; leitura textual e visual de todas as seis páginas. Não se trata apenas de teste estrutural.

| Protocolo | Páginas | Correções | Trajetórias testadas |
|---|---:|---|---:|
| Desospitalização / Saúde em Casa | 4 | Critérios de inclusão/exclusão e perfil ligados à solicitação; parecer aceito/negado e retorno dia útil/fim de semana; formulário completo e nove linhas da tabela raster de antimicrobianos incorporados | 7 |
| Diarreia aguda | 1 | Critérios de hidratação nas perguntas; manejo explícito e retorno preservado; radiografia na diarreia paradoxal; condições para antibióticos e referência APS | 10 |
| Doenças anorretais | 1 | Diferenciação dos quadros indolores; emergência sim/não; quatro graus de hemorroida; fissura refratária; abscesso, condições técnicas e celulite no cisto pilonidal | 20 |

## Pendências precisas para validação clínica

Saúde em Casa: cabeçalho da tabela diz função renal/hepática normal, mas amicacina/gentamicina incluem alternativas por ajuste renal e meropenem só traz frequência em ajuste renal. Reconstituição sem apresentação do frasco; diluições/tempos não discriminados entre IV/IM/HDC; não aplicar preparo IV a outras vias. A tabela não permite cálculo automático nem correção inferida. Contatos mantidos como dados da edição municipal, sem afirmação de atualização.

Diarreia: exatamente 14 dias sobrepõe aguda/persistente; antibiótico usa >14. “SF ,09%” na cautela cardiopata/nefropata requer validar concentração; concentrações de dipirona/metoclopramida injetáveis não definem dose. Diarreia do viajante não esclarece associação versus alternativa dos dois antimicrobianos. A fonte não desenha saída para suspeita de diarreia paradoxal com RX sem as alterações descritas; nenhum encaminhamento/alta foi inventado.

Anorretal: analgesia traz concentrações sem doses/volumes/intervalos, morfina sem via; albendazol sem dose. Antibióticos da celulite pilonidal não têm intervalo/duração. Ceftriaxona condicionada a paciente na CLM. Não se substituíram essas lacunas por regimes presumidos.

## Testes

`node --check site/review-batch-06.js` e `node scripts/test-review-batch-06.cjs`: PASS. Exercício de todas as trajetórias simples e de todas as alternativas pela interface real app.js em DOM simulado, com fixtures independentes de arestas e conteúdo. A diarreia possui retorno legítimo à avaliação de hidratação: a aresta de retorno foi exercitada; repetições infinitas do ciclo não são enumeráveis. Encerramentos administrativos, encaminhamentos e medidas conservadoras legítimas preservados. Total 37 trajetórias.

## Publicação

Aguardando commit, Actions e comparação dos arquivos servidos antes de iniciar lote 7.
