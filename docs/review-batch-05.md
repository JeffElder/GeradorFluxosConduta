# Conferência individual — lote 05 — 14/10/2026

Após deploy 38672188980 success e arquivos conferidos. PDFs originais com hashes iguais ao manifesto; sete páginas renderizadas e lidas visualmente, inclusive Cincinnati, NIHSS, escala geriátrica, Framingham, frequências de monitorização e tabelas de risco.

| Protocolo | Páginas | Caminhos | Correções |
|---|---:|---:|---|
| Déficit focal agudo | 2 | 11 | Cincinnati, NIHSS textual, Bell, exames e faixas temporais |
| Delirium | 3 | 57 | Continuidade diagnóstico/manejo, critérios 1+2+(3 ou 4), correção das alterações e escala geriátrica |
| Descompensação aguda da IC | 2 | 22 | Critérios, monitorização, perfis, FA, baixo débito, dispneia e reavaliação após volume |

Preservados encaminhamentos legítimos de déficit focal/ECG, regulação e critérios de hospital/APS. NIHSS disponibilizado por item como texto sem somar códigos potencialmente inadequados. Delirium agora inicia pela verificação dos critérios e continua no manejo da página 2; página 3 incorporada com as 15 perguntas e valores Sim/Não. Não se assume diagnóstico quando critérios não confirmados. IC mantém prioridade choque/isquemia/arritmia/emergência hipertensiva antes dos perfis; quadros finais com condições internas agora permitem escolhê-las explicitamente.

## Pendências específicas

- Déficit focal: Cincinnati/Bell sem critérios completos de diferencial; não inferir Bell por assimetria isolada. NIHSS sobrepõe 17 nas faixas moderada/grave e enumera códigos 0/2/3 em extinção/inatenção, 9 em amputação/fusão e 3 em intubação/barreira: validar antes de somar. Faixas <48/>48 omitem exatamente 48 e tempo indeterminado. Janela <4 h e regra 220×120 não resolvem início desconhecido/tipo de AVC/reperfusão.
- Delirium: PAS exatamente 90 sem hipoperfusão não recebe faixa; volume de SF não informado. Diazepam IV em ampola sem apresentação e tiamina IM sem dose. Haloperidol em hipoatividade exige validação da indicação; biperideno em concentração sem volume. Escala geriátrica apresentada em confusão aguda sem discutir validade; ausência de respostas não gera escore.
- IC: Framingham da fonte exige 2 maiores E 1 menor ou 1 maior E 2 menores; primeira combinação exige validação. Lactato em mmol/dL; frequência 12/12 h (se alterado)/24 h sem associação inequívoca. SF “,09%” no perfil L não corrigido por inferência. Dobutamina 12,5 mg IV sem clareza de apresentação; não interpretada como bolus. Ataque de deslanosídeo em ampolas sem duração; validar dose acumulada. Lacunas de PAS ≤90 sem choque completo, perfil L persistente e perfil A com instabilidade/dispneia foram registradas sem atribuir alta ou tratamento fictício.

## Testes e deploy

`node scripts/test-review-batch-05.cjs`: 90 caminhos completos, todas as opções renderizadas, critérios, escalas textuais e setas. Teste inicialmente detectou remissão residual “VER P.3” nas notas; corrigida e repetido com sucesso.

Aguardando publicação e comparação byte a byte. Testes não equivalem a validação clínica.

Confirmação: commit `6e549c19d3691da4d991d3becac43ad3d53abc91`, Actions [38672705912](https://github.com/JeffElder/GeradorFluxosConduta/actions/runs/38672705912) completed/success. index.html e review-batch-05.js comparados byte a byte com a publicação: iguais.
