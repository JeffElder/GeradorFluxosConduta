'use strict';
(() => {
const $=s=>document.querySelector(s), catalog=window.CATALOG||[], protocols=window.PROTOCOLS||{};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
const areas=[
 ['Emergências gerais','Parada, choque ou alteração da glicemia','Avaliação de situações críticas'],
 ['Cardiovascular','Dor no peito, palpitação ou pressão alta','Dor torácica, arritmias, síncope e circulação'],
 ['Respiratório','Dificuldade para respirar','Dispneia, pneumonia, sibilância e via aérea'],
 ['Neurologia','Alteração neurológica','Convulsão, déficit focal, cefaleia e consciência'],
 ['Infecções','Febre ou suspeita de infecção','Sepse, HIV, tuberculose e outras infecções'],
 ['Digestivo','Dor abdominal ou sintomas digestivos','Diarreia, vômitos, sangramento e icterícia'],
 ['Renal e urologia','Sintomas urinários ou renais','Infecção urinária, hematúria, cólica e diálise'],
 ['Gestação e ginecologia','Gestação ou queixa ginecológica','Parto, sangramento, dor pélvica e hipertensão'],
 ['Trauma e toxicologia','Trauma, intoxicação ou picada','Traumatismos, dor lombar e animais peçonhentos'],
 ['Outros atendimentos','Outras queixas e condições','Pele, garganta, ouvido, saúde mental e oncologia'],
 ['Apoio assistencial','Encaminhamento e apoio ao atendimento','Atenção domiciliar e serviços']
];
let state={screen:'population',population:null,category:null,protocol:null,node:null,trail:[],actions:[]},history=[];
const copy=v=>JSON.parse(JSON.stringify(v));
function move(patch,answer){history.push(copy(state));state={...state,...patch};if(answer)state.trail=[...state.trail,answer];render(true);}
function restart(){state={screen:'population',population:null,category:null,protocol:null,node:null,trail:[],actions:[]};history=[];historyURL('');render(true);}
function historyURL(id){try{window.history.replaceState(null,'',location.pathname+location.search+(id?'#'+id:''));}catch{}}
function popLabel(p){return p==='infantil'?'Infantil':'Adulto';}
function formatted(text){const bits=String(text).replace(/\s+([•])\s*/g,'\n$1 ').split(/\n/).filter(Boolean);let out='',list=false;for(let bit of bits){const bullet=/^[•]/.test(bit);if(bullet&&!list){out+='<ul>';list=true;}if(!bullet&&list){out+='</ul>';list=false;}out+=bullet?'<li>'+esc(bit.replace(/^[•]\s*/,''))+'</li>':'<p>'+esc(bit)+'</p>';}return out+(list?'</ul>':'');}
function option(label,sub,action,value,extra=''){return `<button class="answer-option ${extra}" data-action="${action}" data-value="${esc(value)}"><span class="answer-mark" aria-hidden="true"></span><span><strong>${esc(label)}</strong>${sub?'<small>'+esc(sub)+'</small>':''}</span></button>`;}
const ANIMAL_ID='adulto-acidente-por-animais-peconhentos';
function animalPhotos(){return state.protocol===ANIMAL_ID?(window.ANIMAL_PHOTOS||null):null;}
function animalPhoto(keys,className=''){
 const media=animalPhotos();
 if(!media||!keys||!keys.length)return '';
 const photos=keys.map(k=>media.files[k]).filter(Boolean);
 if(!photos.length)return '';
 return '<div class="animal-photo-gallery '+esc(className)+'">'+photos.map(p=>
  '<figure class="animal-figure"><img loading="lazy" decoding="async" src="'+esc(p.src)+'" alt="'+esc(p.alt)+'">'+
  '<figcaption><span>'+esc(p.name)+'</span><a href="'+esc(p.source)+'" target="_blank" rel="noopener noreferrer">Foto: '+esc(p.author)+' · '+esc(p.license)+'</a></figcaption></figure>'
 ).join('')+'</div>';
}
function photoOption(label,sub,action,value,keys){
 if(!animalPhotos()||!keys||!keys.length)return option(label,sub,action,value);
 const media=animalPhotos(),photos=keys.map(k=>media.files[k]).filter(Boolean);
 if(!photos.length)return option(label,sub,action,value);
 return '<article class="animal-selection-card"><button class="answer-option animal-select-button" data-action="'+esc(action)+'" data-value="'+esc(value)+'">'+
  '<div class="animal-choice-thumbs">'+photos.map(p=>'<img loading="lazy" decoding="async" src="'+esc(p.src)+'" alt="'+esc(p.alt)+'">').join('')+'</div>'+
  '<span class="animal-select-label"><strong>'+esc(label)+'</strong>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span></button>'+
  '<p class="animal-choice-credits">'+photos.map(p=>'<a href="'+esc(p.source)+'" target="_blank" rel="noopener noreferrer">'+esc(p.author)+' · '+esc(p.license)+'</a>').join(' · ')+'</p></article>';
}
function animalPagePhoto(n){
 const media=animalPhotos();
 if(!media||!n)return '';
 const photo=animalPhoto(media.byPage[n.page],'animal-page-photos');
 const source=catalog.find(p=>p.id===ANIMAL_ID)?.url;
 const extra=n.page===1&&source?'<a href="'+esc(source)+'#page=1" target="_blank" rel="noopener noreferrer">Consultar as fotografias das lesões clínicas no PDF original · página 1</a>':'';
 return photo?'<div class="animal-context-photos"><p class="animal-photo-caption">Fotografias ilustrativas · a aparência não confirma a espécie nem a gravidade.</p>'+photo+(extra?'<p class="animal-clinical-link">'+extra+'</p>':'')+'</div>':'';
}
function heading(kicker,title,desc=''){return `<div class="question-heading"><p class="eyebrow">${esc(kicker)}</p><h1>${esc(title)}</h1>${desc?'<p class="intro">'+esc(desc)+'</p>':''}</div>`;}
function badge(){const c=catalog.find(p=>p.id===state.protocol);return c?`<div class="protocol-identity"><span class="badge ${c.population}">${popLabel(c.population)}</span><strong>${esc(c.title)}</strong><small>Catálogo SMS: ${c.version?'v. '+esc(c.version)+' · ':''}${esc(c.date||'data não informada')}</small></div>`:'';}
function tableHTML(table){return `<div class="native-table-wrap"><table class="native-table">${table.rows.map((r,i)=>'<tr>'+r.map(c=>i===0?'<th scope="col">'+esc(c)+'</th>':'<td>'+esc(c)+'</td>').join('')+'</tr>').join('')}</table></div>`;}
function referenceHTML(p,open=false){return `<details class="reference ${open?'reference-open':''}" ${open?'open':''}><summary>Protocolo em texto: critérios, quadros e tabelas</summary><p class="reference-intro">Referência integral do documento. Há condutas para situações diferentes; use os critérios correspondentes. A ordem de transcrição não representa uma sequência de ações.</p>${p.pages.map(page=>`<section class="source-page"><h3>${esc(page.heading)} <small>· página ${page.page}</small></h3>${[...page.blocks.map(b=>({y:b.y,html:formatted(b.text)})),...page.tables.map(t=>({y:t.rect[1],html:tableHTML(t)}))].sort((a,b)=>a.y-b.y).map(x=>x.html).join('')}</section>`).join('')}</details>`;}
function notesHTML(p,n){const page=p.pages.find(x=>x.page===n.page);const notes=(n.contextNodes||page?.notes||[]).map(k=>p.nodes[k]).filter(Boolean);if(!notes.length&&!page?.tables.length)return '';const terms=norm(n.text).split(' ').filter(x=>x.length>3);const score=note=>{const title=norm(note.text.split(/[•]/)[0]);return terms.filter(w=>norm(note.text).includes(w)).length+(title.includes(norm(n.text))?100:0);};notes.sort((a,b)=>score(b)-score(a));return `<aside class="clinical-context"><h2>Critérios e observações</h2><p class="context-caption">Notas do mesmo trecho do protocolo</p>${notes.map((note,i)=>`<details ${i===0&&score(note)>0?'open':''}><summary>${esc(note.text.split(/[•]/)[0].slice(0,170)||'Observações')}</summary><div class="clinical-text">${formatted(note.text)}</div><small>Fonte: página ${note.page}</small></details>`).join('')}${page.tables.length?`<details><summary>Quadros e tabelas desta página</summary>${page.tables.map(tableHTML).join('')}</details>`:''}</aside>`;}
function linkedProtocols(text){const current=catalog.find(c=>c.id===state.protocol);if(!/FLUXO|SEGUIR|PROTOCOLO/i.test(text))return '';let matches=[];const t=norm(text);const aliases=[['sindrome coronarian','sindromes-coronarianas'],['arritmi','arritmias'],['deficit focal','deficit-focal-agudo'],['crises convulsiv','crises-convulsivas'],['sepse','sepse-em-'],['aspiracao de corpo estranho','aspiracao-de-corpo-estranho'],['sibilancia','sibilancia-em-pediatria'],['pneumonia','pneumonia-'],['estridor','estridor'],['infeccao do trato urinario','infeccao-do-trato-urinario'],['itu','infeccao-do-trato-urinario'],['diarreia','diarreia-aguda'],['emergencias respiratorias','emergencias-respiratorias'],['intoxicacoes','intoxicacoes-exogenas'],['urgencias dialiticas','urgencias-dialiticas'],['rebaixamento do nivel','rebaixamento-do-nivel-de-consciencia'],['colica renal','colica-renal'],['febre em pediatria','febre-em-pediatria'],['crise hipertensiva','crise-hipertensiva']];for(const [term,slug] of aliases){if(term==='itu'?t.split(' ').includes(term):t.includes(term))matches.push(...catalog.filter(c=>c.id!==current.id&&c.population===current.population&&c.id.includes(slug)));}matches=[...new Map(matches.map(p=>[p.id,p])).values()];return matches.length?`<section class="related"><h3>Protocolos citados nesta etapa</h3>${matches.map(c=>`<button class="secondary-button" data-action="protocol" data-value="${c.id}">${esc(c.title)}</button>`).join('')}</section>`:'';}
function openProtocol(id){const c=catalog.find(p=>p.id===id),p=protocols[id];if(!c||!p)return;let patch={protocol:id,population:c.population,category:c.category,actions:[],node:null};if(!p.entries.length)patch.screen='reference';else if(p.entries.length===1){patch.screen='step';patch.node=p.entries[0].to;}else patch.screen='select-flow';move(patch,{question:'Situação selecionada',answer:c.title});historyURL(id);}
function render(focus=false){
 const root=$('#consultation');
 root.dataset.feedbackProtocol=state.protocol ? ((catalog.find(p=>p.id===state.protocol)?.title||state.protocol)+' ['+state.protocol+']') : 'Nenhum protocolo selecionado';
 root.dataset.feedbackStep=[state.screen,state.node?'Etapa: '+state.node:'',state.category||''].filter(Boolean).join(' · ');
if(!catalog.length||!Object.keys(protocols).length){root.innerHTML=heading('CARREGAMENTO','Não foi possível carregar os protocolos.','Recarregue a página. Nenhuma conduta será exibida sem o conteúdo completo.');return;}
 $('#back').hidden=history.length===0;$('#restart-top').hidden=history.length===0;$('#breadcrumb').textContent=[state.population?popLabel(state.population):'Nova consulta',state.category].filter(Boolean).join(' / ');
 const stage=state.screen==='population'?'population':['category','topic','library'].includes(state.screen)?'category':(['reference','result'].includes(state.screen)||(state.screen==='step'&&protocols[state.protocol]?.nodes[state.node]?.choices.length===0))?'result':'step';document.querySelectorAll('[data-stage]').forEach(x=>x.classList.toggle('active',x.dataset.stage===stage));
 $('#side-history').innerHTML=state.trail.length?state.trail.map(t=>'<li><small>'+esc(t.question)+'</small><span>'+esc(t.answer)+'</span></li>').join(''):'<li>Escolha o público para começar.</li>';
 if(state.screen==='population'){root.innerHTML=homeIntro()+heading('ETAPA 1 · PÚBLICO','Qual é o público do atendimento?','Escolha para iniciar as perguntas do protocolo.')+`<div class="answer-grid population-answers">${option('Adulto','Inclui gestação e urgências ginecológicas','population','adulto')}${option('Infantil','Protocolos de atendimento pediátrico','population','infantil')}</div><div class="start-footnote"><span>73 documentos de origem</span><span>Condutas na própria tela</span><span>Sem dados de pacientes</span></div>`;renderSearch(true);}
 else if(state.screen==='category'){const allowed=new Set(catalog.filter(p=>p.population===state.population).map(p=>p.category));root.innerHTML=heading('ETAPA 2 · QUADRO CLÍNICO','Qual quadro precisa ser avaliado?','Selecione a queixa ou situação principal.')+`<div class="answer-grid">${areas.filter(a=>allowed.has(a[0])).map(a=>option(a[1],a[2],'category',a[0])).join('')}</div>`;}
 else if(state.screen==='topic'){const candidates=catalog.filter(p=>p.population===state.population&&p.category===state.category);root.innerHTML=heading('ETAPA 2 · SITUAÇÃO','Qual situação corresponde ao caso?','A escolha define qual fluxo da SMS será consultado.')+`<div class="answer-grid">${candidates.map(c=>option(c.title,protocols[c.id].entries.length?'Iniciar as etapas deste protocolo':'Consultar orientações em texto','protocol',c.id)).join('')}</div>`;}
 else if(state.screen==='library'){root.innerHTML=heading('ACESSO DIRETO','Qual protocolo procura?','Pesquise para iniciar uma consulta ou leia os documentos em texto.')+`<label class="sr-only" for="search">Buscar por protocolo, sigla ou queixa</label><div class="searchbox"><input type="search" id="search" placeholder="Ex.: sepse, AVC, dor abdominal…" autocomplete="off"></div><div class="library-pops"><button data-action="library-pop" data-value="todos" aria-pressed="true">Todos</button><button data-action="library-pop" data-value="adulto" aria-pressed="false">Adulto</button><button data-action="library-pop" data-value="infantil" aria-pressed="false">Infantil</button></div><p id="search-count" role="status"></p><div class="answer-grid" id="search-results"></div>`;renderSearch();}
 else {const p=protocols[state.protocol];let html=badge();if(p.warning)html+=`<div class="source-warning"><strong>Trecho que exige conferência</strong><p>${esc(p.warning)}</p></div>`;
  if(state.screen==='select-flow'){html+=heading('ETAPA 3 · PARTE DO PROTOCOLO','Qual parte corresponde à avaliação?','Este documento reúne mais de um fluxo. Selecione o trecho aplicável.')+`<div class="answer-grid">${p.entries.map(e=>state.protocol===ANIMAL_ID?photoOption(e.label,'Fonte: página '+e.page,'entry',e.to,animalPhotos()?.byEntry[e.to]):option(e.label,'Fonte: página '+e.page,'entry',e.to)).join('')}</div>`+referenceHTML(p);}
  else if(state.screen==='reference'){html+=heading('PROTOCOLO EM TEXTO','Orientações do documento','Este trecho é apresentado como referência em texto. As condutas dependem dos critérios descritos.')+referenceHTML(p,true);}
  else {const n=p.nodes[state.node];if(!n){root.innerHTML=heading('ETAPA INDISPONÍVEL','Não foi possível identificar esta etapa.','Volte para conferir a seleção.');return;}
   const terminal=n.choices.length===0&&!n.incomplete;let body='';
   if(n.incomplete){body=heading('DECISÃO A CONFERIR',n.text,'A ligação desta decisão não foi reconstruída com segurança. Consulte os critérios em texto abaixo; a aplicação não presume uma resposta.')+referenceHTML(p,true);}
   else if(terminal){body=heading('CONDUTA DO CAMINHO','Orientação conforme o fluxo selecionado')+`<div class="result-card clinical-text">${formatted(n.text)}<small>Fonte: página ${n.page}</small></div>`+linkedProtocols(n.text);if(state.actions.length)body+=`<details class="prior-actions"><summary>Etapas anteriores deste caminho (${state.actions.length})</summary>${state.actions.map(k=>p.nodes[k]).filter(Boolean).map(a=>'<div class="clinical-text">'+formatted(a.text)+'<small>Fonte: página '+a.page+'</small></div>').join('')}</details>`;body+='<button class="primary-button" data-action="restart">Iniciar nova consulta</button>';}
   else {const title=n.question?n.text:n.choices.length>1?'Qual achado ou componente deseja consultar?':'Etapa prevista no protocolo';body=heading(n.question?'AVALIAÇÃO · RESPONDA À PERGUNTA':'CONDUTA · ETAPA INTERMEDIÁRIA',title);if(n.question&&n.criteria)body+='<div class="step-card clinical-text question-criteria">'+formatted(n.criteria)+'<small>Fonte: página '+n.page+'</small></div>';if(!n.question)body+='<div class="step-card clinical-text">'+formatted(n.text)+'<small>Fonte: página '+n.page+'</small></div>';if(!n.question&&n.choices.length>1)body+='<p class="branch-hint">Os componentes podem ser complementares. A escolha organiza a consulta; não exclui as demais medidas indicadas no documento.</p>';body+=`<div class="answer-grid clinical-answers">${n.choices.map((c,i)=>state.protocol===ANIMAL_ID&&state.node==='af-outros'?photoOption(c.label,'','answer',String(i),i===2?['abelha','vespa','formiga']:animalPhotos()?.byChoice['af-outros']?.slice(i,i+1)):option(c.label,'','answer',String(i))).join('')}</div>`;body+=linkedProtocols(n.text);}
   html+=`<div class="clinical-layout"><div class="clinical-main">${animalPagePhoto(n)}${body}</div>${notesHTML(p,n)}</div>`;if(!n.incomplete)html+=referenceHTML(p);
  }root.innerHTML=html;
 }
 if(focus){root.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
}
let libraryPop='todos';
function homeIntro(){return `<section class="test-banner" aria-labelledby="test-banner-title"><div class="test-banner-badge">TESTE ABERTO · ACESSO GRATUITO</div><h2 id="test-banner-title">Versão de teste aberta e gratuita</h2><p>Explore a aplicação gratuitamente. Estamos em fase de testes: os fluxos e as condutas ainda precisam de revisão clínica antes do uso assistencial.</p></section><section class="home-search" aria-labelledby="home-search-title"><h2 id="home-search-title"><label for="home-search">Encontre um protocolo</label></h2><p id="home-search-help">Pesquise por nome, sigla ou queixa para começar diretamente pelo protocolo.</p><div class="searchbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input type="search" id="home-search" placeholder="Ex.: sepse, AVC, dor abdominal…" autocomplete="off" aria-describedby="home-search-help" aria-controls="home-search-results" value="${esc(state.homeQuery||'')}"></div><p id="home-search-count" role="status" aria-live="polite"></p><div class="answer-grid" id="home-search-results" hidden></div></section><p class="home-divider">Ou inicie uma consulta guiada</p>`;}
function renderSearch(home=false){const input=home?'#home-search':'#search',count=home?'#home-search-count':'#search-count',results=home?'#home-search-results':'#search-results';const q=norm($(input)?.value||'');if(home&&!q){$(count).textContent='';$(results).innerHTML='';$(results).hidden=true;return;}const matches=catalog.filter(c=>(home||libraryPop==='todos'||c.population===libraryPop)&&q.split(' ').every(w=>norm(c.title+' '+c.aliases).includes(w)));$(count).textContent=matches.length+' protocolos e documentos';$(results).hidden=false;$(results).innerHTML=matches.length?matches.map(c=>option(c.title,popLabel(c.population)+' · '+c.category,'protocol',c.id)).join(''):'<div class="empty"><h3>Nenhum protocolo encontrado</h3><p>Tente outro termo ou outro público. Não há substituição automática por um protocolo de outra população.</p></div>';}

function answer(i){const p=protocols[state.protocol],n=p.nodes[state.node],c=n?.choices[i];if(!c)return;const actions=!n.question?[...state.actions,state.node]:state.actions;move({node:c.to,screen:'step',actions},{question:n.question?n.text:'Etapa do protocolo',answer:c.label==='Próxima etapa'?n.text.slice(0,100):c.label});}
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,v=b.dataset.value;
 if(a==='population')move({population:v,screen:'category'},{question:'Público',answer:popLabel(v)});
 else if(a==='category')move({category:v,screen:'topic'},{question:'Quadro clínico',answer:areas.find(x=>x[0]===v)?.[1]||v});
 else if(a==='protocol')openProtocol(v);
 else if(a==='entry')move({node:v,screen:'step'},{question:'Parte do protocolo',answer:protocols[state.protocol].entries.find(x=>x.to===v)?.label||v});
 else if(a==='answer')answer(Number(v));
 else if(a==='back'&&history.length){state=history.pop();historyURL(state.protocol||'');render(true);}
 else if(a==='restart')restart();
 else if(a==='library'){libraryPop='todos';move({screen:'library'});}
 else if(a==='library-pop'){libraryPop=v;document.querySelectorAll('[data-action="library-pop"]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.value===v)));renderSearch();}
 else if(a==='about')$('#sources-dialog').showModal();
});
document.addEventListener('input',e=>{if(e.target.id==='search')renderSearch();else if(e.target.id==='home-search'){state.homeQuery=e.target.value;renderSearch(true);}});
$('#close-sources').addEventListener('click',()=>$('#sources-dialog').close());
const initial=location.hash.slice(1);render();if(initial&&protocols[initial])openProtocol(initial);
})();
