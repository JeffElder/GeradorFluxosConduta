'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-hemorragia-digestiva','adulto-sepse-em-adultos','adulto-avaliacao-do-paciente-com-hiv-e-tuberculose-na-upa','adulto-leptospirose','adulto-obesidade-morbida','adulto-emergencias-psiquiatricas'];
const w={PROTOCOLS:Object.fromEntries(ids.map(id=>[id,{nodes:{},entries:[],pages:[{page:1},{page:2}]}]))};
for(const file of ['psychiatric-flow.js','hiv-tb-flow.js','clinical-flow-review.js','digestive-bleeding-flow.js','sepsis-flow.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),{window:w},{filename:file});
let count=0;
for(const id of ids){
 const p=w.PROTOCOLS[id];assert(p.entries.length>0,id);
 const reached=new Set();const explore=k=>{if(reached.has(k))return;reached.add(k);const n=p.nodes[k];assert(n,id+' -> '+k+' inexistente');assert(n.text?.trim(),id+' -> '+k+' sem texto');assert(!n.incomplete,id+' -> '+k+' incompleto');if(n.question)assert(n.choices.length>=2,id+' -> '+k+' sem escolhas suficientes');for(const c of n.choices){assert(c.label?.trim(),id+' -> '+k+' opção sem rótulo');explore(c.to)}};
 for(const entry of p.entries)explore(entry.to);
 count+=reached.size;
 console.log(id,':',reached.size,'etapas alcançáveis');
}
console.log('PASS:',ids.length,'fluxos reconstruídos,',count,'etapas conectadas');
