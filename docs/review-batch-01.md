# Conferência individual — lote 01 — 14/10/2026

Base: c96aa38f026b91a9674616162f1e33027a285674. PDFs municipais baixados nesta sessão, hashes iguais aos do source-manifest.json. Todas as 15 páginas foram renderizadas e examinadas visualmente, além da extração textual. Os protocolos anteriores não são considerados conferidos por passarem em testes estruturais.

| Protocolo | Páginas | Caminhos completos testados | Resultado |
|---|---:|---:|---|
| Acidente por animais peçonhentos | 1–8 | 39 | Conteúdo ampliado e decisão pós-SAB reconstruída; pendências da fonte abaixo |
| Arritmias | 1–6 | 60 | Setas e ECGs reconferidos; correções anteriores preservadas; remissões a páginas removidas |
| Assistência ao trabalho de parto na UPA | 1 | 4 | Exame vaginal, critérios de período expulsivo e Malinas incorporados nas etapas |

## Correções e preservação

Animais: exames por animal; tratamento domiciliar, manejo, soroterapia e critérios antes omitidos foram incluídos nas próprias etapas. Reconstruída decisão explícita de soroterapia complementar (2 ampolas SAB) diante de incoagulabilidade em 12 h e/ou alteração em 24 h. Ausência desses critérios não foi transformada em alta. Mantidos os encerramentos originais, observação de 12 h para jararaca e 24 h para coral, e indicação etária de soro na armadeira moderada. Não se inventou soroterapia para Lonomia.

Arritmias: preservadas bifurcações, 11 painéis de ECG originais, contraindicação contextual de FA pré-excitada e retenção da dose agrupada de vasopressores. Removidos VER P.3/P.5 da navegação; preparo disponível junto da seleção de TV refratária. Mantidos como finais os quadros de manutenção de amiodarona e pós-falha de adenosina, sem seta de saída no original.

Parto: preservados ramos <5, 5–7 e >7, com pergunta sobre período expulsivo no último. Exame vaginal completo, tabela de Malinas e critérios de período expulsivo agora estão na tela pertinente. Restituída manobra de desprendimento fetal; retirada repetição do acionamento SAMU. Referência definida pela carteirinha/UBS.

## Pendências precisas para validação clínica

- Animais, p.1: placa marmórea exatamente 3 cm não é classificada (<3 e >3). Não criada categoria automática.
- Animais, pp.1–8: várias listas fornecem apresentação/concentração, sem posologia completa. Cetoprofeno aparece como 100 mg/mL IM sem volume administrado; não convertido em dose. Morfina sem via no quadro das pp.2–4; lidocaína com limite 2 mg/kg/dia e repetição sem intervalo; validar redação.
- Animais, p.4: ácido tranexâmico 500 mg IV (50 mg/min) no acidente por Lonomia e ausência de soro antilonômico. Conduta explicitamente pendente de validação, sem tratamento substituto inferido.
- Animais, p.5: anafilaxia sem limites pediátricos/repetição de adrenalina e sem número de doses de salbutamol; validar completude.
- Animais, p.7: furosemida pediátrica 1 mL/kg/dose IV sem concentração; não é possível converter em mg. Bicarbonato com meta de pH sérico >7,5; validar desigualdade antes de tornar executável. Dose adulta de furosemida e esquema de bicarbonato não foram apresentados como prescrição resolvida enquanto esse quadro permanece pendente.
- Arritmias, p.1: dopamina/epinefrina agrupadas em 5–20 mcg/kg/min; atropina inicial 0,5 mg e redação sobre Mobitz II. Preservada sinalização específica anterior, sem dose substituta.
- Arritmias, p.2: FA aberrante e pré-excitada no mesmo ramo; preservada restrição contextual dos quadros contraindicados. Deslanosídeo no quadro inferior esquerdo termina em “dose única ou fracionada”, sem completar fracionamento; lacuna explícita.
- Arritmias, p.3: energias de 2024 e escalonamento monofásico mantidos como documentais; não convertidos para equipamento bifásico.
- Parto, p.1: Malinas não define zero partos prévios, duração >5 e ≤6 h ou amniorrexe de exatamente 1 h. Não atribuídos pontos por inferência.

## Testes

`node scripts/test-review-batch-01.cjs`: enumera e percorre todos os 103 caminhos entrada–desfecho dos três protocolos, renderiza cada passo com o motor real em DOM simulado, confere opções e referências removidas, além de verificar setas e conteúdos esperados independentemente.

`node scripts/test-arrhythmia.cjs`: setas documentais, 57 etapas, 16 finais, ECGs, histórico, alertas contextuais e zoom.

`node scripts/test-animal-flow.cjs`: oito grupos, 47 etapas, 26 finais.

Os testes não substituem a conferência visual nem validam clinicamente doses/condutas. As pendências impedem declarar estes protocolos clinicamente validados ou plenamente resolvidos.

## Publicação

Aguardando commit e execução do GitHub Actions. A confirmação e os hashes servidos serão registrados após a conclusão. Não iniciar lote 02 antes disso.
