'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-ictericia-no-adulto','adulto-infeccao-do-trato-urinario-em-gestantes','adulto-infeccao-do-trato-urinario'];
const files=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="\.\/([^"?]+)(?:\?[^" ]*)?"/g)].map(m=>m[1]).filter(f=>!['feedback.js','animal-photos.js'].includes(f));
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

const j=app(ids[0]).p.nodes,g=app(ids[1]).p.nodes,u=app(ids[2]).p.nodes;
edges(j,{p1n13:['ict-anemia','ict-gilbert','ict-both','ict-indirect-other'],p1n29:['ict-viral','ict-cholestasis','ict-lab-gap'],p1n31:['ict-cholestasis','ict-neoplasm','ict-evolution-gap'],'ict-maddrey':['ict-prednisone','ict-alcohol-enceph','ict-maddrey-pending'],'ict-viral-enceph':['ict-finish','ict-viral-fulminant-low','ict-viral-fulminant-high'],'ict-paracetamol':['ict-toxic','ict-samu']});
edges(g,{'ob-pyelo':['preg-hydration'],'preg-hydration':['preg-fluid','preg-pain'],'preg-pain':['preg-analgesia','preg-vomit'],'preg-vomit':['preg-antiemetic','preg-referral'],'preg-strip':['preg-culture','preg-strip-gap'],'preg-antibiotic':['preg-fosfomycin','preg-weeks','preg-cephalexin'],'preg-weeks':['preg-nitrofurantoin','preg-weeks-gap']});
edges(u,{'uti-catheter':['uti-catheter-follow','p1n8'],p1n23:['uti-pyelo-drug'],p1n30:['uti-risk-syndrome'],p1n28:['uti-low-syndrome'],'uti-doxy-risk':['uti-follow'],'uti-urethritis-risk':['uti-follow']});
assert.match(j['ict-alcohol'].text,/TGO\/TGP ≥2/);assert.match(j['ict-maddrey'].criteria,/4,6/);assert.match(j['ict-viral-enceph'].criteria,/descerebração/);assert.match(j['ict-fulminant-high'].text,/30°/);
assert.match(g['preg-fosfomycin'].text,/50–75/);assert.match(g['preg-nitrofurantoin'].text,/36 semanas/);assert.match(g['ob-cystitis-final'].text,/sonolência excessiva/);
assert.match(u.p1n23.text,/10–14/);assert.match(u.p1n23.text,/7–10/);assert.match(u.p1n30.text,/hemocultura/);assert.match(u['uti-follow'].text,/48 h/);
assert.match(app(ids[0]).p.nodes['ict-lepto'].text,/leptospirose/);
console.log(JSON.stringify(report,null,2));console.log('PASS lote 11: trajetórias completas na interface e critérios documentais.');
