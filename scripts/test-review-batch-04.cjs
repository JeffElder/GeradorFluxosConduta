'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-colica-renal','adulto-crises-convulsivas','adulto-crise-hipertensiva'];
const files=['catalog.js','protocols.js','animal-flow.js','arrhythmia-ecg.js','arrhythmia-flow.js','obstetric-flow.js','hiv-tb-flow.js','review-batch-02.js','review-batch-03.js','review-batch-04.js','app.js'];
function app(id){const els=new Map(),listeners={};const get=k=>{if(!els.has(k))els.set(k,{innerHTML:'',dataset:{},focus(){},addEventListener(){}});return els.get(k)};const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){listeners[e]=f}},location:{hash:'#'+id,pathname:'/',search:''}};vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);return{p:c.window.PROTOCOLS[id],html:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return{dataset:{action,value}}}}})}};}
const report=[];
for(const id of ids){
 const p=app(id).p,paths=[];
 function walk(key,entry,trail,seen){if(seen.includes(key)){assert.equal(id,'adulto-crise-hipertensiva');assert.equal(key,'p1n4');paths.push({entry,trail,terminal:key,cycle:true});return;}const n=p.nodes[key];assert(n&&!n.incomplete,key);if(!n.choices.length){paths.push({entry,trail,terminal:key});return;}for(let i=0;i<n.choices.length;i++)walk(n.choices[i].to,entry,[...trail,{key,index:i}], [...seen,key]);}
 for(const e of p.entries)walk(e.to,e.to,[],[]);
 for(const route of paths){const ui=app(id);ui.click('entry',route.entry);for(const step of route.trail){assert(ui.html().dataset.feedbackStep.includes('Etapa: '+step.key+' '),step.key);const n=p.nodes[step.key];const html=ui.html().innerHTML.split('<details class="reference ')[0];assert.equal((html.match(/data-action="answer"/g)||[]).length,n.choices.length,step.key);if(n.question)assert(n.choices.length>=2,step.key);assert(!/conferir no texto integral|conforme o PDF|VER P\.[35]/i.test(html),step.key);ui.click('answer',String(step.index));}assert(ui.html().dataset.feedbackStep.includes('Etapa: '+route.terminal+' '));}
 report.push({id,paths:paths.length,terminals:[...new Set(paths.map(x=>x.terminal))]});
}
function edges(n,expected){for(const [k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}
const renal=app(ids[0]).p.nodes,sz=app(ids[1]).p.nodes,bp=app(ids[2]).p.nodes;
edges(renal,{p1n4:['p1n5'],p1n5:['p1n8','p1n12'],p1n12:['renal-imaging'],'renal-imaging':['p1n10','renal-xray'],'renal-xray':['p1n10'],p1n10:['p1n16','p1n18'],p1n18:['p1n20'],p1n20:['p1n22','p1n24'],p1n22:['renal-infection','renal-function','renal-both'],p1n16:['renal-recurring','renal-discharge']});
edges(sz,{'seizure-glucose':['seizure-correct-glucose','p1n5'],'seizure-correct-glucose':['p1n5'],p1n5:['p1n10','p1n12'],p1n10:['seizure-iv','seizure-no-iv'],'seizure-five':['seizure-repeat','p1n15'],'seizure-repeat':['seizure-five-again'],'seizure-five-again':['seizure-phenytoin','p1n15'],'seizure-phenytoin':['seizure-refractory'],'seizure-refractory':['seizure-intubation','p1n15'],p1n15:['p1n18','p1n20'],p1n20:['p1n22','p1n24'],p1n24:['p1n26','p1n28'],p1n28:['p1n29','p1n32'],p1n32:['p1n35'],p1n35:['p1n37','p1n39'],p1n39:['p1n40','p1n43']});
edges(bp,{p1n24:['p1n25'],p1n25:['p1n4','p1n26'],p1n4:['p1n6','p1n7'],p1n7:['p1n9','p1n11'],p1n11:['p1n12','p1n16'],p1n16:['p1n17','p1n20'],p1n20:['p1n22','p1n30'],p1n30:['p1n32','p1n36'],'htn-risk':['p1n4','htn-aps']});
assert.match(renal.p1n5.criteria,/OLIGÚRIA/);assert.match(renal.p1n10.criteria,/10MM/);assert.match(sz.p1n39.criteria,/40 ANOS/);assert.match(sz['seizure-refractory'].criteria,/60 minutos/);assert(!bp.p1n33.text.includes('5 A 10MCG/KG/MIN'));
console.log(JSON.stringify(report,null,2));console.log('PASS: lote 04; caminhos acíclicos completos e um retorno explícito de reavaliação. Ciclos ilimitados não enumeráveis; aresta de retorno e destino testados.');
