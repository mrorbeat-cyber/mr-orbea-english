/* MR.ORBEA · Dialogos reales v1.0 · Biblioteca aprobada (no escribe en Supabase) */
(function(){
'use strict';
const scenarios=[
 {id:'aisle6',cat:'Trabajo',title:'Productos duplicados · Pasillo 6',description:'Pedir ayuda a un compañero para revisar productos mal ubicados.',turns:[{id:54,who:'Tú'},{id:69,who:'Compañero'},{id:46,who:'Tú'},{id:70,who:'Compañero'}]}
];
let active=null,step=0,showSpanish=true,showPron=false,hideAnswer=false,speed=0.9;
const oldSpecial=showSpecial;
function available(d){return d.turns.every(t=>phrases.some(p=>Number(p.id)===t.id))}
function phrase(t){return phrases.find(p=>Number(p.id)===t.id)}
function stopAudio(){if('speechSynthesis' in window)window.speechSynthesis.cancel()}
function speak(){stopAudio();if(!('speechSynthesis' in window))return;let p=phrase(active.turns[step]);if(!p)return;const u=new SpeechSynthesisUtterance(p.en);u.lang='en-US';u.rate=speed;window.speechSynthesis.speak(u)}
function renderMenu(){
 const root=document.getElementById('categories');
 const cats=['Trabajo','Restaurante','Banco y pagos','Compras','Vida cotidiana','Salud y farmacia'];
 const have=scenarios.filter(available);
 document.querySelector('#special .title').textContent='Diálogos reales';
 root.innerHTML='<div class="card"><h2>Aprende a conversar</h2><p class="muted">Pregunta, responde y continúa conversaciones con tus frases aprobadas. No se generan ni guardan frases nuevas sin tu autorización.</p></div>'+
 cats.map(cat=>'<button class="category" data-dialog-cat="'+cat+'">💬 '+cat+' <small>· '+have.filter(d=>d.cat===cat).length+' diálogos</small></button>').join('')+
 '<div class="card"><button id="openOriginalSpecial">📚 Ver frases de Inglés especializado</button></div>';
 root.querySelectorAll('[data-dialog-cat]').forEach(el=>el.onclick=()=>showCategory(el.dataset.dialogCat));
 root.querySelector('#openOriginalSpecial').onclick=()=>oldSpecial();
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
