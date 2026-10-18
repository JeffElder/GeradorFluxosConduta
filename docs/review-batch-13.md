# Lote 13 — náuseas/vômitos, obesidade mórbida, PCR

Conferência individual visual e textual das cinco páginas originais municipais (1 + 1 + 3), v.2 de 25/06/2024. Downloads renovados e hashes idênticos aos registrados. Comparadas anamnese, perguntas, alternativas, setas, quadros laterais, conectores, ciclos, condutas e desfechos. As reconstruções anteriores foram conferidas, não simplesmente contabilizadas.

| Protocolo | Achados e correções | Desfechos preservados |
|---|---|---|
| Náuseas e vômitos | Critérios de meningismo/desidratação ausentes na pergunta. Manejo e exames ocultos em nó de referência, com desfecho exibindo só o título. Incorporados expansão, manutenção, cautela renal/cardíaca, sintomáticos e todos os exames; sintomas também no ramo de meningismo. Criada ligação funcional ao protocolo de dor abdominal do adulto. | Hiperglicemia, meningismo/SAMU, hemorragia digestiva, dor abdominal, manejo/reavaliação da desidratação e tratamento domiciliar. O ramo de desidratação encerra no manejo/reavaliação, como no desenho; não foi criada seta de alta posterior. |
| Obesidade mórbida | Reconstrução anterior preservada; critérios completos incluindo gasometria e AVCH agora visíveis. Condição de instabilidade durante internamento virou pergunta explícita. Removido ≥150 kg introduzido anteriormente sem operador na fonte. | SAMU e contato do regulador com retaguarda; CLM/observação para estabilidade, com encaminhamento se surgirem critérios. |
| PCR | Conectores 3 pediátricos apontavam ao começo do ramo chocável; agora atingem o choque anterior à amiodarona, conforme posição visual. Qualidade de RCP, causas reversíveis, doses adultas e problemas pediátricos explícitos nos ciclos. Checagem de eletrodos/ganho na assistolia. Pulso presente mantém ventilação e reavaliação a cada 2 min. Manejo pós-PCR completo no desfecho de transferência. | Todos os ciclos de RCP, reavaliação de ritmo e retorno da circulação, transição para pós-PCR e dois desfechos por obediência a comandos. Não se criou condição de interrupção da ressuscitação. |

## Pendências clínicas específicas

**Náuseas/vômitos:** SF “,09%” na cautela renal/cardíaca, diferente do 0,9% no restante; não convertido silenciosamente. Sintomáticos injetáveis indicam concentração, mas não dose/volume. Ceftriaxona 2 g/dia ou 100 mg/kg/dia sem delimitação da população/divisão do esquema. Manutenção 4:1 e fórmula de volume sem faixa etária explícita. Redose após vômito <40 min sem delimitar fármaco/número de repetições/teto. Dipirona/paracetamol domiciliares sem posologia completa. Esses pontos permanecem identificados para validação.

**Obesidade:** peso “150 kg” sem operador comparativo, versus IMC explicitamente >40. Validar abrangência do peso; não foi presumido ≥. Sem instabilidade, cadastro e observação são encerramento legítimo.

**PCR:** profundidade pediátrica “metade do diâmetro torácico”; amiodarona “5 mg em bolus”, sem /kg e sem via; adrenalina endotraqueal 0,1 mg/kg seguida de volume “0,1 mL da ampola de 1 mg/mL”, sem /kg. Não se inventaram valores alternativos. Conector 3 leva a amiodarona mesmo após conversão de ritmo não chocável, sem explicar choques prévios: transição documentada para validação. Adrenalina de 0,01 mg/kg sem via explícita. Adulto: dois esquemas de amiodarona em bolus, sem terceira dose definida apesar de ciclo recorrente. Conectores adultos dizem apenas “vá para choque” sem número, preservada a ligação anterior ao ramo chocável e registrada a falta de especificação. Via aérea pediátrica: ventilação com pulso a cada 6 s versus via aérea avançada durante RCP a cada 2–3 s, contextos mantidos. Pós-PCR: SpO₂ DPOC ≥88% na estabilização versus 88–92% no manejo; amiodarona de manutenção sem população explicitada; dobutamina “12,5 mg IV” sem apresentação/volume e sem indicação de bolus, distinta da infusão 2,5 mcg/kg/min. Não houve prescrição de substituição por inferência.

## Testes

`test-review-batch-13.cjs` enumera as trajetórias simples de cada entrada e cada fechamento de ciclo, e percorre a mesma lista pela interface real com eventos e retorno. Total: 6 + 3 + 60 =69; PCR inclui 30 fechamentos de ciclos, não tratados como altas ou encerramentos. A natureza repetitiva da RCP admite infinitas sequências; a cobertura declarada é de todos os caminhos simples e arestas de ciclo, acrescida de três execuções consecutivas do ciclo chocável e transição para circulação espontânea/pós-PCR. Verifica conector pediátrico 3, pulso com ventilação/reavaliação, energia, amiodarona, causas, manejo, critérios e botão para dor abdominal. Regressões das calculadoras e PSI passaram.

## Fontes e publicação

URLs e SHA-256 no registro central e manifest /tmp/batch13-sources.json da sessão:
- Náuseas/vômitos: `9f3613ae14138c605d34e246494a1106d966179bc9d8b2679ee5a98bbc788815`.
- Obesidade: `47bed03fa66103f8f83dcab05ed6efe50ce5115ead8816ed1cb421c17e1c031f`.
- PCR: `e3cbc9f42ec32d951fb4275d4f4e2cf327ffe6fe31fdd6495b62d2f06cfead0c`.

Publicação confirmada: commit `a474aca5d57c94d0e2801484c17254c6e3c10511`, Actions `39090689481`, Publicar concluído com sucesso em 18/10/2026 02:39:08Z. index.html, app.js e review-batch-13.js idênticos byte a byte; version.json identifica o commit. Lote 14 liberado após essa confirmação.

Publicação anterior das calculadoras confirmada: commit `dca3ca82e518d80cf7bafa260bef334a90e2df9e`, Actions `39090176477`, sucesso em 18/10/2026 02:30:44Z. Seis arquivos idênticos ao checkout e version.json correto. Tentativas `39089895948`/`39089980199` falharam por adaptador DOM incompleto do teste 11; corrigido sem relaxar verificações, com 116 caminhos do lote 11 e 12.141 do lote 12 passando novamente. Nenhum novo lote começou antes dessa confirmação.
