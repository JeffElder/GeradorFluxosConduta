# Relatos de erro — ativação pendente

O botão foi preparado, mas permanece oculto enquanto não houver um formulário válido.

## Formulário na conta do proprietário

Título: Reportar erro — Fluxo UPA

Descrição: Conte o que aconteceu para ajudar a melhorar a aplicação. Não inclua nomes, documentos, fotos ou outros dados identificáveis de pacientes.

Campos:
1. Protocolo — resposta curta (preenchido pelo site).
2. Etapa — resposta curta (preenchido pelo site).
3. Tipo de problema — múltipla escolha: Conteúdo / Funcionamento / Sugestão.
4. Descreva o problema — parágrafo, obrigatório.
5. Seu e-mail — resposta curta, opcional.

Permitir acesso público sem exigir login, sem limitar a uma resposta e sem coletar e-mail verificado. Manter o resumo das respostas privado. Não adicionar upload de arquivos.

Publicar e gerar um link pré-preenchido com valores de exemplo em Protocolo e Etapa. Copiar a URL completa: os parâmetros entry.NUMERO identificam esses campos.
Em site/feedback.js, preencher formUrl com a URL pública terminada em /viewform, protocolField e stepField com seus respectivos entry.NUMERO.

No Forms, ativar Respostas → Mais → Receber notificações por e-mail para novas respostas. Opcionalmente vincular a uma planilha privada.

## Antes de publicar

Verificar no computador e celular que o botão aparece em todas as etapas, que o formulário abre em nova aba preservando a consulta e que os dois campos correspondem ao protocolo/etapa atuais. Verificar também na página inicial e após voltar/reiniciar.

Não são enviados histórico de respostas, termos de pesquisa, dados de pacientes ou IP pelo código do botão. Apenas os identificadores do protocolo e da tela são incluídos no link, após o usuário clicar. O formulário permite revisar esses campos.

Nenhum formulário foi criado e nenhum recebimento por e-mail foi validado ainda: o acesso à página de login Google retornou HTTP 502.
