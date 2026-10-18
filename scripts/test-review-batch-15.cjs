'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-raio-x-horarios-de-atendimento-do-servico-de-raio-x-nas-upas','adulto-sangramento-genital-feminino','adulto-sepse-em-adultos'];
const files=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="\.\/([^"?]+)(?:\?[^" ]*)?"/g)].map(m=>m[1]).filter(f=>!['feedback.js','animal-photos.js'].includes(f));
function app(id){const els=new Map(),listeners={};const get=k=>{if(!els.has(k))els.set(k,{innerHTML:'',dataset:{},focus(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []}});return els.get(k)};const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){listeners[e]=f}},location:{hash:'#'+id,pathname:'/',search:''}};vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8').replace("let irisAnswers=Array(IRIS_FIELDS.length).fill('');","let irisAnswers=Array(IRIS_FIELDS.length).fill('');window.__irisTest={set(v){irisAnswers=v},score:irisScore};"),c);return{context:c,fillScore(key,field,value){listeners.change({target:{dataset:{score:key,field},value,matches:s=>s==='[data-score]'}})},iris(i){const v=Array(12).fill('0');if(i===1)v[0]=v[3]=v[4]='1';if(i===2)v[11]='1';c.window.__irisTest.set(v)},p:c.window.PROTOCOLS[id],html:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return{dataset:{action,value}}}}})}};}
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
   if(id===ids[2]&&key==='sp-qsofa')for(const field of ['pressure','resp','mental'])ui.fillScore('qsofa',field,i===0?'1':'0');
   ui.click('answer',String(i));walkUI(n.choices[i].to,[...trail,{key,index:i}]);
   ui.click('back');assert(ui.html().dataset.feedbackStep.includes('Etapa: '+key+' '),'Back '+key);
  }
 }
 for(const entry of p.entries){ui.click('restart');ui.click('protocol',id);ui.click('entry',entry.to);walkUI(entry.to,[]);}
 assert.deepEqual(visited,paths.map(({trail,terminal})=>JSON.stringify({trail,terminal})),id+' all paths rendered');
 if(id===ids[2])for(const route of paths){const pos=route.trail.findIndex(s=>s.key==='sp-pressure');if(pos>=0){assert(route.trail.slice(0,pos).some(s=>s.key==='sp-s-antibiotic'),'Antibiotic selection before 3h pressure check');assert(route.trail.slice(0,pos).some(s=>/^sp-s-(pulm-usual|pulm-dpoc|pulm-no-vo|urine-cef|urine-cipro|abdom|skin|cns|undefined)$/.test(s.key)),'Drug step before 3h');}}
 report.push({id,paths:paths.length,terminals:[...new Set(paths.filter(x=>!x.cycle).map(x=>x.terminal))],cycleClosures:paths.filter(x=>x.cycle).length});
}
function edges(n,expected){for(const [k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}

const x=app(ids[0]).p.nodes,b=app(ids[1]).p.nodes,s=app(ids[2]).p.nodes;
assert.equal(x['rx-unit'].choices.length,9);assert.match(x['rx-0'].text,/07h30–12h e 13h–17h/);assert.match(x['rx-2'].text,/13h30–17h30/);assert.match(x['rx-2'].text,/07h30–13h30/);assert.match(x['rx-3'].text,/Não possui/);assert.match(x['rx-6'].text,/Não possui/);assert.match(x['rx-7'].text,/09h–15h30/);assert.match(x['rx-8'].text,/07h–00h/);assert.match(x['rx-8'].text,/cortados/);assert.match(x['rx-unit'].criteria,/25\/05\/2023/);
edges(b,{'ob-start':['ob-severe','ob-pregnant'],'ob-preg':['bleed-maternity'],'bleed-maternity':['bleed-bound','bleed-origin'],'bleed-origin':['bleed-ht','bleed-samu192'],'ob-trauma-care':['bleed-laceration'],'bleed-laceration':['bleed-laceration-samu','bleed-trauma-gap'],'ob-low':['bleed-aps','bleed-exclusion-pending'],'ob-bhcg':['ob-positive','ob-negative','bleed-hcg-pending'],'ob-negative':['bleed-clm','bleed-clm','bleed-clm','bleed-aps-normal','bleed-labs-gap']});
assert.match(b['ob-start'].criteria,/medicações contínuas/);assert.match(b['ob-start'].text,/em grande quantidade com sinais/);assert.match(b['ob-alert'].criteria,/PAS <120 e >90/);assert.match(b['bleed-ht'].text,/Hospital do Trabalhador/);assert.match(b['bleed-samu192'].text,/SAMU 192/);assert.match(b['bleed-clm'].text,/Hb <7/);
edges(s,{'sp-severe':['sp-s-focus'],'sp-s-focus':['sp-s-antibiotic'],'sp-s-pulm-usual':['sp-pressure'],'sp-s-abdom':['sp-pressure'],'sp-pressure':['sp-shock','sp-focus'],'sp-after-norepi':['sp-hydrocortisone','sp-perfusion'],'sp-after-hydrocortisone':['sp-epinephrine','sp-perfusion'],'sp-refractory':['sp-clm-refractory','sp-perfusion'],'sp-perfusion':['sp-perfusion-care','sp-followup'],'sp-followup':['sp-monitor-end']});
assert.match(s['sp-severe'].text,/NA PRIMEIRA HORA/);assert.match(s['sp-severe'].text,/IOT/);assert.match(s['sp-s-focus'].text,/salmonelose septicêmica/);assert.match(s['sp-s-focus'].text,/exantema por drogas/);assert.match(s['sp-shock'].text,/cada 10 min/);assert.match(s['sp-hydrocortisone'].text,/200 mg IV/);assert.match(s['sp-epinephrine'].text,/1–2 mcg\/kg\/min/);assert.match(s['sp-perfusion-care'].text,/2,5–5 mcg\/kg\/min/);assert.match(s['sp-followup'].text,/5\.000 UI SC de 12\/12 h/);assert.match(s['sp-followup'].text,/omeprazol 40 mg IV a cada 24 h/);assert.match(s['sp-followup'].text,/base <-5/);
const c=app(ids[2]).context;assert(c.window.SCORE_CALCULATORS.definitions.sofa.nodes.includes('sp-followup'));assert(!c.window.SCORE_CALCULATORS.definitions.sofa.nodes.includes('sp-pulm'));
console.log(JSON.stringify(report,null,2));console.log('PASS lote 15: todas as trajetórias e reavaliações, 9 unidades com dois quadros, manejo inicial preservado, referências maternas, Hb/coagulopatia e antibiótico antes de 3 horas.');
