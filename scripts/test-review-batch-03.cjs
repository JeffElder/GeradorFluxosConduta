'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-avaliacao-do-paciente-com-tuberculose-na-upa','adulto-cefaleia','adulto-choque'];
const files=['catalog.js','protocols.js','animal-flow.js','arrhythmia-ecg.js','arrhythmia-flow.js','obstetric-flow.js','hiv-tb-flow.js','review-batch-02.js','review-batch-03.js','app.js'];
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
const tb=app(ids[0]).p.nodes,ce=app(ids[1]).p.nodes,sh=app(ids[2]).p.nodes;
edges(tb,{p1n4:['p1n5'],p1n5:['p1n7','p1n9'],p1n7:['tb-result'],p1n9:['tb-result'],'tb-result':['tb-sensitive','tb-repeat','tb-traces','tb-symptoms'],'tb-repeat':['tb-resistance'],'tb-resistance':['tb-resistant','tb-sensitive'],'tb-traces':['tb-traces-positive','tb-traces-repeat'],'tb-symptoms':['tb-investigate','tb-unlikely']});
edges(ce,{p1n5:['p1n7','p1n11'],p1n11:['p1n10','p1n9'],p1n9:['p1n23','p1n19'],p1n23:['p1n17'],p1n17:['p1n18','p1n19'],p1n18:['ceph-persistent-primary','p1n20'],p1n19:['p1n21','p1n20']});
edges(sh,{p2n4:['p2n5'],p2n5:['p2n8'],p2n8:['p2n10','p2n13'],p2n13:['p2n14','p2n17'],p2n17:['p2n20','p2n19'],p2n20:['p2n23','p2n12'],p2n23:['p2n24','p2n27'],p2n10:['shock-trauma','shock-bleed','shock-glucose','shock-other-volume'],p2n14:['shock-low-bp','shock-mid-bp','shock-high-bp'],p2n19:['shock-tamponade','shock-pneumothorax','shock-pe']});
assert.match(tb['tb-treatment'].criteria,/150\/75\/400\/275/);assert.match(tb['tb-resistant'].text,/resistência confirmada/i);assert.equal(tb['tb-resistant'].choices.length,0);
assert.match(ce.p1n11.criteria,/PIOR DOR DA VIDA/);assert.match(ce.p1n23.text,/CLORPROMAZINA/);
assert.match(sh.p2n5.text,/HEMOGRAMA/);assert.match(sh.p2n4.text,/4,5/);assert.match(sh.p2n27.text,/HIPOVOLÊMICO/);
console.log(JSON.stringify(report,null,2));console.log('PASS: lote 03, caminhos completos renderizados e correspondência documental.');
