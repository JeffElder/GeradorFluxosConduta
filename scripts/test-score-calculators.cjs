'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site'),ctx={window:{}};vm.createContext(ctx);
for(const m of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="\.\/([^"?]+)/g)){if(['app.js','feedback.js','animal-photos.js'].includes(m[1]))continue;vm.runInContext(fs.readFileSync(path.join(root,m[1]),'utf8'),ctx);}
const t=ctx.window.SCORE_CALCULATORS,D=t.definitions;
const fixtures={malinas:[[0,1,2,null],[0,1,2,null],[0,1,2],[0,1,2],[0,1,2,null]],gds:Array.from({length:15},(_,i)=>[1,5,7,11,13].includes(i+1)?[0,1]:[1,0]),qsofa:[[0,1],[0,1],[0,1]],wells_pe:[[0,3],[0,3],[0,1.5],[0,1.5],[0,1.5],[0,1],[0,1]],wells_dvt:[...Array.from({length:8},()=>[0,1]),[0,-2]],twist:[[0,2],[0,2],[0,1],[0,1],[0,1]],stridor:[[0,1,2,3],[0,1,2,3],[null,2,3],[null,2,3],[0,1,2,3]],bps:[[0,3],[0,2],[0,2,null],[0,1,null],[2,1,-1],[1,1,-1],[0,1,2],[0,1,2],[0,-1,-1,0]],gcs:[[4,3,2,1,null],[5,4,3,2,1,null],[6,5,4,3,2,1,null]],gbs:[[0,2,3,4,6],[0,1,3,1,6],[0,1,2,3],[0,1],[0,1],[0,2],[0,2],[0,2]],nihss:[[0,1,2,3],[0,1,2],[0,1,2],[0,1,2],[0,1,2,3],[0,1,2,3],...Array.from({length:4},()=>[0,1,2,3,4,null]),[0,1,2,null],[0,1,2],[0,1,2,3],[0,1,2,null],[0,1,2]],sofa:[[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4,null],[0,1,2,3,4],[0,1,2,3,4,null],[0,1,2,3,4,null]]};
let combinations=0;
for(const [key,weights]of Object.entries(fixtures)){
 assert.deepEqual(JSON.parse(JSON.stringify(D[key].fields.map(f=>f.options.map(o=>o.points)))),weights,key+' source weights');
 const base=Object.fromEntries(D[key].fields.map(f=>[f.key,'0']));
 for(const f of D[key].fields)for(const bad of ['',undefined,'999','-1','0.5','NaN'])assert.equal(t.calculate(key,{...base,[f.key]:bad},D[key].nodes[0]).complete,false,key+' invalid '+f.key);
 if(['nihss','bps'].includes(key))continue;
 function walk(i,v,sum){if(i===weights.length){const r=t.calculate(key,v,D[key].nodes[0]);assert(r.complete);assert.equal(r.score,sum);combinations++;return;}weights[i].forEach((w,j)=>{if(w!==null)walk(i+1,{...v,[D[key].fields[i].key]:String(j)},sum+w);});}walk(0,{},0);
}
// Independent clinically meaningful vectors and thresholds.
for(const [key,values,score,answer]of [
 ['malinas',['1','1','1','1','1'],5,1],['malinas',['2','2','2','2','0'],8,2],
 ['qsofa',['1','1','0'],2,0],['wells_pe',['1','1','0','0','0','0','0'],6,1],['wells_pe',['1','1','0','0','0','1','0'],7,2],
 ['twist',['1','0','0','0','0'],2,2],['twist',['1','1','0','0','0'],4,0],['twist',['1','1','1','0','0'],5,1],
 ['stridor',['0','0','1','1','2'],6,null],['stridor',['1','0','1','1','2'],7,1],
 ['bps',['1','1','0','0','2','2','0','0','1'],2,0]
]){const v=Object.fromEntries(D[key].fields.map((f,i)=>[f.key,values[i]]));const r=t.calculate(key,v,D[key].nodes[0]);assert.equal(r.score,score,key);assert.equal(r.answer,answer,key);}
let v=Object.fromEntries(D.bps.fields.map(f=>[f.key,'0']));v.neutrophils=v.immature='2';let r=t.calculate('bps',v,'p2n35');assert(r.complete&&r.partial);assert.equal(r.score,3);assert.equal(r.answer,0);assert.equal(t.calculate('bps',v,'p2n47').complete,false);
v.neutrophils='1';v.immature='0';r=t.calculate('bps',v,'p2n47');assert.equal(r.score,5);assert.equal(r.answer,0);
v=Object.fromEntries(D.nihss.fields.map(f=>[f.key,String(f.options.findIndex(o=>o.points===Math.max(...f.options.map(o=>o.points??-1))))]));assert.equal(t.calculate('nihss',v).score,42);v['10']='3';assert.equal(t.calculate('nihss',v).complete,false);
for(const [values,score]of [[{patient:'18',control:'12',bilirubin:'5'},32.6],[{patient:'12',control:'12',bilirubin:'32'},32],[{patient:'11',control:'12',bilirubin:'1,5'},-3.1]])assert(Math.abs(t.calculate('maddrey',values).score-score)<1e-10);
for(const field of ['patient','control','bilirubin'])for(const bad of ['',undefined,'NaN','-1','999'])assert(!t.calculate('maddrey',{patient:'18',control:'12',bilirubin:'5',[field]:bad}).complete);
v={stridor:'0',retraction:'0',air:'0',color:'0',mental:'0'};r=t.calculate('stridor',v,'p1n15');assert.equal(r.min,0);assert.equal(r.max,2);assert.equal(r.answer,0);v.stridor='3';v.retraction='1';r=t.calculate('stridor',v,'p1n15');assert.equal(r.answer,null);assert.equal(r.min,4);assert.equal(r.max,6);
assert.deepEqual(Array.from(ctx.window.PROTOCOLS['infantil-estridor'].nodes.p1n15.choices,c=>c.to),['p1n22','p1n24','p1n28']);
console.log('PASS source-weight fixtures, '+combinations+' complete combinations, score boundaries, invalid/NT fields, documentary ranges, BPS subtotal/reassessment, NIHSS 42 and Maddrey units.');
function application(){
 const els=new Map(),events={};function element(){let html='';const el={dataset:{},value:'',focus(){},addEventListener(){},outputs:new Map(),buttons:[],querySelector(s){if(!el.outputs.has(s))el.outputs.set(s,{innerHTML:''});return el.outputs.get(s)},querySelectorAll(s){return s==='[data-action="answer"]'?el.buttons:[]}};Object.defineProperty(el,'innerHTML',{get(){return html},set(v){html=v;el.buttons=[...v.matchAll(/<button[^>]*data-action="answer"[^>]*data-value="([^"]+)"/g)].map(m=>({dataset:{value:m[1]},disabled:false}));}});return el;}
 const get=k=>{if(!els.has(k))els.set(k,element());return els.get(k)},c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return[]},addEventListener(k,f){events[k]=f}},location:{hash:'',pathname:'/',search:''}};vm.createContext(c);
 for(const m of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="\.\/([^"?]+)/g)){if(['feedback.js','animal-photos.js'].includes(m[1]))continue;vm.runInContext(fs.readFileSync(path.join(root,m[1]),'utf8'),c);}
 return {c,get,click(action,value){events.click({target:{closest(){return{dataset:{action,value:String(value??'')}}}}})},fill(key,field,value){const target={dataset:{score:key,field},value,matches:s=>s==='[data-score]'};events.change({target});events.input({target});},node(){return get('#consultation').dataset.feedbackStep}};
}
function representative(key,node,index){const d=D[key];let found;function walk(i,v){if(found)return;if(i===d.fields.length){if(t.allowed(key,node,v,index))found={...v};return;}d.fields[i].options.forEach((o,j)=>walk(i+1,{...v,[d.fields[i].key]:String(j)}));}walk(0,{});return found;}
const ui=application();let interfaces=0;
function enter(protocol,node){ui.click('restart');ui.click('protocol',protocol);const p=ui.c.window.PROTOCOLS[protocol],q=p.entries.map(e=>[e.to,[],e.to]),seen=new Set();let route;while(q.length){const [id,path,entry]=q.shift();if(id===node){route={path,entry};break;}if(seen.has(id))continue;seen.add(id);p.nodes[id].choices.forEach((c,i)=>q.push([c.to,[...path,{id,index:i}],entry]));}assert(route,protocol+'/'+node+' reachable');if(p.entries.length>1)ui.click('entry',route.entry);for(const step of route.path){for(const key of t.matches(protocol,p.nodes[step.id]))if(t.gated(key,step.id)){const v=representative(key,step.id,step.index);assert(v,key+' reachable choice');for(const[f,value]of Object.entries(v))ui.fill(key,f,value);}ui.click('answer',step.index);}assert.match(ui.node(),new RegExp('Etapa: '+node+' '));}
for(const[key,d]of Object.entries(D)){
 if(!d.protocol)continue;
 for(const node of d.nodes){const p=ui.c.window.PROTOCOLS[d.protocol];if(!p)continue;let seen=new Set(),q=p.entries.map(e=>e.to);while(q.length){const k=q.shift();if(seen.has(k))continue;seen.add(k);q.push(...p.nodes[k].choices.map(c=>c.to));}if(!seen.has(node))continue;
 enter(d.protocol,node);assert.match(ui.get('#consultation').innerHTML,new RegExp('score-title-'+key));
 const values=key==='maddrey'?{patient:'18',control:'12',bilirubin:'5'}:Object.fromEntries(d.fields.map(f=>[f.key,'0']));
 for(const[field,value]of Object.entries(values))ui.fill(key,field,value);
 const r=t.calculate(key,values,node),out=ui.get('#consultation').querySelector('[data-score-result="'+key+'"]');assert.match(out.innerHTML,/pontos/);ui.click('library');ui.click('resume');assert.match(out.innerHTML,/pontos/);
 if(t.gated(key,node)&&r.answer!==null){assert(!ui.get('#consultation').buttons[r.answer].disabled);const target=p.nodes[node].choices[r.answer].to;ui.click('answer',r.answer);assert.match(ui.node(),new RegExp('Etapa: '+target+' '));assert.match(ui.get('#side-history').innerHTML,new RegExp(d.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));ui.click('back');assert.match(ui.get('#consultation').querySelector('[data-score-result="'+key+'"]').innerHTML,/pontos/);}
 interfaces++;
 }
}
enter('adulto-delirium','p2n23');assert(!ui.get('#consultation').buttons[3].disabled);ui.click('answer',3);assert.match(ui.node(),/del-scale-undefined/);
enter('adulto-assistencia-ao-trabalho-de-parto-na-upa','ob-score');assert(ui.get('#consultation').buttons.every(b=>b.disabled));ui.click('answer',0);assert.match(ui.node(),/ob-score/);
console.log('PASS '+interfaces+' reachable calculator screens through real app events; arithmetic display, route controls, histories, back, pause/resume, reset and non-applicable exit.');
