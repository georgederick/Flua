"use strict";
/* ===== Rotas ===== */
const ROUTES=[["dash","Visão geral","M3 10l7-6 7 6v7H3z"],["mine","Minhas tarefas","M4 10l4 4 8-8"],["kanban","Quadro","M3 4h5v12H3zM12 4h5v7h-5z"],["proj","Projetos","M3 6h14v10H3zM7 6V4h6v2"],["cal","Calendário","M3 5h14v12H3zM3 9h14M7 3v4M13 3v4"],["team","Equipe","M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 17c0-3 2-5 5-5s5 2 5 5"],["set","Configurações","M10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM10 2v2M10 16v2M2 10h2M16 10h2"]];
let route="dash",F={q:"",st:"",pr:"",as:""},calM=new Date(),param=null;
function side(){
 $("#side").innerHTML=`<div class="brand">${logo()}<span class="lb">Flua</span></div>`+
 ROUTES.map(r=>`<button class="nav ${route===r[0]?"on":""}" data-go="${r[0]}"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${r[2]}"/></svg><span class="lb">${r[1]}</span></button>`).join("")+
 `<div class="grp lb">Espaços de trabalho</div>`+D.projects.map(p=>`<button class="nav ws" data-go="proj" data-p="${p.id}"><i class="dot" style="background:${p.color}"></i><span class="lb">${esc(p.name)}</span></button>`).join("")+
 `<button class="nav hide-m" style="margin-top:auto" id="mn"><span class="lb">« Recolher</span><span>↔</span></button>`;
}
function go(r,p){route=r;param=p||null;location.hash=r;draw()}
function draw(){
 side();
 const t=ROUTES.find(r=>r[0]===route);const h=new Date().getHours();
 $("#title").textContent=route==="dash"?`${h<12?"Bom dia":h<18?"Boa tarde":"Boa noite"}, ${D.settings.name}`:t[1];
 $("#me").style.background=usr(D.settings.me).color;$("#me").textContent=D.settings.name[0];
 const un=D.notifs.filter(n=>!n.read).length;$("#bc").textContent=un;$("#bc").style.display=un?"":"none";
 const v=$("#view");v.innerHTML=({dash,mine,kanban,proj,cal,team,set})[route]();v.scrollTop=0;
 if(route==="dash")charts();
}
function empty(t){return`<div class="empty"><svg width="48" height="48" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 14V6l6 4h6l6-4v8a9 9 0 0 1-18 0z"/></svg><div>${t}</div></div>`}
const pill=t=>`<span class="pill pr${t.prio}">${PR[t.prio]}</span>`;
