'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-evento-vascular-periferico-agudo','adulto-hematuria-macroscopica','adulto-hemorragia-digestiva'];
const files=['catalog.js','protocols.js','animal-flow.js','arrhythmia-ecg.js','arrhythmia-flow.js','obstetric-flow.js','psychiatric-flow.js','digestive-bleeding-flow.js','hiv-tb-flow.js','review-batch-02.js','review-batch-03.js','review-batch-04.js','review-batch-05.js','review-batch-06.js','review-batch-07.js','review-batch-08.js','review-batch-09.js','review-batch-10.js','app.js'];
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
const v=app(ids[0]).p.nodes,u=app(ids[1]).p.nodes,h=app(ids[2]).p.nodes;
edges(v,{p1n4:['p1n26'],p1n26:['p1n28','p1n23'],p1n23:['p1n24','p1n34'],p1n34:['p1n24','p1n31'],p1n31:['p1n32','p1n40'],p1n40:['p1n78','p1n39'],p1n39:['vasc-daop','vasc-venous','vasc-undefined']});
edges(u,{p1n5:['urine-vitc','urine-strip'],p1n8:['p1n10','p1n17'],p1n17:['p1n19','p1n12'],'urine-pain':['urine-tramadol','urine-samu'],p1n12:['p1n14','p1n22'],p1n14:['urine-uti','urine-stone','urine-sickle'],p1n25:['p1n26','p1n29'],p1n26:['urine-exercise','urine-menstrual','urine-recurrent-undefined'],p1n31:['p1n33','p1n36'],'urine-hb-retention':['urine-clm','urine-urology','urine-hb-border'],p1n36:['p1n40','p1n38'],'urine-glomerular-renal':['urine-dialysis','urine-clm'],p1n40:['urine-clm','urine-hb-normal-renal'],'urine-hb-normal-renal':['urine-nephrology','urine-hb-border']});
edges(h,{'hd-instability':['hd-emergency','hd-criteria'],'hd-criteria':['hd-emergency','hd-exams'],'bleed-o2':['bleed-give-o2','bleed-airway'],'bleed-airway':['bleed-iot','bleed-cirrhosis'],'bleed-cirrhosis':['bleed-ceftriaxone','bleed-samu'],'hd-score':['hd-high','hd-medium','hd-low','bleed-score-undefined']});
assert.match(v.p1n40.criteria,/Subtrair 2/);assert.match(v.p1n24.text,/mg\/kg/);assert(!/80MG\/KG/.test(v.p1n24.text));assert.match(u['urine-hb-retention'].text,/hemoglobina/);assert.match(h['hd-score'].criteria,/100–109/);assert.match(h['hd-exams'].text,/coagulograma/);
console.log(JSON.stringify(report,null,2));console.log('PASS lote 10: trajetórias completas e critérios documentais.');
