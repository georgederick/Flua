"use strict";
/* ===== Eventos ===== */
document.addEventListener("click",e=>{
 const t=e.target,c=s=>t.closest(s);let x;
 if(x=c("[data-done]")){e.stopPropagation();const k=D.tasks.find(a=>a.id===x.dataset.done);k.status=k.status===4?0:4;setDone(k);if(k.status===4){act(`Você concluiu “${k.title}”`);toast("Tarefa concluída")}save();return draw()}
 if(x=c("[data-pf]")){const p=prj(x.dataset.pf);p.fav=p.fav?0:1;save();return draw()}
 if(x=c("[data-pd]")){const p=prj(x.dataset.pd);return confirmBox(`Excluir o projeto “${esc(p.name)}” e suas tarefas?`,()=>{D.projects=D.projects.filter(a=>a!==p);D.tasks=D.tasks.filter(a=>a.project!==p.id);save();draw();toast("Projeto excluído")})}
 if(c("[data-newp]")){const o=modal(`<h2>Novo projeto</h2><div class="fld"><label>Nome</label><input id="pn"></div><div class="fld"><label>Cor</label><input type="color" id="pc" value="#6d5bd0"></div><div class="acts"><button class="btn" data-x>Cancelar</button><button class="btn p" data-ok>Criar projeto</button></div>`);o.onclick=ev=>{if(ev.target.dataset.x!=null)o.remove();if(ev.target.dataset.ok!=null){const n=$("#pn").value.trim();if(!n)return toast("Informe o nome do projeto","er");D.projects.push({id:uid("p"),name:n,color:$("#pc").value});act(`Você criou o projeto “${n}”`);save();o.remove();draw();toast("Projeto criado")}};return}
 if(x=c("[data-new]")){e.stopPropagation();const s=x.dataset.new,pre={};if(s!=="")pre.status=+s;if(x.dataset.pj)pre.project=x.dataset.pj;return taskModal(null,pre)}
 if(x=c("[data-newd]")){if(!c("[data-open]"))taskModal(null,{due:x.dataset.newd});return}
 if(x=c("[data-open]")){if(!c(".ov"))return taskModal(x.dataset.open);const id=x.dataset.open;document.querySelectorAll(".ov").forEach(o=>o.remove());return taskModal(id)}
 if(x=c("[data-go]")){document.querySelectorAll(".ov").forEach(o=>o.remove());return go(x.dataset.go,x.dataset.p)}
 if(x=c("[data-tab]")){mineTab=x.dataset.tab;return draw()}
 if(x=c("[data-cm]")){calM=new Date(calM.getFullYear(),calM.getMonth()+ +x.dataset.cm,1);return draw()}
 if(c("#mn"))return $("#side").classList.toggle("min");
 if(c("#sbtn"))return search();
 if(c("#bell"))return bell();
 if(c("#thm")){D.settings.theme=document.documentElement.dataset.theme==="dark"?"light":"dark";save();return theme()}
 if(c("#exp")||c("#expc")){const csv=!!c("#expc");const body=csv?"título,status,prioridade,prazo\n"+D.tasks.map(t=>[t.title,ST[t.status],PR[t.prio],t.due].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n"):JSON.stringify(D,null,2);const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([body],{type:"text/plain"}));a.download=csv?"flua.csv":"flua.json";a.click();return toast("Exportação iniciada")}
 if(c("#rst")){D=seed();save();draw();return toast("Dados de demonstração restaurados")}
 if(c("#clr"))return confirmBox("Apagar todos os dados locais?",()=>{Store.clear();D={...seed(),tasks:[],notifs:[],log:[],projects:[]};save();draw();toast("Dados apagados")});
 if(!c(".pop")&&!c("#bell")){const p=$(".pop");p&&p.remove()}
});
document.addEventListener("change",e=>{const t=e.target;
 if(t.dataset.f!==undefined){F[t.dataset.f]=t.value;draw()}
 if(t.id==="sname"){D.settings.name=t.value||"Você";save();draw()}
 if(t.id==="sthm"){D.settings.theme=t.value;save();theme()}});
document.addEventListener("input",e=>{if(e.target.id==="fq"){F.q=e.target.value;const p=e.target.selectionStart;draw();const i=$("#fq");i.focus();i.setSelectionRange(p,p)}});
/* Drag and drop nativo */
let dragId=null;
document.addEventListener("dragstart",e=>{const c=e.target.closest&&e.target.closest(".tc");if(c){dragId=c.dataset.id;c.classList.add("drag");e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",dragId)}});
document.addEventListener("dragend",e=>{document.querySelectorAll(".drag,.over").forEach(n=>n.classList.remove("drag","over"))});
document.addEventListener("dragover",e=>{const c=e.target.closest&&e.target.closest(".col");if(c&&dragId){e.preventDefault();document.querySelectorAll(".over").forEach(n=>n.classList.remove("over"));c.classList.add("over")}});
document.addEventListener("drop",e=>{const c=e.target.closest&&e.target.closest(".col");if(c&&dragId){e.preventDefault();const t=D.tasks.find(a=>a.id===dragId);t.status=+c.dataset.col;setDone(t);act(`Você moveu “${t.title}” para ${ST[t.status]}`);save();dragId=null;draw();toast(`Movida para ${ST[t.status]}`)}});
document.addEventListener("keydown",e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();search()}
 if(e.key==="Escape"){document.querySelectorAll(".ov,.pop").forEach(o=>o.remove())}
 if(e.key==="n"&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)&&!$(".ov"))taskModal();
});
function theme(){const t=D.settings.theme;if(t==="auto")delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=t;if(route==="set")draw()}
window.addEventListener("hashchange",()=>{const r=location.hash.slice(1);if(r!==route&&ROUTES.some(a=>a[0]===r)){route=r;draw()}});
theme();
const r0=location.hash.slice(1);if(ROUTES.some(a=>a[0]===r0))route=r0;
$("#view").innerHTML='<div class="grid g3"><div class="sk"></div><div class="sk"></div><div class="sk"></div></div>';
setTimeout(()=>{draw();if(route==="set")$("#sthm").value=D.settings.theme},250);
document.addEventListener("click",()=>{const s=$("#sthm");s&&(s.value=D.settings.theme)});
