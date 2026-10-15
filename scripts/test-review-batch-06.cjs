'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-desospitalizacao-acionamento-do-saude-em-casa','adulto-diarreia-aguda','adulto-doencas-anorretais'];
const files=['catalog.js','protocols.js','animal-flow.js','arrhythmia-ecg.js','arrhythmia-flow.js','obstetric-flow.js','hiv-tb-flow.js','review-batch-02.js','review-batch-03.js','review-batch-04.js','review-batch-05.js','review-batch-06.js','app.js'];
function app(id){const els=new Map(),listeners={};const get=k=>{if(!els.has(k))els.set(k,{innerHTML:'',dataset:{},focus(){},addEventListener(){}});return els.get(k)};const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){listeners[e]=f}},location:{hash:'#'+id,pathname:'/',search:''}};vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);return{p:c.window.PROTOCOLS[id],html:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return{dataset:{action,value}}}}})}};}
const report=[];
for(const id of ids){
 const p=app(id).p,paths=[];
 function walk(key,entry,trail,seen){if(seen.includes(key)){assert.equal(id,ids[1]);assert.equal(key,'p1n5');paths.push({entry,trail,terminal:key});return;}const n=p.nodes[key];assert(n&&!n.incomplete,key);if(!n.choices.length){paths.push({entry,trail,terminal:key});return;}for(let i=0;i<n.choices.length;i++)walk(n.choices[i].to,entry,[...trail,{key,index:i}], [...seen,key]);}
 for(const e of p.entries)walk(e.to,e.to,[],[]);
 for(const route of paths){const ui=app(id);ui.click('entry',route.entry);for(const step of route.trail){assert(ui.html().dataset.feedbackStep.includes('Etapa: '+step.key+' '),step.key);const n=p.nodes[step.key];const html=ui.html().innerHTML.split('<details class="reference ')[0];assert.equal((html.match(/data-action="answer"/g)||[]).length,n.choices.length,step.key);if(n.question)assert(n.choices.length>=2,step.key);assert(!/conferir no texto integral|conforme o PDF|VER P\.[35]/i.test(html),step.key);ui.click('answer',String(step.index));}assert(ui.html().dataset.feedbackStep.includes('Etapa: '+route.terminal+' '));}
 report.push({id,paths:paths.length,terminals:[...new Set(paths.map(x=>x.terminal))]});
}
function edges(n,expected){for(const [k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}
const h=app(ids[0]).p.nodes,d=app(ids[1]).p.nodes,a=app(ids[2]).p.nodes;
edges(h,{'sad-inclusion':['sad-exclusion','p2n11'],'sad-exclusion':['p2n11','sad-profile'],'sad-profile':['p2n9','p2n11'],p2n9:['p1n4'],p1n11:['p1n13','p1n14'],p1n21:['p1n21-weekday','p1n21-weekend'],p1n23:['p1n23-weekday','p1n23-weekend']});
edges(d,{p1n7:['p1n8','p1n15'],p1n15:['p1n16','p1n5'],'diarrhea-rx':['diarrhea-samu','diarrhea-rx-undefined'],p1n5:['p1n11','p1n17'],p1n11:['p1n5'],'diarrhea-antibiotic':['diarrhea-regimen','diarrhea-duration'],'diarrhea-regimen':['diarrhea-travel','diarrhea-smztmp'],'diarrhea-duration':['diarrhea-aps','diarrhea-home']});
edges(a,{p1n4:['p1n5','p1n8'],p1n8:['p1n10','p1n12'],p1n12:['p1n18','ano-diagnosis'],p1n28:['ano-conservative','ano-conservative','ano-grade3','ano-grade4'],'ano-abscess':['ano-technical','ano-cellulitis'],'ano-technical':['ano-drain','ano-cellulitis'],'ano-cellulitis':['ano-antibiotic','ano-surgery']});
for(const drug of ['Amicacina','Gentamicina','Cefepima','Ceftazidima','Ceftriaxona','Meropenem','Vancomicina','Ciprofloxacino','Levofloxacino'])assert(h['sad-antibiotics'].text.includes(drug));
assert.match(h.p1n5.text,/PARECER MÉDICO SAD/);assert.match(d.p1n11.text,/FUNÇÃO RENAL/);assert.match(a.p1n12.criteria,/ABSCESSOS PERIANAIS/);assert.match(a['ano-antibiotic'].text,/OU/);
console.log(JSON.stringify(report,null,2));console.log('PASS lote 06: trajetórias e retorno de reavaliação exercitados na interface.');
