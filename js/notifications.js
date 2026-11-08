"use strict";

function search(){
 const o=modal(`<input id="gq" placeholder="Buscar tarefas, projetos, pessoas, tags…" style="width:100%;padding:10px;border:1px solid var(--ln);border-radius:9px;background:var(--sf)"><div id="gr" style="margin-top:12px"></div>`);
 const run=()=>{const q=$("#gq").value.toLowerCase().trim();if(!q){$("#gr").innerHTML=empty("Digite para buscar");return}
  const T=live().filter(t=>t.title.toLowerCase().includes(q)||t.tags.some(g=>g.includes(q))),P=D.projects.filter(p=>p.name.toLowerCase().includes(q)),U=D.users.filter(u=>u.name.toLowerCase().includes(q));
  $("#gr").innerHTML=(T.length?`<div class="grp">Tarefas</div>`+T.slice(0,6).map(t=>`<div class="row" data-open="${t.id}">${esc(t.title)}</div>`).join(""):"")+(P.length?`<div class="grp">Projetos</div>`+P.map(p=>`<div class="row" data-go="proj" data-p="${p.id}">${esc(p.name)}</div>`).join(""):"")+(U.length?`<div class="grp">Pessoas</div>`+U.map(u=>`<div class="row" data-go="team">${av(u.id)} ${esc(u.name)}</div>`).join(""):"")||empty("Nada encontrado")};
 $("#gq").oninput=run;run();o.addEventListener("click",e=>{if(e.target.closest("[data-open],[data-go]"))o.remove()});
}
function bell(){
 const old=$(".pop");if(old)return old.remove();
 const p=document.createElement("div");p.className="pop";document.body.append(p);
 const r=()=>{p.innerHTML=`<div style="display:flex;justify-content:space-between;padding:4px 6px"><b>Notificações</b><button class="tag" data-allr>Marcar todas como lidas</button></div>`+(D.notifs.length?D.notifs.map(n=>`<div class="row" style="${n.read?"opacity:.55":""}"><span style="flex:1" data-rd="${n.id}">${esc(n.text)}</span><button data-nd="${n.id}" aria-label="Excluir">✕</button></div>`).join(""):empty("Tudo em dia"))};r();
 p.onclick=e=>{const d=e.target.dataset;if(d.allr!=null)D.notifs.forEach(n=>n.read=1);if(d.rd)D.notifs.find(n=>n.id===d.rd).read=1;if(d.nd)D.notifs=D.notifs.filter(n=>n.id!==d.nd);save();r();draw()};
}
