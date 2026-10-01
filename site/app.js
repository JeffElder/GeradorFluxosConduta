'use strict';
(() => {
const catalog = window.CATALOG || [];
const $ = s => document.querySelector(s);
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
const escapeHTML = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categories = ['Todos os documentos','Emergências gerais','Cardiovascular','Respiratório','Neurologia','Infecções','Digestivo','Renal e urologia','Gestação e ginecologia','Trauma e toxicologia','Outros atendimentos','Apoio assistencial'];
const symbols = ['▦','✚','♡','◉','◎','⊕','◈','◇','○','✣','⊞','▤'];
let population='todos', category=categories[0], onlyFavorites=false, favorites=new Set(), active=null, toastTimer;
try { const saved=JSON.parse(localStorage.getItem('fluxo-upa-favorites')||'[]'); if(Array.isArray(saved)) favorites=new Set(saved.filter(id=>catalog.some(p=>p.id===id))); } catch {}
const searchData=new Map(catalog.map(p=>[p.id,{title:norm(p.title),text:norm(p.title+' '+p.aliases)}]));
const formatMeta = p => [p.version ? 'v. '+p.version : null,p.date || 'Data não informada no catálogo',p.pages ? p.pages+' pág.' : null].filter(Boolean).join(' · ');
function announce(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2200);}
function persistFavorite(id){if(favorites.has(id)) favorites.delete(id);else favorites.add(id);let stored=true;try{localStorage.setItem('fluxo-upa-favorites',JSON.stringify([...favorites]));}catch{stored=false;}render();if(active)updateReaderFavorite();announce(stored?(favorites.has(id)?'Salvo nos favoritos deste navegador':'Removido dos favoritos'):'Favorito alterado apenas nesta sessão');}
function updateReaderFavorite(){$('#reader-favorite').textContent=favorites.has(active.id)?'★ Favoritado':'☆ Favoritar';$('#reader-favorite').setAttribute('aria-pressed',String(favorites.has(active.id)));}
function filterCategory(value){category=value;render();}
function render(){
 const query=norm($('#search').value),tokens=query.split(' ').filter(Boolean);
 let matches=catalog.filter(p=>(population==='todos'||p.population===population)&&(category===categories[0]||p.category===category)&&(!onlyFavorites||favorites.has(p.id))&&tokens.every(t=>searchData.get(p.id).text.includes(t)));
 matches.sort((a,b)=>{if(query){const at=searchData.get(a.id).title,bt=searchData.get(b.id).title;const score=t=>t===query?3:t.startsWith(query)?2:t.includes(query)?1:0;const difference=score(bt)-score(at);if(difference)return difference;}return a.title.localeCompare(b.title,'pt-BR')||a.population.localeCompare(b.population);});
 document.querySelectorAll('[data-pop]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pop===population)));
 $('#favorite-filter').setAttribute('aria-pressed',String(onlyFavorites));
 $('#total-count').textContent=catalog.length;
 ['todos','adulto','infantil'].forEach(g=>$('#count-'+g).textContent=g==='todos'?catalog.length:catalog.filter(p=>p.population===g).length);
 $('#categories').innerHTML=categories.map((c,i)=>`<button class="category-button" data-category="${escapeHTML(c)}" aria-pressed="${category===c}"><span class="category-symbol" aria-hidden="true">${symbols[i]}</span><span>${escapeHTML(c)}</span><span class="category-number">${catalog.filter(p=>(population==='todos'||p.population===population)&&(i===0||p.category===c)).length}</span></button>`).join('');
 $('#category-select').value=category;
 $('#results-title').textContent=query?'Resultados da busca':onlyFavorites?'Seus favoritos':category;
 $('#results-count').textContent=matches.length+' documento'+(matches.length===1?'':'s')+(population==='todos'?' · Adulto e infantil':population==='adulto'?' · Atendimento adulto':' · Atendimento infantil');
 $('#clear-filters').hidden=!query&&!onlyFavorites&&category===categories[0]&&population==='todos';
 if(!matches.length){const pediatricPCR=population==='infantil'&&/\bpcr\b|parada|reanimacao/.test(query);$('#results').innerHTML=`<div class="empty"><h3>${onlyFavorites&&!favorites.size?'Seus atalhos começam aqui':'Nenhum documento encontrado'}</h3><p>${pediatricPCR?'O catálogo infantil consultado não contém um PDF específico de parada cardiorrespiratória. Confira a página oficial e as orientações do serviço.':onlyFavorites&&!favorites.size?'Toque na estrela de um protocolo para encontrá-lo rapidamente neste navegador.':'Tente outro termo ou remova um filtro. Os resultados são limitados aos documentos publicados nas duas páginas da SMS.'}</p><button class="secondary-button" data-reset>Limpar filtros</button>${pediatricPCR?'<p><a href="https://saude.curitiba.pr.gov.br/conteudo/atendimento-infantil/1472" target="_blank" rel="noopener noreferrer">Consultar a fonte infantil</a></p>':''}</div>`;return;}
 $('#results').innerHTML=matches.map(p=>`<article class="protocol-card"><div class="card-content"><div class="card-top"><span class="badge ${p.population}">${p.population==='adulto'?'ADULTO':'INFANTIL'}</span><button class="favorite-button" data-favorite="${p.id}" aria-label="${favorites.has(p.id)?'Remover dos favoritos':'Favoritar'}: ${escapeHTML(p.title)}" aria-pressed="${favorites.has(p.id)}">${favorites.has(p.id)?'★':'☆'}</button></div><h3><button class="card-title" data-open="${p.id}">${escapeHTML(p.title)}</button></h3><p class="card-category">${escapeHTML(p.category)}</p></div><div class="card-bottom"><small>${p.version?'v. '+p.version+' · ':''}${p.date||'Data não informada'}</small><button class="view-button" data-open="${p.id}" aria-label="Abrir ${escapeHTML(p.title)} — ${p.population}">${p.kind==='Apoio assistencial'?'Ver documento':'Ver fluxo'}</button></div></article>`).join('');
}
function reset(){population='todos';category=categories[0];onlyFavorites=false;$('#search').value='';render();$('#search').focus();}
function openProtocol(id,updateHash=true){const p=catalog.find(x=>x.id===id);if(!p)return;active=p;$('#reader-title').textContent=p.title;$('#reader-pop').textContent=p.population==='adulto'?'ATENDIMENTO ADULTO':'ATENDIMENTO INFANTIL';$('#reader-pop').className='badge '+p.population;$('#reader-meta').textContent='Catálogo SMS: '+formatMeta(p);$('#external-pdf').href=p.url;$('#source-link').href=p.source;updateReaderFavorite();const iframe=document.createElement('iframe');iframe.title='PDF oficial — '+p.title;iframe.src=p.url+'#view=FitH';$('#pdf-container').replaceChildren(iframe);if(!$('#reader').open)$('#reader').showModal();if(updateHash)history.replaceState(null,'','#'+p.id);}
function closeReader(){$('#reader').close();}
$('#reader').addEventListener('close',()=>{$('#pdf-container').replaceChildren();active=null;history.replaceState(null,'',location.pathname+location.search);});
$('#reader-favorite').addEventListener('click',()=>{if(active)persistFavorite(active.id);});
$('#close-reader').addEventListener('click',closeReader);
$('#search').addEventListener('input',render);
document.querySelectorAll('[data-pop]').forEach(b=>b.addEventListener('click',()=>{population=b.dataset.pop;render();}));
$('#favorite-filter').addEventListener('click',()=>{onlyFavorites=!onlyFavorites;render();});
$('#categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b)filterCategory(b.dataset.category);});
$('#category-select').innerHTML=categories.map(c=>`<option>${escapeHTML(c)}</option>`).join('');
$('#category-select').addEventListener('change',e=>filterCategory(e.target.value));
$('#clear-filters').addEventListener('click',reset);
$('#results').addEventListener('click',e=>{const fav=e.target.closest('[data-favorite]'),open=e.target.closest('[data-open]');if(fav)persistFavorite(fav.dataset.favorite);else if(open)openProtocol(open.dataset.open);else if(e.target.closest('[data-reset]'))reset();});
const quick=[['PCR','Parada cardíaca','PCR'],['Sepse','Adulto & infantil','sepse'],['Dor torácica','Avaliação inicial','dor toracica'],['AVC','Déficit focal agudo','AVC'],['Convulsão','Crises convulsivas','convulsao'],['Falta de ar','Fluxos respiratórios','falta de ar']];
$('#quick-links').innerHTML=quick.map(([title,subtitle,q])=>`<button class="quick-button" data-query="${q}"><strong>${title}</strong><span>${subtitle}</span></button>`).join('');
$('#quick-links').addEventListener('click',e=>{const b=e.target.closest('[data-query]');if(b){$('#search').value=b.dataset.query;category=categories[0];onlyFavorites=false;render();$('#results-title').scrollIntoView({block:'nearest',behavior:'instant'});}});
$('#about').addEventListener('click',()=>$('#sources-dialog').showModal());$('#close-sources').addEventListener('click',()=>$('#sources-dialog').close());
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();$('#search').focus();}});
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(id)openProtocol(id,false);else if($('#reader').open)closeReader();});
render();if(location.hash)openProtocol(location.hash.slice(1),false);
})();
