'use strict';
(() => {
  // Manual arrow-by-arrow review: SMS Curitiba ARRITMIAS.pdf v.2, 24/06/2024, pp.1–6.
  // Apply after generated protocols.js so source regeneration cannot erase these corrections.
  const p = window.PROTOCOLS?.['adulto-arritmias'];
  if (!p) return;
  const N = p.nodes, C = (label, to) => ({ label, to });
  const link = (id, to) => { N[id].choices = [C('Próxima etapa', to)]; };
  const ask = (id, page, text, choices, criteria = '') => {
    N[id] = { id, page, text, question: true, choices, criteria, incomplete: false, contextNodes: [] };
  };
  const warning = (title, text, page, url) => ({ title, text, page, url });
  const source = 'https://saude.curitiba.pr.gov.br/images/DUE/ARRITMIAS.pdf';
  const aha = 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support';
  const bradyAha = 'https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Bradycardia-250514.pdf';
  p.media = window.ARRHYTHMIA_ECG;
  p.entries = [
    { to: 'p1n7', page: 1, label: 'Bradiarritmias' },
    { to: 'p2n47', page: 2, label: 'Taquiarritmias' }
  ];
  p.warning = 'Fonte municipal: v. 2, 24/06/2024. Há divergências de dose/unidade no manejo da bradicardia e cuidados específicos em FA com pré-excitação. Veja os alertas em cada etapa. As imagens são os painéis originais das páginas 4–6; a transcrição não constitui atualização nem validação clínica.';
  // Keep reference panels out of the navigation. Relevant criteria are visible before answers.
  for (const n of Object.values(N)) n.contextNodes = [];
  const common = ['p1n4', 'p1n6', 'p1n5', 'p1n31', 'p1n32'];
  N.p1n7.contextNodes = common;
  N.p2n47.contextNodes = common;
  N.p1n7.criteria = N.p1n8.text;
  N.p1n14.criteria = N.p1n19.text;
  N.p1n23.text = 'CAUSAS REVERSÍVEIS?';
  N.p1n23.criteria = N.p1n29.text;
  N.p2n4.text = 'SINAIS DE INSTABILIDADE?';
  N.p2n4.criteria = N.p3n6.text;
  const instability = warning('Atenção · instabilidade', 'Os sinais só definem instabilidade deste fluxo quando decorrem da arritmia: hipotensão/choque/má perfusão, dor torácica, dispneia, alteração aguda do estado mental ou síncope.', 1);
  N.p1n7.warnings = [instability];
  N.p2n4.warnings = [{ ...instability, page: 3 }];
  const bradyWarning = warning('Atenção · divergência de dose e unidade na fonte', 'O PDF agrupa dopamina e epinefrina sob uma mesma dose em mcg/kg/min e registra atropina 0,5 mg. A AHA 2025 diferencia as infusões e usa outra dose inicial de atropina. Não aplicar a dose agrupada à epinefrina. Conferir protocolo vigente com a regulação antes de prescrever; a dose agrupada foi retirada do texto navegável. A redação sobre Mobitz II também exige conferência.', 1, bradyAha);
  // Do not display the source's conflated vasopressor dose as an executable instruction.
  const rawManagement = N.p1n11.text;
  N.p1n11.text = rawManagement.replace('• 5-20MCG/KG/MIN EM BIC;', '• DOSE/UNIDADE AGRUPADA OMITIDA: conferir separadamente dopamina e epinefrina (ver alerta).');
  for (const page of p.pages) for (const b of page.blocks) {
    if (/5\s*[-–]\s*20MCG\/KG\/MIN/i.test(b.text)) b.text = b.text.replace(/5\s*[-–]\s*20MCG\/KG\/MIN/ig, '[dose agrupada omitida: conferir dopamina e epinefrina separadamente]');
  }
  for (const id of ['p1n12', 'p1n15']) {
    N[id].text += '\n\n' + N.p1n11.text;
    N[id].warnings = [bradyWarning, warning('Atenção · manejo e sedação', 'O documento orienta não usar atropina em QRS alargado e alerta para depressão respiratória com midazolam. O marca-passo transcutâneo é provisório; verificar a resposta.', 1)];
    N[id].media = ['mobitz-2', 'bav-total'];
  }
  // P.2: both QRS branches must be selectable; unknown timing is an explicit source route.
  ask('p2n6', 2, 'QUAL A DURAÇÃO DO QRS NO ECG?', [C('QRS < 0,12 s (estreito)', 'p2n24'), C('QRS ≥ 0,12 s (largo)', 'p2n11')]);
  N.p2n11.text = 'RITMO REGULAR?';
  N.p2n11.criteria = 'QRS largo (≥ 0,12 s). Compare os traçados correspondentes antes de selecionar o ramo.';
  N.p2n24.criteria = 'QRS estreito (< 0,12 s). Compare a regularidade dos intervalos R-R nos exemplos da fonte.';
  N.p2n28.choices = [C('Sim', 'p2n29'), C('Não', 'p2n31'), C('Indeterminado', 'p2n31')];
  N.p2n31.text = 'ARRITMIA AGUDA?';
  N.p2n31.choices = [C('Sim', 'p2n33'), C('Não', 'p2n34'), C('Indeterminado', 'p2n34')];
  N.p2n46.text = N.p2n46.text.replace(/ NÃO$/, '');
  N.p2n67.text = 'TAQUICARDIA SUPRAVENTRICULAR';
  N.p2n37.text = 'CAUSAS REVERSÍVEIS?';
  N.p2n37.criteria = N.p3n4.text;
  N.p2n21.contextNodes = ['p3n4'];
  // p2n21/p2n45 have no outgoing arrow in the PDF: preserve them as conclusions.
  // P.3 is the continuation for cardioversion, not a duplicate tachyarrhythmia entry.
  link('p2n5', 'p3n9');
  link('p2n29', 'p3n9');
  link('p3n11', 'p3n13');
  N.p3n13.criteria = N.p3n13.text;
  N.p3n13.text = 'QUAL ARRITMIA CORRESPONDE AO TRAÇADO?';
  N.p3n13.question = true;
  N.p3n13.choices = [C('Taquicardia supraventricular / flutter', 'p3n17'), C('Fibrilação atrial', 'p3n16'), C('TV monomórfica', 'p3n15'), C('TV polimórfica', 'p3n14'), C('Torsades de pointes', 'p3n31')];
  ask('ar-polymorphic', 3, 'QUAL TRAÇADO CORRESPONDE AO CASO?', [C('TV polimórfica', 'p3n14'), C('Torsades de pointes', 'p3n31')], 'A página 2 remete a estas condutas. Elas estão na página 3; os exemplos de ECG estão na página 6.');
  link('p2n26', 'ar-polymorphic');
  // Split the two explicit conditions of the torsades source panel into actionable choices.
  ask('ar-torsades-stability', 3, 'HÁ INSTABILIDADE NA TORSADES DE POINTES?', [C('Sim', 'ar-torsades-unstable'), C('Não — estável', 'ar-torsades-stable')], N.p3n6.text);
  link('p3n31', 'ar-torsades-stability');
  for (const [id, text] of [
    ['ar-torsades-unstable', 'TORSADES DE POINTES COM INSTABILIDADE\nDESFIBRILAÇÃO, conforme quadro da página 3.'],
    ['ar-torsades-stable', 'TORSADES DE POINTES ESTÁVEL\nSULFATO DE MAGNÉSIO 10%: 1 A 2 g EM 5 A 20 MIN, SEGUIDO DE MAIS 2 g EM 15 MIN SE NECESSÁRIO. PODE-SE AINDA FAZER 3–20 mg/min EM BIC, conforme quadro da página 3.']
  ]) N[id] = { id, page: 3, text, question: false, choices: [], contextNodes: [], incomplete: false, media: ['torsades'] };
  ask('ar-refractory', 3, 'QUAL O TIPO DE TAQUICARDIA VENTRICULAR?', [C('TV monomórfica', 'p3n15'), C('TV polimórfica', 'p3n14')], 'Refratariedade ou instabilidade hemodinâmica, conforme ramo da página 2. Conferir preparo, monitorização e pré-medicação da página 3.');
  N['ar-refractory'].contextNodes = ['p3n9', 'p3n11'];
  link('p2n16', 'ar-refractory');
  // Original caution boxes and contraindications are always expanded, next to the decision.
  const shockWarning = warning('Atenção · sincronização do equipamento', N.p3n22.text.replace(/^ATENÇÃO:\s*/, ''), 3);
  const energyWarning = warning('Atenção · energias da edição de 2024', 'As energias abaixo são as transcritas do PDF municipal, incluindo a tabela de escalonamento monofásico. Não converter automaticamente para um equipamento bifásico; conferir recomendações atuais e instruções do fabricante.', 3, aha);
  const asthma = warning('Atenção · adenosina', 'NÃO USAR EM PACIENTES COM ASMA (alerta do PDF).', 2);
  N.p2n12.warnings = [asthma, warning('Atenção · QRS largo', 'A adenosina só deve ser considerada no ritmo largo estável, regular e monomórfico. Não usar em taquicardia larga irregular ou polimórfica.', 2, aha)];
  N.p2n46.warnings = [asthma];
  const metoprolol = warning('Atenção · metoprolol', 'O PDF orienta NÃO USAR EM BRONCOESPASMO, DPOC, ASMA OU IC DESCOMPENSADA. Conferir contraindicações e o quadro de IC/cardiopatia estrutural antes de qualquer medicação.', 2);
  N.p2n34.warnings = [metoprolol]; N.p2n45.warnings = [metoprolol];
  const wpw = warning('Atenção · FA com pré-excitação / WPW', 'O PDF reúne FA com aberrância e FA pré-excitada no mesmo ramo. Isso não torna os tratamentos equivalentes. Na FA pré-excitada, não usar bloqueadores do nó AV (adenosina, betabloqueadores, digitálicos, verapamil/diltiazem) nem amiodarona IV: há risco de fibrilação ventricular. A imagem WPW do PDF é um ECG sem arritmia. Discutir manejo com regulação/especialista.', 2, 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11104284/');
  N.p2n25.warnings = [wpw];
  p.persistentWarnings = [{ from: 'p2n25', warning: wpw }];
  // When that source branch is followed, keep its contraindicated drug panels documentary only.
  for (const id of ['p2n33', 'p2n34']) N[id].sourceOnlyAfter = ['p2n25'];
  for (const id of ['p2n5', 'p2n29', 'p2n16', 'p3n9', 'p3n11', 'p3n13', 'p3n14', 'p3n15', 'p3n16', 'p3n17', 'p3n18', 'p3n19', 'p3n20', 'p3n21', 'ar-torsades-unstable', 'ar-refractory']) {
    N[id].warnings = [shockWarning, energyWarning];
  }
  N.p2n48.warnings = [warning('Atenção · ausência de pulso', 'Manejar como parada cardiorrespiratória, conforme encaminhamento explícito do documento para o fluxo de PCR.', 2)];
  N.p3n11.warnings.push(warning('Atenção · pré-medicação', 'Analgesia e sedação sempre que possível, com monitorização e equipamentos para manejo da via aérea disponíveis, conforme página 3.', 3));
  const brady = ['bav-1', 'mobitz-1', 'mobitz-2', 'bav-total'];
  const tachy = ['tsv', 'fa', 'flutter', 'wpw', 'tv-mono', 'tv-poli', 'torsades'];
  const media = {
    p1n7: brady, p1n14: brady,
    p2n6: tachy, p2n24: ['tsv', 'fa', 'flutter'], p2n11: ['tv-mono', 'tv-poli', 'torsades', 'wpw'],
    'p2n11-nao': ['tv-poli', 'torsades', 'wpw'], p2n25: ['wpw', 'fa'], p2n26: ['tv-poli', 'torsades'],
    p2n27: ['fa', 'flutter'], p2n28: ['fa', 'flutter', 'wpw'], p2n31: ['fa', 'flutter'],
    p2n12: ['tv-mono'], p2n13: ['tv-mono'], p2n14: ['tv-mono'], p2n15: ['tv-mono'], p2n16: ['tv-mono', 'tv-poli'], p2n21: ['tv-mono'],
    p2n43: ['tsv'], p2n44: ['tsv'], p2n46: ['tsv'], p2n61: ['tsv'], p2n67: ['tsv'], p2n45: ['tsv'],
    p3n13: tachy.filter(x => x !== 'wpw'), p3n14: ['tv-poli'], p3n15: ['tv-mono'], p3n16: ['fa'], p3n17: ['tsv', 'flutter'],
    p3n18: ['tsv', 'flutter'], p3n19: ['fa'], p3n20: ['tv-mono'], p3n21: ['tv-poli'], p3n31: ['torsades'],
    'ar-refractory': ['tv-mono', 'tv-poli'], 'ar-polymorphic': ['tv-poli', 'torsades'], 'ar-torsades-stability': ['torsades']
  };
  for (const [id, keys] of Object.entries(media)) N[id].media = keys;
  // Reference gallery preserves all source panels even outside the guided path.
  for (const page of p.pages) page.media = Object.keys(p.media?.files || {}).filter(k => p.media.files[k].page === page.page);
  p.sourceReview = { date: '2026-10-09', url: source, sha256: p.media?.sha256, pages: 6 };
})();
