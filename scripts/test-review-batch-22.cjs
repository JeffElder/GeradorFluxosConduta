'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['infantil-emergencias-respiratorias-em-pediatria','infantil-escroto-agudo','infantil-estridor'];
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
   if(id===ids[1]&&key==='p2n29')for(const[f,value]of Object.entries(i===0?{volume:'1',hard:'0',nausea:'1',high:'0',reflex:'0'}:i===1?{volume:'1',hard:'1',nausea:'1',high:'0',reflex:'0'}:{volume:'0',hard:'0',nausea:'0',high:'0',reflex:'0'}))ui.fillScore('twist',f,value);
   if(id===ids[2]&&key==='p1n15')for(const[f,value]of Object.entries(i===0?{stridor:'0',retraction:'0',air:'0',color:'0',mental:'0'}:i===1?{stridor:'1',retraction:'0',air:'1',color:'1',mental:'2'}:i===2?{stridor:'3',retraction:'3',air:'2',color:'2',mental:'3'}:{stridor:'0',retraction:'0',air:'1',color:'1',mental:'2'}))ui.fillScore('stridor',f,value);
   ui.click('answer',String(i));walkUI(n.choices[i].to,[...trail,{key,index:i}]);
   ui.click('back');assert(ui.html().dataset.feedbackStep.includes('Etapa: '+key+' '),'Back '+key);
  }
 }
 for(const entry of p.entries){ui.click('restart');ui.click('protocol',id);ui.click('entry',entry.to);walkUI(entry.to,[]);}
 assert.deepEqual(visited,paths.map(({trail,terminal})=>JSON.stringify({trail,terminal})),id+' all paths rendered');
 report.push({id,paths:paths.length,terminals:[...new Set(paths.filter(x=>!x.cycle).map(x=>x.terminal))],cycleClosures:paths.filter(x=>x.cycle).length});
}
function edges(n,expected){for(const[k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}
const r=app(ids[0]).p.nodes,ss=app(ids[1]),s=ss.p.nodes,e=app(ids[2]).p.nodes,calc=ss.context.window.SCORE_CALCULATORS;
edges(r,{'p1n25':['p1n20'],'p1n20':['p1n28','p1n20-nao'],'p1n28':['resp-anaphylaxis-salbutamol'],'resp-anaphylaxis-salbutamol':['resp-salbutamol-child','resp-salbutamol-adolescent']});assert.match(r.p1n22.criteria,/SpO₂≤91%/);assert.match(r.p1n20.criteria,/prurido mesmo sem rash/);assert.match(r.p1n28.text,/0,01 mg\/kg IM/);assert.match(r.p1n28.text,/0,3 mg\/kg/);assert.match(r.p1n28.text,/sem esclarecer por aplicação ou acumulado/);assert.match(r.p1n28.text,/5–10 mL\/kg/);assert.match(r['resp-salbutamol-child'].text,/máximo10 jatos/);assert.match(r['resp-salbutamol-adolescent'].text,/4–8 jatos/);assert.equal(r['resp-initial'].supportTables[0].rows.length,6);
edges(s,{'p1n35':['p2n28','sc-time-pending'],'p2n29':['p2n32','p2n33','p2n31'],'p1n50':['sc-hernia-incarcerated','sc-hernia-reducible','sc-hernia-pending'],'p1n54':['sc-epididymitis-abscess','sc-epididymitis-pending'],'sc-epididymitis-abscess':['p1n53','p1n52'],'p1n52':['sc-nonsexual','sc-sexual','sc-context-pending']});
for(const v of ['Angel','Prehn','testis redux','Rabinowitz','ponto azul','Transiluminação'])assert(s['sc-initial'].text.includes(v));for(const [id,loc]of [['p2n38','CLM'],['p2n37','SAMU3360-4980'],['p2n39','avaliação hospitalar']]){assert(s[id].text.includes(loc));assert.match(s[id].text,/0,05–0,1 mg\/kg IV/);assert.match(s[id].text,/SOMENTE ADULTO/);assert.match(s[id].text,/manobra de distorção/);}assert.match(s['sc-sexual'].text,/500 mg IM/);assert.match(s['sc-sexual'].text,/100 mg12\/12h14 dias/);
let twist=0,stridor=0;
for(let bits=0;bits<32;bits++){let sum=0,v={};['volume','hard','nausea','high','reflex'].forEach((k,i)=>{v[k]=String((bits>>i)&1);sum+=Number(v[k])*[2,2,1,1,1][i];});const result=calc.calculate('twist',v,'p2n29');assert.equal(result.score,sum);assert.equal(result.answer,sum<=2?2:sum<=4?0:1);twist++;}
const weights=[[0,1,2,3],[0,1,2,3],[0,2,3],[0,2,3],[0,1,2,3]],keys=['stridor','retraction','air','color','mental'];
function vectors(i,v,min,max){if(i===5){const result=calc.calculate('stridor',v,'p1n15');assert(result.complete);assert.equal(result.min,min);assert.equal(result.max,max);const bands=Array.from({length:max-min+1},(_,j)=>{let s=min+j;return s<6?0:s===6?null:s<=8?1:2});assert.equal(result.answer,bands.every(x=>x!==null&&x===bands[0])?bands[0]:null);stridor++;return;}weights[i].forEach((w,j)=>vectors(i+1,{...v,[keys[i]]:String(j)},min+w,max+w+([2,3].includes(i)&&j===0?1:0)));}vectors(0,{},0,0);
edges(e,{'p1n15':['p1n22','p1n24','p1n28','str-score-pending'],'p1n28':['p1n7'],'p1n7':['str-respiratory-persistence'],'str-respiratory-persistence':['str-airway','str-severe-medications'],'str-airway':['str-severe-medications'],'p1n25':['p1n30','p1n32']});assert.match(e.p1n5.criteria,/TEC>3 s/);assert.match(e.p1n5.criteria,/SpO₂<92%/);assert.match(e.p1n7.text,/máximo5 mL,não diluída/);assert.match(e['str-airway'].text,/0,5–1 mm menor/);assert.match(e['str-severe-medications'].text,/0,6 mg\/kg IM dose única/);assert.match(e['str-severe-medications'].text,/ceftriaxona100 mg\/kg IV/);assert.match(e.p1n24.text,/observar3–4 h/);assert.match(e.p1n32.text,/a cada2 h/);assert.match(e.p1n32.text,/contabilizar dose prévia/);assert(calc.allowed('stridor','p1n15',{},3));assert(!calc.allowed('stridor','p1n15',{},0));
console.log(JSON.stringify(report,null,2));console.log('PASS lote22: todas as trajetórias reais, '+twist+' TWIST e '+stridor+' perfis do estridor, setas, critérios, dose/unidade e saídas de pendência.');
