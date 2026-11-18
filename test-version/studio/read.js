import {mount} from './renderer.js';
import {validate} from './model.js';
import {portable,saveJSON,saveHTML} from './files.js';
const key=new URLSearchParams(location.search).get('draft')||'overdrive-background-v4';
const notice=document.querySelector('#notice');
try{
 if(!/^[a-z0-9-]+$/.test(key))throw Error('잘못된 초안 주소입니다.');
 const response=await fetch('drafts/'+key+'.json');if(!response.ok)throw Error('초안을 찾을 수 없습니다.');
 const doc=validate(await response.json());document.title=doc.title.replace(/\n/g,' ')+' | 포트폴리오';
 const theme=new URLSearchParams(location.search).get('theme');if(['light','dark'].includes(theme))doc.theme=theme;
 mount(document.querySelector('#portfolio'),doc);
 document.querySelector('#edit').href='./?draft='+key;
 for(const [id,exporter] of [['save',saveJSON],['html',saveHTML]])document.querySelector('#'+id).onclick=async()=>{
  document.querySelectorAll('.review-tools button').forEach(b=>b.disabled=true);
  try{const packed=await portable(doc,message=>notice.textContent=message);await exporter(packed);notice.textContent='저장했습니다.'}catch(e){notice.textContent=e.message}finally{document.querySelectorAll('.review-tools button').forEach(b=>b.disabled=false)}
 };
}catch(e){notice.textContent=e.message;document.querySelectorAll('.review-tools button').forEach(b=>b.disabled=true)}

