'use strict';
(()=>{
 const fields=[
 ['history','H · História (avaliação clínica)',['Pouca suspeita','Moderadamente suspeita','Altamente suspeita']],
 ['ecg','E · Eletrocardiograma',['Normal','Alteração de repolarização inespecífica','Infra de ST']],
 ['age','A · Idade',['Menos de 45 anos','45 a 64 anos','65 anos ou mais']],
 ['risk','R · Número de fatores de risco',['Nenhum','1 ou 2','3 ou mais']],
 ['troponin','T · Troponina em relação ao limite superior do laboratório',['Normal','Elevada, de 1 a menos de 3 vezes o limite','Mais de 3 vezes o limite']]
 ];
 function calculate(v,reassessment=false){
  const missing=fields.filter(([k])=>!['0','1','2'].includes(v[k])).map(([k])=>k);
  if(reassessment&&!['yes','no'].includes(v.curve))missing.push('curve');
  if(missing.length)return {complete:false,ambiguous:v.troponin==='boundary',missing};
  const score=fields.reduce((s,[k])=>s+Number(v[k]),0);
  return {complete:true,score,answer:reassessment?(score>=7?0:v.curve==='yes'?null:score>=4?1:2):(score>=4?0:1)};
 }
 function resultHTML(r){return r.complete&&r.answer===null?`<strong>${r.score} pontos · HEART</strong><p>Curva ascendente com HEART abaixo de 7: a caixa municipal não explicita a combinação AND/OR. Validar a classificação de síndrome coronariana definida; nenhuma rota de alta ou encaminhamento é inferida pelo escore neste caso.</p>`:r.complete?`<strong>${r.score} pontos · HEART</strong><p>H + E + A + R + T. A alternativa correspondente está habilitada abaixo.</p>`:r.ambiguous?'<strong>Troponina exatamente 3 vezes: pontuação pendente de validação.</strong><p>A tabela municipal sobrepõe “1–3×” (1 ponto) e “≥3×” (2 pontos). Não há escolha automática para esse limite.</p>':'<strong>Cálculo pendente</strong><p>Preencha os cinco componentes'+(r.missing.includes('curve')?' e informe a curva de troponina':'')+'. Campo vazio não vale zero.</p>';}
 function render(v,esc,reassessment){return '<section class="psi-calculator" aria-labelledby="heart-title"><h3 id="heart-title">Calculadora HEART</h3><p>Fatores de risco: HAS (hipertensão arterial), DM (diabetes mellitus), dislipidemia, obesidade (IMC &gt;30), sedentarismo, tabagismo (atual ou interrupção há menos de 3 meses), história familiar (mãe/irmã com infarto antes dos 65 anos; pai/irmão antes dos 55 anos). Cada fator conta uma vez.</p><div class="psi-fields">'+fields.map(([key,label,options])=>'<label>'+label+'<select data-heart="'+key+'"><option value="">Selecione</option>'+options.map((s,i)=>`<option value="${i}" ${v[key]===String(i)?'selected':''}>${esc(s)} — ${i} ponto(s)</option>`).join('')+(key==='troponin'?`<option value="boundary" ${v[key]==='boundary'?'selected':''}>Exatamente 3 vezes — limite sobreposto na fonte</option>`:'')+'</select></label>').join('')+(reassessment?'<label>Há curva ascendente de troponina na reavaliação?<select data-heart="curve"><option value="">Selecione</option><option value="yes" '+(v.curve==='yes'?'selected':'')+'>Sim</option><option value="no" '+(v.curve==='no'?'selected':'')+'>Não</option></select></label>':'')+'</div><p>História: use o grau de suspeita clínica da tabela HEART, sem converter automaticamente a classificação A–D da dor. Troponina: use o limite do método do laboratório. Em exatamente 3×, a tabela municipal atribui faixas sobrepostas e exige validação.</p><div id="heart-result" class="psi-result" role="status" aria-live="polite">'+resultHTML(calculate(v,reassessment))+'</div><small>Fonte: SMS Curitiba, Síndrome Coronariana, v.2, 25/06/2024, páginas 1–2.</small></section>';}
 window.HEART_CALCULATOR={fields,calculate,render,resultHTML};
})();
