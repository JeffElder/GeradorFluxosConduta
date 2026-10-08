'use strict';
// Exercise app.js rendering and click handlers with a minimal DOM adapter.
// This verifies navigation/content; it is not a browser layout or clinical test.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const site=path.join(__dirname,'..','site'),id='adulto-sindromes-coronarianas';
function openApp(){
 const elements=new Map(),listeners={};
 const get=selector=>{
  if(!elements.has(selector))elements.set(selector,{innerHTML:'',textContent:'',dataset:{},value:'',focus(){},addEventListener(){},showModal(){},close(){}});
  return elements.get(selector);
 };
 const ctx={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return [];},addEventListener(event,handler){listeners[event]=handler;}},location:{hash:'#'+id,pathname:'/',search:''}};
 vm.createContext(ctx);
 for(const file of ['catalog.js','protocols.js','app.js'])vm.runInContext(fs.readFileSync(path.join(site,file),'utf8'),ctx);
 const app={protocol:ctx.window.PROTOCOLS[id],root:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return {dataset:{action,value}};}}});}};
 app.node=()=>app.root().dataset.feedbackStep.match(/Etapa: ([^ ]+)/)[1];
 app.heading=()=>app.root().innerHTML.match(/<h1>(.*?)<\/h1>/s)?.[1];
 return app;
}
function answer(app,label){
 const n=app.protocol.nodes[app.node()];
 if(label===null)assert.equal(n.choices.length,1,'Only one continuation on an action screen');
 const index=label===null?0:n.choices.findIndex(c=>c.label===label);
 assert(index>=0,`Missing answer ${label}`);app.click('answer',String(index));
 assert(!/\bROTA\s*\d/i.test(app.heading()),'A numbered route must not be a question');
}
function navigate(answers){const app=openApp();for(const value of answers)answer(app,value);return app;}
const initial=openApp();
assert.equal(initial.node(),'p1n7');
assert.equal(initial.heading(),'SUSPEITA DE SÍNDROME CORONARIANA?');
assert.equal((initial.root().innerHTML.match(/data-action="answer"/g)||[]).length,2);
assert(!initial.root().innerHTML.includes('class="step-card clinical-text"'),'No introductory action before the first question');
assert(initial.root().innerHTML.includes('FATORES DE RISCO'),'Pain and risk definitions remain available as context');
const ecg=['Sim',null],initialTests=[...ecg,'Não','Não','Não'],serial=[...initialTests,null];
assert.equal(navigate(ecg).heading(),'O ECG apresenta supradesnivelamento do segmento ST?');
const risk=navigate([...ecg,'Não','Não']);
const riskPanel=risk.root().innerHTML.match(/class="step-card clinical-text question-criteria">(.*?)<\/div>/s)?.[1];
assert(riskPanel?.includes('INSTABILIDADE HEMODINÂMICA'),'High-risk factors must be visible before answering');
assert(riskPanel.includes('ANGINA REFRATÁRIA'));
const defined=initial.protocol.nodes.p1n27.text;
const cases=[
 [['Não'],'p1n9','DOR TIPO D'],
 [[...ecg,'Sim'],'p1n15','SAMU'],
 [[...ecg,'Não','Sim'],'p1n15','SAMU'],
 [[...ecg,'Não','Não','Sim'],'p1n15','SAMU'],
 [[...serial,'Não','Não','Não','Não'],'p1n21','ALTA DOMICILIAR'],
 [[...serial,'Sim',null,defined,null],'p1n32','SAMU'],
 [[...serial,'Sim',null,'HEART SCORE 4 A 6',null],'p1n37','HOSPITALAR CARDIOLOGIA'],
 [[...serial,'Sim',null,'HEART SCORE ≤ 3',null],'p1n34','ALTA DOMICILIAR']
];
for(const [answers,terminal,text] of cases){
 const app=navigate(answers);assert.equal(app.node(),terminal);
 const result=app.root().innerHTML.match(/class="result-card clinical-text">(.*?)<\/div>/s)?.[1];
 assert(result?.includes(text),`Wrong rendered outcome at ${terminal}`);
}
for(const answers of [['Sim'],['Não','Sim'],['Não','Não','Sim'],['Não','Não','Não','Sim']]){
 const app=navigate([...serial,...answers]);assert.equal(app.node(),'p1n25');
 answer(app,null);assert.equal(app.node(),'reassessment');
 assert(!app.root().innerHTML.includes('class="branch-hint"'));
 app.click('back');assert.equal(app.node(),'p1n25');
 answer(app,null);assert.equal(app.node(),'reassessment');
}
console.log('PASS: coronary first question, clinical criteria, rendered outcomes and back/forward navigation.');
