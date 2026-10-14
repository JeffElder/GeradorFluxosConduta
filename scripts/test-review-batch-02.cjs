'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-atendimento-de-urgencia-ao-paciente-oncologico-ou-com-suspeita-oncologica','adulto-avaliacao-do-paciente-com-hiv-e-tuberculose-na-upa','adulto-avaliacao-do-paciente-com-hiv-na-upa'];
const files=['catalog.js','protocols.js','animal-flow.js','arrhythmia-ecg.js','arrhythmia-flow.js','obstetric-flow.js','hiv-tb-flow.js','review-batch-02.js','app.js'];
function app(id){const els=new Map(),listeners={};const get=k=>{if(!els.has(k))els.set(k,{innerHTML:'',dataset:{},focus(){},addEventListener(){}});return els.get(k)};const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){listeners[e]=f}},location:{hash:'#'+id,pathname:'/',search:''}};vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);return{p:c.window.PROTOCOLS[id],html:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return{dataset:{action,value}}}}})}};}
const report=[];
for(const id of ids){
 const p=app(id).p,paths=[];
 function walk(key,entry,trail,seen){assert(!seen.includes(key),'Unexpected cycle '+key);const n=p.nodes[key];assert(n&&!n.incomplete,key);if(!n.choices.length){paths.push({entry,trail,terminal:key});return;}for(let i=0;i<n.choices.length;i++)walk(n.choices[i].to,entry,[...trail,{key,index:i}], [...seen,key]);}
 for(const e of p.entries)walk(e.to,e.to,[],[]);
 for(const route of paths){const ui=app(id);ui.click('entry',route.entry);for(const step of route.trail){assert(ui.html().dataset.feedbackStep.includes('Etapa: '+step.key+' '),step.key);const n=p.nodes[step.key];const html=ui.html().innerHTML.split('<details class="reference ')[0];assert.equal((html.match(/data-action="answer"/g)||[]).length,n.choices.length,step.key);if(n.question)assert(n.choices.length>=2,step.key);assert(!/conferir no texto integral|conforme o PDF|VER P\.[35]/i.test(html),step.key);ui.click('answer',String(step.index));}assert(ui.html().dataset.feedbackStep.includes('Etapa: '+route.terminal+' '));}
 report.push({id,paths:paths.length,terminals:[...new Set(paths.map(x=>x.terminal))]});
}
const onc=app(ids[0]).p.nodes,hiv=app(ids[2]).p.nodes,tb=app(ids[1]).p.nodes;
function edges(n,expected){for(const [k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}
edges(onc,{p1n4:['p1n9','p1n15'],p1n15:['p1n5','p1n18'],p1n18:['p1n20','p1n23'],p1n23:['p1n25','p1n28'],p1n28:['p1n31','p1n30'],p1n31:['p1n34'],p1n30:['p1n36']});
edges(hiv,{p1n4:['p1n5'],p1n5:['p1n29','review-hiv-outside'],p1n29:['p1n7'],p1n7:['p1n8','p1n10'],p1n10:['p1n12'],p1n12:['p1n19','p1n14'],p1n19:['p1n21','p1n23'],p1n23:['p1n25','p1n26']});
edges(tb,{'tb-hiv-status':['tb-hiv-current','tb-hiv-abandoned','tb-hiv-new'],'tb-hiv-current':['tb-hiv-discharge'],'tb-hiv-abandoned':['tb-hiv-cd4'],'tb-hiv-new':['tb-hiv-cd4'],'tb-hiv-cd4':['tb-hiv-early','tb-hiv-later','tb-hiv-review'],'tb-hiv-discharge':['tb-hiv-admit','tb-hiv-street','tb-hiv-aps']});
assert.match(onc.p1n4.criteria,/>30 irpm/);assert(onc.p1n28.question);
assert.match(hiv.p1n14.text,/3217-1283/);assert.match(hiv.p1n10.text,/creatinina/i);
for(const k of ['tb-hiv-new','tb-hiv-abandoned']){assert.match(tb[k].text,/150\/75\/400\/275/);assert.match(tb[k].text,/MANUTENÇÃO, 4 MESES/);assert.match(tb[k].text,/acima de 70 kg, 5/)}
assert.match(tb['tb-hiv-cd4'].criteria,/ambas as linhas/);
console.log(JSON.stringify(report,null,2));console.log('PASS: lote 02, todos os caminhos completos, opções renderizadas, setas da fonte e conteúdos críticos.');
