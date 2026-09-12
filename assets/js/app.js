
const EV={
  money:n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n),
  favorites:new Set(JSON.parse(localStorage.getItem('estatevista-favorites')||'[]')),
  compare:new Set(JSON.parse(localStorage.getItem('estatevista-compare')||'[]')),
  save(){localStorage.setItem('estatevista-favorites',JSON.stringify([...this.favorites]));localStorage.setItem('estatevista-compare',JSON.stringify([...this.compare]));this.syncBadges()},
  syncBadges(){document.querySelectorAll('[data-fav-count]').forEach(el=>el.textContent=this.favorites.size);document.querySelectorAll('[data-compare-count]').forEach(el=>el.textContent=this.compare.size)},
  toast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(window.__evt);window.__evt=setTimeout(()=>t.classList.remove('show'),2200)}
};

document.addEventListener('DOMContentLoaded',()=>{
  EV.syncBadges();
  const mt=document.querySelector('.menu-toggle'), nl=document.querySelector('.nav-links');
  mt?.addEventListener('click',()=>{nl.classList.toggle('open');document.body.classList.toggle('menu-open')});
  document.querySelectorAll('.favorite').forEach(btn=>{const s=btn.dataset.slug;if(EV.favorites.has(s))btn.classList.add('active');btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();EV.favorites.has(s)?EV.favorites.delete(s):EV.favorites.add(s);btn.classList.toggle('active');EV.save();EV.toast(btn.classList.contains('active')?'Saved to favorites':'Removed from favorites')})});
  document.querySelectorAll('[data-compare]').forEach(btn=>{const s=btn.dataset.compare;if(EV.compare.has(s))btn.textContent='✓ Added to compare';btn.addEventListener('click',()=>{if(EV.compare.has(s)){EV.compare.delete(s);btn.textContent='+ Add to compare';}else{if(EV.compare.size>=3){EV.toast('Compare up to 3 homes at a time');return}EV.compare.add(s);btn.textContent='✓ Added to compare'}EV.save();EV.toast('Comparison updated')})});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.13});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  initFilters(); initMortgage(); initContact(); initFavorites(); initCompare();
});

function initFilters(){
 const grid=document.querySelector('[data-property-grid]'); if(!grid)return;
 const cards=[...grid.querySelectorAll('[data-card]')];
 const inputs=['locationFilter','typeFilter','priceFilter','bedsFilter'].map(id=>document.getElementById(id)).filter(Boolean);
 const count=document.querySelector('[data-result-count]');
 const apply=()=>{let visible=0;cards.forEach(c=>{const loc=document.getElementById('locationFilter')?.value||'';const type=document.getElementById('typeFilter')?.value||'';const price=+(document.getElementById('priceFilter')?.value||0);const beds=+(document.getElementById('bedsFilter')?.value||-1);const ok=(!loc||c.dataset.neighborhood===loc)&&(!type||c.dataset.type===type)&&(!price||+c.dataset.price<=price)&&(beds<0||+c.dataset.beds>=beds);c.classList.toggle('hide',!ok);if(ok)visible++});if(count)count.textContent=visible+' homes';document.querySelector('[data-empty]')?.classList.toggle('hide',visible!==0)};
 inputs.forEach(i=>i.addEventListener('change',apply));apply();
}

function initMortgage(){
 const form=document.querySelector('[data-mortgage]');if(!form)return;const out=document.querySelector('[data-monthly]'),total=document.querySelector('[data-total-interest]');
 const calc=()=>{const price=+form.price.value||0,down=+form.down.value||0,rate=(+form.rate.value||0)/100/12,months=(+form.years.value||30)*12,loan=Math.max(0,price-down);let payment=0;if(rate===0)payment=loan/months;else payment=loan*rate*Math.pow(1+rate,months)/(Math.pow(1+rate,months)-1);out.textContent=EV.money(payment)+'/mo';total.textContent=EV.money(payment*months-loan)};form.addEventListener('input',calc);calc();
}

function initContact(){
 document.querySelectorAll('[data-demo-form]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const note=f.querySelector('.notice');if(note){note.classList.add('show');note.textContent='Thanks — this portfolio demo has captured the interaction locally. No message was sent.'}f.reset()}));
}

async function loadProps(){return fetch('assets/data/properties.json').then(r=>r.json()).catch(()=>[])}
function cardMarkup(p){return `<article class="card property-card"><a href="property-${p.slug}.html"><div class="media"><img src="assets/images/${p.slug}-1.svg" alt="${p.title}"><span class="tag">${p.tag}</span></div><div class="body"><div class="price">${EV.money(p.price)}</div><h3>${p.title}</h3><div class="muted">${p.neighborhood} · ${p.type}</div><div class="specs"><span>${p.beds||'Studio'} ${p.beds===1?'bed':'beds'}</span><span>${p.baths} baths</span><span>${p.sqft.toLocaleString()} sq ft</span></div></div></a></article>`}
async function initFavorites(){const wrap=document.querySelector('[data-favorites-grid]');if(!wrap)return;const props=await loadProps();const items=props.filter(p=>EV.favorites.has(p.slug));wrap.innerHTML=items.length?items.map(cardMarkup).join(''):`<div class="empty-state"><h3>No saved homes yet</h3><p class="muted">Browse the collection and tap the heart to build your shortlist.</p><a class="btn btn-primary" href="properties.html">Explore properties</a></div>`}
async function initCompare(){const wrap=document.querySelector('[data-compare-table]');if(!wrap)return;const props=await loadProps();const items=props.filter(p=>EV.compare.has(p.slug));if(!items.length){wrap.innerHTML=`<div class="empty-state"><h3>Your comparison is empty</h3><p class="muted">Add up to three homes from property detail pages.</p><a class="btn btn-primary" href="properties.html">Browse homes</a></div>`;return}const rows=[['Price',p=>EV.money(p.price)],['Neighborhood',p=>p.neighborhood],['Type',p=>p.type],['Bedrooms',p=>p.beds||'Studio'],['Bathrooms',p=>p.baths],['Interior',p=>p.sqft.toLocaleString()+' sq ft'],['Year built',p=>p.year],['Parking',p=>p.parking],['HOA / month',p=>p.hoa?EV.money(p.hoa):'None']];wrap.innerHTML=`<div style="overflow:auto"><table class="compare-table"><thead><tr><th>Feature</th>${items.map(p=>`<th>${p.title}</th>`).join('')}</tr></thead><tbody>${rows.map(([k,fn])=>`<tr><td><b>${k}</b></td>${items.map(p=>`<td>${fn(p)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
