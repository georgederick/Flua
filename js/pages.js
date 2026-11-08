"use strict";

function dash(){
 const L=live(),n=s=>L.filter(t=>t.status===s).length;
 const k=[["Total",L.length,"var(--tx)"],["Pendentes",n(0),"var(--mt)"],["Em andamento",n(1)+n(2)+n(3),"var(--wr)"],["Concluídas",n(4),"var(--ok)"],["Atrasadas",L.filter(late).length,"var(--er)"]];
 const next=L.filter(t=>t.status<4).sort((a,b)=>a.due.localeCompare(b.due)).slice(0,6);
 return`<div class="grid k5">${k.map(x=>`<div class="card kpi"><span>${x[0]}</span><b style="color:${x[2]}">${x[1]}</b><span class="up">${L.length?Math.round(x[1]/L.length*100):0}% do total</span></div>`).join("")}</div>
 <div class="grid g2" style="margin-top:16px"><div class="card"><h3>Concluídas por dia (7 dias)</h3><div class="bars" id="wk"></div></div>
 <div class="card"><h3>Tarefas por status</h3><div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap"><div class="donut" id="dn"></div><div class="lg" id="dl"></div></div></div></div>
 <div class="grid g2" style="margin-top:16px"><div class="card"><h3>Próximas tarefas</h3>${next.length?next.map(trow).join(""):empty("Nada pendente. Bom trabalho!")}</div>
 <div class="card"><h3>Prioridades</h3>${PR.map((p,i)=>{const c=L.filter(t=>t.prio===i).length;return`<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:12px"><span>${p}</span><span>${c}</span></div><div class="pbar"><i style="width:${L.length?c/L.length*100:0}%;background:${["#99a","#4a86d8","#e0a82e","#d9534f"][i]}"></i></div></div>`}).join("")}
 <h3 style="margin-top:18px">Atividades recentes</h3>${D.log.slice(0,4).map(l=>`<div style="font-size:12px;color:var(--mt);padding:3px 0">${esc(l.x)}</div>`).join("")}</div></div>
 <div class="card" style="margin-top:16px"><h3>Progresso dos projetos</h3>${D.projects.map(p=>{const ts=L.filter(t=>t.project===p.id),d=ts.filter(t=>t.status===4).length,pc=ts.length?Math.round(d/ts.length*100):0;return`<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between"><span>${esc(p.name)}</span><span class="tag">${pc}%</span></div><div class="pbar"><i style="width:${pc}%;background:${p.color}"></i></div></div>`}).join("")}</div>`;
}
function charts(){
 const days=[...Array(7)].map((_,i)=>day(i-6));
 const vals=days.map(d=>D.tasks.filter(t=>t.done===d).length),mx=Math.max(1,...vals);
 $("#wk").innerHTML=days.map((d,i)=>`<div><span>${vals[i]}</span><i style="height:${vals[i]/mx*80}%"></i>${["D","S","T","Q","Q","S","S"][new Date(d+"T12:00").getDay()]}</div>`).join("");
 const L=live(),tot=L.length||1;let a=0;
 const seg=ST.map((s,i)=>{const c=L.filter(t=>t.status===i).length,p=c/tot*100,r=`${STC[i]} ${a}% ${a+p}%`;a+=p;return[r,c,s,i]});
 $("#dn").style.background=L.length?`conic-gradient(${seg.map(s=>s[0]).join(",")})`:"var(--ln)";
 $("#dl").innerHTML=seg.map(s=>`<span><i class="dot" style="background:${STC[s[3]]}"></i>${s[2]}: ${s[1]}</span>`).join("");
}
function trow(t){return`<div class="row" data-open="${t.id}"><span class="chk ${t.status===4?"on":""}" data-done="${t.id}" title="Concluir"></span><span style="flex:1;${t.status===4?"text-decoration:line-through;color:var(--mt)":""}">${esc(t.title)}${t.fav?" ★":""}</span>${pill(t)}<span class="tag ${late(t)?"dn":""}">${fmt(t.due)}</span>${av(t.assignee)}</div>`}
function filtered(base){
 let L=base.filter(t=>(!F.q||t.title.toLowerCase().includes(F.q.toLowerCase())||t.tags.join(" ").includes(F.q.toLowerCase()))&&(F.st===""||t.status==F.st)&&(F.pr===""||t.prio==F.pr)&&(!F.as||t.assignee===F.as));
 return F.sort==="prio"?L.sort((a,b)=>b.prio-a.prio):F.sort==="name"?L.sort((a,b)=>a.title.localeCompare(b.title)):L.sort((a,b)=>a.due.localeCompare(b.due));
}
function tools(){return`<div class="tools"><input id="fq" placeholder="Filtrar tarefas…" value="${esc(F.q)}"><select data-f="st"><option value="">Status</option>${ST.map((s,i)=>`<option value="${i}" ${F.st==i&&F.st!==""?"selected":""}>${s}</option>`).join("")}</select><select data-f="pr"><option value="">Prioridade</option>${PR.map((s,i)=>`<option value="${i}" ${F.pr==i&&F.pr!==""?"selected":""}>${s}</option>`).join("")}</select><select data-f="as"><option value="">Responsável</option>${D.users.map(u=>`<option value="${u.id}" ${F.as===u.id?"selected":""}>${esc(u.name)}</option>`).join("")}</select><select data-f="sort"><option value="">Ordenar: prazo</option><option value="prio" ${F.sort==="prio"?"selected":""}>Prioridade</option><option value="name" ${F.sort==="name"?"selected":""}>Nome</option></select><button class="btn p" data-new="">+ Nova tarefa</button></div>`}
let mineTab="all";
function mine(){
 const me=D.settings.me,all=live().filter(t=>t.assignee===me);
 const tabs={all:["Todas",all],today:["Hoje",all.filter(t=>t.due===today()&&t.status<4)],next:["Próximas",all.filter(t=>t.due>today()&&t.status<4)],late:["Atrasadas",all.filter(late)],done:["Concluídas",all.filter(t=>t.status===4)]};
 const L=filtered(tabs[mineTab][1]);
 return tools()+`<div class="tools">${Object.entries(tabs).map(([k,v])=>`<button class="btn ${mineTab===k?"p":""}" data-tab="${k}">${v[0]} ${v[1].length}</button>`).join("")}</div><div class="card">${L.length?L.map(trow).join(""):empty("Nenhuma tarefa aqui")}</div>`;
}
function kanban(){
 const L=filtered(live());
 return tools()+`<div class="board">${ST.map((s,i)=>{const c=L.filter(t=>t.status===i);return`<div class="col" data-col="${i}"><h4><i class="dot" style="background:${STC[i]}"></i>${s}<em>${c.length}</em><button class="ic" style="width:26px;height:26px" data-new="${i}" aria-label="Adicionar em ${s}">+</button></h4>${c.map(t=>`<div class="tc" draggable="true" data-id="${t.id}" data-open="${t.id}"><p>${esc(t.title)}</p><div>${pill(t)}<span class="tag ${late(t)?"dn":""}">${fmt(t.due)}</span>${t.tags.map(g=>`<span class="tag">${esc(g)}</span>`).join("")}<span style="margin-left:auto">${av(t.assignee)}</span></div></div>`).join("")}</div>`}).join("")}</div>`;
}
function proj(){
 if(param){const p=prj(param);if(!p){param=null}else{const ts=live().filter(t=>t.project===p.id);return`<div class="tools"><button class="btn" data-go="proj">← Projetos</button><button class="btn p" data-new="" data-pj="${p.id}">+ Nova tarefa</button></div><div class="card"><h3 style="font-size:18px"><i class="dot" style="background:${p.color};display:inline-block;margin-right:8px"></i>${esc(p.name)}</h3><div style="margin-top:12px">${ts.length?ts.map(trow).join(""):empty("Este projeto ainda não tem tarefas")}</div></div>`}}
 return`<div class="tools"><button class="btn p" data-newp>+ Novo projeto</button></div><div class="grid g3">${D.projects.map(p=>{const ts=live().filter(t=>t.project===p.id),d=ts.filter(t=>t.status===4).length,pc=ts.length?Math.round(d/ts.length*100):0;
 return`<div class="card" style="border-top:3px solid ${p.color}"><div style="display:flex;gap:8px"><h3 style="flex:1;cursor:pointer" data-go="proj" data-p="${p.id}">${esc(p.name)}</h3><button data-pf="${p.id}" aria-label="Favoritar">${p.fav?"★":"☆"}</button><button data-pd="${p.id}" aria-label="Excluir" class="dn">✕</button></div><div class="pbar"><i style="width:${pc}%;background:${p.color}"></i></div><p style="color:var(--mt);margin:10px 0">${d} de ${ts.length} tarefas concluídas · ${pc}%</p><div>${[...new Set(ts.map(t=>t.assignee))].map(av).join(" ")}</div></div>`}).join("")}</div>`;
}
function cal(){
 const y=calM.getFullYear(),m=calM.getMonth(),first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate();
 let cells=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(d=>`<div class="h">${d}</div>`).join("");
 for(let i=0;i<first;i++)cells+=`<div class="o"></div>`;
 for(let d=1;d<=n;d++){const ds=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  cells+=`<div data-newd="${ds}"><span class="${ds===today()?"t":""}">${d}</span>${live().filter(t=>t.due===ds).map(t=>`<small data-open="${t.id}" style="${late(t)?"background:#fbe0df;color:#b23a36":""}">${esc(t.title)}</small>`).join("")}</div>`}
 return`<div class="tools"><button class="btn" data-cm="-1">‹</button><b style="align-self:center;min-width:140px;text-align:center">${calM.toLocaleDateString("pt-BR",{month:"long",year:"numeric"})}</b><button class="btn" data-cm="1">›</button></div><div class="cal">${cells}</div>`;
}
function team(){
 return`<div class="grid g3">${D.users.map(u=>{const ts=live().filter(t=>t.assignee===u.id),d=ts.filter(t=>t.status===4).length;return`<div class="card"><div style="display:flex;gap:10px;align-items:center">${av(u.id)}<div><b>${esc(u.name)}</b><div style="color:var(--mt);font-size:12px">${esc(u.role)}</div></div></div><p style="margin:12px 0 6px;font-size:12px">${ts.length} tarefas · ${d} concluídas</p><div class="pbar"><i style="width:${ts.length?d/ts.length*100:0}%;background:${u.color}"></i></div></div>`}).join("")}</div>
 <div class="card" style="margin-top:16px"><h3>Atividades recentes</h3>${D.log.map(l=>`<div style="padding:5px 0;font-size:13px">${esc(l.x)} <span style="color:var(--mt);font-size:11px">${new Date(l.t).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span></div>`).join("")}</div>`;
}
function set(){
 return`<div class="card" style="max-width:520px"><h3>Perfil e aparência</h3><div class="fld"><label>Nome</label><input id="sname" value="${esc(D.settings.name)}"></div><div class="fld"><label>Tema</label><select id="sthm"><option value="auto">Automático</option><option value="light">Claro</option><option value="dark">Escuro</option></select></div>
 <h3 style="margin-top:20px">Dados</h3><div class="acts" style="justify-content:flex-start"><button class="btn" id="exp">Exportar JSON</button><button class="btn" id="expc">Exportar CSV</button><button class="btn" id="rst">Restaurar demonstração</button><button class="btn d" id="clr">Limpar dados</button></div></div>`;
}
