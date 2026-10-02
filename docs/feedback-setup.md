# Relatos de erro — Fluxo UPA

O botão fixo "Reportar erro" aparece em todas as etapas. Abre o Google Forms do proprietário em nova aba, preservando a consulta.

Formulário: https://docs.google.com/forms/d/e/1FAIpQLSe6lu943g1k1xKO_SJXPGN2CdGrINBR22f7uQnFWp-0CC75fw/viewform

O formulário tem um único campo de parágrafo obrigatório, "Reporte um erro ou envie sugestão" (entry.1734951772). O link preenche esse campo com espaço para o relato e o contexto do protocolo/etapa. O respondente pode revisar o texto antes de enviar.

A configuração está em site/feedback.js. Se o formulário ou o campo for substituído, atualize formUrl ou reportField. Sem configuração válida, o botão fica oculto.

## Receber avisos por e-mail

Na conta proprietária do formulário: Respostas → Mais (⋮) → Receber notificações por e-mail para novas respostas.
Essa configuração não pode ser verificada pelo link público. O proprietário precisa ativá-la na interface de edição.
As respostas também ficam na guia Respostas. É possível vinculá-las a uma planilha privada.

## Privacidade e validação

O botão não envia respostas da consulta ou termos de pesquisa. Inclui somente protocolo e identificador da etapa no link quando o usuário abre o formulário. A mensagem orienta a não incluir dados identificáveis de pacientes.

O acesso público sem login obrigatório e o preenchimento do campo foram verificados no navegador. Nenhuma resposta de teste foi enviada.
