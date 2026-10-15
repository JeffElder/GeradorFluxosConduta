# Lote 10 — vascular periférico, hematúria e hemorragia digestiva

15/10/2026. Leitura visual e textual de todas as três páginas oficiais; SHA-256 conferidos com manifesto. Revisadas as setas originais e a reconstrução prévia de hemorragia digestiva.

| Protocolo | Correções |
|---|---|
| Evento vascular periférico agudo | Anamnese como entrada; critérios de aneurisma/dedo azul; quadro embolia versus trombose e tabela Wells completos; DAOP versus insuficiência venosa como escolhas; bolus de heparina com unidade inconsistente não oferecido como dose executável |
| Hematúria macroscópica | Uso de vitamina C antes da fita; hipóteses sintomáticas; analgesia refratária; contextos da recorrência; retenção/Hb e dismorfismo/função renal/Hb em escolhas explícitas |
| Hemorragia digestiva | Anamnese integral; condições de O2, IOT e ceftriaxona separadas, sem atrasar medidas simultâneas; EGB documental com validação explícita das inconsistências; destinos já corretos preservados |

## Pendências específicas

Vascular: bolus impresso “heparina 80 mg/kg”, seguido de infusão 18 UI/kg/h. Não corrigido para UI/kg por suposição nem apresentado como dose para administrar. AAS “100 mg 300 mg” não distingue apresentação/dose. Regimes de heparina dos ramos trombose/TVP não especificados. Aquecer/enfaixar permanece como transcrição a validar no contexto arterial, sem técnica presumida. Wells é o quadro da edição: 8 itens de +1 e diagnóstico alternativo -2, limiar≥3; não se adicionou histórico prévio de TVP ausente na tabela.

Hematúria: fonte contraindica fita em vitamina C sem teste substituto/continuidade. Hb exatamente7 não se enquadra em <7/>7. Recorrência fora de exercício/período menstrual sem saída desenhada. Analgésicos/tramadol em concentrações sem doses. Fluxo de anemia citado para crise falcêmica não integra o acervo de73: pendente obtenção/incorporação, sem inventar regime. Raça isolada não define diagnóstico. Encaminhamento de função renal normal/Hb>7 sem dismorfismo mantido como nefrologia, tal como fonte, sem troca presumida para urologia.

Hemorragia: tabela chama “ureia mg/dL” as faixas18,2–22,3/22,4–27,9/28–69,9/≥70; é necessário validar analito/unidade para evitar pontuação indevida. PAS100–109 recebe2, igual a90–99: linha pendente de validação. Não criada calculadora que valide essas inconsistências automaticamente. Metoclopramida5mg/mL sem dose/volume. Destinos EGB mantidos, com opção de pontuação ainda não validada; nenhuma alta é deduzida de escore duvidoso.

## Testes e publicação

Sintaxe e teste dedicado com fixtures de arestas, conteúdo e navegação de todas as trajetórias; resultados registrados abaixo. Aguardar Actions e arquivos servidos antes do lote11.

PASS: `node --check site/review-batch-10.js` e `node scripts/test-review-batch-10.cjs`; 8 trajetórias vasculares +18 de hematúria +20 de hemorragia digestiva =46 trajetórias completas.
