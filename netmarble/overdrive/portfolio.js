// Project-neutral rendering: no Overdrive manuscript, paths, or game rules here.
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inline=v=>esc(v).replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
const paragraphs=v=>String(v||'').split(/\n\s*\n/).filter(p=>p.trim()).map(p=>`<p>${inline(p).replace(/\n/g,'<br>')}</p>`).join('');
const url=v=>{if(!v)return '';if(/^data:(image\/(png|jpeg|webp|gif|avif)|video\/(mp4|webm|ogg));base64,/i.test(v))return v;try{return ['https:','http:'].includes(new URL(v,globalThis.location?.href||'https://example.invalid/').protocol)?v:''}catch{return ''}};
const media=(src,kind='image',caption='',poster='',alt='')=>url(src)?`<figure>${kind==='video'?`<video controls playsinline preload="none" ${url(poster)?`poster="${esc(url(poster))}"`:''} src="${esc(url(src))}" aria-label="${esc(alt||caption||'영상')}"></video>`:`<button class="image-zoom" data-zoom="${esc(url(src))}" aria-label="${esc(alt||caption||'이미지')} 확대"><img src="${esc(url(src))}" alt="${esc(alt||caption)}" loading="lazy"></button>`}${caption?`<figcaption>${esc(caption)}</figcaption>`:''}</figure>`:'<div class="empty-media">이미지 또는 영상을 추가하세요</div>';
function chart(b,template){const style=b.chartStyle==='auto'?({editorial:'line',cinema:'stages',lab:'detail'}[template]):b.chartStyle;const max=Math.max(1,...b.items.map(x=>Number(x.value)||0));let visual='';
 if(style==='line'){const pts=b.items.map((x,i)=>[50+(b.items.length===1?275:i*550/(b.items.length-1)),210-(Number(x.value)||0)/max*160]);visual=`<svg viewBox="0 0 650 260" role="img" aria-label="${esc(b.items.map(i=>i.title+' '+i.value).join(', '))}"><path class="chart-grid" d="M40 210H620M40 130H620M40 50H620"/><path class="chart-line" d="${pts.map((p,i)=>(i?'L':'M')+p.join(' ')).join(' ')}"/>${pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="5"/><text x="${p[0]}" y="${p[1]-15}">${b.items[i].value}</text><text x="${p[0]}" y="245">${esc(b.items[i].title)}</text>`).join('')}</svg>`;}
 if(style==='bars')visual=`<div class="bars">${b.items.map(i=>`<div><span>${esc(i.title)}</span><i style="width:${(Number(i.value)||0)/max*75}%"></i><b>${i.value}</b></div>`).join('')}</div>`;
 if(style==='stages')visual=`<div class="stages">${b.items.map((i,n)=>`<button data-item="${n}" aria-pressed="${n===0}"><span>${esc(i.title)}</span><strong>${i.value}</strong><small>${esc(b.unit)}</small></button>`).join('')}</div>`;
 const choices=style==='stages'?'':`<div class="item-choices" role="group" aria-label="데이터 항목 선택">${b.items.map((i,n)=>`<button data-item="${n}" aria-pressed="${n===0}">${esc(i.title)}</button>`).join('')}</div>`;
 return `<div class="chart-widget" data-chart-style="${style}">${visual}${choices}<div class="item-detail">${chartDetail(b.items[0],b.unit,style==='detail')}</div></div>`;
}
function chartDetail(i,unit,large){return i?`<div><span class="eyebrow">${esc(i.title)}</span>${large?`<strong class="big-value">${i.value}<small>${esc(unit)}</small></strong>`:''}${paragraphs(i.body)}</div>${url(i.src)?media(i.src,i.kind,'근거 자료'):''}`:'<p>데이터를 추가하세요.</p>';}
function list(b,template){const mode=b.type==='steps'?({editorial:'timeline',cinema:'tabs',lab:'accordion'}[template]):b.type;
 if(mode==='gallery')return `<div class="visual-cards" style="--columns:${Math.max(2,Math.min(4,b.gridColumns||2))}">${b.items.map(i=>`<article>${url(i.src)?media(i.src,i.kind,'',i.poster):''}<div><h3>${esc(i.title)}</h3>${paragraphs(i.body)}</div></article>`).join('')}</div>`;
 if(mode==='flow')return `<ol class="flow-strip" style="--columns:${Math.min(4,Math.max(1,b.items.length))}">${b.items.map((i,n)=>`<li><span class="flow-number">${String(n+1).padStart(2,'0')}</span>${url(i.src)?media(i.src,i.kind,'',i.poster):''}<h3>${esc(i.title)}</h3>${paragraphs(i.body)}${n<b.items.length-1?'<span class="flow-arrow" aria-hidden="true">→</span>':''}</li>`).join('')}</ol>`;
 if(mode==='grid')return `<div class="card-grid" style="--columns:${Math.max(2,Math.min(4,b.gridColumns||3))}">${b.items.map((i,n)=>`<details class="expand-card"><summary><small>${String(n+1).padStart(2,'0')}</small><h3>${esc(i.title)}</h3><span>자세히 ＋</span></summary><div>${paragraphs(i.body)}${url(i.src)?media(i.src,i.kind,'',i.poster):''}</div></details>`).join('')}</div>`;
 if(mode==='accordion')return `<div class="accordion">${b.items.map((i,n)=>`<details ><summary><small>${String(n+1).padStart(2,'0')}</small>${esc(i.title)}</summary><div>${paragraphs(i.body)}${url(i.src)?media(i.src,i.kind,'',i.poster):''}</div></details>`).join('')}</div>`;
 if(mode==='timeline')return `<ol class="timeline">${b.items.map((i,n)=>`<li><span>${String(n+1).padStart(2,'0')}</span><div><h3>${esc(i.title)}</h3>${paragraphs(i.body)}${url(i.src)?media(i.src,i.kind,'',i.poster):''}</div></li>`).join('')}</ol>`;
 return `<div class="tabs-widget"><div role="tablist" aria-label="${esc(b.title||'항목')}" class="item-choices">${b.items.map((i,n)=>`<button role="tab" data-tab="${n}" id="tab-${b.id}-${n}" aria-controls="panel-${b.id}" aria-selected="${n===0}" tabindex="${n===0?0:-1}">${esc(i.title)}</button>`).join('')}</div><div id="panel-${b.id}" role="tabpanel" aria-labelledby="tab-${b.id}-0" class="tab-detail">${tabDetail(b.items[0])}</div></div>`;
}
function tabDetail(i){return i?`<div><h3>${esc(i.title)}</h3>${paragraphs(i.body)}</div>${url(i.src)?media(i.src,i.kind,'',i.poster):''}`:'<p>항목을 추가하세요.</p>';}
function carousel(b){
 if(!b.items.length) return '';
 const count=b.items.length;
 const pad=count>1?2:0;
 const cards=Array.from({length:count+2*pad},(_,slot)=>{
   const n=((slot-pad)%count+count)%count,it=b.items[n];
   return `<div class="carousel-card" data-index="${n}" data-copy="${slot<pad||slot>=pad+count}"><div class="carousel-picture">${media(it.src,it.kind,'',it.poster,it.title)}</div></div>`;
 });
 const arrow=(step,label,glyph)=>count===1?'':`<button type="button" class="carousel-arrow" data-step="${step}" aria-label="${label}">${glyph}</button>`;
 return `<div class="media-carousel" role="region" aria-label="${esc(b.title)}"><div class="carousel-stage">${arrow(-1,'이전 자료','←')}<div class="carousel-track" tabindex="0" aria-label="사진 가로 탐색">${cards.join('')}</div>${arrow(1,'다음 자료','→')}</div><div class="carousel-caption" aria-live="polite"></div></div>`;
}
function pairedVideo(b){
 const frames=['left','right'].map(side=>{
   const src=url(b[side+'Src']),label=esc(b[side+'Caption']);
   return `<figure>${src?`<video muted playsinline preload="metadata" src="${esc(src)}" aria-label="${label}"></video>`:'<div class="empty-media">영상을 추가하세요</div>'}<figcaption>${label}</figcaption></figure>`;
 });
 return `<div class="sync-widget"><div class="sync-films">${frames.join('')}</div><div class="sync-transport"><button type="button" data-play disabled>함께 재생</button><input type="range" min="0" max="1" value="0" step="0.05" aria-label="두 영상의 경과 시간" disabled><output>0.0초</output></div><div class="sync-stops">${b.items.map(it=>`<button type="button" data-time="${Number(it.value)||0}" disabled>${esc(it.title)}</button>`).join('')}</div></div>`;
}
function bindCarousel(section,b,signal){
 const box=section.querySelector('.media-carousel');
 if(!box)return;
 const track=box.querySelector('.carousel-track'),cards=[...track.children],count=b.items.length;
 const pad=count>1?2:0;
 let active=-1, target=null, lastWheel=-Infinity;
 function paint(slot){
   if(active===slot)return;
   active=slot;
   cards.forEach((card,i)=>{
     card.classList.toggle('centered',i===slot);
     card.setAttribute('aria-hidden',String(i!==slot));
     card.querySelectorAll('button,video').forEach(control=>control.tabIndex=i===slot?0:-1);
     if(i!==slot)card.querySelector('video')?.pause();
   });
   const item=b.items[Number(cards[slot].dataset.index)];
   box.querySelector('.carousel-caption').innerHTML=`<h3>${esc(item.title)}</h3>${paragraphs(item.body)}`;
 }
 function center(slot,behavior='instant'){
   const card=cards[slot];
   track.scrollTo({left:card.offsetLeft+(card.offsetWidth-track.clientWidth)/2,behavior});
 }
 function move(slot){
   target=Math.max(0,Math.min(cards.length-1,slot));
   center(target,matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth');
 }
 function step(delta){move((target??active)+delta)}
 let layoutWidth=0;
 track.onscroll=()=>{
   if(!track.clientWidth || cards.length===1)return;
   if(track.clientWidth!==layoutWidth){align();return}
   const pitch=cards[1].offsetLeft-cards[0].offsetLeft;
   const x=track.scrollLeft+(track.clientWidth-cards[0].offsetWidth)/2-cards[0].offsetLeft;
   paint(Math.max(0,Math.min(cards.length-1,Math.round(x/pitch))));
 };
 track.onscrollend=()=>{
   target=null;
   if(cards[active]?.dataset.copy==='true'){
     const slot=pad+Number(cards[active].dataset.index);
     paint(slot);center(slot);
   }
 };
 paint(pad);
 function align(){
   layoutWidth=track.clientWidth;
   if(layoutWidth)center(target??active);
 }
 align();
 const observer=new ResizeObserver(align);
 observer.observe(track);
 signal.addEventListener('abort',()=>observer.disconnect(),{once:true});
 box.querySelectorAll('[data-step]').forEach(el=>el.onclick=()=>step(Number(el.dataset.step)));
 track.addEventListener('click',e=>{
   const card=e.target.closest('.carousel-card'),slot=cards.indexOf(card);
   if(slot>=0&&slot!==active){e.preventDefault();e.stopPropagation();move(slot)}
 },true);
 track.addEventListener('wheel',e=>{
   if(count===1||e.ctrlKey||e.shiftKey||Math.abs(e.deltaX)>=Math.abs(e.deltaY))return;
   e.preventDefault();e.stopPropagation();
   const now=performance.now();
   if(now-lastWheel>140)step(Math.sign(e.deltaY));
   lastWheel=now;
 },{passive:false});
 box.onkeydown=e=>{
   if(!['ArrowLeft','ArrowRight'].includes(e.key))return;
   e.preventDefault();step(e.key==='ArrowLeft'?-1:1);
 };
}
function bindPairedVideo(box,signal){
 const clips=[...box.querySelectorAll('video')];
 if(clips.length!==2)return;
 const [lead,other]=clips,range=box.querySelector('input'),output=box.querySelector('output'),play=box.querySelector('[data-play]');
 let end=0;
 function display(t){range.value=t;output.textContent=t.toFixed(1)+'초';range.setAttribute('aria-valuetext',output.textContent)}
 function pause(){clips.forEach(v=>v.pause());play.textContent='함께 재생'}
 function seek(t){pause();t=Math.max(0,Math.min(end,t));clips.forEach(v=>{v.currentTime=t});display(t)}
 function ready(){
   if(!clips.every(v=>Number.isFinite(v.duration)))return;
   end=Math.min(...clips.map(v=>v.duration));range.max=end;range.disabled=false;play.disabled=false;
   box.querySelectorAll('[data-time]').forEach(el=>el.disabled=Number(el.dataset.time)>end);
 }
 const prepared=new Set();
 async function prepare(v){
   // Servers without byte ranges may decode the entire clip but seek only to 0.
   if(!/^(blob:|data:)/.test(v.src) && (!v.seekable.length || v.seekable.end(0)===0)){
     try{
       const response=await fetch(v.src,{signal});
       if(!response.ok)throw Error();
       const blob=await response.blob();
       if(signal.aborted)return;
       const local=URL.createObjectURL(blob);
       signal.addEventListener('abort',()=>URL.revokeObjectURL(local),{once:true});
       v.src=local;
       return;
     }catch{if(!signal.aborted)output.textContent='영상 탐색 불가';return}
   }
   prepared.add(v);
   if(prepared.size===clips.length)ready();
 }
 clips.forEach(v=>{
   v.onloadedmetadata=()=>prepare(v);
   if(v.readyState>=1)prepare(v);
   v.onended=pause;
   v.onpause=()=>{if(!lead.paused||!other.paused)pause();play.textContent='함께 재생'};
 });
 play.onclick=async()=>{
   if(!lead.paused){pause();return}
   if(lead.currentTime>=end-0.05)seek(0);
   try {await Promise.all(clips.map(v=>v.play()));play.textContent='일시 정지'}catch{pause()}
 };
 range.oninput=()=>seek(Number(range.value));
 box.querySelectorAll('[data-time]').forEach(el=>el.onclick=()=>seek(Number(el.dataset.time)));
 lead.ontimeupdate=()=>{
   if(lead.paused)return;
   display(Math.min(end,lead.currentTime));
   if(lead.currentTime>=end){pause();return}
   if(Math.abs(other.currentTime-lead.currentTime)>0.15)other.currentTime=lead.currentTime;
 };
}
function blockContent(b,template){switch(b.type){
 case 'carousel':return `<h2>${esc(b.title)}</h2>${paragraphs(b.body)}${carousel(b)}`;
 case 'syncvideo':return `${b.title?`<h2>${esc(b.title)}</h2>`:''}${paragraphs(b.body)}${pairedVideo(b)}`;
 case 'heading':return `<p class="eyebrow">${esc(b.caption)}</p><h2>${esc(b.title)}</h2>${paragraphs(b.body)}`;
 case 'text':return `${b.title?`<h2>${esc(b.title)}</h2>`:''}${paragraphs(b.body)}`;
 case 'quote':return `<blockquote><span>${esc(b.title)}</span>${paragraphs(b.body)}<cite>${esc(b.caption)}</cite></blockquote>`;
 case 'image':case 'video':return `${b.title?`<h2>${esc(b.title)}</h2>`:''}${media(b.src,b.type,b.caption,b.poster,b.alt)}`;
 case 'compare':return `<h2>${esc(b.title)}</h2><div class="media-pair">${media(b.leftSrc,b.leftKind,b.leftCaption)}${media(b.rightSrc,b.rightKind,b.rightCaption)}</div>${paragraphs(b.body)}`;
 case 'beforeafter':return `<h2>${esc(b.title)}</h2>${url(b.leftSrc)&&url(b.rightSrc)?`<div class="reveal" style="--split:50%"><img src="${esc(url(b.leftSrc))}" alt="${esc(b.leftCaption)}"><div class="after"><img src="${esc(url(b.rightSrc))}" alt="${esc(b.rightCaption)}"></div><span class="before-label">${esc(b.leftCaption)}</span><span class="after-label">${esc(b.rightCaption)}</span><div class="handle">↔</div><input type="range" min="0" max="100" value="50" aria-label="두 이미지 비교"></div>`:'<div class="empty-media">비교할 이미지 두 장을 추가하세요</div>'}${paragraphs(b.body)}`;
 case 'chart':return `<h2>${esc(b.title)}</h2>${paragraphs(b.body)}${chart(b,template)}<p class="caption">${esc(b.caption)}</p>`;
 case 'table':return `<h2>${esc(b.title)}</h2><div class="table-scroll"><table><caption>${esc(b.caption)}</caption><thead><tr>${b.columns.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r=>'<tr>'+b.columns.map((_,i)=>`<td>${inline(r[i])}</td>`).join('')+'</tr>').join('')}</tbody></table></div>${paragraphs(b.body)}`;
 default:return `<h2>${esc(b.title)}</h2>${paragraphs(b.body)}${list(b,template)}`;
}}
function render(doc,editing=false){const toc=doc.blocks.filter(b=>b.type==='heading');const nav=`<nav class="contents" aria-label="목차">${toc.map(b=>`<a href="#b-${b.id}">${esc(b.caption||b.title)}</a>`).join('')}</nav>`;const title=`<div class="title-copy"><p class="eyebrow">${esc(doc.kicker)}</p><h1>${esc(doc.title).replace(/\n/g,'<br>')}</h1><p>${esc(doc.subtitle).replace(/\n/g,'<br>')}</p><span>${esc(doc.author)}</span></div>`;const cover=url(doc.cover)?`<img class="cover" src="${esc(url(doc.cover))}" alt="${esc(doc.coverAlt)}">`:'<div class="cover empty-media">프로젝트 표지</div>';
 return `<div class="portfolio ${doc.template}" data-theme="${doc.theme}"><nav class="portfolio-bar"><span>${esc(doc.kicker)}</span><button data-toggle-theme> ${doc.theme==='light'?'☾ 다크':'☀ 화이트'}</button></nav><header class="document-header">${cover}${doc.coverCaption?`<p class="cover-caption">${esc(doc.coverCaption)}</p>`:""}${title}</header>${doc.template!=='editorial'?nav:''}<div class="document-body">${doc.template==='editorial'?nav:''}<main>${doc.blocks.map(b=>`<section id="b-${b.id}" data-block="${b.id}" class="block kind-${b.type} width-${b.width} tone-${b.tone} ${editing?'editable':''}" style="--body-size:${Math.min(72,Math.max(12,b.size))}px;--space:${Math.min(140,Math.max(0,b.space))}px;--media-height:${Math.max(0,b.height)||'auto'}${b.height?'px':''};--ratio:${['16/9','4/3','1/1'].includes(b.ratio)?b.ratio:'auto'};--fit:${b.fit==='cover'?'cover':'contain'};text-align:${['left','center','right'].includes(b.align)?b.align:'left'}">${editing?`<button class="select-block" data-select="${b.id}" aria-label="${esc(b.title||b.type)} 편집">편집</button>`:''}${blockContent(b,doc.template)}</section>`).join('')}</main></div><footer class="document-footer">${esc(doc.author)}<span>${esc(doc.title)}</span></footer><dialog class="zoom-dialog"><button data-close>닫기 ×</button><img alt="원본 이미지 확대"></dialog></div>`;
}
// The same chapter reader runs in Studio, the reading page and standalone HTML.
function mountChapters(root, signal) {
 const main = root.querySelector('main');
 const nav = root.querySelector('.contents');
 const links = [...nav.querySelectorAll('a')];
 if (!links.length) return;
 root.querySelector('.portfolio').classList.add('chapter-reader');
 const chapters = [];
 for (const block of [...main.children]) {
   if (block.classList.contains('kind-heading')) {
     const panel = document.createElement('article');
     panel.className = 'chapter-panel';
     panel.setAttribute('aria-labelledby', block.id);
     block.before(panel);
     chapters.push(panel);
   }
   chapters.at(-1)?.append(block);
 }
 const pager = document.createElement('nav');
 pager.className = 'chapter-pager';
 pager.setAttribute('aria-label','장 이동');
 main.append(pager);
 const buttons = [-1,1].map(step=>{
   const btn = document.createElement('button');
   btn.type = 'button';
   btn.onclick = ()=>go(active+step);
   pager.append(btn);
   return btn;
 });
 let active = -1;
 function show(index) {
   if (active===index) return;
   chapters[active]?.querySelectorAll('video').forEach(v=>v.pause());
   active = index;
   chapters.forEach((panel,i)=>{
     panel.hidden = i!==index;
     if(i===index) links[i].setAttribute('aria-current','page');
     else links[i].removeAttribute('aria-current');
   });
   buttons.forEach((btn,i)=>{
     const link = links[index+(i===0?-1:1)];
     btn.hidden = !link;
     if(link) btn.textContent = i===0?'← '+link.textContent:link.textContent+' →';
   });
 }
 let motion=null, turn=0;
 function stopMotion(){
   turn++;
   motion?.cancel();
   motion=null;
 }
 signal.addEventListener('abort',stopMotion,{once:true});
 async function go(index,fromBelow=false) {
   if (!chapters[index]) return;
   const direction=Math.sign(index-active);
   const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
   const opacity=getComputedStyle(main).opacity;
   stopMotion();
   const request=turn;
   const target = fromBelow ? pager : chapters[index].firstElementChild;
   if(!direction){
     target.scrollIntoView({block:fromBelow?'end':'start',behavior:reduce?'instant':'smooth'});
     return;
   }
   if(!reduce){
     motion=main.animate([{opacity,transform:'translateY(0)'},{opacity:0,transform:`translateY(${-direction*12}px)`}],{duration:125,easing:'ease-in',fill:'forwards'});
     try{await motion.finished}catch{return}
     if(request!==turn)return;
     motion.cancel();
   }
   show(index);
   if (location.hash!==links[index].hash) history.pushState(null,'',links[index].hash);
   target.tabIndex = -1;
   target.focus({preventScroll:true});
   target.scrollIntoView({block:fromBelow?'end':'start',behavior:'instant'});
   if(!reduce){
     motion=main.animate([{opacity:0,transform:`translateY(${direction*18}px)`},{opacity:1,transform:'translateY(0)'}],{duration:245,easing:'cubic-bezier(.2,.7,.25,1)'});
     try{await motion.finished}catch{return}
     if(request===turn)motion=null;
   }
 }
 function chapterFromHash(){
   const target = document.getElementById(location.hash.slice(1));
   return chapters.findIndex(panel=>target && panel.contains(target));
 }
 links.forEach((link,i)=>link.addEventListener('click',e=>{
   if(e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
   e.preventDefault();
   go(i);
 },{signal}));
 let hashIndex = chapterFromHash();
 show(hashIndex<0?0:hashIndex);
 if(hashIndex>=0) document.getElementById(location.hash.slice(1)).scrollIntoView({behavior:'instant'});
 window.addEventListener('hashchange',()=>{
   stopMotion();
   const index = chapterFromHash();
   if(index!==active) {
     show(index<0?0:index);
     document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant'});
   }
 },{signal});
 // A further scroll at the edge continues the manuscript in either direction.
 let lastTurn = -Infinity;
 function atEdge(delta) {
   if (motion) return true;
   if (performance.now()-lastTurn<650) return false;
   const forward = delta>0;
   const next = active+(forward?1:-1);
   if (!chapters[next]) return false;
   const edge = forward ? pager.getBoundingClientRect().bottom<=innerHeight+2
                        : chapters[active].firstElementChild.getBoundingClientRect().top>=24;
   if(!edge) return false;
   lastTurn = performance.now();
   go(next,!forward);
   return true;
 }
 window.addEventListener('wheel',e=>{
   if(e.ctrlKey || Math.abs(e.deltaY)<=Math.abs(e.deltaX) || !root.contains(e.target)) return;
   if(root.querySelector('dialog[open]') || e.target.closest('video,input,.table-scroll:focus-within')) return;
   if(atEdge(e.deltaY)) e.preventDefault();
 },{passive:false,signal});
 let startTouch;
 root.addEventListener('touchstart',e=>{startTouch=e.touches.length===1?e.touches[0]:null},{passive:true,signal});
 root.addEventListener('touchend',e=>{
   if(!startTouch || root.querySelector('dialog[open]') || e.target.closest('input,video')) return;
   const touch=e.changedTouches[0],dy=startTouch.clientY-touch.clientY;
   if(Math.abs(dy)>55 && Math.abs(dy)>Math.abs(startTouch.clientX-touch.clientX)) atEdge(dy);
   startTouch=null;
 },{passive:true,signal});
}
function mount(root,doc,{editing=false,onSelect=()=>{},onTheme=()=>{}}={}){root.chapterEvents?.abort();root.chapterEvents=new AbortController();root.innerHTML=render(doc,editing);const wrap=root.querySelector('.portfolio');
 if(doc.navigation==='chapters'&&!editing){mountChapters(root,root.chapterEvents.signal)}
 if(!editing){
   let drawer=null;
   for(const b of doc.blocks){
     if(!b.detailGroup){drawer=null;continue}
     const section=root.querySelector('#b-'+CSS.escape(b.id));
     if(!drawer || drawer.firstChild.textContent!==b.detailGroup){
       drawer=document.createElement('details');
       drawer.className='supporting-material';
       const label=document.createElement('summary');
       label.textContent=b.detailGroup;drawer.append(label);
       section.before(drawer);
       drawer.ontoggle=e=>{
         if(!e.currentTarget.open)e.currentTarget.querySelectorAll('video').forEach(v=>v.pause());
       };
     }
     drawer.append(section);
     if(location.hash==='#'+section.id)drawer.open=true;
   }
 }
 root.querySelector('[data-toggle-theme]').onclick=()=>{doc.theme=doc.theme==='light'?'dark':'light';wrap.dataset.theme=doc.theme;root.querySelector('[data-toggle-theme]').textContent=doc.theme==='light'?'☾ 다크':'☀ 화이트';onTheme(doc.theme)};
 root.querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>onSelect(b.dataset.select));
 for(const b of doc.blocks){
   if(b.type==='carousel')bindCarousel(root.querySelector('#b-'+CSS.escape(b.id)),b,root.chapterEvents.signal);
 }
 root.querySelectorAll('.sync-widget').forEach(box=>bindPairedVideo(box,root.chapterEvents.signal));
 root.querySelectorAll('.reveal input').forEach(i=>i.oninput=()=>i.parentElement.style.setProperty('--split',i.value+'%'));
 root.querySelectorAll('.block').forEach(el=>{const b=doc.blocks.find(b=>b.id===el.dataset.block);el.querySelectorAll('[data-item]').forEach(btn=>btn.onclick=()=>{const n=Number(btn.dataset.item);el.querySelectorAll('[data-item]').forEach(x=>x.setAttribute('aria-pressed',x===btn));el.querySelector('.item-detail').innerHTML=chartDetail(b.items[n],b.unit,el.querySelector('.chart-widget').dataset.chartStyle==='detail')});const selectTab=n=>{el.querySelectorAll('[data-tab]').forEach((btn,i)=>{btn.setAttribute('aria-selected',i===n);btn.tabIndex=i===n?0:-1});el.querySelector('.tab-detail').innerHTML=tabDetail(b.items[n]);el.querySelector('[role=tabpanel]').setAttribute('aria-labelledby','tab-'+b.id+'-'+n)};el.querySelectorAll('[data-tab]').forEach(btn=>{btn.onclick=()=>selectTab(Number(btn.dataset.tab));btn.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?b.items.length-1:(Number(btn.dataset.tab)+(e.key==='ArrowRight'?1:-1)+b.items.length)%b.items.length;selectTab(n);el.querySelector(`[data-tab="${n}"]`).focus()}})});
 const dialog=root.querySelector('dialog');root.onclick=e=>{const target=e.target.closest('[data-zoom]');if(target){dialog.querySelector('img').src=target.dataset.zoom;dialog.showModal()}if(e.target.matches('[data-close]')||e.target===dialog)dialog.close()};
}


const grades={"id": "new-gear", "type": "carousel", "title": "필연의 인과율", "items": [{"title": "C등급", "src": "media/tooltip-C.png", "kind": "image", "body": "", "alt": "C등급 필연의 인과율, 공격력 231. [봉인부진] 스킬이 최대 2회까지 충전되는 스택형 스킬로 변경됩니다. [봉인부진]의 생성 범위가 30% 감소하는 대신, 재사용 대기시간이 21초로 감소합니다. [환수부] 스킬로 [두목시니] 소환 시, 현재 충전 중인 [봉인부진] 1스택의 재사용 대기시간이 즉시 초기화됩니다. [봉인부진]이 중첩 설치되더라도 [공격력 감소] 디버프와 [환수부] 재사용 대기시간 감소 배율(2배)은 중복 적용되지 않습니다."}, {"title": "B등급", "src": "media/tooltip-B.png", "kind": "image", "body": "", "alt": "B등급 필연의 인과율, 공격력 313. [봉인부진] 스킬이 최대 2회까지 충전되는 스택형 스킬로 변경됩니다. [봉인부진]의 생성 범위가 30% 감소하는 대신, 재사용 대기시간이 20초로 감소합니다. [환수부] 스킬로 [두목시니] 소환 시, 현재 충전 중인 [봉인부진] 1스택의 재사용 대기시간이 즉시 초기화됩니다. [봉인부진]이 중첩 설치되더라도 [공격력 감소] 디버프와 [환수부] 재사용 대기시간 감소 배율(2배)은 중복 적용되지 않습니다."}, {"title": "A등급", "src": "media/tooltip-A.png", "kind": "image", "body": "", "alt": "A등급 필연의 인과율, 공격력 407. [봉인부진] 스킬이 최대 2회까지 충전되는 스택형 스킬로 변경됩니다. [봉인부진]의 생성 범위가 30% 감소하는 대신, 재사용 대기시간이 19초로 감소합니다. [환수부] 스킬로 [두목시니] 소환 시, 현재 충전 중인 [봉인부진] 1스택의 재사용 대기시간이 즉시 초기화됩니다. [봉인부진]이 중첩 설치되더라도 [공격력 감소] 디버프와 [환수부] 재사용 대기시간 감소 배율(2배)은 중복 적용되지 않습니다."}, {"title": "S등급", "src": "media/tooltip-S.png", "kind": "image", "body": "", "alt": "S등급 필연의 인과율, 공격력 530. [봉인부진] 스킬이 최대 2회까지 충전되는 스택형 스킬로 변경됩니다. [봉인부진]의 생성 범위가 30% 감소하는 대신, 재사용 대기시간이 18초로 감소합니다. [환수부] 스킬로 [두목시니] 소환 시, 현재 충전 중인 [봉인부진] 1스택의 재사용 대기시간이 즉시 초기화됩니다. [봉인부진]이 중첩 설치되더라도 [공격력 감소] 디버프와 [환수부] 재사용 대기시간 감소 배율(2배)은 중복 적용되지 않습니다."}], "width": "body", "fit": "contain", "ratio": "auto", "space": 32};
const gear=document.getElementById('gear');
gear.innerHTML=carousel(grades);
bindCarousel(gear,grades,new AbortController().signal);
const zoom=document.getElementById('zoom');

for(const d of [zoom]){d.querySelector('.close').onclick=()=>d.close();d.addEventListener('click',ev=>{if(ev.target===d){const r=d.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)d.close()}})}

document.addEventListener('click',e=>{const btn=e.target.closest('.image-zoom');if(!btn)return;if(btn.closest('.carousel-card:not(.centered)'))return;const src=btn.querySelector('img');const im=zoom.querySelector('img');im.src=src.src;im.alt=src.alt;zoom.showModal()});
const theme=document.getElementById('theme');
function setTheme(t){document.body.dataset.theme=t;theme.textContent=t==='dark'?'화이트 모드':'다크 모드';theme.setAttribute('aria-label',theme.textContent+'로 전환');try{localStorage.setItem('od-plan-color',t)}catch{}}
try{setTheme(localStorage.getItem('od-plan-color')||'light')}catch{}
theme.onclick=()=>setTheme(document.body.dataset.theme==='dark'?'light':'dark');
const clock=document.getElementById('clock');
const lanes=document.querySelectorAll('.summon-lane');
function showTime(){
  const seconds=Number(clock.value);
  document.getElementById('elapsed').textContent=seconds+'초';
  const descriptions=[];
  for(const lane of lanes){
    const track=lane.querySelector('.summon-track');
    let count=0;
    for(const marker of track.children){
      const reached=Number(marker.dataset.at)<=seconds;
      marker.classList.toggle('reached',reached);
      if(reached) count++;
    }
    track.style.setProperty('--elapsed',seconds/Number(clock.max)*100+'%');
    lane.querySelector('.lane-label b').textContent=count+'회';
    descriptions.push(lane.querySelector('strong').textContent+' '+count+'회');
  }
  clock.setAttribute('aria-valuetext',seconds+'초, '+descriptions.join(', '));
}
const timingModeButtons = document.querySelectorAll('[data-timing-mode]');
for (const button of timingModeButtons) {
  button.addEventListener('click', () => {
    const mode = button.dataset.timingMode;
    for (const option of timingModeButtons) {
      option.setAttribute('aria-pressed', String(option === button));
    }
    for (const lane of lanes) {
      const track = lane.querySelector('.summon-track');
      for (const marker of track.children) {
        const at = marker.dataset[mode];
        marker.dataset.at = at;
        marker.style.left = (100 * Number(at) / Number(clock.max)) + '%';
        marker.querySelector('small').textContent = at + '초';
      }
      track.style.setProperty('--end', track.lastElementChild.style.left);
      lane.querySelector('.timing-count-label').textContent = mode === 'cast' ? '누적 소환' : '사용 기회';
    }
    showTime();
  });
}
const timingClips=[...document.querySelectorAll('#summon-timing .timing-clip video')];
const playTiming=document.getElementById('timing-play');
let timingLead=null;
function stopTiming(){
  timingLead=null;
  timingClips.forEach(v=>v.pause());
  playTiming.textContent='비교 영상 재생';
}
function seekTimingClip(v,seconds){
  if(Number.isFinite(v.duration)) v.currentTime=Math.min(seconds,v.duration);
}
function scrubTiming(){
  stopTiming();
  const seconds=Number(clock.value);
  timingClips.forEach(v=>seekTimingClip(v,seconds));
  showTime();
}
for(const clip of timingClips){
  const prepare=()=>{
    seekTimingClip(clip,Number(clock.value));
    playTiming.hidden=!timingClips.every(v=>Number.isFinite(v.duration));
  };
  clip.addEventListener('loadedmetadata',prepare);
  if(clip.readyState>=1) prepare();
  clip.addEventListener('timeupdate',()=>{
    if(timingLead!==clip)return;
    const t=clip.currentTime;
    clock.value=Math.min(t,Number(clock.max)).toFixed(1);
    showTime();
    if(t>=Number(clock.max)){stopTiming();return}
    for(const other of timingClips){
      if(other!==clip && Math.abs(other.currentTime-Math.min(t,other.duration))>.2) seekTimingClip(other,t);
    }
  });
  clip.addEventListener('ended',()=>{if(timingLead===clip)stopTiming()});
}
playTiming.onclick=async()=>{
  if(timingLead){stopTiming();return}
  const lead=timingClips.reduce((a,b)=>a.duration>=b.duration?a:b);
  if(Number(clock.value)>=Math.min(Number(clock.max),lead.duration)) clock.value=0;
  scrubTiming();
  timingLead=lead;
  playTiming.textContent='일시 정지';
  try{await Promise.all(timingClips.filter(v=>v.currentTime<v.duration).map(v=>v.play()))}
  catch{if(timingLead===lead)stopTiming()}
};
clock.oninput=scrubTiming;
showTime();
const sections=Array.from(document.querySelectorAll('.chapter')), links=Array.from(document.querySelectorAll('.chapnav a'));let frame=0;
function mark(){frame=0;let chosen=0;for(let i=0;i<sections.length;i++)if(sections[i].getBoundingClientRect().top<=innerHeight*.35)chosen=i;
links.forEach((a,i)=>{if(i===chosen)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')}); const nav=links[chosen].parentNode;if(nav.scrollWidth>nav.clientWidth){const a=links[chosen],offset=a.offsetLeft-nav.offsetLeft;if(offset<nav.scrollLeft||offset+a.offsetWidth>nav.scrollLeft+nav.clientWidth)nav.scrollLeft=offset-12;}}
window.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(mark)},{passive:true});window.addEventListener('resize',mark);mark();

;(() => {
const scenes = {"snake-stop":{"title":"뱀 · 연속 이동","videoStart":10472,"results":{"now":{"C":{"casts":[0,15.0,37.3,64.6],"installs":[[0.0,"시작점"],[15.0,"시작점"],[21.25,"기둥 옆"],[42.15,"철로 앞쪽"],[63.15,"외곽"]],"accel":[[0.0,17.5],[21.25,26.45],[42.15,43.45],[63.15,64.6]]},"B":{"casts":[0,15.0,37.3,65.45],"installs":[[0.0,"시작점"],[15.0,"시작점"],[21.25,"기둥 옆"],[40.4,"철로 안쪽"],[60.0,"외곽 전방"]],"accel":[[0.0,17.5],[21.25,26.45],[40.4,40.55],[60.0,61.7]]},"A":{"casts":[0,15.0,41.85,66.6],"installs":[[0.0,"시작점"],[15.0,"시작점"],[19.15,"기둥 앞"],[40.4,"철로 안쪽"],[57.0,"외곽"]],"accel":[[0.0,17.5],[19.15,19.65],[40.4,40.55],[57.0,58.3],[62.65,66.6]]},"S":{"casts":[0,15.0,41.35,64.85],"installs":[[0.0,"시작점"],[15.0,"시작점"],[19.15,"기둥 앞"],[36.6,"두 번째 장판 앞쪽"],[54.0,"외곽"]],"accel":[[0.0,17.5],[19.15,19.65],[36.6,37.25],[54.0,58.3],[62.65,64.85]]}},"hold":{"C":{"casts":[0,15.0,37.3,64.6],"installs":[[0.0,"시작점"],[15.0,"시작점"],[21.25,"기둥 옆"],[42.15,"철로 앞쪽"],[63.15,"외곽"]],"accel":[[0.0,17.5],[21.25,26.45],[42.15,43.45],[63.15,64.6]]},"B":{"casts":[0,15.0,37.3,65.45],"installs":[[0.0,"시작점"],[15.0,"시작점"],[21.25,"기둥 옆"],[40.4,"철로 안쪽"],[60.0,"외곽 전방"]],"accel":[[0.0,17.5],[21.25,26.45],[40.4,40.55],[60.0,61.7]]},"A":{"casts":[0,15.0,37.3,64.25],"installs":[[0.0,"시작점"],[15.0,"시작점"],[21.25,"기둥 옆"],[40.4,"철로 안쪽"],[57.0,"외곽"]],"accel":[[0.0,17.5],[21.25,26.45],[40.4,40.55],[57.0,58.3],[62.65,64.25]]},"S":{"casts":[0,15.0,36.95,62.35],"installs":[[0.0,"시작점"],[15.0,"시작점"],[21.25,"기둥 옆"],[36.6,"두 번째 장판 앞쪽"],[54.0,"외곽"]],"accel":[[0.0,17.5],[21.25,26.45],[36.6,37.25],[54.0,58.3]]}}},"cues":[["기둥 앞 정지",10476.15,"앞에서 한 번 맞힐 짧은 틈입니다."],["다시 이동",10476.65,"뱀이 몸을 돌려 첫 설치 지점을 떠납니다."],["기둥 옆 도착",10478.25,"옆 지점에 더 오래 머뭅니다."]],"note":"기둥 앞의 짧은 정지와 기둥 옆의 긴 정지가 한 동작으로 이어집니다. 첫 정지에서 충전을 쓰면 다음 정지에 쓸 충전이 남는지가 관건입니다.","places":{"시작점":[39,59],"기둥 앞":[57,43],"기둥 옆":[76,48],"두 번째 장판 앞쪽":[67,61],"두 번째 장판 중앙":[52,57],"철로 옆":[37,42],"철로 안쪽":[54,36],"철로 앞쪽":[71,41],"외곽":[80,62],"외곽 전방":[58,67]},"moves":[[0,"시작점"],[17.5,null],[18.65,"기둥 앞"],[19.65,null],[20.75,"기둥 옆"],[26.45,null],[27.45,"두 번째 장판 앞쪽"],[32.75,null],[33.55,"두 번째 장판 중앙"],[35.25,null],[36.1,"두 번째 장판 앞쪽"],[37.25,null],[38.65,"철로 옆"],[39.1,null],[39.9,"철로 안쪽"],[40.55,null],[41.65,"철로 앞쪽"],[43.45,null],[44.75,"외곽"],[58.3,null],[59.35,"외곽 전방"],[61.7,null],[62.65,"외곽"]]},"golem":{"title":"골렘 · 도약","videoStart":9638.25,"results":{"now":{"C":{"casts":[0,15.0,35.25,62.0],"installs":[[0.0,"A"],[15.0,"A"],[21.0,"B"],[42.0,"E"]],"accel":[[0.0,16.5],[21.0,29.25],[42.0,45.25]]},"B":{"casts":[0,15.0,34.25,60.15],"installs":[[0.0,"A"],[15.0,"A"],[20.0,"B"],[41.25,"E"],[60.0,"H"]],"accel":[[0.0,16.5],[20.0,29.25],[41.25,45.25],[60.0,60.15]]},"A":{"casts":[0,15.0,33.25,59.9],"installs":[[0.0,"A"],[15.0,"A"],[19.0,"B"],[39.0,"D"],[57.0,"H"]],"accel":[[0.0,16.5],[19.0,29.25],[39.0,39.5],[57.0,59.9]]},"S":{"casts":[0,15.0,32.5,57.75],"installs":[[0.0,"A"],[15.0,"A"],[18.25,"B"],[36.0,"C"],[54.25,"H"]],"accel":[[0.0,16.5],[18.25,29.25],[36.0,37.25],[54.25,57.75]]}}},"cues":[["도약 직전",9641,"골렘 아래에 봉인부진이 보입니다."],["공중 이동",9641.75,"골렘이 장판을 두고 뛰어오릅니다."],["새 착지점",9644.5,"원래 장판과 착지점이 떨어져 보입니다."]],"note":"도약 전후에는 바닥의 마법진을 기준으로 보세요. 착지한 골렘을 다시 맞히려면 이전 장판이 남아 있어도 새 위치에 한 번 더 설치해야 합니다.","places":{"A":[40,57],"B":[61,45],"C":[77,60],"D":[60,68],"E":[41,47],"F":[60,39],"G":[78,46],"H":[46,64],"I":[66,55],"J":[51,43]},"moves":[[0.0,"A"],[16.5,null],[17.75,"B"],[29.25,null],[31.5,"C"],[37.25,null],[38.5,"D"],[39.5,null],[40.75,"E"],[45.25,null],[46.25,"F"],[49.0,null],[50.0,"G"],[52.5,null],[53.75,"H"],[63.5,null],[64.75,"I"],[71.25,null],[72.75,"J"]]},"snake-turn":{"title":"뱀 · 가장자리 왕복","videoStart":10342,"results":{"now":{"C":{"casts":[0,17.6,35.15,54.15],"installs":[[0.0,"시작점"],[3.0,"왼쪽"],[21.0,"문 앞"],[42.0,"문 앞"]],"accel":[[0.0,1.75],[3.0,11.65],[13.0,15.0],[21.0,29.9],[31.6,36.0],[42.0,43.9],[45.9,54.15]]},"B":{"casts":[0,17.6,34.65,53.15],"installs":[[0.0,"시작점"],[3.0,"왼쪽"],[20.0,"문 앞"],[40.0,"문 앞"]],"accel":[[0.0,1.75],[3.0,11.65],[13.0,15.0],[20.0,29.9],[31.6,35.0],[40.0,43.9],[45.9,53.15]]},"A":{"casts":[0,17.6,34.3,52.15],"installs":[[0.0,"시작점"],[3.0,"왼쪽"],[19.0,"문 앞"],[38.0,"문 앞"]],"accel":[[0.0,1.75],[3.0,11.65],[13.0,15.0],[19.0,29.9],[31.6,34.0],[38.0,43.9],[45.9,52.15]]},"S":{"casts":[0,17.6,34.3,51.3],"installs":[[0.0,"시작점"],[3.0,"왼쪽"],[18.75,"문 앞"],[36.0,"문 앞"]],"accel":[[0.0,1.75],[3.0,11.65],[13.0,15.0],[18.75,29.9],[31.6,33.75],[36.0,43.9],[45.9,51.0]]}}},"cues":[["장판 전개",10342.25,"처음 장판을 놓은 위치입니다."],["첫 이탈",10344,"뱀의 중심이 왼쪽으로 빠집니다."],["시작점 재진입",10355.25,"장판이 남은 위치로 돌아옵니다."]],"note":"뱀이 돌아오는 동안 처음 장판은 그 자리에 남습니다. 재진입으로 가속이 다시 붙는 순간과, 다른 자리에 장판을 설치해야 하는 순간을 구분할 수 있습니다.","places":{"시작점":[58,55],"왼쪽":[34,52],"문 앞":[67,39],"돌출 지점":[79,55],"전방":[47,61],"기둥 옆":[39,39]},"moves":[[0.0,"시작점"],[1.75,null],[2.5,"왼쪽"],[11.65,null],[13.0,"시작점"],[17.1,null],[18.25,"문 앞"],[29.9,null],[30.4,"돌출 지점"],[30.75,null],[31.6,"문 앞"],[43.9,null],[44.6,"전방"],[45.05,null],[45.9,"문 앞"],[55.4,null],[56.45,"기둥 옆"],[58.3,null],[59.15,"문 앞"]]}};
const study = document.querySelector('#boss-comparison');
const find = selector => study.querySelector(selector);
const all = selector => [...study.querySelectorAll(selector)];
const grades = ['C','B','A','S'];
const charges = [21,20,19,18];
const sec = n => n.toFixed(2)+'초';
let sceneKey='snake-stop', policy='now', grade='A';
let frame=0, startTime=0, startStamp=0;
const clock=find('#boss-sim-time'), play=find('[data-play-replay]');
const scene=()=>scenes[sceneKey], runs=()=>scene().results[policy], run=()=>runs()[grade];
const movie=()=>find('[data-movie="'+sceneKey+'"]');
const pendingSeek=new WeakMap();
const fields=Array.from({length:2},()=>{
  const field=document.createElement('i');find('.replay-fields').append(field);return field;
});

function pauseReplay(){
  cancelAnimationFrame(frame);frame=0;
  play.textContent=clock.valueAsNumber>=Number(clock.max)?'다시 재생':'재생';
}
function setPosition(el,[x,y]){el.style.left=x+'%';el.style.top=y+'%'}
function draw(){
  const t=clock.valueAsNumber, r=run(), end=r.casts[3], finished=t>=end-.001;
  const hit=r.accel.some(([a,b])=>a<=t && t<b);
  const castIndex=r.casts.findLastIndex(v=>v<=t+.001);
  const last=r.casts[castIndex], since=t-last;
  const bonus=r.accel.reduce((sum,[a,b])=>sum+Math.max(0,Math.min(b,t)-Math.max(a,last)),0);
  const moves=scene().moves, idx=moves.findLastIndex(([at])=>at<=t);
  const [at,zone]=moves[idx], places=scene().places;
  let pos=places[zone];
  if (!zone){
    const prev=places[moves[idx-1][1]], [until,next]=moves[idx+1], target=places[next];
    const k=Math.min(1,(t-at)/(until-at));
    pos=[prev[0]+(target[0]-prev[0])*k,prev[1]+(target[1]-prev[1])*k];
    if(sceneKey==='golem')pos[1]-=8*Math.sin(Math.PI*k);
  }
  const boss=find('.replay-boss');setPosition(boss,pos);
  const seals=r.installs.filter(([when])=>when<=t && t<when+15);
  fields.forEach((el,i)=>{
    el.hidden=!seals[i];
    if(!el.hidden){
      setPosition(el,places[seals[i][1]]);
      const age=t-seals[i][0];
      el.style.opacity=String(Math.min(1,.45+age*2,.55+(15-age)));
      el.style.transform='translate(-50%,-50%) scale('+(.96+.04*Math.sin(age*3))+')';
    }
  });
  const summoned=find('.replay-summon');
  summoned.classList.toggle('commander',finished);
  summoned.hidden=since>2.5&&!finished;
  summoned.style.opacity=finished?'1':String(Math.min(1,.6+since*2,Math.max(0,2.5-since)));
  const castFlash=find('[data-cast-flash]');
  castFlash.textContent=finished?'두목시니 소환':since<1.6?'어둑시니 소환':'';
  find('[data-region]').textContent=zone ? (sceneKey==='golem'?'착지 구역 '+zone:zone) : '보스 이동 중';
  find('[data-accel]').textContent=finished?'네 번째 소환 완료':hit?'장판 적중 · 2배 가속':'가속 공백';
  find('[data-cooldown]').textContent=finished?'사용 완료':Math.max(0,30-since-bonus).toFixed(1)+'초';
  find('[data-clock]').textContent=sec(t)+' / '+sec(end);
  clock.setAttribute('aria-valuetext',sec(t)+' · 누적 소환 '+(castIndex+1)+'회');
  find('[data-playhead]').style.left=(100*t/end)+'%';
  all('.boss-casts li').forEach((li,i)=>li.classList.toggle('reached',i<=castIndex));
}
function tick(stamp){
  const target=startTime+(stamp-startStamp)*Number(find('[data-speed]').value)/1000;
  clock.value=String(Math.min(target,Number(clock.max)));draw();
  if(target>=Number(clock.max)){pauseReplay();return}
  frame=requestAnimationFrame(tick);
}
play.onclick=()=>{
  if(frame){pauseReplay();return}
  movie().pause();
  if(clock.valueAsNumber>=Number(clock.max))clock.value='0';
  startTime=clock.valueAsNumber;startStamp=performance.now();
  play.textContent='일시 정지';frame=requestAnimationFrame(tick);
};
find('[data-speed]').onchange=()=>{startTime=clock.valueAsNumber;startStamp=performance.now()};
clock.oninput=()=>{pauseReplay();draw()};
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseReplay()});

function cueText(){
  const v=movie(),wall=scene().videoStart+v.currentTime;
  const current=scene().cues.findLastIndex(([,at])=>at<=wall+.03);
  all('.boss-seeks button').forEach((b,i)=>b.setAttribute('aria-current',i===current?'step':'false'));
}
for(const v of all('[data-movie]')){
  v.addEventListener('loadedmetadata',()=>{
    if(pendingSeek.has(v)){v.currentTime=pendingSeek.get(v);pendingSeek.delete(v)}
  });
  v.addEventListener('timeupdate',()=>{if(v===movie())cueText()});
  v.addEventListener('play',()=>pauseReplay());
}
function makeFlow(){
  const steps=scene().cues.map(([title,at,reason])=>{
    const li=document.createElement('li'),button=document.createElement('button');
    const stamp=document.createElement('small'),label=document.createElement('b'),caption=document.createElement('span');
    const offset=at-scene().videoStart;
    stamp.textContent=offset.toFixed(2)+'초';label.textContent=title;caption.textContent=reason;
    button.type='button';button.append(stamp,label,caption);
    button.onclick=()=>{
      pauseReplay();const v=movie();
      if(v.readyState>=1)v.currentTime=offset;else pendingSeek.set(v,offset);
      v.play().catch(()=>{if(v.readyState===0)v.load()});
    };
    li.append(button);return li;
  });
  find('.boss-seeks').replaceChildren(...steps);cueText();
}
for (const g of grades){
  const tab=document.createElement('button');tab.id='replay-grade-'+g;
  tab.type='button';tab.dataset.grade=g;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','replay-panel');
  tab.onclick=()=>{grade=g;update()};
  tab.onkeydown=e=>{
    const i=grades.indexOf(g);
    const dest={ArrowLeft:(i+3)%4,ArrowRight:(i+1)%4,Home:0,End:3}[e.key];
    if(dest===undefined)return;e.preventDefault();const next=find('[data-grade="'+grades[dest]+'"]');next.click();next.focus();
  };
  find('.replay-grades').append(tab);
}
function update(){
  const atEnd=clock.value===clock.max, previous=clock.valueAsNumber;
  pauseReplay();
  const r=run(), end=r.casts[3], result=runs();
  clock.max=String(end);clock.value=String(atEnd?end:Math.min(previous,end));
  const isStop=sceneKey==='snake-stop';
  find('.boss-policies').hidden=!isStop;
  all('[data-policy]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.policy===policy)));
  const a=result.A.casts[3],b=result.B.casts[3];
  const gradeTimes=grades.map(g=>g+' '+sec(result[g].casts[3])).join(' · ');
  let summary;
  if(isStop && policy==='hold')summary='기둥 앞에서 아끼면 A는 즉시 설치보다 '+sec(scene().results.now.A.casts[3]-a)+' 빠르고, B보다 '+sec(b-a)+' 먼저 소환합니다.';
  else if(isStop)summary='A는 첫 정지에서 0.50초, B는 다음 정지에서 5.20초간 가속을 얻습니다. 즉시 설치하면 A의 네 번째 소환이 B보다 '+sec(a-b)+' 늦습니다.';
  else summary=sceneKey==='golem'?'도약 뒤 바로 재설치하면 C에서 S로 갈 때 네 번째 소환이 4.25초 빨라집니다. B와 A의 차이는 0.25초입니다.':'가장자리를 오갈 때 B와 A는 같은 자리에 네 번씩 설치합니다. A가 가속 공백을 2초 줄여 네 번째 소환을 1초 앞당깁니다.';
  find('[data-explain]').textContent='네 번째 소환은 '+gradeTimes+'입니다. '+summary;
  all('[data-grade]').forEach((el,i)=>{
    const g=el.dataset.grade;el.textContent=g+'등급 · '+charges[i]+'초';
    el.tabIndex=g===grade?0:-1;el.setAttribute('aria-selected',String(g===grade));
  });
  find('#replay-panel').setAttribute('aria-labelledby','replay-grade-'+grade);
  find('[data-arena-grade]').textContent=grade+'등급 · 전투 재현';
  find('.replay-boss').classList.toggle('golem',sceneKey==='golem');
  find('[data-segments]').replaceChildren(...r.accel.map(([a,b])=>{
    const span=document.createElement('i');span.style.left=100*a/end+'%';span.style.width=100*(b-a)/end+'%';return span;
  }));
  find('.boss-casts').replaceChildren(...r.casts.map((at,i)=>{
    const li=document.createElement('li'),btn=document.createElement('button'),value=document.createElement('b');
    btn.type='button';btn.textContent=['첫 소환','두 번째','세 번째','두목시니'][i];value.textContent=sec(at);btn.append(value);
    btn.onclick=()=>{clock.value=String(at);pauseReplay();draw()};li.append(btn);return li;
  }));
  pauseReplay();draw();
}
function switchScene(key){
  const old=movie();old.pause();pendingSeek.delete(old);sceneKey=key;policy='now';clock.value='0';
  for(const v of all('[data-movie]'))v.hidden=v!==movie();
  all('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scene===key)));
  find('[data-shot]').textContent=scene().note;makeFlow();update();
}
for(const b of all('[data-scene]'))b.onclick=()=>switchScene(b.dataset.scene);
for(const b of all('[data-policy]'))b.onclick=()=>{policy=b.dataset.policy;update()};
for(const b of all('[data-metric]'))b.onclick=()=>{
  for(const item of all('[data-metric]'))item.setAttribute('aria-pressed',String(item===b));
  const metric=b.dataset.metric;
  find('caption').textContent=metric==='fourth'?'네 번째 소환까지의 전투 시간 · 초':'네 번째 소환까지 가속이 끊긴 누적 시간 · 초';
  for(const cell of all('.boss-table td'))cell.textContent=cell.dataset[metric];
};
switchScene(sceneKey);

})();
