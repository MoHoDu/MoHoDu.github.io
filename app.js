const cards=[...document.querySelectorAll('.project-card')],filters=[...document.querySelectorAll('[data-filter]')],search=document.querySelector('#search');
if(search){
 const query=new URLSearchParams(location.search);let filter=query.get('type')||'all';if(!filters.some(b=>b.dataset.filter===filter))filter='all';search.value=query.get('q')||'';
 function update(){const term=search.value.trim().toLocaleLowerCase();let count=0;cards.forEach(c=>{c.hidden=!((filter==='all'||c.dataset.kind===filter)&&c.dataset.search.toLocaleLowerCase().includes(term));if(!c.hidden)count++});filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));document.querySelector('#result-count').textContent=`프로젝트 ${count}개`;document.querySelector('#no-results').hidden=count>0;const params=new URLSearchParams();if(filter!=='all')params.set('type',filter);if(term)params.set('q',search.value.trim());history.replaceState(null,'',location.pathname+(params.size?'?'+params:'')+location.hash)}
 filters.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;update()}));search.addEventListener('input',update);update();
}
