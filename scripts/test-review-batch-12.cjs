'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-intoxicacoes-exogenas','adulto-leptospirose','adulto-lombalgia'];
const files=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="\.\/([^"?]+)(?:\?[^" ]*)?"/g)].map(m=>m[1]).filter(f=>!['feedback.js','animal-photos.js'].includes(f));
function app(id){const els=new Map(),listeners={};const get=k=>{if(!els.has(k))els.set(k,{innerHTML:'',dataset:{},focus(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []}});return els.get(k)};const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){listeners[e]=f}},location:{hash:'#'+id,pathname:'/',search:''}};vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8').replace("let irisAnswers=Array(IRIS_FIELDS.length).fill('');","let irisAnswers=Array(IRIS_FIELDS.length).fill('');window.__irisTest={set(v){irisAnswers=v},score:irisScore};"),c);return{context:c,iris(i){const v=Array(12).fill('0');if(i===1)v[0]=v[3]=v[4]='1';if(i===2)v[11]='1';c.window.__irisTest.set(v)},p:c.window.PROTOCOLS[id],html:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return{dataset:{action,value}}}}})}};}
const report=[];
for(const id of ids){
 const p=app(id).p,paths=[];
 function walk(key,entry,trail,seen){assert(!seen.includes(key),'Unexpected cycle '+key);const n=p.nodes[key];assert(n&&!n.incomplete,key);if(!n.choices.length){paths.push({entry,trail,terminal:key});return;}for(let i=0;i<n.choices.length;i++)walk(n.choices[i].to,entry,[...trail,{key,index:i}], [...seen,key]);}
 for(const e of p.entries)walk(e.to,e.to,[],[]);
 const ui=app(id),visited=[];
 // Traverse every UI path depth-first. Back restores the shared prefix instead of
 // reloading the entire application for each leaf; no path is skipped.
 function walkUI(key,trail){
  assert(ui.html().dataset.feedbackStep.includes('Etapa: '+key+' '),key);
  const n=p.nodes[key],html=ui.html().innerHTML.split('<details class="reference ')[0];
  assert.equal((html.match(/data-action="answer"/g)||[]).length,n.choices.length,key);
  assert(!/conferir no texto integral|conforme o PDF|VER P\.[35]/i.test(html),key);
  if(!n.choices.length){visited.push(JSON.stringify({trail,terminal:key}));return;}
  if(n.question)assert(n.choices.length>=2,key);
  for(let i=0;i<n.choices.length;i++){
   if(id===ids[0]&&key==='p1n30')ui.iris(i);
   ui.click('answer',String(i));walkUI(n.choices[i].to,[...trail,{key,index:i}]);
   ui.click('back');assert(ui.html().dataset.feedbackStep.includes('Etapa: '+key+' '),'Back '+key);
  }
 }
 for(const entry of p.entries){ui.click('restart');ui.click('protocol',id);walkUI(entry.to,[]);}
 assert.deepEqual(visited,paths.map(({trail,terminal})=>JSON.stringify({trail,terminal})),id+' all paths rendered');
 report.push({id,paths:paths.length,terminals:[...new Set(paths.map(x=>x.terminal))]});
}
function edges(n,expected){for(const [k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}


const t=app(ids[0]).p.nodes,l=app(ids[1]).p.nodes,b=app(ids[2]).p.nodes;
edges(t,{p1n4:['p1n5'],p1n5:['p1n7','p1n9'],p1n7:['p1n9'],p1n9:['tox-lavage-check','p1n14'],p1n14:['tox-charcoal-check','p1n17'],p1n17:['p1n19','p1n18'],p1n22:['p1n23','p1n30'],p1n30:['p1n25','p1n26','tox-iris-hours'],'tox-liver':['tox-nac-continue','p1n22'],'tox-benzo-mixed':['tox-tca-mixed','tox-benzo','tox-benzo-pending'],'tox-tca-arrhythmia':['tox-bicarbonate','p1n22'],'tox-cerebral-edema':['tox-glucose-gap','tox-glucose']});
edges(l,{'rv-alert':['rv-severe','rv-mild'],'lep-pressure':['lep-sepsis','lep-airway'],'lep-airway':['lep-iot','lep-renal'],'lep-renal':['lep-dialysis','lep-potassium'],'lep-potassium':['lep-electrolytes','lep-iv']});
edges(b,{p1n5:['p1n7','p1n9'],p1n9:['p1n12','p1n18'],p1n12:['p1n15'],p1n15:['p1n18','p1n17'],p1n18:['p1n23','p1n22'],'lum-pain':['lum-codeine','lum-radicular'],'lum-radicular':['lum-gabapentin','lum-aps']});
assert.match(t['tox-paracetamol'].text,/150mg\/kg/);assert.match(t['tox-charcoal-check'].criteria,/gestantes/);assert.match(t['tox-bicarbonate'].text,/teto/);assert.match(t['tox-benzo-mixed'].criteria,/contraindica/);assert.match(t['tox-hemorrhagic'].text,/72HS/);assert.match(t['tox-vitk-indication'].criteria,/48 h/);assert.match(l['rv-suspect'].text,/vínculo com caso/);assert.match(l['rv-severe'].text,/sonda vesical/i);assert.match(l['lep-airway'].criteria,/28/);assert.match(b['lum-zoster'].text,/1000 mg/);assert.match(b.p1n5.criteria,/4,5/);
const c=app(ids[0]).context;
for(let bits=0;bits<4096;bits++){const vals=Array.from({length:12},(_,i)=>String((bits>>i)&1));const expected=vals[11]==='1'?20:vals.slice(0,11).reduce((sum,v,i)=>sum+Number(v)*[1,1,1,2,2,2,2,2,2,2,3][i],0);c.window.__irisTest.set(vals);assert.equal(c.window.__irisTest.score(),expected);}
c.window.__irisTest.set(Array(12).fill(''));assert.equal(c.window.__irisTest.score(),null);
console.log(JSON.stringify(report,null,2));console.log('PASS lote 12: todas as trajetórias, critérios e 4096 combinações IRIS.');
