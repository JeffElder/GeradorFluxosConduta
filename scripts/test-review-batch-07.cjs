'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'../site');
const ids=['adulto-dor-abdominal-em-gestantes','adulto-dor-abdominal-no-adulto','adulto-dor-pelvica-na-mulher'];
const files=['catalog.js','protocols.js','animal-flow.js','arrhythmia-ecg.js','arrhythmia-flow.js','obstetric-flow.js','hiv-tb-flow.js','review-batch-02.js','review-batch-03.js','review-batch-04.js','review-batch-05.js','review-batch-06.js','review-batch-07.js','app.js'];
function app(id){const els=new Map(),listeners={};const get=k=>{if(!els.has(k))els.set(k,{innerHTML:'',dataset:{},focus(){},addEventListener(){}});return els.get(k)};const c={window:{history:{replaceState(){}},scrollTo(){}},document:{querySelector:get,querySelectorAll(){return []},addEventListener(e,f){listeners[e]=f}},location:{hash:'#'+id,pathname:'/',search:''}};vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);return{p:c.window.PROTOCOLS[id],html:()=>get('#consultation'),click(action,value){listeners.click({target:{closest(){return{dataset:{action,value}}}}})}};}
const report=[];
for(const id of ids){
 const p=app(id).p,paths=[];
 function walk(key,entry,trail,seen){assert(!seen.includes(key),'Unexpected cycle '+key);const n=p.nodes[key];assert(n&&!n.incomplete,key);if(!n.choices.length){paths.push({entry,trail,terminal:key});return;}for(let i=0;i<n.choices.length;i++)walk(n.choices[i].to,entry,[...trail,{key,index:i}], [...seen,key]);}
 for(const e of p.entries)walk(e.to,e.to,[],[]);
 for(const route of paths){const ui=app(id);ui.click('entry',route.entry);for(const step of route.trail){assert(ui.html().dataset.feedbackStep.includes('Etapa: '+step.key+' '),step.key);const n=p.nodes[step.key];const html=ui.html().innerHTML.split('<details class="reference ')[0];assert.equal((html.match(/data-action="answer"/g)||[]).length,n.choices.length,step.key);if(n.question)assert(n.choices.length>=2,step.key);assert(!/conferir no texto integral|conforme o PDF|VER P\.[35]/i.test(html),step.key);ui.click('answer',String(step.index));}assert(ui.html().dataset.feedbackStep.includes('Etapa: '+route.terminal+' '));}
 report.push({id,paths:paths.length,terminals:[...new Set(paths.map(x=>x.terminal))]});
}
function edges(n,expected){for(const [k,v]of Object.entries(expected))assert.deepEqual(Array.from(n[k].choices,c=>c.to),v,k)}
const p=app(ids[0]).p.nodes,a=app(ids[1]).p.nodes,g=app(ids[2]).p.nodes;
edges(p,{'ob-gravity':['ob-severe','ob-obstetric'],'ob-obstetric':['ob-abruption','ob-alerts'],'ob-abruption':['ob-maternity','ob-labor'],'ob-labor':['ob-labor-ref','ob-simple'],'ob-alerts':['ob-maternity','ob-other'],'ob-other':['ob-uti','ob-diet','ob-review']});
edges(a,{p1n4:['p2n4'],p2n4:['p2n7','p2n9'],p2n9:['p2n10','p2n13'],p2n13:['p2n16','p2n14'],p2n16:['p2n18','p2n45'],p2n18:['p2n19','p2n22'],p2n22:['p2n23','p2n26'],p2n26:['p2n27','p2n33'],p2n29:['p2n31','p2n33'],p2n33:['p2n34','p2n35'],p2n34:['p2n37','p2n36'],'abd-occlusion':['abd-occlusive-samu','abd-clm'],'abd-tube':['abd-tube-consider','abd-regulation']});
edges(g,{'ob-start':['ob-severe','ob-pregnant'],'ob-pregnant':['ob-preg-ref','ob-acute'],'ob-acute':['ob-tests','ob-chronic'],'ob-hcg':['ob-hcg-pos','ob-peritonitis','ob-review'],'ob-peritonitis':['ob-perit','ob-cause'],'ob-cause':['ob-gyneco','ob-non-gyneco','ob-undefined'],'ob-gyneco':['pelvic-dysmenorrhea','pelvic-neoplasia','pelvic-pid'],'ob-non-gyneco':['pelvic-uti','pelvic-stone','pelvic-neoplasia','pelvic-constipation']});
assert.match(p['ob-maternity'].text,/20 MIN/);assert.match(p['ob-gravity'].criteria,/>20 semanas/);assert.match(a.p2n31.text,/B-HCG/);assert.match(g['ob-perit'].text,/40 mg\/kg\/dia/);
for(const [id,node,target]of [[ids[0],'ob-labor-ref','adulto-assistencia-ao-trabalho-de-parto-na-upa'],[ids[2],'ob-preg-ref',ids[0]],[ids[1],'p2n19','adulto-hemorragia-digestiva']]){const ui=app(id);ui.click('entry',node);assert(ui.html().innerHTML.includes('data-value="'+target+'"'),target);ui.click('protocol',target);assert(!ui.html().innerHTML.includes('ETAPA INDISPONÍVEL'));assert(ui.html().dataset.feedbackStep.includes('Etapa: '+app(target).p.entries[0].to),target);}
console.log(JSON.stringify(report,null,2));console.log('PASS lote 07: todos os caminhos e navegação entre protocolos citados.');
