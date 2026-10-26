/* MR.ORBEA · Dialogos reales v1.0 · Biblioteca aprobada (no escribe en Supabase) */
(function(){
'use strict';
const scenarios=[
 {id:'aisle6',cat:'Trabajo',title:'Productos duplicados · Pasillo 6',description:'Pedir ayuda a un compañero para revisar productos mal ubicados.',turns:[{id:54,who:'Tú'},{id:69,who:'Compañero'},{id:46,who:'Tú'},{id:70,who:'Compañero'}]},
 {id:'bank-deposit',cat:'Banco y pagos',title:'Depósito desde cuenta de cheques',description:'Conversar sobre retiro de efectivo o transferencia desde tu cuenta.',turns:[{id:5,who:'Empleado'},{id:56,who:'Tú'},{id:71,who:'Empleado'},{id:72,who:'Tú'},{id:73,who:'Empleado'}]}
];
scenarios.push({id:'walgreens-prescription',cat:'Salud y farmacia',title:'Walgreens · Recoger una receta',description:'Recoger una receta médica en Walgreens.',turns:[{id:74,who:'Empleado'},{id:75,who:'Tú'},{id:76,who:'Empleado'},{id:77,who:'Tú'},{id:78,who:'Empleado'},{id:79,who:'Tú'}]});
scenarios.push({"id":"walgreens-ready","title":"Walgreens · Está lista","cat":"Salud y farmacia","description":"Recoger, pagar y despedirse.","turns":[{"id":74,"who":"Empleado"},{"id":75,"who":"Tú"},{"id":76,"who":"Empleado"},{"id":77,"who":"Tú"},{"id":78,"who":"Empleado"},{"id":80,"who":"Empleado"},{"id":81,"who":"Tú"},{"id":82,"who":"Empleado"},{"id":83,"who":"Tú"},{"id":84,"who":"Empleado"},{"id":85,"who":"Tú"},{"id":86,"who":"Empleado"},{"id":79,"who":"Tú"}]});
scenarios.push({"id":"walgreens-pending","title":"Walgreens · Aún no está lista","cat":"Salud y farmacia","description":"Preguntar cuándo regresar y despedirse.","turns":[{"id":74,"who":"Empleado"},{"id":75,"who":"Tú"},{"id":76,"who":"Empleado"},{"id":77,"who":"Tú"},{"id":78,"who":"Empleado"},{"id":87,"who":"Empleado"},{"id":88,"who":"Tú"},{"id":89,"who":"Empleado"},{"id":90,"who":"Tú"},{"id":91,"who":"Empleado"},{"id":92,"who":"Tú"}]});
scenarios.push({"id":"walgreens-partial","title":"Walgreens · Entrega parcial","cat":"Salud y farmacia","description":"Recoger lo disponible y consultar lo pendiente.","turns":[{"id":74,"who":"Empleado"},{"id":75,"who":"Tú"},{"id":76,"who":"Empleado"},{"id":77,"who":"Tú"},{"id":78,"who":"Empleado"},{"id":93,"who":"Empleado"},{"id":94,"who":"Tú"},{"id":95,"who":"Empleado"},{"id":96,"who":"Tú"},{"id":97,"who":"Empleado"},{"id":98,"who":"Tú"},{"id":99,"who":"Empleado"},{"id":83,"who":"Tú"},{"id":84,"who":"Empleado"},{"id":100,"who":"Tú"},{"id":101,"who":"Empleado"},{"id":79,"who":"Tú"}]});
scenarios.push({"id":"roger-cash-accepted","cat":"Banco y pagos","title":"Roger · Depósito aceptado","description":"Retirar efectivo, verificar cuenta y recibir comprobante.","turns":[{"id":5,"who":"Empleado"},{"id":56,"who":"Tú"},{"id":71,"who":"Empleado"},{"id":72,"who":"Tú"},{"id":105,"who":"Empleado"},{"id":106,"who":"Tú"},{"id":102,"who":"Empleado"},{"id":103,"who":"Tú"},{"id":104,"who":"Empleado"},{"id":107,"who":"Tú"},{"id":108,"who":"Empleado"},{"id":103,"who":"Tú"},{"id":109,"who":"Tú"},{"id":73,"who":"Empleado"},{"id":85,"who":"Tú"},{"id":110,"who":"Empleado"},{"id":111,"who":"Tú"}]});
scenarios.push({"id":"roger-cash-transfer","cat":"Banco y pagos","title":"Roger · Transferencia o Zelle","description":"Explicar por qué necesitas depósito en efectivo.","turns":[{"id":5,"who":"Empleado"},{"id":56,"who":"Tú"},{"id":112,"who":"Empleado"},{"id":113,"who":"Tú"},{"id":114,"who":"Tú"},{"id":115,"who":"Tú"},{"id":116,"who":"Tú"},{"id":117,"who":"Empleado"},{"id":79,"who":"Tú"}]});
scenarios.push({"id":"roger-cash-receipt","cat":"Banco y pagos","title":"Roger · Verificar comprobante","description":"Comparar comprobante previo y pedir uno nuevo.","turns":[{"id":5,"who":"Empleado"},{"id":56,"who":"Tú"},{"id":118,"who":"Tú"},{"id":119,"who":"Tú"},{"id":120,"who":"Empleado"},{"id":121,"who":"Tú"},{"id":109,"who":"Tú"},{"id":73,"who":"Empleado"},{"id":122,"who":"Tú"},{"id":123,"who":"Empleado"},{"id":124,"who":"Tú"}]});
scenarios.push({"id":"roger-cash-refused","cat":"Banco y pagos","title":"Roger · Depósito rechazado","description":"Consultar alternativas con el dueño de la casa.","turns":[{"id":5,"who":"Empleado"},{"id":56,"who":"Tú"},{"id":125,"who":"Empleado"},{"id":126,"who":"Tú"},{"id":127,"who":"Empleado"},{"id":128,"who":"Tú"},{"id":129,"who":"Tú"}]});
// Manager · Tareas adicionales: turno 6 aprobado como ID 153 (histórico ID 050 preservado en Supabase).
// Approved manager scenarios are synchronized from Supabase; no local copies needed.
const LOCAL_DIALOGUES_KEY='mrorbea-dialogues-local-v1';
function loadMyDialogues(){
 try{
  const arr=JSON.parse(localStorage.getItem(LOCAL_DIALOGUES_KEY)||'[]');
  if(Array.isArray(arr))arr.forEach(d=>{
   if(d&&typeof d.id==='string'&&d.id.startsWith('mine-')&&Array.isArray(d.turns)&&d.turns.length>=2&&d.turns.every(t=>Number.isInteger(t.id)&&typeof t.who==='string')&&!scenarios.some(x=>x.id===d.id))
    scenarios.push({id:d.id,cat:String(d.cat||'Personal'),title:String(d.title||'Mi diálogo'),description:'Creado en este iPhone',turns:d.turns});
  });
 }catch(e){console.warn('No se pudieron recuperar diálogos locales',e)}
}
loadMyDialogues();
async function syncApprovedDialogues(strict=false){
 const url=localStorage.getItem('mrorbea-sb-url'),key=localStorage.getItem('mrorbea-sb-key');
 if(!url||!key){if(strict)throw Error('No hay conexión Supabase configurada');return 0;}
 try{
  const response=await fetch(url+'/rest/v1/dialogues?select=slug,title,category,description,turns&approved=eq.true&order=id.asc',{headers:{apikey:key,Authorization:'Bearer '+key},cache:'no-store'});
  if(!response.ok)throw Error('HTTP '+response.status);
  const rows=await response.json();
  if(!Array.isArray(rows))return;
  const remote=rows.filter(d=>d&&typeof d.slug==='string'&&Array.isArray(d.turns)&&d.turns.length>=2&&d.turns.every(t=>Number.isInteger(Number(t.id))&&typeof t.who==='string')).map(d=>({id:d.slug,title:d.title,cat:d.category,description:d.description||'',turns:d.turns.map(t=>({id:Number(t.id),who:t.who}))}));
  remote.forEach(d=>{const index=scenarios.findIndex(x=>x.id===d.id);if(index>=0)scenarios[index]=d;else scenarios.push(d)});
  if(!document.getElementById('special').hidden)renderMenu();
  return remote.length;
 }catch(e){console.warn('Diálogos: se usan copias locales disponibles',e.message);if(strict)throw e;return 0;}
}
document.addEventListener('mrorbea-sync',()=>syncApprovedDialogues());
syncApprovedDialogues();
let builderTurns=[];
function editDialogue(){
 stopAudio();builderTurns=[];renderBuilder();
}
function renderBuilder(){
 const body=document.getElementById('extraBody');
 document.getElementById('extraTitle').textContent='Crear diálogo';
 const choices=phrases.filter(p=>p.en&&p.es).sort((a,b)=>Number(a.id)-Number(b.id));
 if(!choices.length){body.textContent='Primero sincroniza tus frases aprobadas desde Supabase.';show('extras');return}
 const currentTitle=body.querySelector('#myDialogueTitle')?.value||'Mi nuevo diálogo';
 const currentCat=body.querySelector('#myDialogueCategory')?.value||'Trabajo';
 const categories=[...new Set(choices.map(p=>p.cat).filter(Boolean))];
 body.innerHTML='<button id="dlgBack">← Diálogos reales</button>'+
 '<div class="card"><h2>Constructor de diálogos</h2><p class="muted">Selecciona frases aprobadas. No se mueven ni se duplican. Esta versión guarda el diálogo en este dispositivo.</p>'+
 '<label>Título</label><input id="myDialogueTitle" maxlength="100">'+
 '<label>Categoría</label><select id="myDialogueCategory"></select>'+
 '<label>Frase aprobada</label><select id="myDialoguePhrase"></select>'+
 '<label>Quién habla</label><select id="myDialogueSpeaker"><option value="Tú">Tú</option><option value="Interlocutor">Interlocutor</option></select>'+
 '<button class="primary" id="dlgAdd">＋ Agregar intervención</button></div>'+
 '<div class="card"><h2>Secuencia ('+builderTurns.length+')</h2><div id="dlgSequence"></div></div>'+
 '<button class="primary" id="dlgSave">Guardar diálogo en este iPhone</button><p class="muted">Tus frases oficiales no se modifican. Para compartir diálogos entre dispositivos necesitaríamos sincronizarlos después.</p>';
 body.querySelector('#myDialogueTitle').value=currentTitle;
 const cats=body.querySelector('#myDialogueCategory');
 categories.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;cats.appendChild(o)});
 cats.value=categories.includes(currentCat)?currentCat:categories[0];
 const select=body.querySelector('#myDialoguePhrase');
 function filterChoices(){const candidates=choices.filter(p=>p.cat===cats.value);select.innerHTML='';candidates.forEach(p=>{const o=document.createElement('option');o.value=String(p.id);o.textContent=String(p.id).padStart(3,'0')+' · '+p.en;select.appendChild(o)});if(!candidates.length){const o=document.createElement('option');o.textContent='No hay frases aprobadas en esta categoría';o.value='';select.appendChild(o)}}
 cats.onchange=filterChoices;
 /* legacy list intentionally replaced by category filtering */
 /* choices.forEach(p=>{const o=document.createElement('option');o.value=String(p.id);o.textContent=String(p.id).padStart(3,'0')+' · '+p.en;select.appendChild(o)}); */
 filterChoices();
 const list=body.querySelector('#dlgSequence');
 builderTurns.forEach((turn,i)=>{
   const p=phrase(turn),line=document.createElement('div');line.className='card';
   const title=document.createElement('strong');title.textContent=(i+1)+'. '+turn.who+' · '+(p?p.en:'Frase no encontrada');line.appendChild(title);
   const controls=document.createElement('div');controls.className='grid';
   [['↑',()=>{if(i>0){[builderTurns[i-1],builderTurns[i]]=[builderTurns[i],builderTurns[i-1]];captureAndRender()}}],['↓',()=>{if(i<builderTurns.length-1){[builderTurns[i+1],builderTurns[i]]=[builderTurns[i],builderTurns[i+1]];captureAndRender()}}],['Quitar',()=>{builderTurns.splice(i,1);captureAndRender()}]].forEach(([label,fn])=>{const b=document.createElement('button');b.textContent=label;b.onclick=fn;controls.appendChild(b)});
   line.appendChild(controls);list.appendChild(line);
 });
 function captureAndRender(){renderBuilderWith(currentTitleNode.value,catNode.value)}
 const currentTitleNode=body.querySelector('#myDialogueTitle'),catNode=body.querySelector('#myDialogueCategory');
 function renderBuilderWith(title,cat){renderBuilder();body.querySelector('#myDialogueTitle').value=title;body.querySelector('#myDialogueCategory').value=cat}
 body.querySelector('#dlgBack').onclick=renderMenu;
 body.querySelector('#dlgAdd').onclick=()=>{
  const id=Number(select.value);if(!phrase({id}))return;
  builderTurns.push({id,who:body.querySelector('#myDialogueSpeaker').value});renderBuilderWith(currentTitleNode.value,catNode.value)
 };
 body.querySelector('#dlgSave').onclick=()=>{
  const title=currentTitleNode.value.trim();
  if(!title||builderTurns.length<2){alert('Escribe un título y agrega al menos dos intervenciones.');return}
  const mine=scenarios.filter(x=>x.id.startsWith('mine-'));
  const id='mine-'+Date.now();
  const entry={id,title,cat:catNode.value,description:'Creado en este iPhone',turns:builderTurns.map(t=>({...t}))};
  mine.push(entry);
  try{localStorage.setItem(LOCAL_DIALOGUES_KEY,JSON.stringify(mine))}catch(e){alert('No se pudo guardar en el dispositivo.');return}
  scenarios.push(entry);renderMenu();
 };
 show('extras');
}
const EDIT_KEY='mrorbea-dialogue-approved-overrides-v1';
function readEdits(){try{return JSON.parse(localStorage.getItem(EDIT_KEY)||'{}')}catch(_){return {}}}
function saveEdit(dialogueId,index,entry){
 const edits=readEdits(),key=dialogueId+':'+index;
 const prior=edits[key];
 edits[key]={...entry,history:[...(prior?.history||[]),...(prior?[{en:prior.en,es:prior.es,pron:prior.pron,at:prior.at}]:[])],at:new Date().toISOString()};
 localStorage.setItem(EDIT_KEY,JSON.stringify(edits));
}
function turnPhrase(){
 const t=active.turns[step],p=phrase(t);
 if(!p)return null;
 const edit=readEdits()[active.id+':'+step];
 return edit?{...p,...edit}:p;
}
let active=null,step=0,showSpanish=true,showPron=false,hideAnswer=false,speed=0.9;
function available(d){return d.turns.every(t=>t.en&&t.es||phrases.some(p=>Number(p.id)===t.id))}
function phrase(t){return t.en&&t.es?{en:t.en,es:t.es,pron:t.pron||'',id:t.id}:phrases.find(p=>Number(p.id)===t.id)}
function stopAudio(){if('speechSynthesis' in window)window.speechSynthesis.cancel()}
function speak(){stopAudio();if(!('speechSynthesis' in window))return;let p=turnPhrase();if(!p)return;const u=new SpeechSynthesisUtterance(p.en);u.lang='en-US';u.rate=speed;window.speechSynthesis.speak(u)}
function visibleDialogues(){
 const valid=scenarios.filter(d=>available(d)&&(!d.id.startsWith('mine-')||d.turns.every(t=>phrases.find(p=>Number(p.id)===t.id)?.cat===d.cat)));
 const seen=new Map();
 for(const d of valid){const key=d.id==='walgreens-practice'||d.id==='walgreens-prescription'?'walgreens-prescription':d.id;if(!seen.has(key))seen.set(key,d)}
 return [...seen.values()].filter(d=>d.id!=='walgreens-practice');
}
function topicOf(d){return d.cat==='Salud y farmacia'&&d.id.startsWith('walgreens')?'Walgreens':d.cat}
function renderMenu(){
 const root=document.getElementById('categories');
 const items=visibleDialogues(),topics=[...new Set(items.map(topicOf))];
 document.querySelector('#special .title').textContent='Diálogos reales';
 root.innerHTML='<div class="card"><div class="grid"><button class="primary" id="dlgCreate">＋ Crear diálogo con mis frases</button><button id="dlgRefresh">⟳ Actualizar</button></div><p id="dlgRefreshStatus" class="muted" role="status">Actualiza frases y diálogos desde Supabase.</p></div>'+
 '<div class="card"><h2>Mis situaciones</h2><p class="muted">Elige un tema y después la conversación que quieras practicar.</p></div>'+
 topics.map(t=>'<button class="category" data-topic="'+safe(t)+'">📁 '+safe(t)+' <small>· '+items.filter(d=>topicOf(d)===t).length+' situaciones</small></button>').join('');
 root.querySelector('#dlgCreate').onclick=editDialogue;
 root.querySelector('#dlgRefresh').onclick=async()=>{const button=root.querySelector('#dlgRefresh');button.disabled=true;const status=root.querySelector('#dlgRefreshStatus');status.textContent='Actualizando…';try{if(typeof window.mrOrbeaSync==='function')await window.mrOrbeaSync();const count=await syncApprovedDialogues(true);const updated=document.querySelector('#dlgRefreshStatus');if(updated)updated.textContent='✓ '+count+' diálogos sincronizados · '+new Date().toLocaleTimeString('es-US',{hour:'numeric',minute:'2-digit'});}catch(e){const updated=document.querySelector('#dlgRefreshStatus');if(updated)updated.textContent='⚠ No se pudo actualizar: '+e.message;}finally{const current=document.querySelector('#dlgRefresh');if(current)current.disabled=false;}};
 root.querySelectorAll('[data-topic]').forEach(el=>el.onclick=()=>showTopic(el.dataset.topic));
 show('special');
}
function showTopic(topic){
 const matches=visibleDialogues().filter(d=>topicOf(d)===topic);
 document.getElementById('extraTitle').textContent=topic;
 document.getElementById('extraBody').innerHTML='<button id="dialogBackMenu">← Temas</button>'+
 (topic==='Trabajo'?
 '<button class="phrase" id="managerGroup"><strong>📁 Coordinación con manager</strong><small>6 situaciones · prioridades, proveedores, scanner, pedidos y front end</small></button>'+
 matches.filter(d=>!d.id.startsWith('manager-')).map(d=>'<button class="phrase" data-dialog-id="'+safe(d.id)+'"><strong>'+safe(d.title)+'</strong><small>'+d.turns.length+' intervenciones</small></button>').join(''):
 topic==='Banco y pagos'?
 '<button class="phrase" id="rogerGroup"><strong>📁 Depósito en efectivo para Roger</strong><small>4 situaciones · aceptado, transferencia/Zelle, comprobante y rechazo</small></button>'+
 matches.filter(d=>!d.id.startsWith('roger-cash-')).map(d=>'<button class="phrase" data-dialog-id="'+safe(d.id)+'"><strong>'+safe(d.title)+'</strong><small>'+d.turns.length+' intervenciones</small></button>').join(''):
 matches.map(d=>'<button class="phrase" data-dialog-id="'+safe(d.id)+'"><strong>'+safe(d.title.replace(/^Walgreens · /,''))+'</strong><small>'+d.turns.length+' intervenciones · '+safe(d.description||'')+'</small></button>').join(''));
 document.getElementById('extraBody').querySelector('#dialogBackMenu').onclick=renderMenu;
 const roger=document.getElementById('extraBody').querySelector('#rogerGroup');if(roger)roger.onclick=showRoger;
 const mgr=document.getElementById('extraBody').querySelector('#managerGroup');if(mgr)mgr.onclick=showManager;
 document.getElementById('extraBody').querySelectorAll('[data-dialog-id]').forEach(el=>el.onclick=()=>start(el.dataset.dialogId));
 show('extras');
}
function showManager(){
 const matches=visibleDialogues().filter(d=>d.id.startsWith('manager-'));
 document.getElementById('extraTitle').textContent='Coordinación con manager';
 document.getElementById('extraBody').innerHTML='<button id="managerBack">← Trabajo</button>'+matches.map(d=>'<button class="phrase" data-dialog-id="'+safe(d.id)+'"><strong>'+safe(d.title.replace(/^Manager · /,''))+'</strong><small>'+d.turns.length+' intervenciones</small></button>').join('');
 document.getElementById('managerBack').onclick=()=>showTopic('Trabajo');
 document.querySelectorAll('#extraBody [data-dialog-id]').forEach(el=>el.onclick=()=>start(el.dataset.dialogId));
 show('extras');
}
function showRoger(){
 const matches=visibleDialogues().filter(d=>d.id.startsWith('roger-cash-'));
 document.getElementById('extraTitle').textContent='Depósito en efectivo para Roger';
 document.getElementById('extraBody').innerHTML='<button id="rogerBack">← Banco y pagos</button>'+matches.map(d=>'<button class="phrase" data-dialog-id="'+safe(d.id)+'"><strong>'+safe(d.title.replace(/^Roger · /,''))+'</strong><small>'+d.turns.length+' intervenciones</small></button>').join('');
 document.getElementById('rogerBack').onclick=()=>showTopic('Banco y pagos');
 document.querySelectorAll('#extraBody [data-dialog-id]').forEach(el=>el.onclick=()=>start(el.dataset.dialogId));
 show('extras');
}
function showCategory(cat){showTopic(cat==='Salud y farmacia'?'Walgreens':cat)}
function start(id){active=scenarios.find(d=>d.id===id);step=0;hideAnswer=false;renderTurn()}
function renderTurn(){
 if(!active)return;
 stopAudio();
 const t=active.turns[step],p=turnPhrase(),body=document.getElementById('extraBody');
 if(!p){showCategory(active.cat);return}
 document.getElementById('extraTitle').textContent='Diálogo · '+active.cat;
 body.innerHTML='<button id="dialogBackCategory">← Volver a '+active.cat+'</button>'+
 '<p class="muted">'+active.title+' · Turno '+(step+1)+' de '+active.turns.length+(active.draft?' · Propuesta pendiente de tu revisión':'')+'</p>'+
 '<div class="card"><small>'+t.who+' · '+(active.draft?'PROPUESTA PARA PRACTICAR · NO APROBADA':'Frase '+String(t.id).padStart(3,'0')+(readEdits()[active.id+':'+step]?' · Versión local aprobada':' · Aprobada'))+'</small>'+
 (hideAnswer&&t.who==='Tú'?'<h2>Intenta decir tu frase antes de verla</h2><button id="dialogReveal">Mostrar respuesta</button>':'<h2 id="dialogEnglish"></h2>'+(showSpanish?'<p id="dialogSpanish" class="muted"></p>':'')+(showPron?'<p id="dialogPron" class="muted"></p>':''))+'</div>'+
 '<div class="card"><div class="grid"><button id="dialogCorrect" class="primary">✎ Corregir frase</button><button id="dialogBernardo">💬 Consultar a Bernardo</button></div><p class="muted">Solicita revisión y aprobación antes de guardar una nueva versión. La frase oficial permanece intacta.</p></div>'+
 '<div class="card"><div class="grid"><button id="dialogListen" class="primary">▶ Escuchar</button><button id="dialogStop">■ Detener</button></div>'+
 '<label>Velocidad</label><select id="dialogSpeed"><option value="0.75">Lenta</option><option value="0.9">Normal</option><option value="1.05">Rápida</option></select></div>'+
 '<div class="card"><label><input type="checkbox" id="dialogSpanishToggle"> Español</label> <label><input type="checkbox" id="dialogPronToggle"> Pronunciación</label><label><input type="checkbox" id="dialogHideToggle"> Ocultar mis respuestas</label></div>'+
 '<div class="grid"><button id="dialogPrev">← Anterior</button><button id="dialogNext" class="primary">'+(step===active.turns.length-1?'↺ Repetir':'Siguiente →')+'</button></div>';
 const e=body.querySelector('#dialogEnglish');if(e)e.textContent=p.en;
 const es=body.querySelector('#dialogSpanish');if(es)es.textContent=p.es;
 const pr=body.querySelector('#dialogPron');if(pr)pr.textContent=p.pron||'Pronunciación pendiente';
 body.querySelector('#dialogBackCategory').onclick=()=>showCategory(active.cat);
 const reveal=body.querySelector('#dialogReveal');if(reveal)reveal.onclick=()=>{hideAnswer=false;renderTurn()};

 body.querySelector('#dialogBernardo').onclick=()=>{
  stopAudio();
  const request='Bernardo, revisa esta frase de MR.ORBEA, diálogo '+active.title+', turno '+(step+1)+', hablante '+t.who+', ID '+t.id+': Inglés: '+p.en+'; Español: '+p.es+'; pronunciación: '+(p.pron||'pendiente')+'. Propón inglés americano fácil y natural, comprueba significado, pronunciación y continuidad del diálogo. No guardes ni publiques hasta mi aprobación.';
  const box=document.createElement('div');box.className='card';box.id='bernardoConsultPanel';
  const label=document.createElement('p');label.textContent='Consulta preparada. Copia el mensaje y pégalo en este chat con Bernardo.';box.appendChild(label);
  const ta=document.createElement('textarea');ta.rows=5;ta.value=request;box.appendChild(ta);
  const copy=document.createElement('button');copy.className='primary';copy.textContent='Copiar consulta';
  copy.onclick=()=>{ta.select();if(navigator.clipboard?.writeText)navigator.clipboard.writeText(ta.value).then(()=>{label.textContent='Consulta copiada. Ahora pégala en ChatGPT.'}).catch(()=>{label.textContent='Selecciona el texto y cópialo manualmente.'});else label.textContent='Selecciona el texto y cópialo manualmente.'};
  box.appendChild(copy);body.querySelector('#bernardoConsultPanel')?.remove();body.querySelector('#dialogBernardo').closest('.card').after(box);
 };
 body.querySelector('#dialogCorrect').onclick=()=>{
  stopAudio();
  const panel=document.createElement('div');panel.className='card';panel.id='dialogCorrectionPanel';
  const h=document.createElement('h3');h.textContent='Editar y aprobar esta intervención';panel.appendChild(h);
  const inputs=[['Inglés',p.en],['Español',p.es],['Pronunciación',p.pron||'']].map(([label,value])=>{const l=document.createElement('label');l.textContent=label;panel.appendChild(l);const a=document.createElement('textarea');a.rows=2;a.value=value;panel.appendChild(a);return a});
  const status=document.createElement('p');status.className='muted';status.textContent='Solo se actualizará esta intervención. Se conservará su versión anterior.';panel.appendChild(status);
  const save=document.createElement('button');save.className='primary';save.textContent='✓ Aprobar y guardar en este iPhone';
  save.onclick=()=>{
   const [en,es,pron]=inputs.map(i=>i.value.trim());
   if(!en||!es){status.textContent='Completa inglés y español.';return}
   if(en===p.en&&es===p.es&&pron===(p.pron||'')){status.textContent='No hay cambios que guardar.';return}
   if(!confirm('¿Apruebas esta corrección para el diálogo '+active.title+'?'))return;
   try{saveEdit(active.id,step,{en,es,pron});renderTurn()}catch(e){status.textContent='No se pudo guardar: '+e.message}
  };
  panel.appendChild(save);
  const cancel=document.createElement('button');cancel.textContent='Cancelar';cancel.onclick=()=>panel.remove();panel.appendChild(cancel);
  body.querySelector('#dialogCorrectionPanel')?.remove();body.querySelector('#dialogCorrect').closest('.card').after(panel);
 };
 body.querySelector('#dialogBernardo').onclick=()=>{
  stopAudio();
  const request='Bernardo, en MR.ORBEA necesito 2 opciones mejores para la frase '+t.id+' en '+active.title+', turno '+(step+1)+'. Original: '+p.en+' / '+p.es+'. Revisa naturalidad, significado, pronunciación y continuidad. Solicita mi aprobación y luego registra la versión aprobada en Supabase.';
  const panel=document.createElement('div');panel.className='card';panel.id='bernardoConsultPanel';
  const h=document.createElement('h3');h.textContent='Consultar a Bernardo';panel.appendChild(h);
  const msg=document.createElement('p');msg.className='muted';msg.textContent='La generación automática dentro de la app todavía necesita conexión con un servicio de IA. Puedes enviar esta consulta a ChatGPT sin copiarla manualmente.';panel.appendChild(msg);
  const b=document.createElement('button');b.className='primary';b.textContent='Abrir consulta en ChatGPT';
  b.onclick=()=>{window.open('https://chatgpt.com/?q='+encodeURIComponent(request),'_blank','noopener')};
  panel.appendChild(b);
  const cancel=document.createElement('button');cancel.textContent='Cancelar';cancel.onclick=()=>panel.remove();panel.appendChild(cancel);
  body.querySelector('#bernardoConsultPanel')?.remove();body.querySelector('#dialogBernardo').closest('.card').after(panel);
 };
 body.querySelector('#dialogListen').onclick=speak;
 body.querySelector('#dialogStop').onclick=stopAudio;
 body.querySelector('#dialogSpeed').value=String(speed);body.querySelector('#dialogSpeed').onchange=e=>{speed=Number(e.target.value);stopAudio()};
 body.querySelector('#dialogSpanishToggle').checked=showSpanish;body.querySelector('#dialogSpanishToggle').onchange=e=>{showSpanish=e.target.checked;renderTurn()};
 body.querySelector('#dialogPronToggle').checked=showPron;body.querySelector('#dialogPronToggle').onchange=e=>{showPron=e.target.checked;renderTurn()};
 body.querySelector('#dialogHideToggle').checked=hideAnswer;body.querySelector('#dialogHideToggle').onchange=e=>{hideAnswer=e.target.checked;renderTurn()};
 body.querySelector('#dialogPrev').disabled=step===0;body.querySelector('#dialogPrev').onclick=()=>{step=Math.max(0,step-1);renderTurn()};
 body.querySelector('#dialogNext').onclick=()=>{step=(step+1)%active.turns.length;renderTurn()};
 show('extras');
}
showSpecial=renderMenu;
document.addEventListener('mrorbea-sync',()=>{if(!document.getElementById('special').hidden)renderMenu()});
window.addEventListener('pagehide',stopAudio);
})();
