# Síndromes coronarianas — ajuste prioritário de dor e fatores de risco

15/10/2026. Solicitação específica do usuário: priorizar este ajuste, publicar e aguardar nova instrução. Revisão sequencial dos demais protocolos pausada após confirmação do lote10.

Fonte: [SMS Curitiba — Síndromes coronarianas](https://saude.curitiba.pr.gov.br/images/DUE/SINDROMES%20CORONARIANAS.pdf), v.2 de25/06/2024. Três páginas abertas visualmente. SHA-256: `045079ea93755ad5784a04f4bf119a20b6087c20169f061d99f885b99004b6d1`.

## Confirmação documental

Página1: três grupos da dor valem1 ponto cada (tipo/localização; irradiação/sintomas; melhora/piora). A=3, B=2, C=1, D=0. Lista cardiovascular: HAS, DM, dislipidemia, obesidade IMC>30, sedentarismo, tabagismo atual/interrupção<3meses, história familiar com mãe/irmã IAM<65 ou pai/irmão IAM<55. Página2: componente R do HEART — nenhum=0, 1–2=1, ≥3=2. Os fatores cardiovasculares não somam à classificação da dor. Fatores de MUITO ALTO RISCO da página1 são outro conjunto, usado no encaminhamento urgente.

## Alterações

Mantida primeira pergunta “SUSPEITA DE SÍNDROME CORONARIANA?”. Resposta positiva leva às três perguntas explícitas sobre características da dor; classificação A–D calculada pelas respostas, sem pontuar duas vezes dentro de um grupo. Depois, pergunta de quantidade de fatores de risco com a lista e limites entre parênteses; apresenta apenas a parcela R do HEART, sem chamar isso de escore total. A suspeita previamente afirmada mantém investigação ECG mesmo com classificação D, sem inferir exclusão clínica por um escore isolado. Perguntas sobre tipoA+B e muito alto risco agora trazem os significados e critérios no próprio texto. Pergunta de resposta ao nitrato registra história, não orienta teste terapêutico. Demais condutas e decisões existentes preservadas.

## Testes

PASS: sintaxe e `scripts/test-coronary-pain-review.cjs`; 385 trajetórias completas na interface, todas as8 combinações de características de dor, 3 faixas do componenteR, limites familiares65/55, tabagismo<3meses e permanência da primeira pergunta. Este é ajuste focal solicitado, não conclusão da conferência clínica integral desse protocolo; registro individual dos73 permanece pendente para ele.

## Publicação

Aguardar Actions e conferir index.html e coronary-pain-review.js no Pages. Após confirmação, aguardar nova instrução do usuário; não iniciar lote11.
