const panel=document.querySelector('#comparison');
const toggle=document.querySelector('#compare-toggle');
function update(side){document.querySelector(`#${side}-frame`).src=document.querySelector(`#${side}-choice`).value+'/';}
toggle.addEventListener('click',()=>{const opening=panel.hidden;panel.hidden=!opening;toggle.setAttribute('aria-expanded',opening);toggle.innerHTML=opening?'나란히 보기 닫기 <span>−</span>':'두 시안 나란히 열기 <span>＋</span>';if(opening){for(const side of ['left','right'])if(!document.querySelector(`#${side}-frame`).getAttribute('src'))update(side);}});
for(const side of ['left','right'])document.querySelector(`#${side}-choice`).addEventListener('change',()=>update(side));
