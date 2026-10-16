# Ajuste focal — PSI na pneumonia e manejo inicial do sangramento genital

16/10/2026. Prioridade solicitada pelo usuário, com pausa dos lotes após publicação. Não conta como revisão integral dos dois protocolos.

Fontes conferidas visualmente e em texto:
- Pneumonia no adulto, v.3, 25/06/2024, páginas 1–2: https://saude.curitiba.pr.gov.br/images/DUE/PNEUMONIA%20NO%20ADULTO.pdf
- Sangramento genital feminino, v.2, 25/06/2024, página 1: https://saude.curitiba.pr.gov.br/images/DUE/SANGRAMENTO%20GENITAL%20FEMININO.pdf

## PSI

Substituída escolha manual da faixa por entrada de idade/sexo, residência em casa de repouso, cinco comorbidades, estado mental, FR, PAS, temperatura, FC, pH arterial, ureia (não BUN), sódio, glicemia, hematócrito, PaO₂/saturação e derrame pleural. Somatório explicável, classe II–V e pontos no histórico. Limiares estritos e pesos da tabela municipal preservados; oxigenação pontua apenas uma vez. Classe I não é deduzida do somatório: pertence à avaliação clínica anterior sem preditores.

Dados sem resposta não equivalem a normais. Campos inválidos/incompletos bloqueiam avanço; apenas ramo compatível com cálculo é liberado. Troca de protocolo/nova consulta limpa valores; pausar/retomar preserva a consulta atual. Não se gravam dados clínicos em armazenamento persistente.

Divergência precisa: fluxograma da página 1 envia PSI ≥III à CLM; tabela da página 2 descreve reavaliações/alta se estável e discussão com SAD para III, CLM se piora. Resultado III exibe ambas as orientações e a pendência de validação. Nenhum critério de estabilidade ou destino foi inventado. A correção mantém as setas existentes do fluxograma, identificadas no botão como tal.

## Sangramento genital

Quadro compacto e aberto “Manejo inicial” na avaliação inicial e nas etapas que indicam manejo: gravidade, gestante, violência sexual/regulação e investigação laboratorial. Conteúdo: acesso venoso, O₂ se necessário, SF 0,9% 20 mL/kg condicionado a hipotensão/desidratação e cautela cardíaca/renal; sintomáticos; cetoprofeno/tranexâmico exceto gestantes; decúbito lateral esquerdo/BCF a cada 20 min se gestante. Dipirona, cetoprofeno e metoclopramida aparecem como concentrações; doses/volumes ausentes na fonte não foram presumidos.

## Testes

`node scripts/test-psi-bleeding-focus.cjs`: pesos, limiares e limites das classes, 256 combinações de comorbidades/achados binários, oxigenação sem duplicação, vírgula decimal, ausência/invalidade de dados. Interface real executada com adaptador DOM: três acessos ao cálculo, bloqueio de resposta incompatível, dois destinos, histórico, voltar, pausa/retomada e limpeza. Quadro conferido nas cinco etapas previstas. `test-frontend-navigation.cjs` e verificações de sintaxe também passam. Pipeline completo exigido no Actions.

Deploy ainda pendente neste commit. Após confirmação, aguardar novas instruções do usuário, sem iniciar lote 13.
