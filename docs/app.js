'use strict';
const app=document.querySelector('.app'),browse=document.getElementById('browse'),detail=document.getElementById('detail'),room=document.getElementById('reading-room'),list=document.getElementById('place-list'),search=document.getElementById('search'),count=document.getElementById('results-count'),toggle=document.getElementById('mobile-toggle'),topicSelect=document.getElementById('topic'),clearBtn=document.getElementById('clear-filters'),mapEl=document.getElementById('map');
let records=[],filter='all',pinFilter='all',topic='all',query='',region='all',selected=null,hovered=null,view='browse',currentBase='field';const markerById=new Map();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=u=>/^https:\/\//i.test(u||'')?u:'#';
function placeReadings(r){return [...new Map([...(r.sources||[]),...(r.reading_list||[])].map(s=>[s.url,s])).values()];}
function placeHash(hash){try{return decodeURIComponent(hash.slice(1));}catch{return '';}}
const mobile=()=>window.matchMedia('(max-width:760px)').matches;
const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isWest=r=>['H29','H30'].includes(r.id);
const PARAPOLITICS=new Set(['documented_conspiracies','intelligence_research','political_violence','political_organizing']);
const ICONS={
  esoteric:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></svg>',
  intel:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3"/></svg>',
  archive:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  commune:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18L12 4 3 20z"/><path d="M12 11v9"/></svg>',
  lore:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L4 7v6c0 5 3.4 8.8 8 10 4.6-1.2 8-5 8-10V7l-8-5z"/><path d="M12 8v5"/><circle cx="12" cy="16.5" r="0.8" fill="currentColor"/></svg>',
  tiki:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2.5" width="14" height="19" rx="3"/><path d="M7.5 7l3.5 1.5M16.5 7L13 8.5"/><circle cx="9" cy="10" r="0.9" fill="currentColor"/><circle cx="15" cy="10" r="0.9" fill="currentColor"/><path d="M12 9.5v3.5"/><rect x="8" y="15" width="8" height="3.5" rx="1"/><path d="M10.7 15v3.5M13.3 15v3.5"/></svg>',
  dining:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11c0-4.4 4-7.5 8.5-7.5 4.2 0 7.5 2.5 7.5 6.2 0 4.5-4.3 9.8-10.2 9.8C6.2 19.5 4 15.5 4 11z"/><circle cx="14.5" cy="9.5" r="2.2"/><path d="M8.5 11.5l3 3"/></svg>',
  vegan:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  bar:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l-6 8-6-8z"/><path d="M12 11v9"/><path d="M8 20h8"/></svg>'
};
function pinKind(r){return r.pin_kind||(r.category==='Bar'?'bar':isWest(r)?'archive':'esoteric');}
function pinSvg(r){return ICONS[pinKind(r)]||ICONS.esoteric;}
const LEGEND_ITEMS=[
  ['esoteric','Esoteric & occult'],
  ['intel','Intel & secrecy'],
  ['commune','Commune & counterculture'],
  ['lore','Politics, crime & lore'],
  ['archive','Archive / museum'],
  ['tiki','Tiki bar'],
  ['dining','Steak & classic dining'],
  ['vegan','Vegan dining'],
  ['bar','Bar & saloon']
];
const legendEl=document.getElementById('map-legend');
function renderLegend(){
  if(!legendEl)return;
  legendEl.innerHTML=LEGEND_ITEMS.map(([k,label])=>`<button type="button" class="legend-btn" data-pin-kind="${k}" aria-pressed="${pinFilter===k}"><i class="legend-dot ${k}">${ICONS[k]||''}</i><span>${esc(label)}</span></button>`).join('');
}
renderLegend();
const map=L.map('map',{zoomControl:false,preferCanvas:true}).setView([34.03,-118.41],10);L.control.zoom({position:'topright'}).addTo(map);
const BASEMAPS={
  field:{url:'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',opts:{maxZoom:20,subdomains:'abcd',attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'}},
  transit:{url:'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png',opts:{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://memomaps.de/">MeMoMaps</a> (ÖPNVKarte)'}},
  topo:{url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',opts:{maxZoom:19,attribution:'Tiles &copy; Esri, USGS, NOAA'}},
  night:{url:'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',opts:{maxZoom:20,subdomains:'abcd',attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'}},
  street:{url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',opts:{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}}
};
let tiles=null,tileErrors=0;
function setBasemap(name){
  if(!BASEMAPS[name])return;
  currentBase=name;
  if(mapEl)mapEl.dataset.basemap=name;
  if(tiles)map.removeLayer(tiles);
  tileErrors=0;
  tiles=L.tileLayer(BASEMAPS[name].url,BASEMAPS[name].opts).addTo(map);
  tiles.on('tileerror',()=>{tileErrors++;if(tileErrors>5){const s=document.getElementById('map-status');s.hidden=false;s.textContent='The street map is temporarily unavailable. Place pins and the full reading guide remain available.';}});
  tiles.on('load',()=>{if(tileErrors<6)document.getElementById('map-status').hidden=true;});
  for(const b of document.querySelectorAll('[data-basemap]'))b.setAttribute('aria-pressed',String(b.dataset.basemap===name));
}
setBasemap('field');
const clusters=L.markerClusterGroup({showCoverageOnHover:false,maxClusterRadius:38,spiderfyOnMaxZoom:true,animate:!reduced(),iconCreateFunction:c=>L.divIcon({html:String(c.getChildCount()),className:'cluster-pin',iconSize:[34,34]})});map.addLayer(clusters);
function icon(r){const k=pinKind(r);return L.divIcon({html:`<span class="map-pin ${k} ${selected===r.id?'selected':''} ${hovered===r.id?'hovered':''}" aria-hidden="true">${pinSvg(r)}</span>`,className:'pin-wrap',iconSize:[32,32],iconAnchor:[16,16]});}
function topicMatch(r){if(!topic||topic==='all')return true;const ts=r.topics||[];if(topic==='parapolitics')return ts.some(t=>PARAPOLITICS.has(t));return ts.includes(topic);}
function matchesQuickFilter(r,f){const ts=r.topics||[];return f==='all'||f==='sites'&&r.category!=='Bar'||f==='bars'&&r.category==='Bar'||f==='tiki'&&ts.includes('tiki_bars')||f==='dining'&&ts.includes('classic_dining')||f==='vegan'&&ts.includes('vegan_dining')||f==='west'&&isWest(r)||f==='castaneda'&&['H33','H34'].includes(r.id);}
function allowed(r){return matchesQuickFilter(r,filter)&&(pinFilter==='all'||pinKind(r)===pinFilter)&&topicMatch(r)&&(region==='all'||r.region===region)&&(!query||[r.name,r.category,...(r.topic_labels||[]),r.location_role_label||'',r.address,r.story,r.region,r.id].join(' ').toLowerCase().includes(query));}
function filtered(){return records.filter(allowed);}
function updateFilterCounts(){
  const labels={all:'All',sites:'Sites',bars:'Bars & Dining',tiki:'Tiki',dining:'Steak & Booths',vegan:'Vegan',west:'Jolly West',castaneda:'Castaneda'};
  for(const b of document.querySelectorAll('[data-filter]')){
    const f=b.dataset.filter;
    const n=records.filter(r=>matchesQuickFilter(r,f)).length;
    b.innerHTML=`${esc(labels[f]||b.textContent)} <span class="pill-count">${n}</span>`;
    b.setAttribute('aria-pressed',String(f===filter));
  }
}
function resetAllFilters(){
  filter='all';pinFilter='all';topic='all';query='';region='all';
  search.value='';if(topicSelect)topicSelect.value='all';document.getElementById('region').value='all';
  renderLegend();refresh();fit();
}
function refresh(){
  const items=filtered();
  clusters.clearLayers();
  for(const r of items)clusters.addLayer(markerById.get(r.id));
  count.textContent=`${items.length} of ${records.length} places`;
  const hasActive=filter!=='all'||pinFilter!=='all'||topic!=='all'||region!=='all'||Boolean(query);
  if(clearBtn)clearBtn.hidden=!hasActive;
  list.innerHTML=items.length?items.map(r=>{const k=pinKind(r);const sub=r.topic_labels?.length?r.topic_labels.join(' · '):r.category;return `<button class="place-item" data-id="${esc(r.id)}"><span class="place-code ${k}" title="${esc(r.location_role_label||r.category)}">${pinSvg(r)}</span><span><span class="place-title">${esc(r.name)}</span><span class="place-sub">${esc(sub)}</span></span></button>`;}).join(''):'<p class="empty">No places match. Try clearing a filter or searching another name.</p>';
  updateFilterCounts();
  renderLegend();
}
function fit(){const items=filtered();if(items.length)map.fitBounds(L.latLngBounds(items.map(r=>[r.lat,r.lon])),{padding:mobile()?[35,65]:[55,55],maxZoom:13,animate:!reduced()});}
function layout(){app.classList.toggle('detail-mode',view==='detail'&&mobile());app.classList.toggle('reading-mode',view==='reading'&&mobile());browse.hidden=view!=='browse';browse.style.display=view==='browse'?'flex':'none';detail.hidden=view!=='detail';room.hidden=view!=='reading';if(view==='reading'&&mobile())app.classList.add('list-mode');if(view==='detail')app.classList.remove('list-mode');toggle.textContent=app.classList.contains('list-mode')?'Back to map':'View place list';setTimeout(()=>map.invalidateSize(),50);}
function back(){view='browse';selected=null;app.classList.remove('list-mode','reading-mode');for(const r of records)markerById.get(r.id).setIcon(icon(r));layout();}
function choose(id,move=true){const r=records.find(x=>x.id===id);if(!r)return;if(!allowed(r)){filter='all';pinFilter='all';topic='all';query='';region='all';search.value='';if(topicSelect)topicSelect.value='all';document.getElementById('region').value='all';refresh();}selected=id;view='detail';for(const x of records)markerById.get(x.id).setIcon(icon(x));const barIds=[...new Set((r.bar_pairing||'').match(/B\d+/g)||[])];const readings=placeReadings(r);const tags=(r.topic_labels||[]).map((lbl,i)=>`<button class="topic-chip" data-topic-chip="${esc((r.topics||[])[i]||'')}">${esc(lbl)}</button>`).join('');const webLink=r.website&&r.website!==r.wikipedia_url?`<a href="${esc(safeUrl(r.website))}" target="_blank" rel="noopener noreferrer">Official website ↗</a>`:'';detail.innerHTML=`<button class="back-button" data-back>← All places</button><div class="detail-eyebrow">${esc(r.location_role_label||r.category)} · ${esc(r.region)} · <span class="muted-id">${esc(r.id)}</span></div><h2>${esc(r.name)}</h2>${tags?`<div class="topic-chips">${tags}</div>`:''}<p class="address">${esc(r.address)}</p><p>${esc(r.story)}</p><h3>Evidence</h3><p class="evidence">${esc(r.evidence)}</p><h3>What remains uncertain</h3><p>${esc(r.limits)}</p><h3>Visiting</h3><p>${esc(r.access)}</p><div class="link-row"><a href="${safeUrl(r.maps_url)}" target="_blank" rel="noopener noreferrer">Open location in Google Maps ↗</a>${webLink}</div>${r.related_places?.length?`<h3>Connected places</h3>${r.related_places.map(id=>{const x=records.find(p=>p.id===id);return x?`<button class="bar-link" data-place="${esc(id)}"><span class="place-code mini ${pinKind(x)}">${pinSvg(x)}</span><span>${esc(x.name)} ↗</span></button>`:''}).join('')}`:''}${barIds.length?`<h3>Optional bar pairing</h3><p class="entity-note">${esc(r.bar_pairing)}</p>${barIds.map(id=>{const b=records.find(x=>x.id===id);return b?`<button class="bar-link" data-place="${esc(id)}"><span class="place-code mini ${pinKind(b)}">${pinSvg(b)}</span><span>${esc(b.name)} ↗</span></button>`:''}).join('')}`:''}<h3>Reading &amp; sources</h3><ul>${readings.map(s=>`<li><a href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></li>`).join('')}</ul>${r.wikipedia_url||r.wikidata_url?`<h3>Encyclopedia entries</h3><div class="link-row">${r.wikipedia_url?`<a href="${esc(safeUrl(r.wikipedia_url))}" target="_blank" rel="noopener noreferrer">Wikipedia ↗</a>`:''}${r.wikidata_url?`<a href="${esc(safeUrl(r.wikidata_url))}" target="_blank" rel="noopener noreferrer">Wikidata ${esc(r.wikidata_id)} ↗</a>`:''}</div><p class="entity-note">Related entry: ${esc(r.wiki_relation)}.</p>`:''}<p class="map-note">Approximate location. ${esc(r.coordinate_basis)}.<br>Researched November 2026.</p>`;detail.scrollTop=0;layout();const m=markerById.get(id);clusters.zoomToShowLayer(m,()=>{if(move)map.setView([r.lat,r.lon],Math.max(map.getZoom(),14),{animate:!reduced()});});}
function readingRoom(){
view='reading';selected=null;
const featured=[
 {url:'https://openlibrary.org/books/OL3404595M/The_visionary_state',tag:'Start here · regional overview',title:'The Visionary State',by:'Erik Davis · photographs by Michael Rauner · 2006',note:'The closest broad match for the spiritual and occult landscape: places, architecture and religious movements across California. It does not cover every political or intelligence stop.',consulted:'Consulted: catalog contents and Davis’s own Hollywood tour account. Full book not read here.',extra:'https://techgnosis.com/visionary-hollywood-tour/',extraTitle:'Read the author’s tour notes'},
 {url:'https://orbooks.com/catalog/american-trickster/',tag:'Carlos Castaneda · biography',title:'American Trickster: The Hidden Lives of Carlos Castaneda',by:'Ru Marshall · 2026',note:'A recent investigation to pair with the Westwood compound and UCLA collection. Compare the biographer’s reconstruction with participant testimony and institutional records.',consulted:'Consulted: a published book excerpt and publisher information; not the full book.',extra:'https://crimereads.com/ru-marshall-on-the-curious-lives-and-legends-of-carlos-castaneda/',extraTitle:'Read the published excerpt'},
 {url:'https://www.northatlanticbooks.com/shop/sorcerers-apprentice/',tag:'Carlos Castaneda · participant memoir',title:'Sorcerer’s Apprentice: My Life with Carlos Castaneda',by:'Amy Wallace',note:'An intimate account by a former partner and participant. A primary perspective on the circle, with the limits of a personal memoir.',consulted:'Bibliographic scope checked through the publisher. Full memoir not read here.'},
 {url:'https://us.macmillan.com/books/9780312607173/orangesunshine/',tag:'Orange County · Brotherhood of Eternal Love',title:'Orange Sunshine',by:'Nicholas Schou · 2010',note:'The focused companion to Mystic Arts World and the Brotherhood’s Laguna Beach history. Pin locations are corroborated separately through reporting.',consulted:'Consulted: the publisher’s opening excerpt and book description; not the full book.'}
];
const seen=new Set(featured.map(b=>b.url)),books=[];
for(const r of records)for(const b of r.reading_list||[]){if(b.title.startsWith('Suggested book:')&&!seen.has(b.url)){seen.add(b.url);books.push(b);}}
room.innerHTML=`<button class="back-button" data-back>← Back to places</button><div class="detail-eyebrow">THE CLUB’S READING ROOM</div><h2>Follow the footnotes.</h2><p class="reading-intro">A shelf for Greater Los Angeles, the valleys, Orange County and Ventura County.</p><p>No single book covers this whole map. Start with a regional overview, then choose a focused investigation or memoir. Each pin links its own supporting documents.</p>${featured.map(b=>`<div class="reading-book"><span class="book-tag">${esc(b.tag)}</span><a href="${safeUrl(b.url)}" target="_blank" rel="noopener noreferrer">${esc(b.title)} ↗</a><p>${esc(b.by)}</p><p>${esc(b.note)}</p><p>${esc(b.consulted)}</p>${b.extra?`<a class="text-button" href="${safeUrl(b.extra)}" target="_blank" rel="noopener noreferrer">${esc(b.extraTitle)} ↗</a>`:''}</div>`).join('')}<h3>Other threads on the shelf</h3>${books.map(b=>`<div class="reading-book"><a href="${safeUrl(b.url)}" target="_blank" rel="noopener noreferrer">${esc(b.title.replace('Suggested book: ',''))} ↗</a></div>`).join('')}<h3>Jolly West: start with the archive</h3><p>Collection 590 at UCLA Library Special Collections is a research route. The Institute pin marks an institutional connection, not a verified experiment room. Read <em>CHAOS</em> alongside the documents; its investigative arguments are not all established findings.</p><button class="bar-link" data-place="H30">Explore the West papers ↗</button><h3>A literary detour in Orange County</h3><p>Philip K. Dick’s papers at Pollak Library connect the club’s themes with fiction, surveillance and religious experience. The archive pin is distinct from the locations of events he described.</p><button class="bar-link" data-place="H41">Explore the Dick papers ↗</button><h3>About this guide</h3><p>Documented secrecy, religious movements, occult institutions and disputed stories have different kinds of evidence. Read the evidence and limits in each pin. A place’s inclusion does not establish coercion, criminality or membership in a common network.</p><p>The former Altadena Theosophical Library was destroyed in the 2025 Eaton Fire. Former sites, archives and functioning institutions have different visiting arrangements.</p><p>Locations are approximate; access can change.</p>`;
room.scrollTop=0;layout();
}
list.addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(b)choose(b.dataset.id);});
list.addEventListener('mouseover',e=>{const b=e.target.closest('[data-id]');const id=b?b.dataset.id:null;if(id===hovered)return;const prev=hovered;hovered=id;if(prev&&markerById.has(prev)){const pm=markerById.get(prev);pm.setIcon(icon(records.find(x=>x.id===prev)));pm.closeTooltip();}if(hovered&&markerById.has(hovered)){const hm=markerById.get(hovered);hm.setIcon(icon(records.find(x=>x.id===hovered)));if(hm._icon)hm.openTooltip();}});
list.addEventListener('mouseleave',()=>{if(!hovered)return;const prev=hovered;hovered=null;if(markerById.has(prev)){const pm=markerById.get(prev);pm.setIcon(icon(records.find(x=>x.id===prev)));pm.closeTooltip();}});
document.querySelector('.filters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(b){filter=b.dataset.filter;pinFilter='all';refresh();fit();}});
if(legendEl)legendEl.addEventListener('click',e=>{const b=e.target.closest('[data-pin-kind]');if(b){const k=b.dataset.pinKind;pinFilter=pinFilter===k?'all':k;refresh();fit();}});
document.querySelector('.basemap-bar')?.addEventListener('click',e=>{const b=e.target.closest('[data-basemap]');if(b)setBasemap(b.dataset.basemap);});
if(clearBtn)clearBtn.addEventListener('click',resetAllFilters);
search.addEventListener('input',()=>{query=search.value.trim().toLowerCase();refresh();});if(topicSelect)topicSelect.addEventListener('change',e=>{topic=e.target.value;refresh();fit();});document.getElementById('region').addEventListener('change',e=>{region=e.target.value;refresh();fit();});document.getElementById('fit-results').addEventListener('click',()=>{app.classList.remove('list-mode');layout();fit();});document.getElementById('reading-button').addEventListener('click',readingRoom);document.addEventListener('click',e=>{if(e.target.closest('[data-back]'))back();const b=e.target.closest('[data-place]');if(b)choose(b.dataset.place);const chip=e.target.closest('[data-topic-chip]');if(chip&&chip.dataset.topicChip){topic=chip.dataset.topicChip;if(topicSelect)topicSelect.value=topic;back();refresh();fit();}});toggle.addEventListener('click',()=>{if(view!=='browse'){back();return;}app.classList.toggle('list-mode');layout();});document.addEventListener('keydown',e=>{if(e.key==='Escape')back();});window.addEventListener('resize',layout);
fetch('assets/places.geojson?v=20261106d').then(r=>{if(!r.ok)throw new Error('Data could not be loaded');return r.json();}).then(data=>{records=data.features.map(f=>({...f.properties,lon:f.geometry.coordinates[0],lat:f.geometry.coordinates[1]}));for(const r of records){const m=L.marker([r.lat,r.lon],{icon:icon(r),title:r.name,alt:r.name,keyboard:true}).bindTooltip(r.name,{direction:'top',offset:[0,-15]});m.on('click',()=>choose(r.id));markerById.set(r.id,m);}document.getElementById('total-count').textContent=`${records.length} places`;refresh();fit();const hash=placeHash(location.hash);if(records.some(r=>r.id===hash))choose(hash);}).catch(err=>{count.textContent='Guide unavailable';list.innerHTML='<p class="empty">The place data could not be loaded. Please refresh the page.</p>';console.error(err);});
