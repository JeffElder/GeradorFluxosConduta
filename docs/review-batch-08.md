# Lote 8 — dor torácica e emergências hiperglicêmicas

15/10/2026. PDFs oficiais do manifesto, SHA-256 conferidos; leitura textual e visual de todas as quatro páginas. Revisão individual de perguntas, alternativas, setas, quadros e encerramentos, incluindo conteúdo já alterado anteriormente.

| Protocolo | Páginas | Correções | Trajetórias |
|---|---:|---|---:|
| Dor torácica ventilatório-dependente | 1 | Critérios TEP/pneumotórax/derrame; estabilidade, tipo, tamanho, condições técnicas, observação de 6 h e reavaliação; decisão >10 mm no derrame; link funcional TEP | 14 |
| Dor torácica | 1 | Primeira pergunta de suspeita coronariana com critérios completos; critérios vasculares; PAS após betabloqueador; ECG como pergunta explícita; link ao fluxo ventilatório | 8 |
| Emergências hiperglicêmicas | 2 | Tabela diferencial e fórmulas incorporadas; suporte e exames; componentes concomitantes; K antes da insulina, faixas de reposição, reavaliação, resposta glicêmica, limiar para ajuste, quatro critérios cumulativos de suspensão, transição e desfechos DM1; bicarbonato restrito CAD e reavaliação do pH | 201 |

## Pendências clínicas específicas

Pneumotórax: “linha média” no 2º espaço intercostal não é marco anatômico suficientemente definido; não inferida correção. Exatamente 3 cm e local de mensuração não definidos. Sem condições técnicas não existe encaminhamento desenhado. Após observação, a fonte só explicita saída se estável/sem piora; deterioração retorna à avaliação, sem alta automática. Quadro TEP registra B3 hiperfonética, mantida como transcrição sem alterar para B2. Neurite: concentrações/intervalos/titulação incompletos e associação versus alternativas não esclarecida.

Dor torácica: fonte escreve nitroglicerina 5 mg/mL, 5–10 mcg/kg/min em BIC após betabloqueador se PAS >120. Unidade/dose por peso exige validação farmacológica; preservada restrição anterior de não oferecer esse valor como regime executável. Metoprolol “pode repetir até 3x” não esclarece inclusão da dose inicial; sem total inferido.

Hiperglicemia: faixa inicial “100–1500 mL” não corrigida para 1000; 4–14 mL/kg/h não equivale universalmente a 250–500 mL/h. Solução chamada NaCl 0,45% é preparada em SG5% (22 mL NaCl20% + 980 mL SG5%): não é solução salina sem glicose. KCl19,1% em 1 ou 2 ampolas sem volume impede confirmar mEq. Regra de duplicação só informa 0,2 UI/kg/h, sem autorizar duplicações indefinidas. Critérios CAD/EHH deixam sobreposição/quadros mistos e faixas intermediárias; não convertido em diagnóstico negativo. Fonte não desenha glicemia já <200 antes do ajuste nem tratamento de queda excessiva. Bicarbonato: entrada pH≤6,9, repetição se <6,9 e meta >7 deixam 6,9–7 sem resolução. Critérios de suspensão e transição fixa com 10 UI SC compartilhados no desenho precisam validação individual, especialmente EHH. Desfecho EHH/DM2 não especificado após transição; CLM mantida do suporte inicial. Nenhuma dose corrigida presumida.

## Testes

PASS sintaxe e `test-review-batch-08.cjs`: 223 trajetórias simples e arestas de retorno pela interface, fixtures independentes das decisões e verificações de conteúdo (exames, critérios cumulativos, composição e simultaneidade). Ciclos de reavaliação exercitados uma vez; repetições infinitas não enumeráveis. Navegação para TEP e dor ventilatória testada; teste detectou slug incorreto de TEP, corrigido antes da publicação. Não contar endpoints de retorno como alta clínica. Componentes concomitantes não são alternativas terapêuticas mutuamente excludentes.

## Deploy

Aguardando commit, execução Actions e comparação dos três arquivos publicados antes do lote 9.
