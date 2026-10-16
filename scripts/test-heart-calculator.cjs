'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site'),c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'heart-calculator.js'),'utf8'),c);
const calc=c.window.HEART_CALCULATOR.calculate,keys=['history','ecg','age','risk','troponin'];
let count=0;
for(let bits=0;bits<243;bits++){let n=bits,score=0,v={};for(const k of keys){v[k]=String(n%3);score+=n%3;n=Math.floor(n/3);}for(const curve of [undefined,'no','yes']){const r=calc({...v,curve},curve!==undefined);assert.equal(r.score,score);assert.equal(r.answer,curve===undefined?(score>=4?0:1):(curve==='yes'||score>=7?0:score>=4?1:2));count++;}}
for(const k of keys)for(const bad of ['',undefined,'-1','3','NaN'])assert.equal(calc({history:'0',ecg:'0',age:'0',risk:'0',troponin:'0',[k]:bad}).complete,false);
assert.equal(calc({history:'0',ecg:'0',age:'0',risk:'0',troponin:'boundary'}).ambiguous,true);
function application(){
 const els=new Map(),events={};
 function element(){let html='';const el={textContent:'',value:'',dataset:{},focus(){},addEventListener(){},buttons:[],output:{innerHTML:''},querySelector(s){return s==='#heart-result'?el.output:null},querySelectorAll(s){return s==='[data-action="answer"]'?el.buttons:[]}};
  Object.defineProperty(el,'innerHTML',{get(){return html},set(value){html=value;el.buttons=[...html.matchAll(/<button[^>]*data-action="answer"[^>]*data-value="([^"]+)"/g)].map(m=>({dataset:{value:m[1]},disabled:false}));}});return el;}
 const get=k=>{if(!els.has(k))els.set(k,element());return els.get(k)};
 const ctx={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){events[e]=f}},location:{hash:'',pathname:'/',search:''}};vm.createContext(ctx);
 for(const m of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="\.\/([^"?]+)(?:\?[^" ]*)?"/g)){if(['feedback.js','animal-photos.js'].includes(m[1]))continue;vm.runInContext(fs.readFileSync(path.join(root,m[1]),'utf8'),ctx);}
 return {ctx,get,click(action,value){events.click({target:{closest(){return {dataset:{action,value:String(value??'')}}}}})},fill(key,value){events.change({target:{dataset:{heart:key},value,matches:s=>s==='[data-heart]'}})},node(){return get('#consultation').dataset.feedbackStep},html(){return get('#consultation').innerHTML}};
}

const ui=application();
function enter(node){ui.click('restart');ui.click('protocol','adulto-sindromes-coronarianas');const p=ui.ctx.window.PROTOCOLS['adulto-sindromes-coronarianas'],queue=[[p.entries[0].to,[]]],seen=new Set();let route;while(queue.length){const [id,path]=queue.shift();if(id===node){route=path;break;}if(seen.has(id))continue;seen.add(id);p.nodes[id].choices.forEach((c,i)=>queue.push([c.to,[...path,i]]));}assert(route);for(const i of route)ui.click('answer',i);assert.equal(ui.get('#consultation').buttons.filter(b=>b.disabled).length,node==='heart-risk'?2:3);}
for(const node of ['heart-risk','reassessment']){
 for(let bits=0;bits<243;bits++){
  enter(node);let n=bits,v={};for(const k of keys){v[k]=String(n%3);n=Math.floor(n/3);ui.fill(k,v[k]);}
  if(node==='reassessment'){v.curve='no';ui.fill('curve','no');}
  const r=calc(v,node==='reassessment');assert.match(ui.get('#consultation').output.innerHTML,new RegExp(r.score+' pontos'));
  assert.equal(ui.get('#consultation').buttons.filter(b=>!b.disabled).length,1);
  const target=ui.ctx.window.PROTOCOLS['adulto-sindromes-coronarianas'].nodes[node].choices[r.answer].to;
  ui.click('answer',(r.answer+1)%(node==='heart-risk'?2:3));assert.match(ui.node(),new RegExp('Etapa: '+node+' '));
  ui.click('answer',r.answer);assert.match(ui.node(),new RegExp('Etapa: '+target+' '));assert.match(ui.get('#side-history').innerHTML,/HEART:/);
 }
}
enter('reassessment');for(const k of keys)ui.fill(k,'0');ui.fill('curve','yes');assert(!ui.get('#consultation').buttons[0].disabled);ui.click('library');ui.click('resume');assert.match(ui.get('#consultation').output.innerHTML,/0 pontos/);ui.fill('troponin','boundary');assert(ui.get('#consultation').buttons.every(b=>b.disabled));enter('heart-risk');assert.match(ui.get('#consultation').output.innerHTML,/pendente/);
console.log('PASS HEART: '+count+' combinations; 486 interface paths; missing/invalid fields, troponin ambiguity, rising curve, history, reset and pause/resume.');
