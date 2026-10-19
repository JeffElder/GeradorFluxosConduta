'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['infantil-aspiracao-de-corpo-estranho','infantil-choque-em-pediatria','infantil-crises-convulsivas-em-pediatria'];
const files=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="\.\/([^"?]+)(?:\?[^" ]*)?"/g)].map(m=>m[1]).filter(f=>!['feedback.js','animal-photos.js'].includes(f));
function app(id){const els=new Map(),listeners={};const get=k=>{if(!els.has(k))els.set(k,{innerHTML:'',dataset:{},focus(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []}});return els.get(k)};const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){listeners[e]=f}},location:{hash:'#'+id,pathname:'/',search:''}};vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8').replace("let irisAnswers=Array(IRIS_FIELDS.length).fill('');","let irisAnswers=Array(IRIS_FIELDS.length).fill('');window.__irisTest={set(v){irisAnswers=v},score:irisScore};"),c);return{context:c,fillHeart(key,value){listeners.change({target:{dataset:{heart:key},value,matches:s=>s==='[data-heart]'}})},fillScore(key,field,value){listeners.change({target:{dataset:{score:key,field},value,matches:s=>s==='[data-score]'}})},iris(i){const v=Array(12).fill('0');if(i===1)v[0]=v[3]=v[4]='1';if(i===2)v[11]='1';c.window.__irisTest.set(v)},p:c.window.PROTOCOLS[id],html:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return{dataset:{action,value}}}}})}};}
const report=[];
for(const id of ids){
 const p=app(id).p,paths=[];
 function walk(key,entry,trail,seen){if(seen.includes(key)){paths.push({entry,trail,terminal:key,cycle:true});return;}const n=p.nodes[key];assert(n&&!n.incomplete,key);if(!n.choices.length){paths.push({entry,trail,terminal:key});return;}for(let i=0;i<n.choices.length;i++)walk(n.choices[i].to,entry,[...trail,{key,index:i}], [...seen,key]);}
 for(const e of p.entries)walk(e.to,e.to,[],[]);
 const ui=app(id),visited=[];
 // Traverse every UI path depth-first. Back restores the shared prefix instead of
 // reloading the entire application for each leaf; no path is skipped.
 function walkUI(key,trail){
  assert(ui.html().dataset.feedbackStep.includes('Etapa: '+key+' '),key);
  const n=p.nodes[key],html=ui.html().innerHTML.split('<details class="reference ')[0];
  assert.equal((html.match(/data-action="answer"/g)||[]).length,n.choices.length,key);
  if(/conferir no texto integral|conforme o PDF|VER P\.[35]/i.test(html)){fs.writeFileSync('/tmp/bad19.html',html);assert(false,id+'/'+key);}
  if(n.supportTables)for(const table of n.supportTables)for(const row of table.rows)for(const cell of row){const escaped=cell.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\"','&quot;').replaceAll("'",'&#39;');assert(html.includes(escaped),id+'/'+key+' table cell '+cell);}
  if(trail.some(step=>step.key===key)||!n.choices.length){visited.push(JSON.stringify({trail,terminal:key}));return;}
  if(n.question)assert(n.choices.length>=2,key);
  for(let i=0;i<n.choices.length;i++){
   ui.click('answer',String(i));walkUI(n.choices[i].to,[...trail,{key,index:i}]);
   ui.click('back');assert(ui.html().dataset.feedbackStep.includes('Etapa: '+key+' '),'Back '+key);
  }
 }
 for(const entry of p.entries){ui.click('restart');ui.click('protocol',id);ui.click('entry',entry.to);walkUI(entry.to,[]);}
 assert.deepEqual(visited,paths.map(({trail,terminal})=>JSON.stringify({trail,terminal})),id+' all paths rendered');
 report.push({id,paths:paths.length,terminals:[...new Set(paths.filter(x=>!x.cycle).map(x=>x.terminal))],cycleClosures:paths.filter(x=>x.cycle).length});
}
function edges(n,expected){for(const[k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}
const aa=app(ids[0]),a=aa.p.nodes,s=app(ids[1]).p.nodes,c=app(ids[2]).p.nodes;
edges(a,{'p1n6':['ace-conscious','ace-unconscious'],'ace-cleared':['ace-samu','ace-after-clear'],'ace-unconscious':['ace-rcp','ace-cleared'],'p1n11':['ace-antibiotic'],'ace-antibiotic':['ace-ceftriaxone','ace-clm','ace-time-pending'],'p1n13':['p1n15','ace-location-pending'],'p1n17':['p1n20','p1n19']});
assert.match(a.p1n4.criteria,/parada respiratória/);assert.match(a.p1n8.criteria,/OU normal/);assert.match(a.p1n11.text,/20 mL\/kg em30 min/);assert.match(a.p1n11.text,/15 mg\/kg\/dose/);assert.match(a['ace-ceftriaxone'].text,/100 mg\/kg\/dose de24\/24h/);assert.match(a['ace-conscious'].text,/não aplicar uma técnica única/);assert.match(a['ace-after-clear'].text,/não define o desfecho/);
aa.click('protocol',ids[0]);for(const i of [0,0,1,0])aa.click('answer',String(i));assert(aa.html().dataset.feedbackStep.includes('ace-rcp'));assert(aa.html().innerHTML.includes('Abrir PCR — pediatria'));aa.click('linked-entry','adulto-parada-cardio-respiratoria-pcr|p2n4');assert(aa.html().dataset.feedbackStep.includes('Etapa: p2n4 '));assert(aa.html().dataset.feedbackProtocol.includes('adulto-parada-cardio-respiratoria-pcr'));aa.click('back');aa.click('back');assert(aa.html().dataset.feedbackStep.includes('ace-rcp'));
edges(s,{'p2n10':['psh-volume','psh-tranexamic','psh-hyperglycemia','psh-volume'],'p2n13':['psh-pressor','psh-dobutamine'],'psh-pressor':['psh-norepi','psh-epi','psh-dopamine'],'psh-pressure':['psh-furosemide','psh-pressure-pending'],'p2n15':['psh-tamponade','psh-pneumothorax','psh-obstruction-pending']});
for(const v of ['diurese<1 mL/kg/h','TEC>2 s','<70+(2×idade','primeiras2 semanas'])assert((s.p2n4.text+' '+s.p2n4.supportTables.map(t=>t.rows.flat().join(' ')).join(' ')).toLowerCase().includes(v.toLowerCase()));assert.equal(s.p2n4.supportTables[0].rows.length,6);assert.equal(s.p2n4.supportTables[1].rows.length,5);
for(const v of ['ACESSO INTRAÓSSEO','20ml/kg','10ML/Kg','SO2 > 92%','6 L/min','vômitos incoercíveis'])assert(s.p2n5.text.includes(v));
assert.match(s['psh-norepi'].text,/0,01–0,2 mcg\/kg\/min/);assert.match(s['psh-epi'].text,/0,01–0,3 mcg\/kg\/min/);assert.match(s['psh-dopamine'].text,/5–10 mcg\/kg\/min/);assert.match(s['psh-dobutamine'].text,/5–15 mcg\/kg\/min/);assert.match(s['psh-furosemide'].text,/1 mg\/kg IV/);assert.match(s['psh-tranexamic'].text,/10 mg\/kg\/dose IV/);assert.match(s.p2n11.text,/0,01 mL\/kg\/dose IM/);
edges(c,{'p1n8':['pcv-diazepam-iv','pcv-no-iv'],'pcv-no-iv':['pcv-midazolam-im','pcv-midazolam-in','pcv-diazepam-rectal'],'pcv-after-first':['pcv-repeat','p1n16'],'pcv-after-repeat':['pcv-phenytoin','p1n16'],'pcv-after-phenytoin':['pcv-refractory','p1n16','pcv-time-pending'],'p1n28':['pcv-adjust','pcv-hospital'],'p1n33':['pcv-afebrile-reassessment'],'pcv-afebrile-reassessment':['p1n23','p1n23','pcv-afebrile-home','pcv-afebrile-pending'],'p1n43':['pcv-febrile-reassessment'],'pcv-febrile-reassessment':['p1n23','pcv-febrile-pending']});
assert.equal((450*0.05+50*0.50)/500,0.095);assert.match(c.p1n4.text,/9,5%/);assert.match(c['pcv-diazepam-iv'].text,/0,2–0,5 mg\/kg\/dose IV em2 min/);assert.match(c['pcv-midazolam-im'].text,/0,2 mg\/kg\/dose IM/);assert.match(c['pcv-midazolam-in'].text,/0,2 mg\/kg\/dose intranasal/);assert.match(c['pcv-diazepam-rectal'].text,/0,3 mg\/kg via retal/);assert.match(c['pcv-phenytoin'].text,/20 mg\/kg/);assert.match(c['pcv-phenytoin'].text,/250 mL/);assert.match(c['pcv-phenytoin'].text,/50 mg\/min/);assert.match(c['pcv-refractory'].text,/0,1–0,2 mg\/kg\/h/);assert.match(c['pcv-refractory'].text,/0,2 mg\/kg IV/);
for(const v of ['petéquias','fontanela abaulada','rigidez nucal'])assert(c.p1n16.criteria.includes(v));for(const v of ['<18 meses','antibiótico','>15 min'])assert(c.p1n40.criteria.includes(v));assert.match(c['pcv-afebrile-home'].text,/30–60 mg\/kg\/dia/);assert.match(c['pcv-afebrile-home'].text,/3–6 mg\/kg\/dia/);assert.match(c['pcv-afebrile-home'].text,/sem esclarecer se alternativas ou associação/);
// Refractory persistence may never enter a post-crisis assessment before cessation.
for(const item of report)assert.equal(item.cycleClosures,0);
console.log(JSON.stringify(report,null,2));console.log('PASS lote19: todos os caminhos na interface, encaminhamento direto à PCR pediátrica, critérios/tabelas, limites, sequência temporal e desfechos documentais.');
