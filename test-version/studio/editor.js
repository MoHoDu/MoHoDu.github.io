import {TEMPLATES,TYPES,uid,blank,makeBlock,validate,safeURL} from './model.js';
import {esc} from './renderer.js';
import * as storage from './storage.js';
import {readMedia,portable,saveJSON,saveHTML} from './files.js';

const $=s=>document.querySelector(s), frame=$('#preview');
let doc,selected=null,ready=false,reading=false,timer,typing=false,typingTimer,saveQueue=Promise.resolve(),revision=0,dragId;
let undo=[],redo=[];
const status=(message,error=false)=>{const el=$('#status');el.textContent=message;el.classList.toggle('error',error)};
const current=()=>selected?doc.blocks.find(b=>b.id===selected):doc;
const clone=value=>structuredClone(value);
function checkpoint(){undo.push(clone(doc));if(undo.length>30)undo.shift();redo=[];typing=false;buttons()}
function buttons(){$('#undo').disabled=!undo.length;$('#redo').disabled=!redo.length;const n=doc?.blocks.findIndex(b=>b.id===selected);$('#up').disabled=n<=0;$('#down').disabled=n<0||n===doc?.blocks.length-1}
function send(){if(doc)frame.contentWindow.postMessage({type:'render',doc,editing:!reading,selected},location.origin)}
function queueSave(){clearTimeout(timer);const snapshot=clone(doc),rev=revision;saveQueue=saveQueue.catch(()=>{}).then(()=>storage.save(snapshot)).then(()=>{storage.last(snapshot.id);if(rev===revision)status('이 브라우저에 저장됨 · '+new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}))}).catch(error=>{status('자동 저장 실패: '+error.message+' · 편집 파일을 내려받아 보관하세요.',true);throw error});saveQueue.catch(()=>{});return saveQueue}
function changed({fields=false}={}){revision++;status('저장 중…');clearTimeout(timer);timer=setTimeout(queueSave,600);renderStructure();if(fields)renderFields();send();buttons()}
function mutate(action,options={fields:true}){checkpoint();action();changed(options)}
function setValue(path,value){if(!typing){checkpoint();typing=true}clearTimeout(typingTimer);typingTimer=setTimeout(()=>typing=false,700);const parts=path.split('.');let target=current();for(const p of parts.slice(0,-1))target=target[p];target[parts.at(-1)]=value;changed()}
async function projects(){const entries=await storage.all();$('#projects').innerHTML=entries.sort((a,b)=>b.updatedAt-a.updatedAt).map(e=>`<option value="${esc(e.id)}">${esc(e.doc.title.replace(/\n/g,' ')||'제목 없는 문서')}</option>`).join('');$('#projects').value=doc.id}
async function activate(next){doc=validate(next);selected=null;undo=[];redo=[];typing=false;revision++;storage.last(doc.id);await queueSave();await projects();renderStructure();renderFields();send();buttons()}
function panel(name){$('.workspace').dataset.panel=name;document.querySelectorAll('[data-panel]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',b.dataset.panel===name)})}
function select(id,focus=true){selected=id;typing=false;renderStructure();renderFields();buttons();if(id&&focus)frame.contentWindow.postMessage({type:'focus-block',id},location.origin);panel('inspector')}
function renderStructure(){if(!doc)return;$('#templates').innerHTML=Object.entries(TEMPLATES).map(([id,t])=>`<button class="template" data-template="${id}" aria-pressed="${doc.template===id}"><b>${t.name}</b><span>${t.summary}</span></button>`).join('');$('#document-settings').classList.toggle('selected',!selected);$('#block-count').textContent=doc.blocks.length;$('#block-list').innerHTML=doc.blocks.map((b,i)=>`<li draggable="true" data-id="${b.id}" class="block-item ${selected===b.id?'selected':''}"><button data-select="${b.id}"><small>${String(i+1).padStart(2,'0')} · ${TYPES[b.type]}</small><b>${esc(b.title||b.caption||b.body||'제목 없는 요소')}</b></button><span class="drag-handle" aria-hidden="true">⠿</span></li>`).join('');$('#theme').textContent=doc.theme==='light'?'☾ 다크':'☀ 화이트';const option=$('#projects').selectedOptions[0];if(option&&option.value===doc.id)option.textContent=doc.title.replace(/\n/g,' ')||'제목 없는 문서'}

const field=(label,path,value,{area=false,type='text',min,max,step}={})=>`<label>${label}${area?`<textarea data-field="${path}" rows="${path==='body'?6:3}">${esc(value)}</textarea>`:`<input data-field="${path}" type="${type}" value="${esc(value)}" ${min!==undefined?`min="${min}" max="${max}" step="${step||1}"`:''}>`}</label>`;
const choice=(label,path,value,options)=>`<label>${label}<select data-field="${path}">${Object.entries(options).map(([v,t])=>`<option value="${v}" ${value===v?'selected':''}>${t}</option>`).join('')}</select></label>`;
const mediaField=(label,path,value,kind='image')=>`<div class="media-input"><label>${label}<input data-field="${path}" data-url type="url" value="${esc(value?.startsWith('data:')?'':value||'')}" placeholder="${value?.startsWith('data:')?'파일이 포함되어 있습니다':'이미지·영상 직접 URL'}"></label><div class="upload"><label>파일 업로드<input type="file" data-upload="${path}" accept="${kind==='video'?'video/mp4,video/webm,video/ogg':'image/png,image/jpeg,image/webp,image/gif,image/avif'}"></label><button type="button" data-clear="${path}">비우기</button></div>${value?`<div class="media-summary">${value.startsWith('data:')?'파일 포함 · 약 '+Math.round(value.length*.75/1024)+' KB':'연결된 자료'}${kind==='image'?`<img src="${esc(value)}" alt="자료 미리보기">`:''}</div>`:''}</div>`;
function renderFields(){const b=current();$('#inspector-title').textContent=selected?TYPES[b.type]:'표지와 문서 정보';$('#block-actions').hidden=!selected;let html='';if(!selected){html=field('제목','title',doc.title,{area:true})+field('부제 / 소개','subtitle',doc.subtitle,{area:true})+field('분류 / 상단 문구','kicker',doc.kicker)+field('작성자 / 역할','author',doc.author)+mediaField('표지 이미지','cover',doc.cover)+field('표지 이미지 설명','coverAlt',doc.coverAlt)+field('표지 출처 / 캡션','coverCaption',doc.coverCaption);}
 else {html=field('제목','title',b.title,{area:true});if(!['image','video'].includes(b.type))html+=field('원고 · **강조할 말**','body',b.body,{area:true});if(['heading','quote','image','video','chart','table'].includes(b.type))html+=field(b.type==='heading'?'상단 소제목':'캡션 / 출처','caption',b.caption,{area:true});
 if(['image','video'].includes(b.type)){html+=mediaField(b.type==='video'?'영상':'이미지','src',b.src,b.type)+field('자료 설명 (접근성)','alt',b.alt);if(b.type==='video')html+=mediaField('재생 전 표지 이미지','poster',b.poster)}
 if(['compare','beforeafter'].includes(b.type)){for(const side of ['left','right']){const label=side==='left'?'왼쪽 / 이전':'오른쪽 / 이후';html+=`<h3>${label}</h3>`;if(b.type==='compare')html+=choice('자료 종류',side+'Kind',b[side+'Kind'],{image:'이미지',video:'영상'});html+=mediaField('자료',side+'Src',b[side+'Src'],b.type==='compare'?b[side+'Kind']:'image')+field('자료 캡션',side+'Caption',b[side+'Caption'])}}
 if(b.type==='chart')html+=field('단위','unit',b.unit)+choice('표현 방식','chartStyle',b.chartStyle,{auto:'템플릿에 맞추기',line:'선 그래프',bars:'가로 막대',stages:'큰 수치 단계',detail:'항목별 상세'});
 if(['chart','steps','tabs','accordion','grid','gallery','flow'].includes(b.type)){html+='<h3>항목과 자료</h3>';if(['grid','gallery'].includes(b.type))html+=field('데스크톱 열 수','gridColumns',b.gridColumns,{type:'number',min:2,max:4});html+=b.items.map((item,i)=>`<div class="data-item"><div class="item-actions"><b>${i+1}번 항목</b><button data-item-up="${i}" ${i===0?'disabled':''}>↑</button><button data-item-down="${i}" ${i===b.items.length-1?'disabled':''}>↓</button><button data-item-remove="${i}">삭제</button></div>${field('항목 이름',`items.${i}.title`,item.title)}${b.type==='chart'?field('값',`items.${i}.value`,item.value,{type:'number',min:0,max:1e9}):''}${field('설명',`items.${i}.body`,item.body,{area:true})}${choice('자료 종류',`items.${i}.kind`,item.kind,{image:'이미지',video:'영상'})}${mediaField('항목 자료',`items.${i}.src`,item.src,item.kind)}${item.kind==='video'?mediaField('재생 전 표지',`items.${i}.poster`,item.poster):''}</div>`).join('');html+='<button data-add-item>항목 추가 ＋</button>'}
 if(b.type==='table'){html+=`<div class="table-editor"><table><thead><tr>${b.columns.map((c,i)=>`<th>${field('열 '+(i+1),`columns.${i}`,c)}<button data-remove-col="${i}" aria-label="${i+1}열 삭제">열 삭제</button></th>`).join('')}<th></th></tr></thead><tbody>${b.rows.map((r,i)=>'<tr>'+b.columns.map((_,j)=>`<td><input aria-label="${i+1}행 ${j+1}열" data-field="rows.${i}.${j}" value="${esc(r[j])}"></td>`).join('')+`<td><button data-remove-row="${i}" aria-label="${i+1}행 삭제">×</button></td></tr>`).join('')}</tbody></table></div><div class="table-actions"><button data-add-row>행 추가 ＋</button><button data-add-col>열 추가 ＋</button></div>`}
 html+='<h3>크기와 배치</h3>'+choice('너비','width',b.width,{body:'본문 폭',wide:'넓게',full:'전체 폭'})+`<div class="field-pair">${field('글자 크기 (px)','size',b.size,{type:'number',min:12,max:72})}${field('위쪽 여백 (px)','space',b.space,{type:'number',min:0,max:140})}</div>`+choice('정렬','align',b.align,{left:'왼쪽',center:'가운데',right:'오른쪽'})+choice('배경','tone',b.tone,{plain:'기본',surface:'구분 배경',accent:'강조'});
 if(['image','video','compare','beforeafter','chart','steps','tabs','accordion','grid','gallery','flow'].includes(b.type))html+=choice('자료 비율','ratio',b.ratio,{'16/9':'16:9','4/3':'4:3','1/1':'1:1',auto:'원본 비율'})+choice('이미지·영상 맞춤','fit',b.fit,{contain:'전체 보이기',cover:'영역 채우기'})+field('자료 높이 (px, 0 = 자동)','height',b.height,{type:'number',min:0,max:1200});
 }$('#fields').innerHTML=html;buttons()}

frame.addEventListener('load',send);
window.addEventListener('message',e=>{if(e.source!==frame.contentWindow||e.origin!==location.origin)return;if(e.data.type==='ready'){ready=true;send()}if(e.data.type==='select')select(e.data.id,false);if(e.data.type==='theme'&&doc)mutate(()=>doc.theme=e.data.theme,{fields:false})});
$('#fields').addEventListener('input',e=>{const el=e.target,path=el.dataset.field;if(!path||el.tagName==='SELECT')return;let value=el.value;if(el.type==='number'){if(value===''||!el.validity.valid)return;value=Number(value)}if(el.hasAttribute('data-url')){value=safeURL(value);if(el.value&&!value){status('http(s) 이미지·영상 직접 URL을 입력하세요.',true);return}}setValue(path,value)});
$('#fields').addEventListener('change',async e=>{const el=e.target;if(el.dataset.field&&el.tagName==='SELECT'){setValue(el.dataset.field,el.value);renderFields()}typing=false;if(el.dataset.upload&&el.files[0]){const targetId=selected,documentId=doc.id,path=el.dataset.upload;try{status('자료를 가져오는 중…');const value=await readMedia(el.files[0]);if(documentId!==doc.id||targetId!==selected)throw Error('선택한 요소가 바뀌었습니다. 다시 업로드하세요.');setValue(path,value);renderFields()}catch(error){status(error.message,true)}}});
$('#fields').addEventListener('click',e=>{const b=current(),el=e.target.closest('button');if(!el)return;const d=el.dataset;if('clear'in d){setValue(d.clear,'');renderFields();return}mutate(()=>{if('addItem'in d&&b.items.length<50)b.items.push({title:'새 항목',body:'',src:'',kind:'image',value:0});if('itemRemove'in d)b.items.splice(Number(d.itemRemove),1);if('itemUp'in d){const i=Number(d.itemUp);[b.items[i-1],b.items[i]]=[b.items[i],b.items[i-1]]}if('itemDown'in d){const i=Number(d.itemDown);[b.items[i+1],b.items[i]]=[b.items[i],b.items[i+1]]}if('addRow'in d&&b.rows.length<200)b.rows.push(b.columns.map(()=>''));if('addCol'in d&&b.columns.length<20){b.columns.push('새 열');b.rows.forEach(r=>r.push(''))}if('removeRow'in d)b.rows.splice(Number(d.removeRow),1);if('removeCol'in d){const i=Number(d.removeCol);b.columns.splice(i,1);b.rows.forEach(r=>r.splice(i,1))}})});
$('#templates').onclick=e=>{const button=e.target.closest('[data-template]');if(button)mutate(()=>doc.template=button.dataset.template,{fields:false})};
$('#document-settings').onclick=()=>select(null);
$('#block-list').onclick=e=>{const b=e.target.closest('[data-select]');if(b)select(b.dataset.select)};
$('#block-list').ondragstart=e=>{dragId=e.target.closest('[data-id]')?.dataset.id;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',dragId||'')};
$('#block-list').ondragover=e=>{if(dragId)e.preventDefault()};
$('#block-list').ondrop=e=>{e.preventDefault();const target=e.target.closest('[data-id]')?.dataset.id;if(!target||target===dragId||!dragId)return;mutate(()=>{const from=doc.blocks.findIndex(b=>b.id===dragId),to=doc.blocks.findIndex(b=>b.id===target);doc.blocks.splice(to,0,...doc.blocks.splice(from,1))});dragId=null};
$('#block-list').ondragend=()=>dragId=null;
$('#block-type').innerHTML=Object.entries(TYPES).map(([id,label])=>`<option value="${id}">${label}</option>`).join('');
$('#add-block').onclick=()=>{if(doc.blocks.length>=150){status('문서 하나당 150개 요소까지 지원합니다.',true);return}mutate(()=>{const b=makeBlock($('#block-type').value),i=doc.blocks.findIndex(b=>b.id===selected);doc.blocks.splice(i<0?doc.blocks.length:i+1,0,b);selected=b.id});panel('inspector')};
function move(delta){mutate(()=>{const i=doc.blocks.findIndex(b=>b.id===selected);doc.blocks.splice(i+delta,0,...doc.blocks.splice(i,1))})}
$('#up').onclick=()=>move(-1);$('#down').onclick=()=>move(1);
$('#duplicate').onclick=()=>{if(doc.blocks.length>=150)return;mutate(()=>{const b=clone(current());b.id=uid();const i=doc.blocks.findIndex(b=>b.id===selected);doc.blocks.splice(i+1,0,b);selected=b.id})};
$('#delete').onclick=()=>mutate(()=>{const i=doc.blocks.findIndex(b=>b.id===selected);doc.blocks.splice(i,1);selected=doc.blocks[Math.min(i,doc.blocks.length-1)]?.id||null});
function history(from,to){if(!from.length)return;to.push(clone(doc));doc=from.pop();if(!doc.blocks.some(b=>b.id===selected))selected=null;typing=false;changed({fields:true})}
$('#undo').onclick=()=>history(undo,redo);$('#redo').onclick=()=>history(redo,undo);
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.target.matches('input,textarea,select')){e.preventDefault();e.shiftKey?history(redo,undo):history(undo,redo)}});
$('#theme').onclick=()=>mutate(()=>doc.theme=doc.theme==='light'?'dark':'light',{fields:false});
$('#expand').onclick=()=>{const expanded=$('.workspace').classList.toggle('expanded');$('#expand').setAttribute('aria-pressed',expanded);$('#expand').textContent=expanded?'편집 패널 보기':'넓게 보기'};
$('#interact').onclick=()=>{reading=!reading;$('#interact').setAttribute('aria-pressed',reading);$('#interact').textContent=reading?'편집 모드로':'읽기 모드';send()};
document.querySelectorAll('[data-viewport]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-viewport]').forEach(x=>x.setAttribute('aria-pressed',x===b));frame.style.width=Number(b.dataset.viewport)?b.dataset.viewport+'px':'100%';frame.style.flexShrink='0'});
document.querySelectorAll('.mobile-nav button').forEach(b=>b.onclick=()=>panel(b.dataset.panel));
$('#help').onclick=()=>$('#help-dialog').showModal();$('#close-help').onclick=()=>$('#help-dialog').close();
$('#new').onclick=()=>$('#new-dialog').showModal();
$('#create-project').onclick=async()=>{try{await queueSave();let next=$('#new-content').value==='overdrive'?await fetch('overdrive.json').then(r=>r.json()):blank();next.id=uid();next.title=$('#new-title').value.trim()||'새 포트폴리오';next.template=$('#new-template').value;await activate(next);$('#new-dialog').close();panel('inspector')}catch(error){status(error.message,true)}};
$('#projects').onchange=async e=>{const id=e.target.value;try{await queueSave();const entry=(await storage.all()).find(e=>e.id===id);if(entry)await activate(entry.doc)}catch(error){status(error.message,true)}};
$('#import').onclick=()=>$('#import-file').click();
$('#import-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>350*1024*1024)throw Error('편집 파일은 350MB까지 열 수 있습니다.');const next=validate(JSON.parse(await file.text()));await queueSave();next.id=uid();await activate(next);status('편집 파일을 새 문서로 열었습니다.');panel('inspector')}catch(error){status('파일 열기 실패: '+error.message,true)}finally{e.target.value=''}};
async function exportFile(html){const controls=[$('#save-file'),$('#export-html')];controls.forEach(b=>b.disabled=true);try{await queueSave().catch(()=>{});const snapshot=clone(doc);status('자료를 포함하는 중…');const packed=await portable(snapshot,status);if(html)await saveHTML(packed);else saveJSON(packed);status(html?'공유용 HTML을 내려받았습니다.':'자료를 포함한 편집 파일을 내려받았습니다.')}catch(error){status('내보내기 실패: '+error.message+' · 외부 자료는 파일 업로드로 교체해 보세요.',true)}finally{controls.forEach(b=>b.disabled=false)}}
$('#save-file').onclick=()=>exportFile(false);$('#export-html').onclick=()=>exportFile(true);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&doc)queueSave().catch(()=>{})});
window.addEventListener('beforeunload',()=>{if(doc)queueSave().catch(()=>{})});
try{const draft=new URLSearchParams(location.search).get('draft');if(draft&&!/^[a-z0-9-]+$/.test(draft))throw Error('잘못된 초안 주소입니다.');const entries=await storage.all();if(draft){const entry=entries.find(e=>e.id===draft);await activate(entry?.doc||await fetch('drafts/'+draft+'.json').then(r=>{if(!r.ok)throw Error('초안을 찾을 수 없습니다.');return r.json()}))}else{const entry=entries.find(e=>e.id===storage.last())||entries.sort((a,b)=>b.updatedAt-a.updatedAt)[0];await activate(entry?.doc||await fetch('overdrive.json').then(r=>r.json()))}}catch(error){status('자동 저장을 사용할 수 없습니다: '+error.message,true);if(!doc)doc=validate(await fetch('overdrive.json').then(r=>r.json()));renderStructure();renderFields();send()}


const handoffDialog = $('#handoff-dialog');
$('#handoff').onclick = () => handoffDialog.showModal();
$('#handoff-save').onclick = async () => {
  const button = $('#handoff-save');
  button.disabled = true;
  try {
    const snapshot = clone(doc);
    const handoff = {
      documentId: snapshot.id,
      savedAt: new Date().toISOString(),
      selectedBlock: selected,
      request: $('#handoff-note').value.trim()
    };
    const packed = await portable(snapshot, status);
    saveJSON({ ...packed, handoff });
    handoffDialog.close();
    $('#handoff-note').value = '';
    status('수정본을 저장했습니다. 채팅에 첨부하거나 파일 경로를 알려주세요.');
  } catch (error) {
    status('수정본 저장 실패 · ' + error.message, true);
  } finally {
    button.disabled = false;
  }
};
