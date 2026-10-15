# Lote 9 — emergências psiquiátricas e respiratórias

15/10/2026. Conferência individual de cinco páginas oficiais (texto, imagens, quadros e setas), hashes iguais ao manifesto. Reconstruções anteriores foram inspecionadas, mantendo os caminhos corretos e a primeira pergunta exigida para gestação.

| Protocolo | Páginas | Correções | Trajetórias |
|---|---:|---|---:|
| Emergências psiquiátricas | 2 | Contenção por risco; alternativas químicas; delirium tremens; sintomas extrapiramidais; exames por contexto; agressividade e VO; IRIS completo com calculadora; destino por horário; observação da ansiedade até melhora | 143 |
| Emergências psiquiátricas em gestantes | 2 | Mantida pergunta gestação/clínica/fundo uterino; BCF, contenção, via, efeitos extrapiramidais; pré-natal/abstinência/ecografia como escolhas; vínculos e destinos preservados; lítio documental restrito ao contexto IRIS≥10 com pendência específica | 5377 |
| Emergências respiratórias | 1 | Entrada com anamnese/exames; corrigido dead end do manejo inicial para investigação; IOT/VNI/contraindicações explícitas; anafilaxia e broncoespasmo; critérios e links de etiologias | 45 |

## Pendências clínicas e documentais

Psiquiatria: via de biperideno não informada. Haloperidol VO 5 mg 1–4x/dia versus teto 40 mg/dia e clorpromazina 100 mg 1–4x/dia versus teto 600 mg/dia não explicam doses adicionais. Diazepam 10 mg 2/2 h nas primeiras 24 h no delirium tremens sem titulação/interrupção por sedação definida. Lítio escalonado 300/600/900 mg não informa seleção, avaliação basal e monitorização; não usado como prescrição automática pelo IRIS. Gestação: preservar evitar lítio no 1º trimestre e avaliação risco-benefício, além dessas lacunas. Contatos assistenciais são transcrições da edição municipal, sem verificação de atualidade. Risco reduzido no IRIS não exclui risco clínico iminente; a proteção anterior foi preservada. Todas as linhas do IRIS conferidas, inclusive plano que define diretamente total20, sem somar aos demais.

Respiratórias: imagem original registra FR<10 (não ≤10); restaurada desigualdade exata. Regra de FiO2 +3%/L e +10%/L sem limites/condições não é calculadora linear confiável; tabela mantida com essa limitação específica. Fonte não define suporte alternativo único para toda contraindicação VNI. Anafilaxia não fornece intervalo de repetição da adrenalina, tetos por peso, número de jatos de salbutamol nem critérios de alta/observação. Não foram inventados. Os fluxos referenciados de SRAG, exacerbação de asma e de DPOC não fazem parte dos 73 documentos do manifesto: integração desses documentos permanece pendente; não computada como revisão adicional nem substituída por condutas presumidas.

## Testes

PASS: sintaxe de app.js e review-batch-09.js; `test-review-batch-09.cjs`: 5565 trajetórias simples, aresta de retorno na observação e 4096 combinações binárias do IRIS, incluindo total20 por plano, ausência de resultado quando incompleto e limites5/10. Caminhos de IRIS testados com a pontuação correspondente e controle real de seleção da interface. O adaptador de teste foi corrigido para acessar o estado encapsulado da calculadora; o cálculo de produção não foi substituído. As referências ausentes no acervo são pendências documentais reais, não sucesso clínico presumido.

## Publicação

Aguardando commit, Actions e comparação byte a byte antes do lote10.

Confirmação: commit `4366ebaee8f4a95abd4dcd9c68c8238424d11f6e`, Actions [38739059123](https://github.com/JeffElder/GeradorFluxosConduta/actions/runs/38739059123) completed/success. Todos os arquivos alterados do site comparados byte a byte com a publicação: iguais.
