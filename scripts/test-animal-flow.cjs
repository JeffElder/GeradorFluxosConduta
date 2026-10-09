'use strict';
// Regression tests for SMS Curitiba animal-venom flow; based on pages 1–8 of the municipal PDF.
// This smoke test uses a small mock; scripts/test-protocols.cjs also loads the real protocol registry.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ID='adulto-acidente-por-animais-peconhentos';
const protocol={nodes:{},entries:[],pages:Array.from({length:8},(_,index)=>({page:index+1}))};
const ctx={window:{PROTOCOLS:{[ID]:protocol}}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../site/animal-flow.js'),'utf8'),ctx);
assert.equal(protocol.entries.length,8,'É necessário oferecer os oito animais/grupos.');
assert.deepEqual(Array.from(protocol.entries,e=>e.page),[1,2,3,4,5,6,7,8]);
const node=k=>{assert(protocol.nodes[k], 'Etapa inexistente: '+k);return protocol.nodes[k];};
const dest=(key,label)=>{const c=node(key).choices.find(c=>c.label===label);assert(c, 'Resposta ausente: '+key+' -> '+label);return c.to;};
const leaves=new Set(),visited=new Set();
function walk(k,ancestors=[]){
 assert(!ancestors.includes(k),'Ciclo inesperado: '+k);
 const n=node(k);assert(protocol.pages.some(p=>p.page===n.page));
 assert(n.text.trim());
 if(n.question)assert(n.choices.length>=2,'Pergunta sem opções: '+k);
 if(!n.choices.length)leaves.add(k);
 visited.add(k);
 for(const c of n.choices){assert(c.label.trim());walk(c.to,[...ancestors,k]);}
}
for(const e of protocol.entries)walk(e.to);
assert(visited.size>=40);
assert(leaves.size>=20);
const starts=Object.fromEntries(protocol.entries.map(e=>[e.page,e.to]));
for(const page of [1,2,3,4,6,7,8])assert(node(starts[page]).question);
assert.equal(node(starts[5]).choices.length,3);
assert.equal(dest('af-marrom-hemolise','Sim'),'af-marrom-hemolitica');
assert.equal(dest('af-marrom-hemolise','Não'),'af-marrom-moderado');
assert.equal(dest('af-armadeira-idade','Sim — criança menor de 7 anos'),'af-armadeira-moderado-crianca');
assert.equal(dest('af-armadeira-idade','Não — 7 anos ou mais'),'af-armadeira-moderado-outros');
assert.equal(dest('af-jararaca','Não'),'af-jararaca-observar');
assert.equal(dest('af-jararaca-evolucao','Sim'),'af-jararaca-gravidade');
assert.equal(dest('af-jararaca-evolucao','Não'),'af-jararaca-alta');
assert.equal(dest('af-coral-evolucao','Sim'),'af-coral-moderado');
assert.equal(dest('af-coral-evolucao','Não'),'af-coral-alta');
assert.equal(dest('af-outros-anafilaxia','Sim'),'af-outros-com-anafilaxia');
assert.equal(dest('af-outros-anafilaxia','Não'),'af-outros-sem-anafilaxia');
const html=fs.readFileSync(path.join(__dirname,'../site/index.html'),'utf8');
assert(html.indexOf('protocols.js?v=4')<html.indexOf('animal-flow.js?v=1'));
assert(html.indexOf('animal-flow.js?v=1')<html.indexOf('app.js?v=5'));
console.log('PASS: animal-flow.js — 8 grupos, '+visited.size+' etapas alcançáveis, '+leaves.size+' condutas, ramificações preservadas. Teste de software, não validação clínica.');
