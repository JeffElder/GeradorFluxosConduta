'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-deficit-focal-agudo','adulto-delirium','adulto-descompensacao-aguda-da-insuficiencia-cardiaca'];
const files=['catalog.js','protocols.js','animal-flow.js','arrhythmia-ecg.js','arrhythmia-flow.js','obstetric-flow.js','hiv-tb-flow.js','review-batch-02.js','review-batch-03.js','review-batch-04.js','review-batch-05.js','app.js'];
function app(id){const els=new Map(),listeners={};const get=k=>{if(!els.has(k))els.set(k,{innerHTML:'',dataset:{},focus(){},addEventListener(){}});return els.get(k)};const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){listeners[e]=f}},location:{hash:'#'+id,pathname:'/',search:''}};vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);return{p:c.window.PROTOCOLS[id],html:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return{dataset:{action,value}}}}})}};}
const report=[];
for(const id of ids){
 const p=app(id).p,paths=[];
 function walk(key,entry,trail,seen){assert(!seen.includes(key),'Unexpected cycle '+key);const n=p.nodes[key];assert(n&&!n.incomplete,key);if(!n.choices.length){paths.push({entry,trail,terminal:key});return;}for(let i=0;i<n.choices.length;i++)walk(n.choices[i].to,entry,[...trail,{key,index:i}], [...seen,key]);}
 for(const e of p.entries)walk(e.to,e.to,[],[]);
 for(const route of paths){const ui=app(id);ui.click('entry',route.entry);for(const step of route.trail){assert(ui.html().dataset.feedbackStep.includes('Etapa: '+step.key+' '),step.key);const n=p.nodes[step.key];const html=ui.html().innerHTML.split('<details class="reference ')[0];assert.equal((html.match(/data-action="answer"/g)||[]).length,n.choices.length,step.key);if(n.question)assert(n.choices.length>=2,step.key);assert(!/conferir no texto integral|conforme o PDF|VER P\.[35]/i.test(html),step.key);ui.click('answer',String(step.index));}assert(ui.html().dataset.feedbackStep.includes('Etapa: '+route.terminal+' '));}
 report.push({id,paths:paths.length,terminals:[...new Set(paths.map(x=>x.terminal))]});
}
function edges(n,expected){for(const [k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}
const f=app(ids[0]).p.nodes,d=app(ids[1]).p.nodes,h=app(ids[2]).p.nodes;
edges(f,{p1n4:['focal-bell'],'focal-bell':['p1n23','p1n5'],p1n5:['p1n6','p1n8'],p1n8:['p1n9','p1n10'],p1n10:['p1n12','p1n11'],p1n11:['focal-duration'],'focal-duration':['focal-clm','focal-hospital','focal-time-undefined'],p1n15:['p1n25','p1n15-sim'],p1n25:['p1n16','p1n24']});
edges(d,{p1n9:['p1n10','delirium-unconfirmed'],p1n10:['p2n5'],p2n5:['p2n7','p2n9'],p2n9:['p2n11','p2n14'],p2n14:['p2n16','p2n18'],p2n18:['p2n20','p2n23'],p2n23:['p2n27','del-depression-aps','del-depression-caps','del-scale-undefined'],p2n27:['p2n28','p2n31']});
edges(h,{p1n5:['p1n7','p1n9'],p1n9:['p1n10','p1n13'],p1n13:['p1n14','p1n17'],p1n17:['p1n18','p1n52'],p1n52:['p1n34','hf-bp-undefined'],p1n34:['p1n37','p1n35'],p1n37:['p1n38','p1n42'],p1n42:['p1n43','p1n46'],'hf-after-volume':['p1n46','p1n35','hf-volume-undefined'],'hf-low-output':['hf-monitor','hf-dobutamine'],'hf-b-breathing':['hf-vni','hf-monitor']});
assert.match(f.p1n4.text,/CINCINNATI/);assert.equal(f.p1n4.contextNodes.length,16);assert.match(f.p1n22.text,/SÓDIO/);
assert.match(d.p2n23.criteria,/15\./);assert.match(d.p2n23.criteria,/Sim=0; Não=1/);assert.equal(app(ids[1]).p.entries.length,1);
assert.match(h.p1n5.criteria,/FRAMINGHAM/);assert.match(h.p1n35.text,/6–12 h/);assert.match(h.p1n43.text,/concentração/);
console.log(JSON.stringify(report,null,2));console.log('PASS: lote 05, todos os caminhos completos, critérios, escalas textuais e decisões documentais.');
