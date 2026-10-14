# Conferência individual — lote 03 — 14/10/2026

Início após deploy 38602345075 success e arquivos publicados conferidos. PDFs originais baixados, hashes iguais ao manifesto; cinco páginas renderizadas e examinadas visualmente, incluindo tabela rasterizada de RHZE/RH.

| Protocolo | Páginas | Caminhos completos | Correções |
|---|---:|---:|---|
| Tuberculose ≥10 anos | 1–2 | 26 | Removidos finais incorretos após pedido do exame; quatro resultados TRM-TB, confirmação de resistência, condições de traços, persistência de sintomas e continuidade |
| Cefaleia | 1 | 8 | Critérios nas perguntas; manejo nas etapas; escolha primária/secundária na dor persistente |
| Choque | 1–2 | 22 | Sinais, exames e metas em tela; condições de hipovolemia, pressão arterial, FA/IAM e dispneia como opções |

Tuberculose: preservadas coleta externa e diferença de pedidos conforme tratamento prévio. Acrescentada máscara simples. Resistência não confirmada retorna ao ramo sensível. Traços com HIV, criança <10 ou TB extrapulmonar são positivos segundo a fonte; sem condições, repetir TRM/cultura. Não detectável com sintomas → cultura no GAL; sem sintomas → TB improvável. Incluídos testes iniciais (HIV, glicemia, provas hepáticas), RX, notificações, tabela e orientação da página 2.

Cefaleia: preservada hierarquia gravidade → alerta → dor intensa → reavaliação em até 2 h → primária/secundária. Não unificados CTU e CTS, pois a fonte usa siglas diferentes. Encerramentos de regulação, tomografia e manejo da causa mantidos.

Choque: preservada ordem hipovolemia → congestão → dispneia → anafilaxia → infecção. Condições internas dos quadros transformadas em perguntas. Quadros da página 1 e metas antes omitidos da etapa agora disponíveis. Encaminhamentos a outros protocolos mantidos, sem inventar conduta substituta. As condições podem coexistir; seleção organiza a consulta, sem excluir avaliação das demais.

## Pendências específicas

- TB p.1: ramo de resistência confirmada à rifampicina também manda RHZE. Registrado conflito; não apresentado como esquema clinicamente resolvido. Necessária definição especializada.
- TB p.1: cabeçalho ≥10 anos, mas “traços” cita criança <10 e TB extrapulmonar; tabela p.2 só tuberculose pulmonar ≥10 anos. Não extrapoladas doses/faixas.
- Cefaleia p.1: medicamentos em concentração sem volume/dose e O2 100% sem fluxo/duração. Não inventadas posologias. Lista domiciliar não define frequência/duração.
- Choque p.2: estimativa fixa de FiO2 por litro e fluxo de máscara não constituem cálculo confiável universal; registrar necessidade de validação do dispositivo.
- Choque p.2: tranexâmico para sangramento não traumático sem distinguir etiologia; indicação pendente de validação.
- Choque p.2: “dobutamina 12,5 mg IV” não esclarece concentração/volume; não interpretado como bolus, preservada infusão 2,5 mcg/kg/min.
- Choque p.2: deslanosídeo “2 ampolas de 6/6 h” sem duração do ataque; validar dose acumulada/apresentação antes de administrar. Não criada dose substituta.
- Choque p.2: dispneia sem nenhum dos três conjuntos de achados não possui saída específica na fonte; falta documental registrada, sem novo tratamento inferido.

## Testes

`node scripts/test-review-batch-03.cjs`: 56 caminhos completos com renderização, opções e verificações independentes das setas e dos conteúdos críticos. Testes de software não significam validação clínica.

## Deploy

Aguardando publicação e comparação byte a byte.
