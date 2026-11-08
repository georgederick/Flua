"use strict";

function modal(h){const o=document.createElement("div");o.className="ov";o.innerHTML=`<div class="md" role="dialog" aria-modal="true">${h}</div>`;o.addEventListener("mousedown",e=>{if(e.target===o)o.remove()});document.body.append(o);const i=o.querySelector("input");i&&i.focus();return o}
function confirmBox(msg,fn){const o=modal(`<h2>Confirmar</h2><p>${msg}</p><div class="acts"><button class="btn" data-x>Cancelar</button><button class="btn p" data-ok>Excluir</button></div>`);o.onclick=e=>{if(e.target.dataset.x!=null)o.remove();if(e.target.dataset.ok!=null){fn();o.remove()}}}
const opts=(a,sel)=>a.map(([v,l])=>`<option value="${v}" ${String(v)===String(sel)?"selected":""}>${esc(l)}</option>`).join("");
function taskModal(id,pre={}){
 const t=id?D.tasks.find(x=>x.id===id):{title:"",desc:"",status:0,prio:1,assignee:D.settings.me,project:D.projects[0]?.id,due:today(),tags:[],...pre};
 const o=modal(`<h2>${id?"Editar tarefa":"Nova tarefa"}</h2><div class="fld"><label>Título</label><input id="m_t" value="${esc(t.title)}"></div><div class="fld"><label>Descrição</label><textarea id="m_d" rows="3">${esc(t.desc)}</textarea></div>
 <div class="two"><div class="fld"><label>Status</label><select id="m_s">${opts(ST.map((s,i)=>[i,s]),t.status)}</select></div><div class="fld"><label>Prioridade</label><select id="m_p">${opts(PR.map((s,i)=>[i,s]),t.prio)}</select></div>
 <div class="fld"><label>Responsável</label><select id="m_a">${opts(D.users.map(u=>[u.id,u.name]),t.assignee)}</select></div><div class="fld"><label>Projeto</label><select id="m_j">${opts(D.projects.map(p=>[p.id,p.name]),t.project)}</select></div>
 <div class="fld"><label>Prazo</label><input type="date" id="m_u" value="${t.due}"></div><div class="fld"><label>Tags (vírgula)</label><input id="m_g" value="${esc(t.tags.join(", "))}"></div></div>
 <div class="acts">${id?`<button class="btn d" data-del>Excluir</button><button class="btn" data-dup>Duplicar</button><button class="btn" data-fav>${t.fav?"★ Favorita":"☆ Favoritar"}</button><button class="btn" data-arc>Arquivar</button>`:""}<button class="btn" data-x>Cancelar</button><button class="btn p" data-sv>Salvar</button></div>`);
 o.onclick=e=>{const d=e.target.dataset;if(d.x!=null)o.remove();
  if(d.sv!=null){const title=$("#m_t").value.trim();if(!title)return toast("Informe um título para a tarefa","er");
   const v={title,desc:$("#m_d").value,status:+$("#m_s").value,prio:+$("#m_p").value,assignee:$("#m_a").value,project:$("#m_j").value,due:$("#m_u").value||today(),tags:$("#m_g").value.split(",").map(s=>s.trim().toLowerCase()).filter(Boolean)};
   if(id){Object.assign(t,v);setDone(t);act(`Você editou “${title}”`)}else{const n={id:uid("t"),created:today(),done:null,fav:0,archived:0,...v};setDone(n);D.tasks.push(n);act(`Você criou “${title}”`)}
   save();o.remove();draw();toast("Tarefa salva")}
  if(d.del!=null)confirmBox(`Excluir “${esc(t.title)}”?`,()=>{D.tasks=D.tasks.filter(x=>x!==t);act(`Você excluiu “${t.title}”`);save();o.remove();draw();toast("Tarefa excluída")});
  if(d.dup!=null){D.tasks.push({...t,id:uid("t"),title:t.title+" (cópia)"});save();o.remove();draw();toast("Tarefa duplicada")}
  if(d.fav!=null){t.fav=t.fav?0:1;save();o.remove();draw()}
  if(d.arc!=null){t.archived=1;save();o.remove();draw();toast("Tarefa arquivada")}};
}
function setDone(t){t.done=t.status===4?(t.done||today()):null}
