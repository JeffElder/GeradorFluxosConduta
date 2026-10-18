'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-nauseas-e-vomitos','adulto-obesidade-morbida','adulto-parada-cardio-respiratoria-pcr'];
const files=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="\.\/([^"?]+)(?:\?[^" ]*)?"/g)].map(m=>m[1]).filter(f=>!['feedback.js','animal-photos.js'].includes(f));
function app(id){const els=new Map(),listeners={};const get=k=>{if(!els.has(k))els.set(k,{innerHTML:'',dataset:{},focus(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []}});return els.get(k)};const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){listeners[e]=f}},location:{hash:'#'+id,pathname:'/',search:''}};vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8').replace("let irisAnswers=Array(IRIS_FIELDS.length).fill('');","let irisAnswers=Array(IRIS_FIELDS.length).fill('');window.__irisTest={set(v){irisAnswers=v},score:irisScore};"),c);return{context:c,iris(i){const v=Array(12).fill('0');if(i===1)v[0]=v[3]=v[4]='1';if(i===2)v[11]='1';c.window.__irisTest.set(v)},p:c.window.PROTOCOLS[id],html:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return{dataset:{action,value}}}}})}};}
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
  assert(!/conferir no texto integral|conforme o PDF|VER P\.[35]/i.test(html),key);
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
function edges(n,expected){for(const [k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}

const v=app(ids[0]).p.nodes,o=app(ids[1]).p.nodes,p=app(ids[2]).p.nodes;
edges(v,{p1n5:['p1n6','p1n9'],p1n9:['p1n12','p1n14'],p1n14:['p1n15','p1n18'],p1n18:['p1n19','p1n24'],p1n24:['p1n22','p1n26'],p1n22:[]});
edges(o,{'rv-unstable':['rv-transfer','rv-observe'],'rv-observe':['obesity-recheck'],'obesity-recheck':['rv-transfer','obesity-stable']});
edges(p,{p1n5:['p1n7','p1n9'],p1n7:['p1n5'],p1n12:['p1n14','p1n51'],p1n17:['p1shock17','p1n44'],p1n26:['p1shock26','p1n44'],p1n29:['p1n17'],p1roscheck:['p3n4','p1n51'],p2n12:['p2n14','p2n15'],p2n39:['p2shock27'],p2n41:['p2shock27'],p2shock27:['p2n30'],p2n30:['p2n18'],p2roscheck:['p3n4','p2n14'],p3n8:['p3n10','p3n12']});
assert.match(v.p1n9.criteria,/BRUDZINSKI/);assert.match(v.p1n24.criteria,/TEC/);assert.match(v.p1n22.text,/beta-hCG/);assert.match(v.p1n22.text,/30 mL\/kg em 30/);assert.match(v.p1n22.text,/4:1/);assert.match(v.p1n12.text,/dimenidrato/);assert.match(o['rv-unstable'].criteria,/AVCH/);assert(!o['rv-assessment'].text.includes('≥ 150'));assert.match(p.p1n51.text,/eletrodos/);assert.match(p.p2n14.text,/ganho/);assert.match(p.p1n29.text,/300 mg/);assert.match(p.p1n29.text,/150 mg/);assert.match(p.p2n30.text,/5 mg em bolus/);assert.match(p.p2n30.text,/não foi transformada em 5 mg\/kg/);assert.match(p.p2n30.text,/metade/);assert.match(p.p3n10.text,/20ml\/kg/);assert.match(p.p3n10.text,/NOREPINEFRINA/);
// Repeated cyclic execution is checked as well as every simple path/cycle edge.
const ui=app(ids[2]);ui.click('entry','p1n4');for(const i of [0,1,0,0,0,0,0])ui.click('answer',String(i));assert(ui.html().dataset.feedbackStep.includes('Etapa: p1n17 '));
for(let cycle=0;cycle<3;cycle++)for(const i of [0,0,0,0,0,0])ui.click('answer',String(i));assert(ui.html().dataset.feedbackStep.includes('Etapa: p1n17 '));
for(const i of [1,0,0,0,0,1])ui.click('answer',String(i));assert(ui.html().dataset.feedbackStep.includes('Etapa: p3n12 '));
const child=app(ids[2]);child.click('entry','p2n4');for(const i of [0,1,0,0,0,0,1,0])child.click('answer',String(i));assert(child.html().dataset.feedbackStep.includes('Etapa: p2shock27 '));
const nv=app(ids[0]);for(const i of [0,1,1,1,0])nv.click('answer',String(i));assert(nv.html().innerHTML.includes('adulto-dor-abdominal'));
console.log(JSON.stringify(report,null,2));console.log('PASS lote 13: todas as trajetórias simples e fechamentos de ciclos, três repetições de RCP, conector 3, critérios, manejo e ligação à dor abdominal. Ciclos clínicos não são desfechos de alta.');
