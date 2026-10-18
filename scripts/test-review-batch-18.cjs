'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-tromboembolismo-pulmonar','adulto-urgencias-dialiticas','adulto-urgencias-odontologicas'];
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
  if(/conferir no texto integral|conforme o PDF|VER P\.[35]/i.test(html)){fs.writeFileSync('/tmp/bad18.html',html);assert(false,id+'/'+key);}
  if(n.supportTables)for(const table of n.supportTables)for(const row of table.rows)for(const cell of row){const escaped=cell.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\"','&quot;').replaceAll("'",'&#39;');assert(html.includes(escaped),id+'/'+key+' table cell '+cell);}
  if(trail.some(step=>step.key===key)||!n.choices.length){visited.push(JSON.stringify({trail,terminal:key}));return;}
  if(n.question)assert(n.choices.length>=2,key);
  for(let i=0;i<n.choices.length;i++){
   if(id===ids[0]&&['p1n63','tep-reassess'].includes(key)){
    for(const f of ['dvt','likely','pulse','immob','previous','blood','cancer'])ui.fillScore('wells_pe',f,'0');
    if(key==='p1n63'&&i===1)ui.fillScore('wells_pe','dvt','1');
    if(key==='p1n63'&&i===2||key==='tep-reassess'&&i===0)for(const f of ['dvt','likely','pulse'])ui.fillScore('wells_pe',f,'1');
   }
   if(id===ids[0]&&key==='p1n39'){
    for(const f of ['age','pulse','hemoptysis','trauma','vte','estrogen','oxygen','swelling'])ui.fillScore('perc',f,'0');
    if(i===1)ui.fillScore('perc','age','1');if(i===2)ui.fillScore('perc','trauma','2');
   }
   ui.click('answer',String(i));walkUI(n.choices[i].to,[...trail,{key,index:i}]);
   ui.click('back');assert(ui.html().dataset.feedbackStep.includes('Etapa: '+key+' '),'Back '+key);
  }
 }
 for(const entry of p.entries){ui.click('restart');ui.click('protocol',id);ui.click('entry',entry.to);walkUI(entry.to,[]);}
 assert.deepEqual(visited,paths.map(({trail,terminal})=>JSON.stringify({trail,terminal})),id+' all paths rendered');
 report.push({id,paths:paths.length,terminals:[...new Set(paths.filter(x=>!x.cycle).map(x=>x.terminal))],cycleClosures:paths.filter(x=>x.cycle).length});
}
function edges(n,expected){for(const[k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}
const te=app(ids[0]),n=te.p.nodes,r=app(ids[1]).p.nodes,d=app(ids[2]).p.nodes,sc=te.context.window.SCORE_CALCULATORS;
edges(n,{'p1n7':['tep-reassess'],'tep-reassess':['tep-severe-samu','tep-severe-pending'],'p1n63':['p1n67','p1n72','p1n74'],'p1n39':['p1n40','p1n77','tep-perc-pending'],'p1n80':['p1n40','p1n9','tep-ddimer-pending'],'p1n9':['tep-heparin-contra'],'tep-heparin-contra':['tep-heparin','tep-heparin-contra-end','tep-heparin-pending']});
for(const v of ['FR >30','SpO₂ <90%','PAS <90'])assert(n.p1n4.criteria.includes(v));for(const v of ['SpO₂ >92%','88–92%'])assert(n.p1n7.text.includes(v));assert.match(n['tep-heparin'].text,/70 UI\/kg/);assert.match(n['tep-heparin'].text,/4\.000 UI/);assert.match(n['tep-heparin'].text,/18U\/KH\/H/);assert.match(n.p1n80.criteria,/FEU\/DDU/);
for(const v of ['PaO₂ <80','PaCO₂ <33','S1Q3T3','Hampton','72 h'])assert(n.p1n77.text.includes(v));
let perc=0,wells=0;
const fields=['age','pulse','hemoptysis','vte','estrogen','oxygen','swelling'];
for(let bits=0;bits<128;bits++)for(let trauma=0;trauma<3;trauma++){let sum=0,v={trauma:String(trauma)};fields.forEach((k,i)=>{v[k]=String((bits>>i)&1);sum+=Number(v[k]);});const result=sc.calculate('perc',v,'p1n39');assert(result.complete);assert.equal(result.min,sum+(trauma===1?1:0));assert.equal(result.max,sum+(trauma===0?0:1));assert.equal(result.answer,result.min>=1?1:result.max===0?0:null);perc++;}
for(let bits=0;bits<128;bits++){const keys=['dvt','likely','pulse','immob','previous','blood','cancer'],weights=[3,3,1.5,1.5,1.5,1,1],v={};let sum=0;keys.forEach((k,i)=>{v[k]=String((bits>>i)&1);sum+=Number(v[k])*weights[i];});let result=sc.calculate('wells_pe',v,'tep-reassess');assert.equal(result.score,sum);assert.equal(result.answer,sum>6?0:1);assert(sc.allowed('wells_pe','tep-reassess',v,result.answer));assert(!sc.allowed('wells_pe','tep-reassess',v,1-result.answer));wells++;}
assert(!sc.calculate('perc',{},'p1n39').complete);
edges(r,{'p1n6':['p1n8','p1n6-nao','dial-criteria-pending'],'p1n11':['dial-obstruction'],'dial-obstruction':['p1n12','p1n14','p1n14'],'p1n12':['p1n13','p1n14']});
assert.equal(r['p1n6-nao'].supportTables[0].rows.length,15);assert.equal(r['p1n6-nao'].supportTables[1].rows.length,13);assert.equal(r.p1n6.supportTables[0].rows.length,8);
for(const v of ['>200','>4','ASSOCIADA','pericardite','crise convulsiva'])assert(r.p1n6.criteria.includes(v));
for(const v of ['PAS >90','PAM >70','0,5–2 mg/kg','0,3-,06','10 UI de insulina regular +100 mL','10–20 mL IV em20 min','prednisona1 mg/kg/dia','3350-4980'])assert(r.p1n8.text.includes(v),v);
for(const v of ['50–100%','100–200%','>200%','≥0,3 mg/dL','anúria>12 h','exato500'.toLowerCase()])assert(r['dial-initial'].text.toLowerCase().includes(v.toLowerCase()));
assert.match(r.p1n8.text,/Dopamina em dose renal: NÃO FAZER/);
edges(d,{'p1n32':['dental-drain','dental-clm']});
for(const v of ['Meningismo','TEC>3 s','estridor','gangrena','crepitação'])assert(d.p1n4.criteria.includes(v));assert.match(d.p1n8.criteria,/2º\/3ºmolar/);assert.match(d.p1n17.criteria,/voz abafada/);
for(const id of ['p1n6','p1n11','p1n26','p1n23','dental-clm'])for(const v of ['30 mL/kg','primeiras3 h','dexametasona2 mg/mL','2 g IV1×/dia','100 mg/kg/dia','500 mg IV de8/8h','40 mg/kg/dia','diazepam5 mg VO'])assert(d[id].text.includes(v),id+v);
assert.match(d['dental-drain'].text,/amoxicilina500 mg de8\/8h por7 dias/);
for(const id of ['p1n26','p1n23','dental-clm','dental-drain','p1n34'])for(const v of ['08h–18h','19h–23h','09h–18h','19h–07h','reimplante','alveolite'])assert(d[id].text.includes(v));
console.log(JSON.stringify(report,null,2));console.log('PASS lote18: todas as trajetórias, '+perc+' combinações PERC e '+wells+' Wells pós-manejo, critérios, todos os quadros renais e manejo/horários odontológicos.');
