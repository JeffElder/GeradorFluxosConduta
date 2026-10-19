'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['infantil-dor-abdominal-em-pediatria-due','infantil-dor-de-garganta','infantil-dor-de-ouvido'];
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
const a=app(ids[0]).p.nodes,t=app(ids[1]).p.nodes,e=app(ids[2]).p.nodes;
edges(a,{'p1n7':['p1n8','p1n5'],'p1n21':['p1n23'],'p1n34':['p1n37','p1n38'],'p1n38-sim':['abd-geca','abd-uti','p1n40','abd-febrile-pending'],'p1n38-nao':['p1n44','p1n43','abd-weight-pending']});
for(const v of ['genitália','torção testicular','glicemia capilar','sinais de abuso','exato7 dias'])assert(a['abd-initial'].text.includes(v));assert.match(a.p1n5.criteria,/SpO₂≤92%/);assert.match(a.p1n5.criteria,/O₂ usa<92%/);assert.match(a.p1n5.criteria,/2–3 anos/);assert.equal(a.p1n5.supportTables[0].rows.length,6);
for(const id of ['p1n21','p1n25','p1n29','p1n33'])for(const v of ['Dois acessos','20 mL/kg em30 min','15 mg/kg/dose','0,1 mg/kg/dose','1 mg/kg/dose se>2 anos'])assert(a[id].text.includes(v));for(const id of ['p1n29','p1n37'])for(const v of ['Hemograma','C-reativa','urina tipo1','RX de abdome agudo'])assert(a[id].text.includes(v));assert.match(a.p1n40.text,/não integra os73/);
edges(t,{'p1n8':['th-abscess-cef','th-abscess-clinda'],'p1n16':['th-mono','th-diphtheria','th-membrane-pending'],'th-diphtheria':['th-diphtheria-airway'],'th-diphtheria-airway':['th-dexamethasone','th-diphtheria-clm'],'th-airway-reassessment':['th-samu','th-diphtheria-clm'],'p1n24':['p1n29','p1n30','th-etiology-pending'],'p1n35':['th-pen-weight','th-amoxicillin','th-azithromycin','th-amoxiclav','th-cephalexin'],'th-pen-weight':['th-pen-large','th-pen-small','th-pen-pending']});
for(const v of ['desvio da úvula','sialorreia','trismo'])assert(t.p1n4.criteria.includes(v));assert.match(t['th-abscess-cef'].text,/50 mg\/kg IV/);assert.match(t['th-abscess-clinda'].text,/30 mg\/kg\/dia/);for(const v of ['Notificação compulsória','ECG','TGO/TGP','100OOOUI','0800-410148'])assert(t['th-diphtheria'].text.includes(v));assert.match(t['th-dexamethasone'].text,/0,5 mg\/kg IV/);assert.match(t['th-mono'].text,/NÃO prescrever amoxicilina\/penicilina/);assert.match(t['th-pen-large'].text,/1\.200\.000 UI/);assert.match(t['th-pen-small'].text,/50\.000 UI\/kg/);assert.match(t['th-pen-small'].text,/900\.000 UI/);assert.match(t['th-amoxicillin'].text,/90 mg\/kg\/dia/);assert.match(t['th-azithromycin'].text,/10 mg\/kg1 vez\/dia5 dias/);assert.match(t['th-amoxiclav'].text,/50 mg\/kg\/dia/);assert.match(t['th-cephalexin'].text,/50 mg\/kg\/dia/);
edges(e,{'p1n11':['p1n16','ear-hospital-check'],'ear-hospital-check':['ear-hospital','p1n18'],'p1n18':['p1n24','p1n26'],'ear-amoxiclav-indication':['ear-amoxiclav-age','ear-antibiotic-choice'],'ear-antibiotic-choice':['ear-amoxicillin-age','ear-azithromycin'],'ear-suppuration':['ear-suppuration-care','ear-outpatient-end'],'p2n12':['ear-external','ear-wax','ear-foreign','ear-canal-pending'],'ear-foreign-result':['ear-foreign-success','ear-foreign-hospital'],'p2n23':['ear-pinna-cellulitis','ear-pinna-zoster','ear-pinna-pending'],'ear-auditory-nerve':['ear-zoster-hospital','ear-zoster-followup']});
for(const v of ['mastoidite','paralisia facial','meningismo','impossibilidade'])assert(e.p1n11.criteria.includes(v));for(const v of ['≥3 episódios/6 meses','≥4/1 ano','duas séries','>3 meses','colesteatoma'])assert(e['ear-hospital-check'].criteria.includes(v));for(const v of ['<6 meses','48–72 h','conjuntivite purulenta','últimos30 dias'])assert(e['ear-amoxiclav-indication'].criteria.includes(v));
for(const suffix of ['young','older']){assert.match(e['ear-amoxicillin-age-'+suffix].text,/50 mg\/kg\/dia/);assert.match(e['ear-amoxiclav-age-'+suffix].text,/6,4 mg\/kg\/dia/);assert(e['ear-amoxicillin-age-'+suffix].text.includes(suffix==='young'?'10 dias':'7 dias'));}
assert.match(e['ear-azithromycin'].text,/10mg\/ml/);assert.match(e['ear-azithromycin'].text,/sem substituir por10 mg\/kg/);assert.match(e.p1n28.text,/15 mg\/kg\/dose de6\/6h/);assert.match(e.p1n28.text,/Evitar anti-histamínicos/);assert.match(e['ear-suppuration-care'].text,/reavaliação em48 h/);for(const id of ['p2n7','p2n21'])assert.match(e[id].text,/400 mg IV12\/12h/);assert.match(e.p2n7.text,/hemograma,VHS,controle glicêmico/);assert.match(e['ear-pinna-zoster'].text,/máximo60 mg\/dia/);
console.log(JSON.stringify(report,null,2));console.log('PASS lote21: todas as trajetórias reais de três protocolos, critérios/exames, diferenciais, doses pediátricas, idades/peso, alternativas e reavaliações.');
