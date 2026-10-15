'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-sindromes-coronarianas'];
const files=['catalog.js','protocols.js','animal-flow.js','arrhythmia-ecg.js','arrhythmia-flow.js','obstetric-flow.js','psychiatric-flow.js','digestive-bleeding-flow.js','hiv-tb-flow.js','review-batch-02.js','review-batch-03.js','review-batch-04.js','review-batch-05.js','review-batch-06.js','review-batch-07.js','review-batch-08.js','review-batch-09.js','review-batch-10.js','coronary-pain-review.js','app.js'];
function app(id){const els=new Map(),listeners={};const get=k=>{if(!els.has(k))els.set(k,{innerHTML:'',dataset:{},focus(){},addEventListener(){}});return els.get(k)};const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){listeners[e]=f}},location:{hash:'#'+id,pathname:'/',search:''}};vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);return{p:c.window.PROTOCOLS[id],html:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return{dataset:{action,value}}}}})}};}
const report=[];
for(const id of ids){
 const p=app(id).p,paths=[];
 function walk(key,entry,trail,seen){assert(!seen.includes(key),'Unexpected cycle '+key);const n=p.nodes[key];assert(n&&!n.incomplete,key);if(!n.choices.length){paths.push({entry,trail,terminal:key});return;}for(let i=0;i<n.choices.length;i++)walk(n.choices[i].to,entry,[...trail,{key,index:i}], [...seen,key]);}
 for(const e of p.entries)walk(e.to,e.to,[],[]);
 for(const route of paths){const ui=app(id);ui.click('entry',route.entry);for(const step of route.trail){assert(ui.html().dataset.feedbackStep.includes('Etapa: '+step.key+' '),step.key);const n=p.nodes[step.key];const html=ui.html().innerHTML.split('<details class="reference ')[0];assert.equal((html.match(/data-action="answer"/g)||[]).length,n.choices.length,step.key);if(n.question)assert(n.choices.length>=2,step.key);if(step.key.startsWith('cor-'))assert(!/consultar o PDF|conferir no texto integral/i.test(html),step.key);ui.click('answer',String(step.index));}assert(ui.html().dataset.feedbackStep.includes('Etapa: '+route.terminal+' '));}
 report.push({id,paths:paths.length,terminals:[...new Set(paths.map(x=>x.terminal))]});
}
const p=app(ids[0]).p,n=p.nodes;
assert.equal(p.entries[0].to,'p1n7');assert.equal(n.p1n7.text,'SUSPEITA DE SÍNDROME CORONARIANA?');assert.equal(n.p1n7.choices[1].to,'p1n9');
for(let bits=0;bits<8;bits++){const answers=Array.from({length:3},(_,i)=>(bits>>i)&1);let key='cor-pain-location';for(const yes of answers)key=n[key].choices[yes?0:1].to;assert.equal(key,'cor-pain-type-'+answers.reduce((a,b)=>a+b,0));assert.equal(n[key].choices[0].to,'cor-risk-count');}
for(let i=0;i<3;i++){assert.equal(n['cor-risk-count'].choices[i].to,'cor-risk-'+i);assert.equal(n['cor-risk-'+i].choices[0].to,'p1n6');}
for(const term of ['HAS','DM','dislipidemia','IMC >30','sedentarismo','menos de 3 meses','mãe ou irmã','65 anos','pai ou irmão','55 anos'])assert(n['cor-risk-count'].text.includes(term),term);
assert.match(n['very-high-risk'].text,/aterosclerótica prévia/);assert.match(n['very-high-risk'].text,/PAS <90/);assert.match(n['heart-risk'].criteria,/Não usar apenas/);
console.log(JSON.stringify(report,null,2));console.log('PASS: 8 combinações de dor, 3 faixas de risco e todos os caminhos de navegação após a alteração.');
