'use strict';
// Source reviewed visually: SMS ARRITMIAS v.2 pp.1–6. Software checks, not clinical validation.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const site=path.join(__dirname,'../site'),id='adulto-arritmias';
function app(){
 const elements=new Map(),listeners={};
 const get=q=>{if(!elements.has(q))elements.set(q,{innerHTML:'',textContent:'',dataset:{},focus(){},addEventListener(){},showModal(){this.open=true;},close(){this.open=false;}});return elements.get(q);};
 const ctx={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return [];},addEventListener(e,f){listeners[e]=f;}},location:{hash:'#'+id,pathname:'/',search:''}};
 vm.createContext(ctx);
 for(const f of ['catalog.js','protocols.js','arrhythmia-ecg.js','arrhythmia-flow.js','app.js'])vm.runInContext(fs.readFileSync(path.join(site,f),'utf8'),ctx);
 return {p:ctx.window.PROTOCOLS[id],root:()=>get('#consultation'),get,click(action,value){listeners.click({target:{closest(){return {dataset:{action,value}};}}});}};
}
const a=app(),p=a.p;
assert.deepEqual(Array.from(p.entries,e=>e.label),['Bradiarritmias','Taquiarritmias']);
const edges={
 p1n7:['p1n12','p1n14'],p1n14:['p1n15','p1n18'],p1n18:['p1n20','p1n23'],p1n23:['p1n24','p1n27'],
 p2n47:['p2n48','p2n4'],p2n4:['p2n5','p2n6'],p2n6:['p2n24','p2n11'],
 p2n24:['p2n27','p2n43'],p2n43:['p2n44'],p2n44:['p2n46','p2n67'],p2n46:['p2n61'],p2n61:['p2n45','p2n67'],p2n67:['p2n37'],
 p2n11:['p2n12','p2n11-nao'],'p2n11-nao':['p2n26','p2n25'],p2n12:['p2n13'],p2n13:['p2n14','p2n21'],p2n14:['p2n15'],p2n15:['p2n16','p2n21'],p2n16:['ar-refractory'],
 p2n25:['p2n28'],p2n27:['p2n28'],p2n28:['p2n29','p2n31','p2n31'],p2n31:['p2n33','p2n34','p2n34'],p2n33:['p2n37'],p2n34:['p2n37'],p2n37:['p2n40','p2n36'],
 p2n5:['p3n9'],p2n29:['p3n9'],p3n9:['p3n11'],p3n11:['p3n13'],p3n13:['p3n17','p3n16','p3n15','p3n14','p3n31'],
 p3n17:['p3n18'],p3n16:['p3n19'],p3n15:['p3n20'],p3n14:['p3n21'],p2n26:['ar-polymorphic'],'ar-polymorphic':['p3n14','p3n31'],
 'ar-refractory':['p3n15','p3n14'],p3n31:['ar-torsades-stability'],'ar-torsades-stability':['ar-torsades-unstable','ar-torsades-stable']
};
for(const [key,expected] of Object.entries(edges))assert.deepEqual(Array.from(p.nodes[key].choices,c=>c.to),expected,'Wrong PDF arrows at '+key);
assert.equal(p.nodes.p2n28.choices[2].label,'Indeterminado');assert.equal(p.nodes.p2n31.choices[2].label,'Indeterminado');
const paths=new Map(),terminals=new Set();
function walk(key,trail){
 if(paths.has(key))return;paths.set(key,trail);const n=p.nodes[key];assert(n&&!n.incomplete,key);
 if(!n.choices.length)terminals.add(key);
 else if(n.question)assert(n.choices.length>=2,key);
 n.choices.forEach((c,i)=>walk(c.to,[...trail,i]));
}
for(const e of p.entries)walk(e.to,[e.to]);
assert.deepEqual([...terminals].sort(),['p1n12','p1n15','p1n20','p1n24','p1n27','p2n48','p2n21','p2n45','p2n40','p2n36','p3n18','p3n19','p3n20','p3n21','ar-torsades-stable','ar-torsades-unstable'].sort());
for(const [key,trail] of paths){
 const ui=app();ui.click('entry',trail[0]);for(const i of trail.slice(1))ui.click('answer',String(i));
 assert(ui.root().dataset.feedbackStep.includes('Etapa: '+key),key);
 const main=ui.root().innerHTML.split('<details class="reference ')[0];
 assert.equal((main.match(/data-action="answer"/g)||[]).length,p.nodes[key].choices.length,key);
 for(const warning of p.nodes[key].warnings||[])assert(main.includes(warning.title),key);
 for(const media of p.nodes[key].media||[])assert(main.includes(p.media.files[media].src),key);
 if(p.nodes[key].question)assert(!main.includes('class="branch-hint"'),key);
 if(trail.length>1){ui.click('back');assert(!ui.root().dataset.feedbackStep.includes('Etapa: '+key+' '));ui.click('answer',String(trail.at(-1)));assert(ui.root().dataset.feedbackStep.includes('Etapa: '+key));}
}
assert.equal(Object.keys(p.media.files).length,11);
for(const [key,f] of Object.entries(p.media.files)){
 const bytes=fs.readFileSync(path.join(site,f.src));assert.equal(bytes.toString('hex',0,8),'89504e470d0a1a0a');assert.equal(bytes.readUInt32BE(16),f.width);assert.equal(bytes.readUInt32BE(20),f.height);assert(f.width>1200&&f.height>300,key);
}
assert(p.nodes.p1n14.media.includes('mobitz-2'));assert(p.nodes.p1n14.media.includes('bav-total'));
assert(!JSON.stringify(p).includes('5-20MCG/KG/MIN'));
const ui=app();ui.click('entry','p2n47');
for(const key of ['p2n4','p2n6','p2n11','p2n11-nao','p2n25','p2n28','p2n31','p2n33']){
 const current=ui.root().dataset.feedbackStep.match(/Etapa: ([^ ]+)/)[1];
 ui.click('answer',String(ui.p.nodes[current].choices.findIndex(c=>c.to===key)));
}
assert(ui.root().innerHTML.includes('Trecho documental com contraindicação neste caminho'));
assert(ui.root().innerHTML.includes('Atenção · FA com pré-excitação / WPW'));
ui.click('back');ui.click('answer','1');assert(ui.root().innerHTML.includes('Trecho documental com contraindicação neste caminho'));
const photo=app();photo.click('entry','p1n7');photo.click('ecg','mobitz-2');assert(photo.get('#ecg-dialog').open);assert(photo.get('#ecg-image').src.endsWith('/mobitz-2.png'));photo.click('close-ecg');assert(!photo.get('#ecg-dialog').open);
const html=fs.readFileSync(path.join(site,'index.html'),'utf8');
for(const f of ['arrhythmia-ecg.js','arrhythmia-flow.js'])assert(html.indexOf(f)>html.indexOf('protocols.js')&&html.indexOf(f)<html.indexOf('./app.js?'));
console.log(`PASS: arritmias — ${paths.size} etapas, ${terminals.size} conclusões, todas as setas, 11 PNGs originais, alertas, zoom e navegação.`);
