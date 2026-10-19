'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['infantil-sindrome-inflamatoria-multissistemica-pediatrica','infantil-farmacodermias','infantil-febre-em-pediatria'];
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
  if(/conferir no texto integral|conforme o PDF|VER P\.[35]/i.test(html)){fs.writeFileSync('/tmp/bad19.html',html);assert(false,id+'/'+key);}
  if(n.supportTables)for(const table of n.supportTables)for(const row of table.rows)for(const cell of row){const escaped=cell.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\"','&quot;').replaceAll("'",'&#39;');assert(html.includes(escaped),id+'/'+key+' table cell '+cell);}
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

const simp=app(ids[0]),s=simp.p.nodes;
function edges(expected){for(const[k,v]of Object.entries(expected))assert.deepEqual(Array.from(s[k].choices,c=>c.to),v,k)}
edges({'p1n4':['p1n9'],'p1n9':['p1n11','p1n16'],'p1n11':['simp-samu-kaw'],'p1n16':['p1n14','p1n14','p1n17','simp-kaw-pending'],'p1n14':['simp-samu-asa-kaw'],'p1n17':['p1n20'],'p1n20':['p1n22','p1n24'],'p1n24':['p1n26','p1n28','simp-crp-pending'],'p1n26':['simp-clm-kaw'],'simp-samu-kaw':['simp-samu-asa-kaw','simp-samu-asa-no','simp-samu-asa-pending'],'simp-clm-kaw':['simp-clm-asa-kaw','simp-clm-asa-no','simp-clm-asa-pending']});
assert.match(s.p1n4.text,/0–21anos/);assert.match(s.p1n4.text,/≥38°Cpor≥3dias/);assert.equal(s.p1n4.supportTables[0].rows.length,8);assert.equal(s.p1n4.supportTables[1].rows.length,10);assert(s.p1n16.supportTables,'all Kawasaki criteria visible where asked');
for(const id of ['p1n11','p1n14','p1n26']){assert.match(s[id].text,/20mL\/kgem30min/);assert.match(s[id].text,/2mg\/kg\/DIA IVdivididos12\/12h/);assert.match(s[id].text,/não2mg\/kgpor tomada/);}
for(const dest of ['samu','clm']){assert.match(s['simp-'+dest+'-asa-kaw'].text,/30–50mg\/kg\/DIA VOdivididos6\/6h/);assert.match(s['simp-'+dest+'-asa-no'].text,/3–5mg\/kg\/DIA VO/);}
assert.match(s.p1n22.text,/COINFECÇÃOÉPOSSÍVEL/);assert.match(s.p1n24.criteria,/não fornece corte numérico/);assert.match(s.p1n28.text,/24–48h/);assert.match(s.p1n28.text,/sem extrapolar automaticamente/);
const before={window:{}};vm.createContext(before);for(const f of files.filter(f=>!['review-batch-25.js','app.js'].includes(f)))vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),before);
for(const id of ids.slice(1)){const old=JSON.parse(JSON.stringify(before.window.PROTOCOLS[id])),now=JSON.parse(JSON.stringify(app(id).p));if(id===ids[2]){const added=now.nodes.p1n16.linkedEntries.pop();assert.equal(added.protocol,'infantil-pneumonia-em-pediatria');assert.equal(added.entry,'p2n4');}assert.deepEqual(now,old,id+' previous valid corrections preserved');}
const d=app(ids[1]).p.nodes,f=app(ids[2]).p.nodes;
for(const [id,token]of [['sjs','1–15 dias'],['dress','2–8 semanas'],['pega','2 dias–2 semanas'],['eritrodermia','1–4 semanas'],['exantema','1–2 semanas'],['urticaria','Minutos–2 semanas'],['eritema','três zonas concêntricas'],['acne','sem comedões']])assert(d['drug-'+id].text.includes(token),id);
assert.match(d['drug-care-sjs'].text,/3,3 mL×peso/);assert.match(d['drug-care-dress'].text,/hemograma,eletrólitos,função renal\/hepática/);assert.match(d['drug-anaphylaxis'].text,/0,01 mL\/kg\/dose IM/);assert.equal(d['drug-care-eritrodermia'].choices.length,0);
assert.deepEqual(Array.from(f.p1n34.choices,c=>c.to),['p1n20','p1n37']);assert.deepEqual(Array.from(f.p1n19.choices,c=>c.to),['p1n20','p1n34','fev-vaccine-pending']);assert.deepEqual(Array.from(f.p1n37.choices,c=>c.to),['fev-uti','fev-home','fev-urine-pending']);assert.match(f['fev-home'].text,/cada24h/);assert.match(f['fev-home'].text,/Febre>7 dias/);assert.equal(f.p1n20.choices.length,0);assert.equal(f.p1n30.choices.length,0);
for(const n of Object.values(app(ids[2]).p.nodes))for(const l of n.linkedEntries||[])assert(app(ids[2]).context.window.PROTOCOLS[l.protocol].entries.some(e=>e.to===l.entry),l.protocol);
const reg=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/review-register.json'),'utf8'));assert.equal(reg.protocols.length,73);assert.equal(new Set(reg.protocols.map(x=>x.id)).size,73);assert(reg.protocols.every(x=>x.batch&&x.status.startsWith('conferencia-documental')),'all73 individual review records, not structural-only');
console.log(JSON.stringify(report,null,2));console.log('PASS lote25: todas as trajetórias reais SIM-P e duas reconferências integrais, critérios/manejo/AAS/encerramentos, comparação que preserva código válido anterior e73 registros individuais distintos.');
