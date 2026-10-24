'use strict';
(() => {
  // Revisão de usabilidade: pneumonia em adultos. Preserva as decisões e destinos do protocolo.
  const protocol = window.PROTOCOLS?.['adulto-pneumonia-no-adulto'];
  if (!protocol?.nodes) return;
  const nodes = protocol.nodes;

  // Textos explicativos copiados integralmente de etapas anteriores eram
  // reapresentados como critérios, embora já tivessem sido lidos.
  for (const id of ['p1n10', 'p1n12', 'p1n17']) {
    if (nodes[id]) nodes[id].criteria = '';
  }

  // Mantém a condição composta e suas opções originais, tornando a pergunta
  // operacional e evitando reapresentar a tabela inteira.
  if (nodes.p1n12) {
    nodes.p1n12.text =
      'O CRB-65 é ≥ 1 E existe pelo menos um critério adicional de gravidade?';
    nodes.p1n12.criteria =
      'Considere a pontuação já calculada e os critérios adicionais avaliados: ' +
      'SpO₂ < 90% em ar ambiente (< 88% em DPOC) ou comorbidade descompensada ' +
      'conforme o protocolo municipal. Ambos devem estar presentes para responder “Sim”.';
  }

  // O calculador já apresenta o CRB-65 na avaliação anterior. Não pedir de
  // novo os quatro componentes nem duplicar a resposta do critério adicional
  // dentro da calculadora e da própria pergunta seguinte.
  const crb = window.SCORE_CALCULATORS?.definitions?.crb;
  if (crb) {
    crb.nodes = (crb.nodes || []).filter(id => id !== 'p1n12');
    crb.fields = (crb.fields || []).filter(field => field.key !== 'additional');
  }
})();
