'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-pneumonia-no-adulto','adulto-profilaxia-pos-exposicao-sexual-ao-hiv-consentida','adulto-rebaixamento-do-nivel-de-consciencia'];
const files=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="\.\/([^"?]+)(?:\?[^" ]*)?"/g)].map(m=>m[1]).filter(f=>!['feedback.js','animal-photos.js'].includes(f));
function app(id){const els=new Map(),listeners={};const get=k=>{if(!els.has(k))els.set(k,{innerHTML:'',dataset:{},focus(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []}});return els.get(k)};const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){listeners[e]=f}},location:{hash:'#'+id,pathname:'/',search:''}};vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8').replace("let irisAnswers=Array(IRIS_FIELDS.length).fill('');","let irisAnswers=Array(IRIS_FIELDS.length).fill('');window.__irisTest={set(v){irisAnswers=v},score:irisScore};"),c);return{context:c,fillScore(key,field,value){listeners.change({target:{dataset:{score:key,field},value,matches:s=>s==='[data-score]'}})},fillPSI(key,value){listeners.input({target:{dataset:{psi:key},value,matches:s=>s==='[data-psi]'}})},iris(i){const v=Array(12).fill('0');if(i===1)v[0]=v[3]=v[4]='1';if(i===2)v[11]='1';c.window.__irisTest.set(v)},p:c.window.PROTOCOLS[id],html:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return{dataset:{action,value}}}}})}};}
const psiBase={age:'50',sex:'male',residence:'0',cancer:'0',liver:'0',heart:'0',stroke:'0',renal:'0',mental:'0',rr:'20',sbp:'120',temperature:'37',pulse:'80',ph:'7,35',urea:'30',sodium:'140',glucose:'100',hct:'40',oxygen:'sat',sat:'95',effusion:'0'};
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
   if(id===ids[0]&&['p1n10','p1n12'].includes(key)){for(const field of ['confusion','resp','pressure','age'])ui.fillScore('crb',field,key==='p1n10'?(i===0?'1':'0'):(field==='confusion'&&i===0?'1':'0'));ui.fillScore('crb','additional',i===0?'1':'0');}
   if(id===ids[0]&&key==='p1n19')for(const[field,value]of Object.entries(psiBase))ui.fillPSI(field,field==='ph'&&i===0?'7,2':value);
   ui.click('answer',String(i));walkUI(n.choices[i].to,[...trail,{key,index:i}]);
   ui.click('back');assert(ui.html().dataset.feedbackStep.includes('Etapa: '+key+' '),'Back '+key);
  }
 }
 for(const entry of p.entries){ui.click('restart');ui.click('protocol',id);ui.click('entry',entry.to);walkUI(entry.to,[]);}
 assert.deepEqual(visited,paths.map(({trail,terminal})=>JSON.stringify({trail,terminal})),id+' all paths rendered');
 report.push({id,paths:paths.length,terminals:[...new Set(paths.filter(x=>!x.cycle).map(x=>x.terminal))],cycleClosures:paths.filter(x=>x.cycle).length});
}
function edges(n,expected){for(const [k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}

const pn=app(ids[0]).p.nodes,pep=app(ids[1]).p.nodes,loc=app(ids[2]).p.nodes;
edges(pn,{p1n5:['p1n7','p1n10'],p1n10:['p1n11','p1n12'],p1n12:['p1n11','p1n17'],p1n17:['p1n31','p1n19'],p1n19:['p1n20','p1n31'],p1n31:['cap-home-risk','cap-home-low'],'cap-steroid':['cap-methyl','cap-pred'],'cap-iv-antibiotic':['cap-iv-first','cap-iv-second','cap-iv-third']});
edges(pep,{'pep-time':['pep-test','pep-late'],'pep-test':['pep-positive','pep-interaction'],'pep-interaction':['pep-double','pep-standard'],'pep-standard':['pep-contraception'],'pep-double':['pep-contraception'],'pep-contraception':['pep-levonorgestrel','pep-followup'],'pep-levonorgestrel':['pep-lng-single','pep-lng-split']});
edges(loc,{p1n6:['p1n7','p1n10'],p1n7:['loc-glucose','loc-hyper','loc-resp','loc-volume','loc-shock','loc-hypertension','loc-vital-gap'],p1n31:['loc-ischemia','loc-arrhythmia','loc-both-ecg','loc-ecg-gap'],p1n34:['p1n36','p1n39']});
assert.match(pn.p1n5.criteria,/4,5/);assert.match(pn.p1n12.criteria,/DPOC/);assert.match(pn['cap-amox'].text,/8\/8 h por 5–7/);assert.match(pn['cap-iv-first'].text,/100 mg\/kg\/dia/);assert.match(pn['cap-pred'].text,/máximo 60 mg/);assert.match(pep['pep-standard'].text,/28 dias/);assert.match(pep['pep-double'].text,/12\/12 h/);assert.match(pep['pep-interaction'].text,/fenobarbital/);assert.match(pep['pep-violence'].text,/até 11/);assert.match(pep['pep-violence'].text,/exatamente 12/);assert.match(pep['pep-occupational'].text,/4406/);assert.match(loc.p1n22.criteria,/ROMBERG/);assert.match(loc.p1n34.criteria,/GASOMETRIA/);assert.match(loc['loc-glucose'].text,/50%, 50 mL IV/);assert.match(loc['loc-shock'].text,/comparador está indefinido/);
const tools=app(ids[0]).context.window.SCORE_CALCULATORS;
for(let bits=0;bits<16;bits++){let score=0,v={};['confusion','resp','pressure','age'].forEach((k,i)=>{v[k]=String((bits>>i)&1);score+=Number(v[k]);});let r=tools.calculate('crb',v,'p1n10');assert.equal(r.score,score);assert.equal(r.answer,score>=3?0:1);assert(!tools.calculate('crb',v,'p1n12').complete);for(const additional of ['0','1']){r=tools.calculate('crb',{...v,additional},'p1n12');assert.equal(r.score,score);assert.equal(r.answer,score>=1&&additional==='1'?0:1);}}
assert.match(tools.definitions.crb.fields[1].label,/>30/);assert.match(tools.definitions.crb.fields[2].label,/PAD <60/);
console.log(JSON.stringify(report,null,2));console.log('PASS lote 14: todas as trajetórias, CRB-65 (16 combinações e critérios adicionais), PSI com vírgula, regimes explícitos, PEP navegável e manejo por causa.');

for(const [route,target]of [[[0,1,0],'adulto-crises-convulsivas'],[[0,1,1,1,1,1,0],'adulto-intoxicacoes-exogenas'],[[0,1,1,1,1,1,1,0,0],'adulto-sindromes-coronarianas']]){const ui=app(ids[2]);for(const i of route)ui.click('answer',String(i));assert(ui.html().innerHTML.includes('data-value="'+target+'"'),target+' linked protocol');}
