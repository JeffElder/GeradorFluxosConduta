# Calculadora HEART — ajuste focal

Fonte conferida em texto e imagem: SMS Curitiba, SÍNDROME CORONARIANA v.2 (25/06/2024), páginas 1–2, https://saude.curitiba.pr.gov.br/images/DUE/SINDROMES%20CORONARIANAS.pdf.

Calculadora nas etapas `heart-risk` e `reassessment`: história, ECG, faixa etária, fatores de risco e troponina, com 0–2 pontos por componente. Nenhum valor vem preenchido; dados incompletos impedem escolher uma faixa. Soma no histórico; valores preservados ao voltar e pausar, apagados em nova consulta. A reavaliação pergunta separadamente sobre curva ascendente de troponina, cuja combinação com HEART baixo foi reavaliada na conferência individual do lote 16: a fonte não explicita AND/OR na caixa de síndrome definida; esse caso agora exige validação, sem inferir alta ou encaminhamento pelo escore. A classificação A–D da dor não foi convertida sem fundamento em H.

Pendência clínica específica: a tabela imprime troponina 1–3× =1 e ≥3× =2; em exatamente 3× existe sobreposição. A opção explícita desse limite informa a divergência e não calcula nem escolhe um ramo. Faixas estritamente abaixo/acima e resultado normal permanecem calculáveis. Não se atribuiu pontuação adicional por aterosclerose ao componente R porque a tabela municipal não a prevê; o ramo prévio de muito alto risco foi preservado.

Testes: 729 combinações aritméticas/curva; 486 caminhos pela interface real com eventos; campos ausentes/inválidos; limite sobreposto; curva ascendente; histórico; pausar/retomar; reiniciar. Regressão PSI e quadro de sangramento; 385 caminhos do teste coronariano anterior. Este ajuste não representa revisão individual completa do protocolo.

A solicitação atual retoma o trabalho: publicar HEART primeiro, demais calculadoras em segunda versão e só então lote 13. Confirmação do deploy será registrada após conclusão do Actions e comparação dos arquivos publicados.

Publicação confirmada: commit `c94ecd78bc198e50102c5f853c3bdac75541afd3`, Actions `38982696750`, etapa Publicar concluída com sucesso em 2026-10-16T23:43:58Z. `version.json` identifica o commit; index.html, app.js e heart-calculator.js publicados são idênticos byte a byte. Navegador real: formulário completo, cenário sintético de 4 pontos habilita Sim e mantém Não desabilitado. Todos os 44 comandos de verificação do workflow passaram localmente e no Actions.
