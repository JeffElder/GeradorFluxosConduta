# Fluxo UPA · Curitiba

Aplicação estática de consulta rápida aos documentos de atendimento adulto e infantil publicados pela Secretaria Municipal da Saúde de Curitiba.

## Funcionalidades

- 73 documentos: 54 do catálogo adulto e 19 do infantil.
- Pesquisa por título, sigla e termos de navegação, sem diferenciar acentos.
- Filtros por público e área, atalhos de emergência e favoritos locais.
- Leitor do PDF oficial e acesso direto à fonte, com link individual por protocolo.
- Interface responsiva, navegação por teclado e estados vazios explícitos.
- Sem cadastro, servidor, analytics ou coleta de dados de pacientes.

## Fontes

- https://saude.curitiba.pr.gov.br/conteudo/atendimento-adulto/1470
- https://saude.curitiba.pr.gov.br/conteudo/atendimento-infantil/1472

Links conferidos em 01/10/2026. Os 73 documentos retornaram PDFs válidos. Versões e datas exibidas são as informadas nas páginas de catálogo da SMS: podem diferir do cabeçalho interno do PDF. Confira sempre o documento original. A data de conferência não representa revisão clínica ou atualização das diretrizes.

O aplicativo não reescreve condutas, não calcula doses, não faz triagem nem fornece diagnósticos. Categorias, termos relacionados e atalhos são auxiliares de navegação. Os protocolos são servidos pelo domínio oficial e requerem internet. Não há armazenamento offline de PDFs.

Este é um índice independente, sem vínculo institucional com a Prefeitura. Os documentos pertencem aos respectivos autores/órgãos. O catálogo infantil consultado não possui um PDF específico de PCR; a aplicação não substitui esse resultado por um fluxo adulto.

## Executar localmente

Sem dependências de frontend ou etapa de compilação:

```sh
python3 -m http.server 8080 --directory site
```

Acesse http://localhost:8080.

## GitHub Pages

O workflow `.github/workflows/pages.yml` publica a pasta `site` a cada push na branch `main`, e também pode ser executado manualmente. Na configuração do repositório, em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions** caso Pages ainda não esteja habilitado.

## Manutenção do catálogo

O arquivo `site/catalog.js` contém título original, URL oficial, público, página de origem, metadados, categoria e termos auxiliares de pesquisa de cada documento. Para atualizar, confira as páginas de origem, valide que cada link retorna um PDF e revise os metadados antes de enviar alterações. Não altere condutas nem converta o índice em ferramenta de decisão sem validação clínica própria.

Os scripts de coleta e enriquecimento documentam a extração original. A coleta lê os snapshots de links `adulto-source.json` e `infantil-source.json` e requer PyMuPDF para verificar PDFs. Eles não rodam em produção e não fazem atualização automática.
