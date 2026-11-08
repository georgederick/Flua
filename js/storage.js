"use strict";
/* ===== Storage: troque load/save por chamadas de API no futuro ===== */
const KEY="flua.v1";let mem=null;
const Store={
 load(){try{const s=localStorage.getItem(KEY);if(s)return JSON.parse(s)}catch(e){}return mem},
 save(d){mem=d;try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}},
 clear(){mem=null;try{localStorage.removeItem(KEY)}catch(e){}}
};
const ST=["A fazer","Em andamento","Em análise","Em revisão","Concluído","Cancelado"];
const STC=["#8b8ba0","#e0a82e","#4a86d8","#9a6ad8","#3fa57a","#d9534f"];
const PR=["Baixa","Normal","Alta","Urgente"];
const day=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const today=()=>day(0);
function seed(){
 const users=[["Marina Costa","Product Designer"],["Rafael Lima","Engenheiro"],["Julia Alves","Marketing"],["Pedro Santos","Engenharia"],["Ana Ribeiro","Produto"]].map((u,i)=>({id:"u"+i,name:u[0],role:u[1],color:["#6d5bd0","#3fa57a","#e0a82e","#4a86d8","#d9534f"][i]}));
 const projects=[{id:"p1",name:"Lançamento do app",color:"#6d5bd0",fav:1},{id:"p2",name:"Redesign do site",color:"#4a86d8"},{id:"p3",name:"Campanha de outono",color:"#e0a82e"}];
 const T=[["Desenhar layout da página inicial",0,2,"u0","p2",3,"design"],["Criar perfil do usuário",1,1,"u1","p1",5,"dev"],["Revisar telas de integração",2,3,"u0","p1",-2,"design"],["Aprimorar widgets do painel",1,1,"u3","p1",-1,"dev"],["Mockups responsivos",2,0,"u0","p2",6,"design"],["Relatório de vendas",3,1,"u4","p3",4,"dados"],["Vídeo de lançamento",1,2,"u2","p3",7,"mídia"],["Integração do projeto",4,1,"u1","p1",-5,"dev"],["Finalizar cronograma",4,1,"u4","p1",-3,"gestão"],["Planejamento financeiro",4,2,"u4","p3",-8,"gestão"],["Auditoria de inventário",0,0,"u3","p2",10,"ti"],["E-mails para clientes",3,1,"u2","p3",0,"marketing"],["Atualizar paleta de cores",0,1,"u0","p2",2,"design"],["Revisão de código do serviço",2,2,"u3","p1",1,"dev"]]
 .map((t,i)=>({id:"t"+i,title:t[0],desc:"",status:t[1],prio:t[2],assignee:t[3],project:t[4],due:day(t[5]),tags:[t[6]],created:day(-10),done:t[1]==4?day(t[5]):null,fav:0,archived:0}));
 const notifs=[{id:"n1",text:"A tarefa “Revisar telas de integração” está atrasada",read:0},{id:"n2",text:"Marina atribuiu uma tarefa a você",read:0},{id:"n3",text:"Projeto “Lançamento do app” foi atualizado",read:1}];
 return{users,projects,tasks:T,notifs,settings:{theme:"auto",name:"Marina",me:"u0"},log:[{t:Date.now()-36e5,x:"Rafael concluiu “Integração do projeto”"},{t:Date.now()-72e5,x:"Ana criou o projeto “Campanha de outono”"}],seq:100};
}
let D=Store.load()||seed();Store.save(D);
const save=()=>Store.save(D);
const uid=p=>p+(++D.seq);
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const usr=id=>D.users.find(u=>u.id===id);
const prj=id=>D.projects.find(p=>p.id===id);
const av=id=>{const u=usr(id);return u?`<span class="avatar" title="${esc(u.name)}" style="background:${u.color}">${u.name[0]}</span>`:""};
const act=x=>{D.log.unshift({t:Date.now(),x});D.log=D.log.slice(0,30)};
const live=()=>D.tasks.filter(t=>!t.archived);
const late=t=>t.due<today()&&t.status<4;
const fmt=d=>d?d.split("-").reverse().slice(0,2).join("/"):"–";
function toast(m,er){const e=document.createElement("div");e.className="ts"+(er?" er":"");e.textContent=m;$("#toasts").append(e);setTimeout(()=>e.remove(),2600)}
