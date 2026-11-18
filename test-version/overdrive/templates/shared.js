export const media=name=>'../media/'+name;
export const data=await fetch(new URL('./content.json',import.meta.url)).then(r=>r.json());
const names={cinema:'01 게임 소개형',editorial:'02 개발기형',lab:'03 캐릭터 도감형'};
export function boot(kind){
 const key='portfolio-study-theme-'+kind;
 const requested=new URLSearchParams(location.search).get('theme');
 let stored;try{stored=localStorage.getItem(key)}catch{}
 document.documentElement.dataset.theme=['light','dark'].includes(requested)?requested:stored|| (kind==='editorial'?'light':'dark');
 document.querySelector('#review-nav').innerHTML=`<a href="../">← 세 가지 구성 비교</a><div class="review-links">${Object.entries(names).map(([id,title])=>`<a href="../${id}/" ${id===kind?'aria-current="page"':''}>${title}</a>`).join('')}</div><div class="themes" role="group" aria-label="색상 모드"><button data-theme-choice="light">☀ 화이트</button><button data-theme-choice="dark">☾ 다크</button></div>`;
 const update=()=>document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.themeChoice===document.documentElement.dataset.theme));
 document.querySelectorAll('[data-theme-choice]').forEach(b=>b.onclick=()=>{document.documentElement.dataset.theme=b.dataset.themeChoice;try{localStorage.setItem(key,b.dataset.themeChoice)}catch{}update()});update();
 const dialog=document.createElement('dialog');dialog.className='lightbox';dialog.innerHTML='<button aria-label="확대 화면 닫기">닫기 ×</button><div></div><p></p>';document.body.append(dialog);
 dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener('close',()=>{dialog.querySelectorAll('video').forEach(v=>v.pause());dialog.querySelector('div').innerHTML=''});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-zoom],[data-film]');if(!b)return;const video=b.hasAttribute('data-film');dialog.querySelector('div').innerHTML=video?`<video controls playsinline src="${b.dataset.film}" autoplay></video>`:`<img src="${b.dataset.zoom}" alt="실제 게임 캡처 확대">`;dialog.querySelector('p').textContent=b.dataset.caption||'사용자 실제 플레이 녹화에서 추출한 화면';dialog.showModal()});
 document.querySelectorAll('.screen-diff input').forEach(input=>input.addEventListener('input',()=>{input.closest('.screen-diff').style.setProperty('--split',input.value+'%');input.setAttribute('aria-valuetext',`제안 표시 ${100-input.value}%`)}));
 document.documentElement.dataset.ready='true';
}
export const picture=(file,alt)=>`<button class="zoom" data-zoom="${media(file)}" aria-label="${alt} 원본 확대"><img src="${media(file)}" alt="${alt}" loading="lazy"></button>`;
export const video=(file,poster)=>`<video class="media" controls playsinline preload="none" poster="${media(poster)}" src="${media(file)}"></video>`;
export const table=()=>`<div class="table-scroll"><table><caption>논리적 타당성 · 동일 무기 트리의 실제 제작 화면</caption><thead><tr><th scope="col">등급</th><th scope="col">공격력</th><th scope="col">봉인부진 대상 공격력</th><th scope="col">폭풍부 악몽</th><th scope="col">원본 확인</th></tr></thead><tbody>${data.grades.map(g=>`<tr><th scope="row">${g.grade}</th><td>${g.attack}</td><td>${g.weak}</td><td>${g.chance}</td><td><button data-zoom="${media(g.image)}" data-caption="E ${g.time} · ${g.grade} 등급">${g.time} ↗</button></td></tr>`).join('')}</tbody></table></div>`;
export const diff=()=>`<div class="screen-diff"><img src="${media('E-0671.0.jpg')}" alt="실제 전투 원본"><div class="diff-layer"><img src="${media('E-0671.0.jpg')}" alt="같은 원본 위에 제안 단서를 표시한 예시"><span class="proposal target">◆ 선택한 적</span><span class="proposal field">◆ 연결된 영역</span><span class="proposal-arrow">↗</span><small>미구현 · 제안 표시 예시</small></div><span class="diff-label">원본 캡처</span><span class="diff-label after">제안 단서</span><div class="diff-line"></div><input type="range" min="0" max="100" value="45" aria-label="원본과 제안 표시 비교" aria-valuetext="제안 표시 55%"></div>`;
export const footer=(link,title,reflection)=>`<footer class="reference-footer"><div><b>구성 레퍼런스</b><p><a href="${link}" target="_blank" rel="noopener">${title} ↗</a></p><p>${reflection}</p></div><div><b>템플릿 선택용 · 신규 무기 미확정</b><p>실제 수치는 사용자 녹화 E의 툴팁 기준입니다. 도식·오버레이는 기획 가설이며 구현 결과가 아닙니다. 게임 화면의 권리는 각 권리자에게 있습니다.</p><p><a href="../">다른 구성과 비교하기 →</a></p></div></footer>`;
