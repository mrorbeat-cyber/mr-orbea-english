/* MR.ORBEA · Dialogos reales v1.0 · Biblioteca aprobada (no escribe en Supabase) */
(function(){
'use strict';
const scenarios=[
 {id:'aisle6',cat:'Trabajo',title:'Productos duplicados · Pasillo 6',description:'Pedir ayuda a un compañero para revisar productos mal ubicados.',turns:[{id:54,who:'Tú'},{id:69,who:'Compañero'},{id:46,who:'Tú'},{id:70,who:'Compañero'}]},
 {id:'bank-deposit',cat:'Banco y pagos',title:'Depósito desde cuenta de cheques',description:'Conversar sobre retiro de efectivo o transferencia desde tu cuenta.',turns:[{id:5,who:'Empleado'},{id:56,who:'Tú'},{id:71,who:'Empleado'},{id:72,who:'Tú'},{id:73,who:'Empleado'}]}
];
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
async function syncApprovedDialogues(){
 const url=localStorage.getItem('mrorbea-sb-url'),key=localStorage.getItem('mrorbea-sb-key');
 if(!url||!key)return;
 try{
  const response=await fetch(url+'/rest/v1/dialogues?select=slug,title,category,description,turns&approved=eq.true&order=id.asc',{headers:{apikey:key,Authorization:'Bearer '+key},cache:'no-store'});
  if(!response.ok)throw Error('HTTP '+response.status);
  const rows=await response.json();
  if(!Array.isArray(rows))return;
  const remote=rows.filter(d=>d&&typeof d.slug==='string'&&Array.isArray(d.turns)&&d.turns.length>=2&&d.turns.every(t=>Number.isInteger(Number(t.id))&&typeof t.who==='string')).map(d=>({id:d.slug,title:d.title,cat:d.category,description:d.description||'',turns:d.turns.map(t=>({id:Number(t.id),who:t.who}))}));
  remote.forEach(d=>{const index=scenarios.findIndex(x=>x.id===d.id);if(index>=0)scenarios[index]=d;else scenarios.push(d)});
  if(!document.getElementById('special').hidden)renderMenu();
 }catch(e){console.warn('Diálogos: se usan copias locales disponibles',e.message)}
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
 choices.forEach(p=>{const o=document.createElement('option');o.value=String(p.id);o.textContent=String(p.id).padStart(3,'0')+' · '+p.en;select.appendChild(o)});
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
let active=null,step=0,showSpanish=true,showPron=false,hideAnswer=false,speed=0.9;
function available(d){return d.turns.every(t=>phrases.some(p=>Number(p.id)===t.id))}
function phrase(t){return phrases.find(p=>Number(p.id)===t.id)}
function stopAudio(){if('speechSynthesis' in window)window.speechSynthesis.cancel()}
function speak(){stopAudio();if(!('speechSynthesis' in window))return;let p=phrase(active.turns[step]);if(!p)return;const u=new SpeechSynthesisUtterance(p.en);u.lang='en-US';u.rate=speed;window.speechSynthesis.speak(u)}
function renderMenu(){
 const root=document.getElementById('categories');
 const have=scenarios.filter(available);
 document.querySelector('#special .title').textContent='Diálogos reales';
 root.innerHTML='<div class="card"><button class="primary" id="dlgCreate">＋ Crear diálogo con mis frases</button></div><div class="card"><h2>Aprende a conversar</h2><p class="muted">Practica preguntas y respuestas reales con frases aprobadas. Aquí no aparece la antigua biblioteca ni categorías vacías.</p></div>'+
 (have.length?have.map(d=>'<button class="category" data-dialog-id="'+d.id+'">💬 '+d.title+' <small>· '+d.turns.length+' intervenciones aprobadas</small></button>').join(''):'<div class="card"><p>Sin diálogos disponibles. Verifica la sincronización de Supabase.</p></div>');
 root.querySelector('#dlgCreate').onclick=editDialogue;
 root.querySelectorAll('[data-dialog-id]').forEach(el=>el.onclick=()=>start(el.dataset.dialogId));
 show('special');
}
function showCategory(cat){
 const matches=scenarios.filter(d=>d.cat===cat&&available(d));
 document.getElementById('extraTitle').textContent='Diálogos · '+cat;
 document.getElementById('extraBody').innerHTML='<button id="dialogBackMenu">← Todas las situaciones</button><p class="muted">Selecciona un diálogo para practicar. Solo se usan frases ya aprobadas.</p>'+
 (matches.length?matches.map(d=>'<button class="phrase" data-dialog-id="'+d.id+'"><strong>'+d.title+'</strong><small>'+d.description+' · '+d.turns.length+' intervenciones</small></button>').join(''):'<div class="card"><strong>Aún no hay diálogos aprobados en esta situación.</strong><p class="muted">Puedes seguir utilizando las frases individuales de tu biblioteca. No inventaremos conversaciones automáticamente.</p></div>');
 document.getElementById('extraBody').querySelector('#dialogBackMenu').onclick=renderMenu;
 document.getElementById('extraBody').querySelectorAll('[data-dialog-id]').forEach(el=>el.onclick=()=>start(el.dataset.dialogId));
 show('extras');
}
function start(id){active=scenarios.find(d=>d.id===id);step=0;hideAnswer=false;renderTurn()}
function renderTurn(){
 if(!active)return;
 stopAudio();
 const t=active.turns[step],p=phrase(t),body=document.getElementById('extraBody');
 if(!p){showCategory(active.cat);return}
 document.getElementById('extraTitle').textContent='Diálogo · '+active.cat;
 body.innerHTML='<button id="dialogBackCategory">← Volver a '+active.cat+'</button>'+
 '<p class="muted">'+active.title+' · Turno '+(step+1)+' de '+active.turns.length+'</p>'+
 '<div class="card"><small>'+t.who+' · Frase '+String(t.id).padStart(3,'0')+' · Aprobada</small>'+
 (hideAnswer&&t.who==='Tú'?'<h2>Intenta decir tu frase antes de verla</h2><button id="dialogReveal">Mostrar respuesta</button>':'<h2 id="dialogEnglish"></h2>'+(showSpanish?'<p id="dialogSpanish" class="muted"></p>':'')+(showPron?'<p id="dialogPron" class="muted"></p>':''))+'</div>'+
 '<div class="card"><div class="grid"><button id="dialogListen" class="primary">▶ Escuchar</button><button id="dialogStop">■ Detener</button></div>'+
 '<label>Velocidad</label><select id="dialogSpeed"><option value="0.75">Lenta</option><option value="0.9">Normal</option><option value="1.05">Rápida</option></select></div>'+
 '<div class="card"><label><input type="checkbox" id="dialogSpanishToggle"> Español</label> <label><input type="checkbox" id="dialogPronToggle"> Pronunciación</label><label><input type="checkbox" id="dialogHideToggle"> Ocultar mis respuestas</label></div>'+
 '<div class="grid"><button id="dialogPrev">← Anterior</button><button id="dialogNext" class="primary">'+(step===active.turns.length-1?'↺ Repetir':'Siguiente →')+'</button></div>';
 const e=body.querySelector('#dialogEnglish');if(e)e.textContent=p.en;
 const es=body.querySelector('#dialogSpanish');if(es)es.textContent=p.es;
 const pr=body.querySelector('#dialogPron');if(pr)pr.textContent=p.pron||'Pronunciación pendiente';
 body.querySelector('#dialogBackCategory').onclick=()=>showCategory(active.cat);
 const reveal=body.querySelector('#dialogReveal');if(reveal)reveal.onclick=()=>{hideAnswer=false;renderTurn()};
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
