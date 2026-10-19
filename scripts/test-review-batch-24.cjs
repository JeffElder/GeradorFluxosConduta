'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['infantil-pneumonia-em-pediatria','infantil-sepse-em-pediatria','infantil-sibilancia-em-pediatria'];
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
   if(id===ids[0]&&['p2n35','p2n47'].includes(key)){
    const v=key==='p2n35'?(i===0?{temperature:'0',age:'0',neutrophils:'2',immature:'2',infiltrate:'1',location:'0',fluid:'0',abscess:'0',atelectasis:'0'}:i===1?{temperature:'0',age:'0',neutrophils:'2',immature:'2',infiltrate:'2',location:'2',fluid:'0',abscess:'0',atelectasis:'0'}:{temperature:'1',age:'1',neutrophils:'2',immature:'2',infiltrate:'1',location:'0',fluid:'0',abscess:'0',atelectasis:'0'}):(i===0?{temperature:'1',age:'1',neutrophils:'1',immature:'1',infiltrate:'1',location:'0',fluid:'0',abscess:'0',atelectasis:'0'}:{temperature:'0',age:'0',neutrophils:'0',immature:'0',infiltrate:'2',location:'2',fluid:'0',abscess:'0',atelectasis:'0'});
    for(const[f,value]of Object.entries(v))ui.fillScore('bps',f,value);
   }
   if(id===ids[2]&&key==='wheeze-pass')for(const f of ['rr','oxygen','auscultation','effort','dyspnea'])ui.fillScore('pass',f,i===0?'0':i===1?'1':i===2?'2':'');
   ui.click('answer',String(i));walkUI(n.choices[i].to,[...trail,{key,index:i}]);
   ui.click('back');assert(ui.html().dataset.feedbackStep.includes('Etapa: '+key+' '),'Back '+key);
  }
 }
 for(const entry of p.entries){ui.click('restart');ui.click('protocol',id);ui.click('entry',entry.to);walkUI(entry.to,[]);}
 assert.deepEqual(visited,paths.map(({trail,terminal})=>JSON.stringify({trail,terminal})),id+' all paths rendered');
 report.push({id,paths:paths.length,terminals:[...new Set(paths.filter(x=>!x.cycle).map(x=>x.terminal))],cycleClosures:paths.filter(x=>x.cycle).length});
}

function edges(n,expected){for(const[k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}
const pn=app(ids[0]),se=app(ids[1]),wh=app(ids[2]),n=pn.p.nodes,s=se.p.nodes,w=wh.p.nodes,c=pn.context.window.SCORE_CALCULATORS;
edges(n,{'p2n6':['p2n7','p2n10'],'p2n18':['pn-inpatient-age'],'p2n35':['p2n38','p2n39','p2n37'],'p2n47':['p2n30','p2n24'],'p2n30':['pn-home-context'],'p2n23':['pn-home-context'],'pn-home-context':['pn-home-first','pn-home-failure','pn-home-pending']});
assert.match(n.p2n16.criteria,/SpO₂≤91%/);assert.match(n.p2n18.text,/SpO₂<92%/);assert.match(n['pn-iv-amp-gent'].text,/7,5 mg\/kg\/DIA divididos12\/12h/);assert.match(n['pn-iv-cef-azith'].text,/90 mg\/kg\/DIA IV1×dia/);assert.match(n['pn-home-clav-short'].text,/5–7dias/);assert.match(n['pn-home-clav-long'].text,/7–10dias/);assert.match(n['pn-home-cef'].text,/não há logística/);assert.match(n.p2n24.text,/não indica antibiótico/);
for(const k of Object.keys(pn.p.media.files))assert(fs.existsSync(path.join(root,pn.p.media.files[k].src)));
edges(s,{'p1n16':['p1n4','sep-age-pending'],'sep-focus':['sep-pulm-toxic','sep-abx-urine','sep-abx-abdomen','sep-skin-toxic','sep-abx-cns','sep-abx-none'],'sep-pulm-toxic':['sep-abx-pulm-clinda','sep-abx-pulm'],'sep-skin-toxic':['sep-abx-skin-clinda','sep-abx-skin'],'sep-perfusion':['sep-stop-volume','sep-vaso-access','sep-vaso-access','sep-transfer','sep-reassess-pending'],'sep-vaso-access':['sep-vaso-choice','sep-vaso-peripheral'],'sep-vaso-choice':['sep-epi','sep-norepi']});
assert.match(s.p1n16.criteria,/NÃO é necessária/);assert.match(s.p1n4.criteria,/Dois menores isolados não cumprem/);assert.match(s.p1n4.criteria,/diurese<1mL\/kg\/h.*≤0,5mL\/kg\/h/);assert.equal(s.p1n4.supportTables.length,4);assert.match(s.p1n8.text,/40–60mL\/kgna1ªhora/);assert.match(s.p1n8.text,/não ordenam aguardar/);assert.match(s['sep-stop-volume'].text,/Suspender/);assert.match(s['sep-epi'].text,/0,05–0,3 mcg\/kg\/min/);assert.match(s['sep-norepi'].text,/0,1–1 mcg\/kg\/min/);assert.match(s['sep-abx-abdomen'].text,/40 mg\/kg\/DIA divididos8\/8h/);
edges(w,{'wheeze-pass':['p2n23','wheeze-moderate','wheeze-severe','wheeze-pass-pending'],'wheeze-mod-improvement':['p2n35','wheeze-clm'],'wheeze-sev-improvement':['wheeze-clm','wheeze-repeat-maximum'],'wheeze-after-repeat':['wheeze-clm','wheeze-samu'],'p2n33':['p2n35','p2n44']});assert.match(w.p1n25.criteria,/IG≤32/);assert.match(w.p1n29.text,/NÃO usar broncodilatador/);assert.match(w['wheeze-mod-old'].text,/5–10jatos/);assert.match(w['wheeze-severe-methyl'].text,/1–2mg\/kg\/DIA IV/);assert.match(w['wheeze-samu'].text,/25–75mg\/kgIV em20min/);assert.match(w.p2n35.text,/manter3dias/);assert.match(w['wheeze-clm'].text,/hemograma,PCR,RXtórax/);
for(const ui of [pn,se,wh])for(const node of Object.values(ui.p.nodes))for(const l of node.linkedEntries||[]){assert(ui.context.window.PROTOCOLS[l.protocol].entries.some(e=>e.to===l.entry),'linked '+l.protocol+'/'+l.entry);}
let bps=0,pass=0;const weights=[[0,3],[0,2],[0,2,null],[0,1,null],[2,1,-1],[1,1,-1],[0,1,2],[0,1,2],[0,-1,-1,0]],keys=['temperature','age','neutrophils','immature','infiltrate','location','fluid','abscess','atelectasis'];
function allBPS(i,v,sum,missingLab){if(i===keys.length){for(const node of ['p2n35','p2n47']){const r=c.calculate('bps',v,node);assert.equal(r.complete,node==='p2n35'||!missingLab);if(r.complete){assert.equal(r.score,sum);assert.equal(r.answer,node==='p2n47'?(sum>=4?0:1):(sum>=4?2:sum<=0?1:0));assert.equal(r.partial,node==='p2n35'&&missingLab);}bps++;}return;}weights[i].forEach((x,j)=>allBPS(i+1,{...v,[keys[i]]:String(j)},sum+(x??0),missingLab||x===null));}allBPS(0,{},0,false);
const ui=app(ids[2]),calc=ui.context.window.SCORE_CALCULATORS;ui.click('protocol',ids[2]);ui.click('entry','wheeze-pass');
function allPASS(i,v,sum){if(i===5){const r=calc.calculate('pass',v,'wheeze-pass'),expected=sum<=7?0:sum<=11?1:2;assert(r.complete);assert.equal(r.score,sum);assert.equal(r.answer,expected);for(const[k,value]of Object.entries(v))ui.fillScore('pass',k,value);for(let a=0;a<3;a++)assert.equal(calc.allowed('pass','wheeze-pass',v,a),a===expected);ui.click('answer',String(expected));assert(ui.html().dataset.feedbackStep.includes('Etapa: '+['p2n23','wheeze-moderate','wheeze-severe'][expected]+' '));ui.click('back');pass++;return;}for(let j=0;j<3;j++)allPASS(i+1,{...v,[['rr','oxygen','auscultation','effort','dyspnea'][i]]:String(j)},sum+j+1);}allPASS(0,{},0);
assert(!calc.calculate('pass',{},'wheeze-pass').complete);assert(!calc.allowed('pass','wheeze-pass',{},0));assert(calc.allowed('pass','wheeze-pass',{},3));assert(!calc.calculate('pass',{rr:'3',oxygen:'0',auscultation:'0',effort:'0',dyspnea:'0'},'wheeze-pass').complete);
console.log(JSON.stringify(report,null,2));console.log('PASS lote24: todos os caminhos reais, '+bps+' cálculos BPS, '+pass+' perfis PASS com navegação, ausências/bloqueios, setas, doses e destinos originais.');
