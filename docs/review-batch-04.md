# Conferência individual — lote 04 — 14/10/2026

Base remota reconfirmada: 38782997bac00e0e8db5f1b253218f2fdd768478. Deploy anterior 38603083880 success e arquivos conferidos. Três PDFs originais baixados, hashes iguais ao manifesto; uma página de cada renderizada e conferida visualmente, incluindo setas dentro do quadro de manejo convulsivo.

| Protocolo | Caminhos testados | Correções |
|---|---:|---|
| Cólica renal | 13 | Critérios, manejo, exceções ao RX, dor recorrente e encaminhamento por infecção/função renal |
| Crises convulsivas | 90 | Glicemia, acesso venoso, reavaliações, repetição, fenitoína e manejo refratário; exames/critério de TC visíveis |
| Crise hipertensiva | 11 | Pseudocrise, risco de evolução e reavaliação; suspeita de hipertensão maligna; manejo em tela |

As rotas originais foram preservadas, incluindo avaliação de diagnósticos diferenciais se a crise não persiste na primeira pergunta, referência de crise febril para pediatria, alta/APS somente no desfecho previsto e encaminhamentos específicos da crise hipertensiva. No manejo convulsivo, a resolução retorna à avaliação de sinais de alerta após o quadro de manejo; refratariedade encaminha à regulação. Em cólica, os dois encaminhamentos podem coexistir e há opção explícita para ambos.

## Pendências específicas

- Cólica: concentrações de dipirona, cetoprofeno, metoclopramida e tramadol não definem doses/volumes; não completadas por inferência. Lista domiciliar sem frequência/duração completa.
- Convulsão: alternativas por peso de benzodiazepínicos sem teto; preservar dados, validar limites antes da administração. Seta após fenitoína rotulada “persiste após 60 minutos?”: intervalo registrado, sem transformá-lo em ordem de aguardar com crise ativa. Pergunta de persistência torna acessível o ramo refratário, mas não certifica o tempo da fonte.
- Convulsão: sódio <120 como restrição geral de tratamento em usuários de anticonvulsivantes, sem unidade/contexto sintomático; regra pendente de validação, sem substituição.
- Hipertensão: nitroglicerina 5–10 mcg/kg/min nos quadros exige validação de unidade/dose; não inferida correção. Regra de PA 220×120 na suspeita de AVE não distingue tipo de AVC/reperfusão. Morfina no EAP sem via explícita. “Exames laboratoriais” não enumerados na fonte.
- Hipertensão: retorno por risco aumentado não define critério de risco ou ponto de retorno. Navegação retorna à pergunta de alerta como escolha de interface, registrada como interpretação a validar. Pseudocrise não afastada não recebe tratamento inventado.

## Testes

`node scripts/test-review-batch-04.cjs`: 114 trajetos, com todas as alternativas e conteúdo renderizado. A crise hipertensiva contém ciclo legítimo de reavaliação: são enumerados caminhos simples e testada a aresta de retorno; repetições infinitas não são enumeráveis. O destino de retorno não é desfecho clínico. Testes não equivalem a validação clínica.

## Deploy

Aguardando publicação e verificação byte a byte.
