# Fluxo UPA · Curitiba

Consulta guiada em português aos protocolos adultos e pediátricos publicados pela SMS Curitiba. A aplicação apresenta perguntas, respostas, etapas intermediárias e condutas em texto nativo, sem abrir PDFs durante a consulta.

**Versão para revisão clínica: não validada para uso assistencial.** A transcrição e os caminhos precisam ser revisados por responsável clínico. Testes de software não validam indicações, doses, contraindicações ou atualidade de uma diretriz.

## Funcionamento

- Público → quadro clínico → situação → perguntas do fluxo → conduta em tela.
- 73 documentos de origem, com referência textual, critérios e tabelas.
- Fluxos com mais de uma página permitem selecionar o componente aplicável.
- Etapas intermediárias preservam condutas antes da próxima pergunta.
- Histórico de respostas, voltar e reiniciar; busca direta por título, sigla ou queixa.
- Componentes paralelos são identificados como complementares; a consulta de um não exclui os demais.
- Documentos sem fluxograma navegável são apresentados como orientação textual.
- Sem cadastro, analytics ou armazenamento de dados de pacientes. O estado existe somente na memória da página.
- Interface responsiva e navegação por teclado.

## Fontes e limites

- https://saude.curitiba.pr.gov.br/conteudo/atendimento-adulto/1470
- https://saude.curitiba.pr.gov.br/conteudo/atendimento-infantil/1472

As 54 fontes adultas e 19 infantis foram obtidas dos catálogos oficiais e conferidas como PDFs válidos em 01/10/2026. A data não representa revisão clínica. Versões e datas do catálogo podem divergir dos cabeçalhos dos PDFs. Projeto independente, sem vínculo institucional com a Prefeitura.

`site/protocols.js` contém perguntas, ações, referências por página e transições explícitas. A geometria dos PDFs é extraída no preparo do conteúdo, nunca em tempo de execução. `scripts/build-protocols.py` registra ajustes específicos de navegação e pontos de inconsistência encontrados. `conversion-report.json` confere a estrutura; não é certificação clínica.

**Pendências conhecidas:** critérios, ramos e transcrições exigem conferência completa. Foram sinalizadas inconsistências em unidades/doses de nitroglicerina, adrenalina, amiodarona, ceftriaxona e na redação sobre compressões pediátricas; valores suspeitos detectados foram ocultados, sem inferir uma dose substituta. Essa lista não é uma auditoria farmacológica exaustiva. Referências usadas para identificar divergências (não para substituir os protocolos municipais):

- AHA, Pediatric Cardiac Arrest Algorithm, 2025: https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-CA-250123.pdf
- Bula de ceftriaxona, DailyMed: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4c5c2d3f-5038-41a1-a2fe-4dcd048dbac1

O motor não faz diagnóstico automático nem calcula doses. Encaminhamentos para fluxos indisponíveis permanecem descritos em texto; não há substituição automática entre populações. O documento de PCR do catálogo adulto contém também página pediátrica, explicitamente identificada na seleção de parte.

## Executar e publicar

Sem compilação ou dependências de frontend:

```sh
python3 -m http.server 8080 --directory site
```

O workflow `.github/workflows/pages.yml` publica `site` após push na branch `main`. GitHub Pages deve estar configurado para GitHub Actions.

## Regenerar conteúdo para revisão

Requer Python e PyMuPDF. Os downloads temporários ficam em `../tmp/pdfs` e as extrações em `../tmp/graphs`, relativos ao repositório.

```sh
python scripts/collect.py
python scripts/enrich.py
python scripts/extract-flow-geometry.py
python scripts/build-protocols.py
node scripts/test-protocols.cjs
```

Os PDFs podem mudar nas URLs oficiais. Compare versões e diferenças antes de regenerar/publicar; IDs geométricos são específicos da versão obtida. A coleta não é executada automaticamente em produção. Preserve a identificação de versão para revisão até aprovação clínica de todas as decisões e condutas.
