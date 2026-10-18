'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-sincope','adulto-sindrome-hipertensiva-na-gestacao','adulto-sindromes-coronarianas'];
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
   if(id===ids[0]&&key==='p1n38'){
    for(const f of ['palpitations','effort','supine','prodrome','trigger'])ui.fillScore('egsys',f,'0');
    ui.fillScore('egsys','cardiac',i===1?'0':'1');
    if(i===0)for(const f of ['prodrome','trigger'])ui.fillScore('egsys',f,'1');
   }
   if(id===ids[2]&&['heart-risk','reassessment'].includes(key)){
    for(const field of ['history','ecg','age','risk','troponin'])ui.fillHeart(field,'0');
    if(key==='heart-risk'&&i===0||key==='reassessment'&&i===1){ui.fillHeart('history','2');ui.fillHeart('ecg','2');}
    if(key==='reassessment'){if(i===0)for(const field of ['history','ecg','age','risk'])ui.fillHeart(field,'2');ui.fillHeart('curve','no');}
   }
   ui.click('answer',String(i));walkUI(n.choices[i].to,[...trail,{key,index:i}]);
   ui.click('back');assert(ui.html().dataset.feedbackStep.includes('Etapa: '+key+' '),'Back '+key);
  }
 }
 for(const entry of p.entries){ui.click('restart');ui.click('protocol',id);ui.click('entry',entry.to);walkUI(entry.to,[]);}
 assert.deepEqual(visited,paths.map(({trail,terminal})=>JSON.stringify({trail,terminal})),id+' all paths rendered');
 report.push({id,paths:paths.length,terminals:[...new Set(paths.filter(x=>!x.cycle).map(x=>x.terminal))],cycleClosures:paths.filter(x=>x.cycle).length});
}
function edges(n,expected){for(const [k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}
const sn=app(ids[0]),sy=sn.p.nodes,ht=app(ids[1]).p.nodes,co=app(ids[2]).p.nodes;
edges(sy,{'p1n6':['p1n7','p1n10'],'p1n13':['cause','p1n29'],'cause':['reflex','postural','cardiac'],'p1n31':['p1n33','p1n28'],'p1n38':['p1n40','p1n42','syn-egsys-pending']});
for(const value of ['>40 anos','AIT prévio','menos de 3 meses','sopro carotídeo','>3 s','>50 mmHg'])assert(sy.p1n10.text.includes(value));assert.match(sy.cause.criteria,/pós-prandial/);assert.match(sy.cause.criteria,/hipertensão pulmonar/);
assert(sn.context.window.SCORE_CALCULATORS.matches(ids[0],sy.p1n38).includes('egsys'));
const calc=sn.context.window.SCORE_CALCULATORS.calculate;
let combinations=0;
for(let bits=0;bits<32;bits++)for(let cardiac=0;cardiac<3;cardiac++){
 const v={cardiac:String(cardiac)};let score=cardiac===0?3:0;
 for(const [i,k]of ['palpitations','effort','supine','prodrome','trigger'].entries()){v[k]=String((bits>>i)&1);score+=Number(v[k])*[4,3,2,-1,-1][i];}
 const r=calc('egsys',v,'p1n38');assert(r.complete);assert.equal(r.min,score);assert.equal(r.max,score+(cardiac===0?0:3));assert.equal(r.answer,r.min>=3?1:r.max<3?0:null);combinations++;
}
assert.equal(calc('egsys',{},'p1n38').complete,false);
edges(ht,{'ob-severe':['htg-medication'],'htg-medication':['ob-severe-early','ob-severe-late','htg-overlap','ob-severe-uncertain'],'ob-severe-late':['htg-magnesium'],'htg-magnesium':['htg-reference'],'htg-reference':['htg-curitiba-bound','htg-curitiba-unbound','htg-rm-bound','htg-rm-unbound']});
for(const value of ['SG 5%','BCF a cada 20 min','3360-4980'])assert(ht['ob-severe'].text.includes(value));
for(const value of ['4 g IV','15–20 min','PARA 60 mL','300 mL/h','100 mL','1 g IV/h','EM 400 mL','50 mL/h','FR ≥16','≥25 mL/h','≥1,2 mg/dL','metade','gluconato de cálcio 1 g','10 mL a 10%','ataque de 2 g','difenil-hidantoína'])assert(ht['htg-magnesium'].text.includes(value),value);
assert.match(ht['ob-start'].text,/dor em hipocôndrio direito/);assert.match(ht['htg-rm-unbound'].text,/Hospital do Trabalhador/);assert.match(ht['htg-curitiba-unbound'].text,/não integra as duas páginas/);
edges(co,{'p1n19':['p1n25','ischemic-ecg','cor-time-pending'],'elevated-troponin':['p1n25','heart-risk','cor-troponin-pending'],'new-bundle-block':['p1n15','very-high-risk'],'very-high-risk':['p1n15','p1n17'],'reassessment':['p1n27','p1n28','p1n29']});
for(const id of ['p1n15','p1n32'])for(const text of ['Nitrato 5 mg SL','até 15 mg','FC <60','PAS <100','últimas 24 h','últimas 48 h','3 comprimidos mastigados','2–4 mg IV','máximo 25 mg','SatO₂ <90%','90–94%','1–6 L/min','6–15 L/min','≥75 anos','70 UI/kg','4.000 UI','12–15 UI/kg/h','Não solicitar CPK'])assert(co[id].text.includes(text),id+text);
assert.match(co.p1n6.text,/≤−0,2 SEG/);assert.match(co.p1n6.text,/2,5\/7=0,35/);assert.match(co.p1n6.text,/QRS ≥120 ms/);
const heart=sn.context.window.HEART_CALCULATOR;
assert.equal(heart.calculate({history:'0',ecg:'0',age:'0',risk:'0',troponin:'0',curve:'yes'},true).answer,null);
assert.match(heart.resultHTML(heart.calculate({history:'0',ecg:'0',age:'0',risk:'0',troponin:'0',curve:'yes'},true)),/nenhuma rota de alta/);
console.log(JSON.stringify(report,null,2));console.log('PASS lote 16: todas as trajetórias reais, '+combinations+' combinações EGSYS, critérios, contraindicações, anexo magnésio, referências e lacunas explícitas.');
