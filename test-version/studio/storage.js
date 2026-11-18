const DB='portfolio-studio-v1';
let database;
async function open(){if(database)return database;database=await new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('documents',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return database}
async function transaction(mode,action){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('documents',mode);const request=action(tx.objectStore('documents'));tx.oncomplete=()=>resolve(request.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('저장을 완료하지 못했습니다.'))})}
export const all=()=>transaction('readonly',s=>s.getAll());
export const save=doc=>transaction('readwrite',s=>s.put({id:doc.id,doc,updatedAt:Date.now()}));
export function last(id){try{if(id)localStorage.setItem('portfolio-studio-last',id);return localStorage.getItem('portfolio-studio-last')}catch{return null}}
