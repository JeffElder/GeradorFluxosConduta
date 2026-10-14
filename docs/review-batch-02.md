# Conferência individual — lote 02 — 14/10/2026

Iniciado somente após deploy 38601544426 success e comparação byte a byte dos arquivos do lote 01. PDFs baixados da SMS Curitiba, hashes iguais ao manifesto. Quatro páginas renderizadas, examinadas visualmente e comparadas com a navegação.

| Protocolo | Páginas | Caminhos completos | Resultado |
|---|---:|---:|---|
| Atendimento de urgência ao paciente oncológico ou suspeita | 1 | 6 | Setas corretas preservadas; critérios de instabilidade visíveis; escolha clínico/cirúrgico explícita; serviços separados |
| Avaliação de HIV e tuberculose | 1–2 | 21 | Tabela de RHZE/RH incorporada; instruções de dispensação e tomada completas; ambiguidade de CD4 registrada |
| Avaliação do paciente com HIV | 1 | 6 | Restituída condição resultado reagente antes da notificação; escolha de motivo de abandono; unidades de dispensação em tela |

## Evidências e correções

Oncologia: instável → regulação SAMU; estável vinculado → CLM/NIR; não vinculado sem internação → investigação; com internação hematológica → rodízio; não hematológica → clínico/cirúrgico e NIR correspondente. Todos os seis desfechos preservados. Não se adicionou transferência de instável ao ramo estável.

HIV: a seta sorologia → notificação tem condição “se resultado reagente”, perdida no código anterior. A condição agora é explícita. Resultados fora dessa condição encerram apenas a cobertura documental, sem gerar diagnóstico/alta/notificação. O documento não contém conduta para sorologia não reagente/indeterminada/pendente. Motivo do abandono agora é pergunta, com as duas opções originais. Exames e esquema existentes preservados; nomes/contatos das unidades transcritos da edição de 2024.

HIV/TB: tabela rasterizada da página 2 foi lida visualmente e transcrita, incluindo 2 meses de RHZE 150/75/400/275 e 4 meses de RH nas quatro faixas de peso. Incluídos jejum, espera de 1 h antes da alimentação ou 2 h após alimentação, pesagem antes de dispensar e em 15 dias, prevenção de transmissão e formulários. Preservados três ramos TARV, encaminhamento e dispensação para 5 dias.

## Pendências clínicas/documentais

- HIV/TB p.1: as linhas de 2 e 8 semanas usam OU tanto na condição clínica quanto em CD4, permitindo sobreposição (sinais avançados com CD4 ≥50 ou ausência de sinais com CD4 <50). Fonte não define precedência. Código anterior transformava uma das linhas em E. Agora condições sobrepostas são identificadas e não recebem prazo inferido.
- HIV/TB p.2: tabela somente para ≥10 anos e ≥20 kg; não especifica arredondamento entre faixas inteiras (ex.: 35,5 kg). Não extrapoladas doses.
- HIV p.1: início de ARV no mínimo 15 dias após intercorrência, sem distinguir infecção oportunista. Validar aplicação clínica; não usar essa frase para suspender TARV já em uso, cujo ramo orienta manter.
- Contatos/horários refletem documento municipal de 2024; não foi afirmada atualização administrativa para 2026.

## Testes e publicação

`node scripts/test-review-batch-02.cjs`: 33 caminhos completos, renderização em DOM simulado, correspondência das setas, condição da sorologia e tabela por peso. Testes não equivalem a validação clínica.

Commit/deploy: aguardando publicação. Não iniciar lote 03 antes do sucesso no Actions e comparação dos arquivos publicados.
