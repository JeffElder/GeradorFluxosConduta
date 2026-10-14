'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-acidente-por-animais-peconhentos','adulto-arritmias','adulto-assistencia-ao-trabalho-de-parto-na-upa'];
const files=['catalog.js','protocols.js','animal-flow.js','arrhythmia-ecg.js','arrhythmia-flow.js','obstetric-flow.js','app.js'];
function app(id){const els=new Map(),listeners={};const get=k=>{if(!els.has(k))els.set(k,{innerHTML:'',dataset:{},focus(){},addEventListener(){}});return els.get(k)};const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){listeners[e]=f}},location:{hash:'#'+id,pathname:'/',search:''}};vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);return{p:c.window.PROTOCOLS[id],html:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return{dataset:{action,value}}}}})}};}
const report=[];
for(const id of ids){
 const p=app(id).p,paths=[];
 function walk(key,entry,trail,seen){assert(!seen.includes(key),'Unexpected cycle '+key);const n=p.nodes[key];assert(n&&!n.incomplete,key);if(!n.choices.length){paths.push({entry,trail,terminal:key});return;}for(let i=0;i<n.choices.length;i++)walk(n.choices[i].to,entry,[...trail,{key,index:i}], [...seen,key]);}
 for(const e of p.entries)walk(e.to,e.to,[],[]);
 for(const route of paths){const ui=app(id);ui.click('entry',route.entry);for(const step of route.trail){assert(ui.html().dataset.feedbackStep.includes('Etapa: '+step.key+' '),step.key);const n=p.nodes[step.key];const html=ui.html().innerHTML.split('<details class="reference ')[0];assert.equal((html.match(/data-action="answer"/g)||[]).length,n.choices.length,step.key);if(n.question)assert(n.choices.length>=2,step.key);assert(!/conferir no texto integral|conforme o PDF|VER P\.[35]/i.test(html),step.key);ui.click('answer',String(step.index));}assert(ui.html().dataset.feedbackStep.includes('Etapa: '+route.terminal+' '));}
 report.push({id,paths:paths.length,terminals:[...new Set(paths.map(x=>x.terminal))]});
}
const animal=app(ids[0]).p.nodes;
// Condições literais conferidas na fonte, independentes do teste de alcance.
const arrows={
 'af-marrom':['af-marrom-leve','af-marrom-moderado','af-marrom-grave','af-marrom-hemolitica'],
 'af-marrom-grave':['af-marrom-hemolise'],'af-marrom-hemolise':['af-marrom-hemolitica','af-marrom-moderado'],
 'af-armadeira':['af-armadeira-leve','af-armadeira-idade','af-armadeira-grave'],
 'af-armadeira-idade':['af-armadeira-moderado-crianca','af-armadeira-moderado-outros'],
 'af-escorpiao':['af-escorpiao-leve','af-escorpiao-moderado','af-escorpiao-grave'],
 'af-lonomia':['af-lonomia-leve','af-lonomia-moderado','af-lonomia-grave'],
 'af-outros':['af-outros-lycosa','af-outros-lagartas','af-outros-anafilaxia'],
 'af-outros-anafilaxia':['af-outros-com-anafilaxia','af-outros-sem-anafilaxia'],
 'af-jararaca':['af-jararaca-gravidade','af-jararaca-observar'],
 'af-jararaca-observar':['af-jararaca-evolucao'],'af-jararaca-evolucao':['af-jararaca-gravidade','af-jararaca-alta'],
 'af-jararaca-gravidade':['af-jararaca-leve','af-jararaca-moderado','af-jararaca-grave'],
 'af-jararaca-controle':['af-jararaca-complemento','af-jararaca-controle-normal'],
 'af-cascavel':['af-cascavel-leve','af-cascavel-moderado','af-cascavel-grave'],
 'af-coral':['af-coral-observar','af-coral-moderado','af-coral-grave'],
 'af-coral-observar':['af-coral-evolucao'],'af-coral-evolucao':['af-coral-moderado','af-coral-alta']
};
for(const [k,v]of Object.entries(arrows))assert.deepEqual(Array.from(animal[k].choices,c=>c.to),v,k);
for(const level of ['leve','moderado','grave'])assert.equal(animal['af-jararaca-'+level].choices[0].to,'af-jararaca-controle');
for(const key of ['af-marrom-grave','af-marrom-hemolitica'])assert.match(animal[key].text,/bilirrubinas total e frações/);
assert.match(animal['af-armadeira-moderado-crianca'].text,/radiografia de tórax e eletrocardiograma/);
assert.match(animal['af-jararaca-complemento'].text,/2 ampolas de SAB/);
const birth=app(ids[2]).p.nodes;
for(const [k,v]of Object.entries({'ob-start':['ob-score'],'ob-score':['ob-low','ob-medium','ob-expulsive'],'ob-expulsive':['ob-birth','ob-medium']}))assert.deepEqual(Array.from(birth[k].choices,c=>c.to),v,k);
assert.match(birth['ob-score'].criteria,/zero partos prévios/);assert.match(birth['ob-expulsive'].criteria,/10 cm/);assert.match(birth['ob-start'].text,/apagamento cervical/);assert.match(birth['ob-birth'].text,/desprendimento fetal/);
console.log(JSON.stringify(report,null,2));console.log('PASS: todos os caminhos completos dos três protocolos, renderização e condições documentais selecionadas. Não equivale a validação clínica.');
