'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site'),c={window:{PROTOCOLS:{}}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'psi-bleeding-focus.js'),'utf8'),c);
const calc=c.window.PSI_CALCULATOR.calculate;
const base={age:'50',sex:'male',residence:'0',cancer:'0',liver:'0',heart:'0',stroke:'0',renal:'0',mental:'0',rr:'30',sbp:'90',temperature:'35',pulse:'125',ph:'7.35',urea:'60',sodium:'130',glucose:'250',hct:'30',oxygen:'sat',sat:'90',effusion:'0'};
assert.equal(calc(base).score,50);
for(const [key,points]of [['residence',10],['cancer',30],['liver',20],['heart',10],['stroke',10],['renal',10],['mental',20],['effusion',10]])assert.equal(calc({...base,[key]:'1'}).score,50+points,key);
for(const [key,value,points]of [['rr','31',20],['sbp','89',20],['temperature','34.9',15],['temperature','40.1',15],['pulse','126',10],['ph','7.34',30],['urea','60.1',20],['sodium','129.9',20],['glucose','250.1',10],['hct','29.9',10],['sat','89.9',10]])assert.equal(calc({...base,[key]:value}).score,50+points,key);
assert.equal(calc({...base,temperature:'40'}).score,50);
assert.equal(calc({...base,sex:'female',residence:'1'}).score,50);
assert.equal(calc({...base,ph:'7,34'}).score,80);
assert.equal(calc({...base,ph:'7,35'}).score,50);
assert.equal(calc({...base,ph:'7.35'}).score,50);
for(const ph of ['7,','7,3,4','7.3.4','7,3.4','0x7','7e0','15','-1'])assert.equal(calc({...base,ph}).complete,false,ph);
const phHTML=c.window.PSI_CALCULATOR.render({...base,ph:'7,34'},String);
assert.match(phHTML,/<input data-psi="ph" type="text" inputmode="decimal"[^>]*value="7,34"/);
assert.equal(calc({...base,oxygen:'pao2',pao2:'60',sat:''}).score,50);
assert.equal(calc({...base,oxygen:'both',pao2:'59',sat:'89'}).score,60,'Oxygen scored once');
assert.equal(calc({...base,oxygen:'sat',pao2:'50',sat:'95'}).score,50,'Only selected measurement used');
for(const [age,mental,score,riskClass] of [[70,'0',70,2],[71,'0',71,3],[90,'0',90,3],[91,'0',91,4],[110,'1',130,4],[111,'1',131,5]]){const r=calc({...base,age:String(age),mental});assert.equal(r.score,score);assert.equal(r.riskClass,riskClass);assert.equal(r.answer,riskClass>=3?0:1);}
for(const key of Object.keys(base))assert.equal(calc({...base,[key]:''}).complete,false,'Blank '+key);
for(const [key,value]of [['age','-1'],['age','50.5'],['ph','15'],['sat','101'],['hct','101'],['urea','NaN'],['oxygen','unknown'],['sex','unknown']])assert.equal(calc({...base,[key]:value}).complete,false,'Invalid '+key);
let cases=0;const flags=['residence','cancer','liver','heart','stroke','renal','mental','effusion'],weights=[10,30,20,10,10,10,20,10];for(let bits=0;bits<256;bits++){const v={...base};let score=50;flags.forEach((k,i)=>{v[k]=String((bits>>i)&1);score+=Number(v[k])*weights[i];});assert.equal(calc(v).score,score);cases++;}
assert.match(c.window.BLEEDING_MANAGEMENT_HTML,/20 mL\/kg/);assert.match(c.window.BLEEDING_MANAGEMENT_HTML,/500 mg IV a 50 mg\/min/);assert.match(c.window.BLEEDING_MANAGEMENT_HTML,/Exceto gestantes/);assert.match(c.window.BLEEDING_MANAGEMENT_HTML,/BCF a cada 20 min/);assert(!c.window.BLEEDING_MANAGEMENT_HTML.includes('<details'));
console.log('PASS PSI: limites, classes II–V, unidades, dados ausentes/inválidos, oxigenação sem duplicidade e '+cases+' combinações; quadro de manejo completo e aberto.');
// Exercise the real application handlers/rendering, including disabled routes and reset/resume.
function application(){
 const els=new Map(),events={};
 function element(){let html='';const el={textContent:'',value:'',dataset:{},focus(){},addEventListener(){},buttons:[],output:{innerHTML:''},querySelector(s){return s==='#psi-result'?el.output:null},querySelectorAll(s){return s==='[data-action="answer"]'?el.buttons:[]}};
  Object.defineProperty(el,'innerHTML',{get(){return html},set(value){html=value;el.buttons=[...html.matchAll(/<button[^>]*data-action="answer"[^>]*data-value="([^"]+)"/g)].map(m=>({dataset:{value:m[1]},disabled:false}));}});return el;}
 const get=k=>{if(!els.has(k))els.set(k,element());return els.get(k)};
 const ctx={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){events[e]=f}},location:{hash:'',pathname:'/',search:''}};vm.createContext(ctx);
 for(const m of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="\.\/([^"?]+)(?:\?[^" ]*)?"/g)){if(['feedback.js','animal-photos.js'].includes(m[1]))continue;vm.runInContext(fs.readFileSync(path.join(root,m[1]),'utf8'),ctx);}
 return {get,fillCRB(key,value){events.change({target:{dataset:{score:'crb',field:key},value,matches:s=>s==='[data-score]'}})},click(action,value){events.click({target:{closest(){return {dataset:{action,value:String(value??'')}}}}})},fill(key,value){events.input({target:{dataset:{psi:key},value,matches:s=>s==='[data-psi]'}})},node(){return get('#consultation').dataset.feedbackStep},html(){return get('#consultation').innerHTML}};
}
const ui=application();
function enterPSI(route){ui.click('restart');ui.click('protocol','adulto-pneumonia-no-adulto');for(const index of route){if(/Etapa: p1n10 /.test(ui.node()))for(const k of ['confusion','resp','pressure','age'])ui.fillCRB(k,index===0?'1':'0');if(/Etapa: p1n12 /.test(ui.node())){ui.fillCRB('confusion',index===0?'1':'0');ui.fillCRB('additional',index===0?'1':'0');}ui.click('answer',index);}assert.match(ui.node(),/Etapa: p1n19 /);assert.equal(ui.get('#consultation').buttons.filter(b=>b.disabled).length,2);}
for(const route of [[1,0,0],[1,1,0,0],[1,1,1,1]]){
 enterPSI(route);ui.click('answer',0);assert.match(ui.node(),/Etapa: p1n19 /);
 for(const [key,value]of Object.entries(base))ui.fill(key,value);
 assert.match(ui.get('#consultation').output.innerHTML,/50 pontos · PSI II/);assert(ui.get('#consultation').buttons[0].disabled);assert(!ui.get('#consultation').buttons[1].disabled);
 ui.click('answer',0);assert.match(ui.node(),/Etapa: p1n19 /);ui.click('library');ui.click('resume');assert.match(ui.get('#consultation').output.innerHTML,/50 pontos · PSI II/);
 ui.click('answer',1);assert.match(ui.node(),/Etapa: p1n31 /);assert.match(ui.get('#side-history').innerHTML,/50 pontos/);
 ui.click('back');ui.fill('ph','7,2');assert.match(ui.get('#consultation').output.innerHTML,/80 pontos · PSI III/);assert(!ui.get('#consultation').buttons[0].disabled);assert(ui.get('#consultation').buttons[1].disabled);
 ui.click('answer',0);assert.match(ui.node(),/Etapa: p1n20 /);
}
enterPSI([1,0,0]);assert.match(ui.get('#consultation').output.innerHTML,/Cálculo pendente/);
for(const route of [[],[0],[1,0],[1,1,0],[1,1,1,1,0]]){ui.click('restart');ui.click('protocol','adulto-sangramento-genital-feminino');for(const i of route)ui.click('answer',i);assert.match(ui.html(),/class="initial-management"/);assert.match(ui.html(),/Manejo inicial/);}
console.log('PASS interface: três acessos ao PSI, bloqueio de faixa errada/dados ausentes, histórico, voltar, pausar/retomar e quadro nas cinco etapas previstas.');
