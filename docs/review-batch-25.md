# Lote25 — SIM-P, reconferência de farmacodermias e febre

Último ciclo com exatamente3protocolos: SIM-P(73ºinédito),farmacodermias e febre(duas reconferências integrais,sem nova contagem de únicos).73não é múltiplo de3;24×3+1=73. Foram reabertas visualmente e lidas todas as5páginas originais(2+2+1);downloads renovados e hashes iguais ao registro.

|Protocolo|Problemas/correções/conclusão|
|---|---|
|SIM-P|Sequência principal preservada. Critérios remetiam àp.2 e manejo inicial não aparecia nas3telas de destino. Incluídos Kawasaki/choque tóxico/hipotensão/FCFR,gravidade,exames e manejo completo. AAS com/sem manifestações explícito e distinto porSAMU/CLM;PCR ausente não normal. Encerramentos de reavaliação e coinfecção preservados.|
|Farmacodermias|As8entidades,agentes,critérios,8imagens,CLM/domicílio/PEGA/anafilaxia do lote23 comparados novamente com as2páginas;válidos e preservados byte por byte nos dados finais. Sem correção clínica arbitrária. Pendências23 permanecem abertas.|
|Febre|Página inteira reconferida,setas da vacinação e48h retornam à propedêutica(não alta). História/exame,manejo,idades,urofita normal/alterada/indeterminada,retornos e pendências23 mantidos. Acrescentado acesso válido ao foco pneumonia após revisão24;nenhuma outra substituição.|

## Pendências SIM-P

- Escopo municipal0–21anos,entradaKawasaki OUchoque tóxico OUfebreaxilar≥38por≥3dias+≥1manifestaçãoGI/neurológica/rash/conjuntivite/mucosa/extremidade/linfonodo. PesquisarRT-PCR/antígeno “recente” ou contatoCOVID,sem janela temporal;resultado ausente não exclui automaticamente. Fora de escopo exige validação,não baixa probabilidade presumida.
- Kawasaki completa:≥4diasfebreinexplicada+4/5critérios;incompleta:≥5dias+2–3/5,como impresso. Todos5visíveis na entrada e na decisão. É quadro municipal,não nova definição por inferência. Contagem não substitui avaliação clínica. Estado indeterminado tem saída específica,sem aplicar “não”.
- Choque tóxico:≥38,9/rashmaculareritrodérmico/descamação1–2semanas/hipotensão e≥3órgãos;7gruposGI,músculo,mucosa,rim,fígado,plaquetas,SNC com todoslimiares/exclusãoITU/febrehipotensão. Sem supor combinação/destino fora do algoritmo.
- Gravidade:choque/hipotensão/cardiopatia,perfusão,consciência,taquipneia/dispneia,estertores/galope/arritmia→SAMU. PAS4faixas completas. Fonte fornece FRnormal e remete a ela como taquipneia,sem limiar independente;sem gerar diagnóstico automático “acima do normal”. FC/FRnormais reproduzidos,não extrapolados para escolar/pré-escolar por idade inventada.
- Kawasaki sem gravidade→SAMU. NãoKawasaki→hemograma/PCR/urina,RX,investigaçãoSARS/influenza/outrosfocos. Fluxo geralCOVID/influenza citado não integra73.
- Focoidentificado→fonte dizprobabilidadebaixa,reavaliar/observar porque coinfecção possível;nenhuma exclusão deSIM-Pautomática. Sem focoPCR“elevada”→CLM;sem valor/unidade de corte,interpretar referência laboratorial. Ausente/indeterminado não normal. PCRnãoelevada→sintomático/reavaliação24–48h,sem agente/dose/retorno imediato definidos;não transportar esquemaIVdos ramos graves para domicílio.
- Nos3destinosSAMU/CLM:manejo2IV,O₂2Lmin<92,SF20mLkg30minrepetirse necessário,dipirona15mgkgDOSEIVIM;metilpred2mgkg/DIAIVdivididos12h. Total diário não vira2mgkgpor tomada. Sem tetos/duração/limite de expansão/intervalo dipirona/critérios de contraindicação.
- AAScomKawasaki30–50mgkg/DIA VOdivididos6h;sem3–5mgkg/DIA VO sem fracionamento. Fonte não fornece teto/duração/contraindicações. Manifestações indeterminadas não recebem dose baixa por campo vazio;destino/suporte mantidos com validação específica.
- Farmacodermias/febre:pendências clínicas detalhadas do [lote23](review-batch-23.md) continuam sem resolução por software. Releitura não transforma informação ausente em prescrição pronta.

## Testes

test-review-batch-25.cjs:36trajetórias(12SIM-P+12farmacodermias+12febre),enumeração independente e percurso real de todos os caminhos dos3protocolos,comvoltar;critérios/tabelas presentes nas decisões,manejo/doses diárias,AAS por manifestação/destino,exames/PCR/coinfecção/reavaliações;duas reconferências verificadas também por comparação profunda dos dados antes/depois do módulo25 (farmacodermias integralmente igual;febre só1link novo).73IDs individuais distintos no registro,não creditados por teste estrutural. Regressão23/24,escores/navegação/PSI/pH/HEART;Actions executa suíte completa. Auditoria adicional dos73protocolos:2.058nós alcançáveis,12links entre entradas,nenhum alvo ausente/incompleto;teste estrutural complementar,não fundamento para contar revisão. Testes não conferem aprovação clínica.

Fontes/SHA256:
- https://saude.curitiba.pr.gov.br/images/DUE/SINDROME%20INFLAMAT%C3%93RIA%20MULTISSIST%C3%8AMICA%20PEDI%C3%81TRICA.pdf —7fcd9eafd6fb04e3e72e5680158ac758fb225357ce8b8cb9c69454654f57103e.
- https://saude.curitiba.pr.gov.br/images/DUE/FARMACODERMIAS.pdf —c6353c6c9613ef7539ec9add930b1942e894b17d3a93afadc0f8ce7113db1d35.
- https://saude.curitiba.pr.gov.br/images/DUE/FEBRE%20EM%20PEDIATRIA.pdf —356339c7159dcb1f75bf9dcb725fbbbcc7f322c7e2ae552cef6ecd2543942a49.

Publicação:aguardando commit/Actions/verificação dos arquivos;conferência73/73 ainda não é confirmação de deploy deste lote.
