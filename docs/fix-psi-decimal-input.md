# Entrada decimal do pH no PSI

O cálculo convertia vírgula em ponto, mas o input HTML type=number podia rejeitar a vírgula antes de entregar o valor ao JavaScript. O campo de pH agora usa texto com teclado decimal, aceitando explicitamente ponto ou vírgula, mantendo validação numérica e faixa de 0 a 14. Nenhum critério clínico ou peso do PSI mudou.

Regressão: 7,34 e 7.34 acrescentam 30; 7,35 e 7.35 não acrescentam pontos por pH. Entrada vazia, separadores repetidos/mistos, notação hexadecimal/exponencial e valores fora da faixa impedem o cálculo. O teste de interface preenche 7,2 e verifica a atualização e o ramo correspondente, além de verificar o tipo HTML do campo e a preservação da vírgula.

Publicação confirmada: commit `34f918a5f55ea8032cda4da1d5675127724ec4bb`; Actions `39033818292`, etapa Publicar concluída com sucesso em 2026-10-17T12:49:10Z. Arquivo PSI publicado idêntico byte a byte e referência `?v=2` presente no HTML. Teste no navegador publicado: cenário sintético com pH `7,35` aceito e resultado 50 pontos/PSI II.
