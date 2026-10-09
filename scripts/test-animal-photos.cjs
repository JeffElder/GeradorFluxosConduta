'use strict';
// UI smoke test: photos and credits must be visible while animal decisions remain usable.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const site=path.join(__dirname,'..','site'),ID='adulto-acidente-por-animais-peconhentos';
const elements=new Map(),events={};
function get(q){if(!elements.has(q))elements.set(q,{innerHTML:'',textContent:'',dataset:{},value:'',hidden:false,focus(){},addEventListener(){},showModal(){},close(){}});return elements.get(q);}
const p={id:ID,entries:[],nodes:{},pages:Array.from({length:8},(_,i)=>({page:i+1,heading:'Página '+(i+1),blocks:[],tables:[],notes:[]})),status:'transcribed-not-clinically-validated'};
const c={id:ID,title:'Acidente por animais peçonhentos',population:'adulto',category:'Trauma e toxicologia',date:'24/06/2024',url:'https://saude.curitiba.pr.gov.br/images/DUE/ACIDENTE%20POR%20ANIMAIS%20PE%C3%87ONHENTOS%201.pdf'};
const ctx={window:{CATALOG:[c],PROTOCOLS:{[ID]:p},history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return [];},addEventListener(type,f){events[type]=f;}},location:{hash:'#'+ID,pathname:'/',search:''}};
vm.createContext(ctx);
for(const f of ['animal-flow.js','animal-photos.js','app.js'])vm.runInContext(fs.readFileSync(path.join(site,f),'utf8'),ctx);
const media=ctx.window.ANIMAL_PHOTOS,root=get('#consultation'),click=(action,value)=>events.click({target:{closest(){return {dataset:{action,value}};}}});
assert.equal(Object.keys(media.files).length,12);
for(const entry of p.entries)assert(media.byEntry[entry.to]?.length, 'Foto ausente: '+entry.to);
for(const [key,pic] of Object.entries(media.files)){
 assert(pic.alt.includes('Fotografia ilustrativa'), 'Alt inadequado: '+key);
 assert(pic.source.startsWith('https://commons.wikimedia.org/wiki/File:'),'Fonte ausente: '+key);
 assert(pic.license&&pic.author,'Crédito ausente: '+key);
 const filename=decodeURIComponent(pic.source.split('File:')[1]).replace(/ /g,'_');
 const digest=crypto.createHash('md5').update(filename).digest('hex');
 assert(pic.src.includes('/'+digest.slice(0,1)+'/'+digest.slice(0,2)+'/'),'Endereço de imagem incompatível: '+key);
}
assert(root.innerHTML.includes('animal-selection-card'),'Cartões de animais ausentes');
assert(root.innerHTML.includes('animal-choice-thumbs'),'Miniaturas ausentes');
assert(root.innerHTML.includes('af-cascavel'),'Cascavel ausente');
assert(root.innerHTML.includes('commons.wikimedia.org'),'Créditos ausentes');
click('entry','af-marrom');
assert(root.innerHTML.includes('animal-context-photos'),'Foto da aranha-marrom ausente na etapa clínica');
assert(root.innerHTML.includes('Fotografias ilustrativas'),'Aviso de identificação ausente');
assert(root.innerHTML.includes('fotografias das lesões clínicas'),'Ligação às fotografias clínicas da fonte ausente');
click('back');
click('entry','af-outros');
assert(root.innerHTML.includes('animal-photo-gallery'),'Galeria dos subgrupos ausente');
assert(root.innerHTML.includes('animal-select-button'),'Subopções com foto ausentes');
assert(root.innerHTML.includes('af-outros')||root.dataset.feedbackStep.includes('af-outros'));
click('answer','2');
assert(root.innerHTML.includes('Há sinais de anafilaxia'),'Escolha não encaminhou à decisão correta');
assert(root.innerHTML.includes('animal-context-photos'),'Fotos sumiram após avançar');
const html=fs.readFileSync(path.join(site,'index.html'),'utf8');
assert(html.includes('animal-photos.css?v=1'));
assert(html.indexOf('animal-flow.js')<html.indexOf('animal-photos.js'));
assert(html.indexOf('animal-photos.js')<html.indexOf('app.js?v=6'));
console.log('PASS: 12 fotos ilustrativas com créditos, 8 cartões, galeria de subgrupos e navegação preservada.');
