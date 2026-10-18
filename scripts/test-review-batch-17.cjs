'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-tontura','adulto-traumatismo-cranio-encefalico','adulto-traumatismo-ortopedico'];
const files=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="\.\/([^"?]+)(?:\?[^" ]*)?"/g)].map(m=>m[1]).filter(f=>!['feedback.js','animal-photos.js'].includes(f));
function app(id){const els=new Map(),listeners={};const get=k=>{if(!els.has(k))els.set(k,{innerHTML:'',dataset:{},focus(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []}});return els.get(k)};const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){listeners[e]=f}},location:{hash:'#'+id,pathname:'/',search:''}};vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8').replace("let irisAnswers=Array(IRIS_FIELDS.length).fill('');","let irisAnswers=Array(IRIS_FIELDS.length).fill('');window.__irisTest={set(v){irisAnswers=v},score:irisScore};"),c);return{context:c,fillHeart(key,value){listeners.change({target:{dataset:{heart:key},value,matches:s=>s==='[data-heart]'}})},fillScore(key,field,value){listeners.change({target:{dataset:{score:key,field},value,matches:s=>s==='[data-score]'}})},iris(i){const v=Array(12).fill('0');if(i===1)v[0]=v[3]=v[4]='1';if(i===2)v[11]='1';c.window.__irisTest.set(v)},p:c.window.PROTOCOLS[id],html:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return{dataset:{action,value}}}}})}};}
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
const d=app(ids[0]).p.nodes,h=app(ids[1]),t=h.p.nodes,o=app(ids[2]).p;
edges(d,{'p1n11':['diz-after-vitals'],'diz-after-vitals':['p1n10','diz-vital-end'],'p1n23':['diz-reassessment'],'diz-reassessment':['p1n24','diz-ct'],'diz-ct':['diz-ct-result'],'diz-ct-result':['diz-hospital','diz-ct-pending']});
assert.match(d.p1n10.criteria,/FC >150/);assert.match(d.p1n10.criteria,/FC <35/);assert.match(d.p1n4.criteria,/Romberg positivo/);assert.match(d.p1n4.criteria,/vertical ou oscilatório/);assert.match(d.p1n23.text,/10ML\/ML/);assert.match(d['diz-reassessment'].text,/até 2 horas/);assert.match(d.p1n24.text,/PARKINSONISMO E DEPRESSÃO/);
edges(t,{'tce-age':['p1n5','tce-gcs-child'],'p1n5':['p1n28','p1n6'],'p1n39':['tce-fcc','p1n34'],'p1n48':['tce-after-observation'],'tce-after-observation':['p1n34','p1n6','tce-observation-pending']});
assert.match(t['tce-initial'].text,/XABCDE/);for(const value of ['≤8','≤13','20–30 mL/kg','30°','hipovolemia'])assert(t.p1n6.text.includes(value));assert.match(t.p1n28.criteria,/idade <2 anos/);assert.match(t.p1n31.criteria,/parieto-temporal/);
for(const id of ['p1n34','tce-fcc'])for(const value of ['48 h','a cada 3 h','>37,8°C','líquido/sangue','pupilas diferentes','Evitar sedativos'])assert(t[id].text.includes(value),id+value);assert.match(t['tce-fcc'].text,/5 dias na APS/);
const scores=h.context.window.SCORE_CALCULATORS;assert(scores.matches(ids[1],t['tce-gcs-child']).includes('gcs_child'));assert(!scores.matches(ids[1],t['tce-gcs-child']).includes('gcs'));assert(scores.matches(ids[1],t.p1n5).includes('gcs'));
let combos=0;for(let e=0;e<4;e++)for(let v=0;v<5;v++)for(let m=0;m<6;m++){const r=scores.calculate('gcs_child',{eye:String(e),verbal:String(v),motor:String(m)},'tce-gcs-child');assert(r.complete);assert.equal(r.score,e+v+m+3);combos++;}
for(const field of ['eye','verbal','motor'])assert(!scores.calculate('gcs_child',{eye:'0',verbal:'0',motor:'0',[field]:''},'tce-gcs-child').complete);
for(const [field,nt]of [['eye','4'],['verbal','5'],['motor','6']])assert(!scores.calculate('gcs_child',{eye:'0',verbal:'0',motor:'0',[field]:nt},'tce-gcs-child').complete);
const repeat=app(ids[0]);repeat.click('protocol',ids[0]);for(let i=0;i<3;i++){repeat.click('answer','0');repeat.click('answer','0');repeat.click('answer','0');assert(repeat.html().dataset.feedbackStep.includes('Etapa: p1n10 '));}repeat.click('answer','1');assert(repeat.html().dataset.feedbackStep.includes('Etapa: p1n4 '));
assert.equal(o.entries.length,11);assert.equal(o.nodes.p1n21.choices.length,10);assert.equal(o.nodes['ort-open-class'].choices.length,7);
for(let page=3;page<=10;page++){let nodes=Object.values(o.nodes).filter(n=>n.page===page);assert(nodes.some(n=>n.choices.some(c=>c.to==='p2n7')),'Exposed fracture link '+page);}
edges(o.nodes,{'p4n17':['ort-reduce-4','ort-refer-4'],'p5n18':['ort-reduce-5','ort-refer-5'],'p6n15':['ort-reduce-6','ort-refer-6'],'p9n15':['ort-reduce-9','ort-refer-9'],'p8n28':['ort-unstable-8','ort-stable-8'],'p9n30':['ort-unstable-9','ort-stable-9'],'p10n28':['ort-unstable-10','ort-stable-10'],'p11n25':['ort-cervical-refer','ort-cervical-home']});
for(const value of ['30 min','>40 km/h','>4 m'])assert((o.nodes.p1n5.criteria+' '+o.nodes.p1n16.criteria).replace('30min','30 min').includes(value));
for(const value of ['cefazolina','gentamicina','penicilina cristalina'])assert(Object.values(o.nodes).some(n=>n.text.toLowerCase().includes(value)));
assert.match(o.nodes['ort-open-rural'].text,/100\.000 UI\/kg/);assert.match(o.nodes['ort-open-iii'].text,/5–7 mg\/kg/);assert.match(o.nodes.p11n9.text,/0,1–2 mcg\/kg\/min/);assert.match(o.nodes.p11n9.text,/30 mg\/kg IV/);assert.match(o.nodes.p11n9.text,/5,4 mg\/kg\/h/);assert.match(o.nodes['ort-unstable-8'].text,/4–6 semanas/);assert.match(o.nodes['ort-unstable-9'].text,/2–3 semanas/);assert.match(o.nodes['ort-toe-dislocation'].text,/4 semanas/);
for(const file of Object.values(o.media.files)){assert(fs.existsSync(path.join(root,file.src)));assert(file.width>0&&file.height>0);}
// Every home endpoint contains the actual return precautions, not an instruction to open a PDF.
for(const n of Object.values(o.nodes).filter(n=>!n.choices.length&&/Tratamento domiciliar/.test(n.text)))for(const value of ['48 h','cianóticas','movimentar o membro','formigamento'])assert(n.text.includes(value),n.id+value);
console.log(JSON.stringify(report,null,2));console.log('PASS lote 17: todas as trajetórias de três documentos, ciclo de reavaliação, '+combos+' Glasgow pediátricos, manejo/antibióticos/contraindicações e nove painéis originais.');
