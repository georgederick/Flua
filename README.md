<p align="center"><img src="assets/logo.svg" alt="Flua" height="48"></p>

<p align="center"><b>Gerenciador de tarefas e produtividade, feito com HTML, CSS e JavaScript puros.</b></p>

---

## Sobre

O **Flua** é uma aplicação web de gestão de tarefas, projetos e equipe, com navegação lateral estilo app desktop, quadro Kanban, calendário e painel de indicadores. Foi construído **sem frameworks e sem backend**: apenas tecnologias nativas da web, com os dados salvos no `localStorage`.

A identidade visual é própria: o símbolo é uma cabeça de gato geométrica cortada por uma onda, que une a ideia de fluidez com um toque discreto de personalidade.

## Funcionalidades

- **Visão geral:** indicadores, gráfico de tarefas concluídas por dia, distribuição por status e prioridade, próximas tarefas, atividades recentes e progresso dos projetos. Tudo calculado a partir dos dados reais.
- **Tarefas:** criar, editar, excluir (com confirmação), duplicar, arquivar e favoritar; busca, filtros por status, prioridade e responsável; ordenação por prazo, prioridade ou nome.
- **Minhas tarefas:** abas Todas, Hoje, Próximas, Atrasadas e Concluídas, com conclusão rápida.
- **Quadro Kanban:** seis colunas de status, com arrastar e soltar nativo (Drag and Drop API) e persistência automática.
- **Projetos:** cards com progresso, favoritos, criação, exclusão e página de detalhe.
- **Calendário:** visão mensal; clique em um dia para criar uma tarefa com aquele prazo.
- **Equipe:** produtividade por integrante e feed de atividades.
- **Notificações** (marcar como lida, marcar todas, excluir) e **busca global** com `Ctrl + K`.
- **Tema** claro, escuro ou automático, layout responsivo (barra inferior no celular), toasts, estados vazios e skeleton loading.
- **Dados:** exportação em JSON e CSV, restauração dos dados de demonstração e limpeza dos dados locais.

## Atalhos

| Atalho | Ação |
|---|---|
| `Ctrl + K` | Abrir a busca global |
| `N` | Nova tarefa |
| `Esc` | Fechar janelas e painéis |

## Como executar

Não há dependências nem etapa de build.

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/flua.git
   cd flua
   ```
2. Abra o `index.html` no navegador, ou sirva a pasta com qualquer servidor estático:
   ```bash
   npx serve .
   # ou
   python3 -m http.server 8000
   ```

Para publicar no **GitHub Pages**: *Settings → Pages → Deploy from a branch → main / (root)*.

## Estrutura

```
Flua/
├── index.html
├── assets/
│   ├── logo.svg          # símbolo + nome (fundo claro)
│   ├── logo-dark.svg     # símbolo + nome (fundo escuro)
│   ├── symbol.svg        # somente o símbolo
│   └── favicon.svg
├── css/
│   ├── style.css         # variáveis, temas, layout base
│   ├── components.css    # botões, cards, modais, gráficos, toasts
│   ├── kanban.css        # quadro Kanban e calendário
│   └── responsive.css    # adaptação para tablet e celular
└── js/
    ├── storage.js        # persistência (localStorage) e dados de demonstração
    ├── logo.js           # logo em SVG usada na interface
    ├── router.js         # navegação, menu lateral, renderização
    ├── pages.js          # telas: visão geral, tarefas, quadro, projetos, calendário, equipe, configurações
    ├── modals.js         # modal de tarefa e confirmações
    ├── notifications.js  # busca global e central de notificações
    └── app.js            # eventos, drag and drop, atalhos, inicialização
```

Os scripts são carregados em ordem pelo `index.html` e compartilham escopo global, sem bundler.

## Preparado para uma API

Toda leitura e gravação passa pelo objeto `Store` em `js/storage.js` (`load`, `save`, `clear`). Para migrar para um backend, basta substituir esses métodos por chamadas HTTP, sem mexer nas telas.

## Roadmap

- [ ] Sprints com gráfico de burndown
- [ ] Cronograma / Gantt com dependências e marcos
- [ ] Relatórios com filtro de período e exportação
- [ ] Calendário semanal e diário
- [ ] Subtarefas, comentários, anexos e histórico por tarefa
- [ ] Ações em massa e menu de contexto
- [ ] Backend e colaboração em tempo real

## Tecnologias

HTML5 · CSS3 · JavaScript (ES6+) · `localStorage` · Drag and Drop API

## Licença

Distribuído sob a licença MIT. Veja `LICENSE`.
