'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['infantil-farmacodermias','infantil-febre-em-pediatria','infantil-infeccao-do-trato-urinario-em-pediatria'];
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

function edges(n,expected){for(const[k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}
const d=app(ids[0]),f=app(ids[1]),u=app(ids[2]),dn=d.p.nodes,fn=f.p.nodes,un=u.p.nodes;
edges(dn,{'drug-select':['drug-sjs','drug-dress','drug-pega','drug-eritrodermia','drug-exantema','drug-urticaria','drug-eritema','drug-acne'],'drug-care-pega':['drug-pega-extensive','drug-pega-local','drug-pega-pending'],'drug-care-urticaria':['drug-anaphylaxis','drug-urticaria-home','drug-urticaria-pending']});
assert.match(dn['drug-sjs'].text,/SJS<10%,NET>30%,sobreposição10–30%/);assert.match(dn['drug-dress'].text,/eosinofilia≥1500/);assert.match(dn['drug-dress'].text,/exige os três/);
assert.match(dn['drug-care-sjs'].text,/SF0,9%3,3 mL×peso/);assert.match(dn['drug-care-sjs'].text,/não define unidade da área,período/);assert.match(dn['drug-care-dress'].text,/6–8 semanas/);assert.match(dn['drug-pega-extensive'].text,/0,5–1 mg\/kg\/dia VO/);assert.match(dn['drug-care-eritrodermia'].text,/CLM/);assert.match(dn['drug-anaphylaxis'].text,/0,01 mL\/kg\/dose IM/);assert.match(dn['drug-anaphylaxis'].text,/não representa alta domiciliar/);
for(const [key,m]of Object.entries(d.p.media.files)){assert(fs.existsSync(path.join(root,m.src)));assert.deepEqual(Array.from(dn['drug-'+key].media),[key]);d.click('protocol',ids[0]);d.click('entry','drug-select');d.click('answer',String(['sjs','dress','pega','eritrodermia','exantema','urticaria','eritema','acne'].indexOf(key)));assert(d.html().innerHTML.includes(m.src),key+' source photo');}
edges(fn,{'p1n6':['p1n9','p1n11'],'p1n11':['p1n13','p1n15'],'p1n19':['p1n20','p1n34','fev-vaccine-pending'],'p1n34':['p1n20','p1n37'],'p1n37':['fev-uti','fev-home','fev-urine-pending']});
assert.equal(fn.p1n20.choices.length,0,'preserve original diagnostic endpoint');assert.equal(fn.p1n30.choices.length,0,'preserve >36m assessment endpoint');for(const x of ['hemograma','PCR','urofita/urina tipo1','RX tórax','SARS-CoV2/influenza'])assert(fn.p1n20.text.includes(x));assert.match(fn['fev-home'].text,/cada24h/);assert.match(fn['fev-home'].text,/Febre>7 dias/);assert.match(fn.p1n9.text,/2 acessos venosos/);assert.match(fn.p1n9.text,/SpO₂<92%/);
edges(un,{'p1n20':['p1n33'],'p1n33':['p1n34','p1n37'],'p1n34':['p1n37','p1n41'],'p1n41':['uti-result'],'uti-result':['p1n43','uti-result-pending'],'p1n43':['p1n45','p1n47','uti-age-pending'],'p1n45':['p1n47'],'p1n47':['uti-smx','uti-cephalexin','uti-amoxiclav'],'p1n37':['uti-ceftriaxone','uti-gentamicin']});
assert.match(un.p1n20.text,/SpO₂≤92%/);assert.match(un.p1n37.criteria,/somente APÓS coleta/);assert.match(un['uti-ceftriaxone'].text,/100 mg\/kg12\/12h,ou200 mg\/kg\/dia/);assert.match(un['uti-ceftriaxone'].text,/Dose\/frequência precisam de validação/);assert.match(un['uti-gentamicin'].text,/7,5 mg\/kg1×dia/);assert.match(un['uti-smx'].text,/40\+8 mg\/kg\/DIA divididos12\/12h/);assert.match(un['uti-cephalexin'].text,/50 mg\/kg\/DIA divididos6\/6h/);assert.match(un['uti-amoxiclav'].text,/50 mg\/kg\/DIA divididos8\/8h/);assert.match(un.p1n45.text,/48–72h/);assert.equal(un['uti-initial'].supportTables[0].rows.length,4);
for(const ui of [f,u])for(const n of Object.values(ui.p.nodes))for(const link of n.linkedEntries||[]){const target=ui.context.window.PROTOCOLS[link.protocol];assert(target.entries.some(e=>e.to===link.entry),'valid linked entry '+link.protocol+'/'+link.entry);}
console.log(JSON.stringify(report,null,2));console.log('PASS lote23: todos os caminhos reais/voltar, oito farmacodermias/imagens, bifurcações urofita/vacina/idade, manejo/exames, escolhas antibióticas e pendências precisas.');
