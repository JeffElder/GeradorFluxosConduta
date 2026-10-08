'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const f of ['catalog.js','protocols.js'])vm.runInContext(fs.readFileSync(path.join(root,'site',f),'utf8'),ctx);
const {CATALOG:catalog,PROTOCOLS:protocols}=ctx.window;
assert.equal(catalog.length,73);assert.equal(Object.keys(protocols).length,73);
let transitions=0,questions=0;
for(const c of catalog){const p=protocols[c.id];assert(p);assert.equal(p.status,'transcribed-not-clinically-validated');for(const e of p.entries)assert(p.nodes[e.to]);for(const n of Object.values(p.nodes)){assert(n.text.trim());assert(p.pages.some(page=>page.page===n.page));if(n.question){questions++;assert(n.choices.length>=2||n.incomplete);}for(const choice of n.choices){assert(p.nodes[choice.to]);assert(choice.label.trim());transitions++;}}}
const node=(id,k)=>protocols[id].nodes[k];
const dest=(id,k,label)=>node(id,k).choices.find(c=>c.label===label)?.to;
assert.equal(dest('adulto-dor-toracica','p1n5','Sim'),'p1n7');
assert.equal(dest('adulto-dor-toracica','p1n5','Não'),'p1n9');
assert.equal(dest('infantil-febre-em-pediatria','p1n11','Sim'),'p1n13');
assert.equal(dest('infantil-febre-em-pediatria','p1n11','Não'),'p1n15');
assert.equal(dest('adulto-parada-cardio-respiratoria-pcr','p1n17','Sim'),'p1shock17');
assert.equal(node('adulto-parada-cardio-respiratoria-pcr','p1shock17').choices[0].to,'p1n23');
assert.equal(dest('adulto-parada-cardio-respiratoria-pcr','p1roscheck','Sim'),'p3n4');
assert.equal(node('infantil-infeccao-do-trato-urinario-em-pediatria','p1n20').choices[0].to,'p1n33');
// Coronary flow: every outcome must be reachable from the initial suspicion.
// Source: SMS Curitiba, SÍNDROME CORONARIANA v.2 (25/06/2024), page 1.
const coronary=protocols['adulto-sindromes-coronarianas'];
function coronaryPath(labels){
 let current=coronary.entries[0].to;const visited=[current];
 for(const label of labels){
  const n=coronary.nodes[current];
  const choice=label===null?(assert.equal(n.choices.length,1,`Expected one continuation at ${current}`),n.choices[0]):n.choices.find(c=>c.label===label);
  assert(choice,`Missing coronary answer ${label} at ${current}`);
  current=choice.to;visited.push(current);
 }
 return {current,visited};
}
assert.equal(coronary.entries[0].to,'p1n7','Start with the suspicion question, not a reference panel');
assert.equal(coronary.nodes.p1n7.text,'SUSPEITA DE SÍNDROME CORONARIANA?');
assert(coronary.nodes.p1n7.question);
const ecg=['Sim',null];
assert.equal(coronaryPath(ecg).current,'p1n12','ECG must continue to ST assessment');
assert.equal(coronaryPath(['Não']).current,'p1n9');
// Each urgent criterion independently reaches SAMU, before initial troponin.
for(const answers of [['Sim'],['Não','Sim'],['Não','Não','Sim']]){
 const path=coronaryPath([...ecg,...answers]);
 assert.equal(path.current,'p1n15');assert(!path.visited.includes('p1n17'));
}
const initialTests=[...ecg,'Não','Não','Não'];
assert.equal(coronaryPath(initialTests).current,'p1n17');
const serialAssessment=[...initialTests,null];
// Duration, ischemic ECG, elevated troponin and HEART >= 4 are independent triggers.
for(const answers of [['Sim'],['Não','Sim'],['Não','Não','Sim'],['Não','Não','Não','Sim']]){
 assert.equal(coronaryPath([...serialAssessment,...answers]).current,'p1n25');
}
assert.equal(coronaryPath([...serialAssessment,'Não','Não','Não','Não']).current,'p1n21');
const reassessment=coronaryPath([...serialAssessment,'Sim',null]);
assert(coronary.nodes[reassessment.current].question,'Reassessment outcomes are alternatives, not complementary actions');
assert(reassessment.visited.includes('p1n25'),'Repeat troponin and ECG before reassessment');
for(const [label,terminal] of [[coronary.nodes.p1n27.text,'p1n32'],['HEART SCORE 4 A 6','p1n37'],['HEART SCORE ≤ 3','p1n34']]){
 assert.equal(coronaryPath([...serialAssessment,'Sim',null,label,null]).current,terminal);
}
assert(!/^SIM\b/.test(coronary.nodes.p1n25.text),'An arrow label must not be part of the examination instruction');
const reachable=new Set(),terminals=[];
function visitCoronary(id){
 if(reachable.has(id))return;reachable.add(id);
 const n=coronary.nodes[id];assert(!n.incomplete,`Incomplete coronary decision: ${id}`);
 assert(!/\bROTA\s*\d/i.test(n.text),`Numbered route exposed in guided flow: ${id}`);
 for(const ref of n.contextNodes||[])assert(coronary.nodes[ref],`Missing clinical context: ${ref}`);
 if(!n.choices.length)terminals.push(id);
 for(const c of n.choices)visitCoronary(c.to);
}
visitCoronary(coronary.entries[0].to);
assert.deepEqual(terminals.sort(),['p1n9','p1n15','p1n21','p1n32','p1n34','p1n37'].sort(),'No false terminal at ECG or an intermediate examination');
assert(coronary.nodes['very-high-risk'].criteria.includes('INSTABILIDADE HEMODINÂMICA'));
assert(coronary.nodes['very-high-risk'].criteria.includes('DOENÇA ARTERIAL CARDIOVASCULAR ATEROSCLERÓTICA PRÉVIA'));
for(const [id,unsafe] of [['adulto-parada-cardio-respiratoria-pcr',/5MG\/G EM BOLUS|≥ METADE DO DIÂMETRO TORACICO/i],['infantil-infeccao-do-trato-urinario-em-pediatria',/100MG\/Kg 12\/12H/i]])assert(!unsafe.test(JSON.stringify(protocols[id])));
assert(!/<iframe|<embed|<object/i.test(fs.readFileSync(path.join(root,'site/index.html'),'utf8')));
require('./test-coronary-ui.cjs');
console.log(`PASS: ${catalog.length} documentos, ${questions} perguntas, ${transitions} transições; ramos críticos e supressões verificadas. Não constitui validação clínica.`);
