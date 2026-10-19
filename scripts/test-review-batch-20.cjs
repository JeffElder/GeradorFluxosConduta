'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['infantil-dermatoses-na-upa','infantil-diarreia-aguda-em-pediatria','infantil-doencas-exantematicas'];
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
const dd=app(ids[0]).p,d=dd.nodes,di=app(ids[1]).p.nodes,ee=app(ids[2]).p,e=ee.nodes;
assert.equal(d['derm-select'].choices.length,11);assert.equal(e['ex-select'].choices.length,13);
edges(d,{'derm-care-celulite':['derm-cell-severe','derm-cell-home'],'derm-cell-severe':['derm-cefazolin','derm-ceftriaxone'],'derm-care-furunculo':['derm-furuncle-abx','derm-furuncle-heat'],'derm-care-escabiose':['derm-scabies-ivermectin','derm-scabies-topical'],'derm-care-herpes':['derm-herpes-type','derm-herpes-symptoms','derm-herpes-time'],'derm-care-zoster':['derm-zoster-eye','derm-zoster-face','derm-zoster-other']});
for(const id of ['derm-care-impetigo','derm-care-ectima','derm-care-erisipela'])for(const value of ['1.200.000 UI','50.000 UI/kg','900.000 UI','50 mg/kg/dia','10mg/ml','27 kg','explicitamente ADULTA'])assert(d[id].text.includes(value));
assert.match(d['derm-zoster-eye'].text,/avaliação hospitalar/);assert.match(d['derm-zoster-face'].text,/APS/);assert.match(d['derm-zoster-other'].text,/não gerar prescrição infantil automática/);assert.match(d['derm-scabies-ivermectin'].text,/5 anos OU15 kg/);assert.match(d['derm-scabies-topical'].text,/não precisar repetir/);assert.match(d['derm-care-atopica'].text,/1–2 semanas/);
edges(di,{'dia-rn':['dia-bolus-rn','dia-bolus','dia-age-pending'],'dia-bolus-rn':['dia-expansion-check-rn'],'dia-expansion-check-rn':['dia-maint-severe','dia-bolus-rn'],'dia-expansion-check':['dia-maint-severe','dia-bolus'],'p1n35':['dia-home-upa','p1n39'],'dia-maint-severe':['dia-replacement'],'dia-replacement':['dia-clm'],'dia-dysentery':['dia-dysentery-age','dia-parasite'],'dia-dysentery-age':['dia-dysentery-abx','dia-dysentery-pending'],'dia-parasite':['dia-parasite-age','dia-home-end'],'dia-parasite-age':['dia-albendazole','dia-parasite-pending']});
assert.match(di.p1n5.criteria,/TEC>5 s/);assert.match(di.p1n29.criteria,/TEC3–5 s/);assert.match(di.p1n5.criteria,/entre2 e3 anos/);assert.equal(di.p1n5.supportTables[0].rows.length,6);assert.match(di['dia-bolus-rn'].text,/10 mL\/kg em30 min/);assert.match(di['dia-bolus'].text,/20 mL\/kg em30 min/);assert.match(di['dia-mild-oral'].text,/40–100 mL\/kg em4 h VO/);assert.match(di['dia-mild-iv'].text,/20–30 mL\/kg IV/);assert.match(di['dia-maint-severe'].text,/4:1/);assert.match(di['dia-replacement'].text,/1:1,50 mL\/kg\/dia/);assert.match(di['dia-replacement'].text,/KCl10%2 mL por100 mL/);assert.match(di['dia-dysentery-abx'].text,/40\+8 mg\/kg\/dia/);assert.match(di['dia-albendazole'].text,/400 mg\/mL/);assert.match(di['dia-albendazole'].text,/Volume do frasco não informado/);assert(!di.p1n39.text.includes('KCl'));
// Repeated expansions keep the selected RN/non-RN volume, then reach maintenance.
for(const rn of [true,false]){const ui=app(ids[1]);ui.click('protocol',ids[1]);for(const v of ['0','0','0',rn?'0':'1'])ui.click('answer',v);for(let k=0;k<3;k++){assert(ui.html().dataset.feedbackStep.includes(rn?'dia-bolus-rn':'dia-bolus'));ui.click('answer','0');ui.click('answer','1');}ui.click('answer','0');ui.click('answer','0');assert(ui.html().dataset.feedbackStep.includes('dia-maint-severe'));}
edges(e,{'ex-care-escarlatina':['ex-scarlet-penicillin','ex-scarlet-amoxicillin'],'ex-care-varicela':['ex-varicella-abx','ex-varicella-home']});
assert.match(e['ex-scarlet-amoxicillin'].text,/50–70 mg\/kg\/dia/);assert.match(e['ex-varicella-abx'].text,/50 mg\/kg\/dia/);assert.match(e['ex-care-meningo'].text,/SAMU3360-4980/);assert.match(e['ex-care-meningo'].text,/100 mg\/kg\/dia/);assert.match(e['ex-care-kawasaki'].text,/20–25 mg\/kg,4 vezes\/dia/);assert.match(e['ex-care-mono'].text,/Não prescrever penicilina\/amoxicilina/);assert.match(e['ex-care-mpb'].text,/5–7 dias/);
for(const[id,node,target]of [[ids[2],'ex-simp','infantil-sindrome-inflamatoria-multissistemica-pediatrica'],[ids[2],'ex-drug','infantil-farmacodermias'],[ids[2],'ex-care-mono','infantil-dor-de-garganta']]){const ui=app(id),p=ui.p,queue=[[p.entries[0].to,[]]],seen=new Set();let route;while(queue.length){const[k,trail]=queue.shift();if(k===node){route=trail;break;}if(seen.has(k))continue;seen.add(k);p.nodes[k].choices.forEach((c,i)=>queue.push([c.to,[...trail,i]]));}ui.click('protocol',id);for(const i of route)ui.click('answer',String(i));assert(ui.html().innerHTML.includes('data-value="'+target+'"'));ui.click('protocol',target);assert(ui.html().dataset.feedbackProtocol.includes(target));}
let panels=0;for(const p of [dd,ee])for(const [key,file]of Object.entries(p.media.files)){assert(fs.existsSync(path.join(root,file.src)));assert(file.width>0&&file.height>0);assert(Object.values(p.nodes).some(n=>n.media?.includes(key)));panels++;}assert.equal(panels,22);
console.log(JSON.stringify(report,null,2));console.log('PASS lote20: todos os caminhos reais, expansões RN/não RN repetidas,11 dermatoses,13 opções exantemáticas, critérios/tratamento e22 painéis originais.');
