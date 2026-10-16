'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const site=path.join(__dirname,'../site');
function open(){
 const els=new Map(),events={};
 function get(k){if(!els.has(k))els.set(k,{innerHTML:'',textContent:'',value:'',dataset:{},hidden:false,focus(){},addEventListener(){},querySelector(){return null;},querySelectorAll(){return [];}});return els.get(k);}
 const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return [];},addEventListener(k,f){events[k]=f;}},location:{hash:'',pathname:'/',search:''}};
 vm.createContext(c);
 const files=[...fs.readFileSync(path.join(site,'index.html'),'utf8').matchAll(/<script defer src="\.\/([^"?]+)(?:\?[^"]*)?"><\/script>/g)].map(m=>m[1]).filter(f=>f!=='feedback.js');
 for(const f of files)vm.runInContext(fs.readFileSync(path.join(site,f),'utf8'),c,{filename:f});
 return {get,click(action,value){events.click({target:{closest(){return {dataset:{action,value:String(value??'')}};}}});},html(){return get('#consultation').innerHTML;},node(){return get('#consultation').dataset.feedbackStep;},protocols:c.window.PROTOCOLS};
}
const a=open();
assert(a.get('#open-library').hidden,'Initial search has no duplicate header button');
a.click('population','adulto');a.click('category','Cardiovascular');a.click('protocol','adulto-sindromes-coronarianas');
a.click('answer',0);
const before={node:a.node(),history:a.get('#side-history').innerHTML};
a.click('library');assert.match(a.html(),/Retomar consulta/);assert.match(a.get('#breadcrumb').textContent,/pausada/);
a.click('resume');assert.equal(a.node(),before.node);assert.equal(a.get('#side-history').innerHTML,before.history);
a.click('library');a.click('back');assert.equal(a.node(),before.node,'Back from search resumes');
a.click('review-answer',3);assert.match(a.node(),/p1n7/);assert.equal(a.get('#history-count').textContent,'(3)');
a.click('answer',1);assert.match(a.node(),/p1n9/);assert.match(a.html(),/result-card/);
a.click('library');a.click('protocol','infantil-febre-em-pediatria');assert.equal(a.get('#history-count').textContent,'(1)','A new protocol clears the old answers');
assert(!a.get('#side-history').innerHTML.includes('SUSPEITA'));
a.click('restart');assert(a.get('#open-library').hidden);assert.equal(a.get('#history-count').textContent,'');
a.click('protocol','adulto-sindromes-coronarianas');a.click('answer',0);
for(let i=0;i<4;i++)a.click('answer',0);
assert.match(a.node(),/cor-risk-count/);
const visible=a.html().split('<details class="reference ')[0];
assert.match(visible,/<h1>Quantos fatores de risco estão presentes\?<\/h1>/);
const list=visible.match(/<ul class="risk-list">(.*?)<\/ul>/s)[1];
assert.equal((list.match(/<li>/g)||[]).length,7);
for(const text of ['HAS','DM','dislipidemia','IMC &gt;30','sedentarismo','menos de 3 meses','mãe ou irmã','pai ou irmão'])assert(list.includes(text),text);
const reference=Object.values(a.protocols).find(p=>!p.entries.length);
if(reference){a.click('restart');a.click('protocol',reference.id);assert.equal(a.get('#restart-top').hidden,false,'Reference-only documents keep New consultation');}
console.log('PASS: search/resume/back, history editing, new protocol isolation, restart, seven complete risk factors.');
