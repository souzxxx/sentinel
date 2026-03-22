# 🛰️ Project: Sentinel — Planning Document

## Visão Geral

**Dashboard de Monitoramento 3D em Tempo Real** — uma interface sci-fi inspirada em Iron Man / Minority Report, onde você visualiza métricas reais (GitHub, sistema, APIs) em um espaço tridimensional interativo.

O projeto combina **Three.js** como motor visual com **FastAPI + WebSockets** como backend de dados em tempo real, entregando uma experiência que é tanto **ferramenta funcional** quanto **vitrine técnica**.

---

## Prompt Refinado (para gerar mais ideias ou pedir ajuda)

> Estou desenvolvendo o **Project Sentinel**: um dashboard de monitoramento 3D em tempo real, inspirado em interfaces sci-fi. É uma aplicação web onde métricas reais (GitHub, CPU/RAM, APIs externas) são visualizadas em um espaço tridimensional interativo.
>
> **Sobre mim:** Sou estudante de computação e dev full stack (React, Next.js, FastAPI, Django, PostgreSQL). Nunca mexi com Three.js — estou aprendendo do zero.
>
> **Stack:** Next.js (App Router) + React Three Fiber + Zustand + TypeScript no front. FastAPI + WebSockets + PostgreSQL no back. Deploy no Vercel (front) e Render free tier (back).
>
> **Objetivo:** O projeto é minha vitrine técnica no GitHub — precisa impressionar recrutadores, demonstrar criatividade visual, e provar competência full stack. Tenho 10-15h/semana e quero que dure semanas de desenvolvimento progressivo.
>
> **Contexto visual:** A estética é sci-fi/cyberpunk — bloom neon, partículas flutuantes, grids holográficos, transições suaves. Cada dado real é representado por um elemento 3D (esferas, anéis orbitais, grafos).
>
> **[INSIRA AQUI SUA PERGUNTA ESPECÍFICA]**

---

## Stack Definitiva

### Frontend
| Tecnologia | Função |
|---|---|
| **Next.js 14+** (App Router) | Framework base, SSR, routing |
| **React Three Fiber (R3F)** | Three.js como componentes React |
| **@react-three/drei** | Helpers 3D (OrbitControls, Text3D, Effects) |
| **@react-three/postprocessing** | Bloom, vignette, tone mapping |
| **Zustand** | State management global (leve e simples) |
| **TypeScript** | Tipagem em tudo |
| **Tailwind CSS** | UI 2D (HUD, modais, sidebars) |
| **Framer Motion** | Animações da UI 2D |
| **GSAP** | Animações 3D complexas (camera fly-to, tweens) |

### Backend
| Tecnologia | Função |
|---|---|
| **FastAPI** | API REST + WebSocket server |
| **WebSockets** | Stream de dados em tempo real |
| **PostgreSQL** | Persistência (layouts, configs, histórico) |
| **psutil** | Monitoramento de sistema (CPU, RAM, disco) |
| **GitHub API (REST/GraphQL)** | Dados dos repos, commits, stars |
| **SQLAlchemy / asyncpg** | ORM / driver async |

### DevOps & Qualidade
| Tecnologia | Função |
|---|---|
| **Docker** | Container do backend |
| **GitHub Actions** | CI/CD automático |
| **Vercel** | Deploy do frontend |
| **Render** | Deploy do backend (free tier) |
| **ESLint + Prettier** | Lint e formatação |

---

## Roadmap Detalhado

### Fase 1 — "Big Bang": Fundamentos e Primeira Cena
**Duração estimada:** ~2 semanas (20-30h)
**Branch:** `feat/phase-1-core-scene`

#### O que aprender
- Three.js basics: Scene, Camera (Perspective), Renderer
- Sistema de coordenadas (x, y, z)
- requestAnimationFrame loop
- Geometrias: SphereGeometry, TorusGeometry, BufferGeometry
- Materiais: MeshStandardMaterial, MeshPhysicalMaterial
- React Three Fiber: `<Canvas>`, `<mesh>`, `useFrame`, `useThree`

#### Tarefas
1. **Setup do projeto**
   - `npx create-next-app@latest sentinel --typescript --tailwind --app`
   - Instalar: `@react-three/fiber`, `@react-three/drei`, `zustand`
   - Estrutura de pastas:
     ```
     src/
     ├── app/              # Next.js App Router
     ├── components/
     │   ├── canvas/       # Componentes 3D (R3F)
     │   ├── ui/           # Componentes 2D (React + Tailwind)
     │   └── hud/          # Overlay UI sobre o canvas
     ├── hooks/            # Custom hooks
     ├── stores/           # Zustand stores
     ├── lib/              # Utilitários
     └── types/            # TypeScript types
     ```

2. **Núcleo Central (Core Sphere)**
   - Esfera wireframe no centro da cena
   - Animação de "pulso" suave (scale oscilando com `Math.sin`)
   - Material emissivo com cor base (azul/cyan sci-fi)
   - Anel orbital ao redor (TorusGeometry) girando lentamente

3. **Ambiente Base**
   - Fundo escuro (quase preto, `#0a0a1a`)
   - Grid no chão (GridHelper) com opacidade baixa
   - Ambient light (intensidade baixa) + Point light no núcleo
   - Stars background (drei: `<Stars>`)

4. **Câmera e Controles**
   - OrbitControls (drei) com limites de zoom e rotação
   - Posição inicial da câmera em ângulo cinematográfico
   - Damping suave nos controles

#### Entregável
Uma cena 3D com um núcleo pulsante, anel orbital, grid no chão, e estrelas no fundo. O usuário pode orbitar livremente.

---

### Fase 2 — "Sistema Solar": Satélites e Dados do GitHub
**Duração estimada:** ~2 semanas (20-30h)
**Branch:** `feat/phase-2-satellites`

#### O que aprender
- Object3D e grupos
- Rotação e translação (órbitas elípticas)
- Instanced Meshes (performance com muitos objetos)
- Fetch de APIs externas (GitHub REST API)
- Zustand: estado compartilhado entre 3D e 2D

#### Tarefas
1. **GitHub Data Layer**
   - Criar serviço para buscar repos via GitHub API
   - Dados relevantes por repo: nome, stars, forks, linguagem, último commit, tamanho
   - Store Zustand para cachear dados dos repos

2. **Satélites Orbitais**
   - Cada repo = um satélite (esfera/icosaedro) orbitando o núcleo
   - Tamanho do satélite → proporcional a stars + forks
   - Velocidade orbital → frequência de commits recentes
   - Cor → linguagem principal (mapeamento: TypeScript=azul, Python=amarelo, Java=laranja...)
   - Distância do núcleo → idade do repo (mais novo = mais perto)
   - Trail/rastro sutil atrás de cada satélite (partículas ou line)

3. **Labels Flutuantes**
   - Nome do repo como Text3D ou sprite flutuando acima do satélite
   - Sempre de frente para a câmera (billboarding)
   - Opacidade baseada na distância da câmera

4. **Conexões Visuais**
   - Linhas finas (como neural network) conectando repos que compartilham linguagem
   - Opacidade pulsante nas linhas

#### Entregável
Sistema solar de repos GitHub orbitando o núcleo central. Cada satélite tem tamanho, cor, velocidade e posição baseados em dados reais.

---

### Fase 3 — "Interface Neural": Interação e Raycasting
**Duração estimada:** ~2 semanas (20-30h)
**Branch:** `feat/phase-3-interaction`

#### O que aprender
- Raycasting no Three.js (detecção de hover/click em objetos 3D)
- Eventos R3F: `onPointerOver`, `onPointerOut`, `onClick`
- Animação de câmera (fly-to com GSAP)
- Transições entre estados de UI

#### Tarefas
1. **Hover Effects**
   - Satélite brilha (emissive intensity aumenta) no hover
   - Cursor muda para pointer
   - Tooltip flutuante com nome do repo + stats resumidos
   - Anel sutil ao redor do satélite selecionado

2. **Click → Focus Mode**
   - Ao clicar num satélite, câmera faz fly-to suave (GSAP timeline)
   - Satélite fica centralizado, outros ficam com opacidade reduzida
   - Painel lateral abre (React/Tailwind) com detalhes completos:
     - Nome, descrição, linguagens
     - Gráfico de commits (mini chart 2D)
     - Links para o repo
     - Contributors
   - Botão "Voltar" faz câmera retornar à posição orbital

3. **Navegação por Teclado**
   - Setas ou Tab para navegar entre satélites
   - Enter para focar
   - Esc para voltar à visão orbital

4. **HUD Overlay**
   - Canto superior: relógio + data estilo sci-fi
   - Canto inferior: mini-mapa 2D da cena (top-down view)
   - Indicadores de status ao redor da tela (cantos)

#### Entregável
Interação completa com hover, click, focus mode com fly-to, painel de detalhes, e HUD overlay.

---

### Fase 4 — "Pulso de Dados": Backend e Tempo Real
**Duração estimada:** ~3 semanas (30-45h)
**Branch:** `feat/phase-4-backend`

#### O que aprender
- FastAPI com WebSockets
- Streaming de dados em tempo real
- psutil para monitoramento de sistema
- Integração frontend ↔ WebSocket
- Docker basics para o backend

#### Tarefas
1. **Setup Backend**
   - FastAPI project com estrutura limpa:
     ```
     backend/
     ├── app/
     │   ├── main.py
     │   ├── api/
     │   │   ├── routes/       # REST endpoints
     │   │   └── websockets/   # WS handlers
     │   ├── services/         # Business logic
     │   ├── models/           # SQLAlchemy models
     │   └── core/             # Config, deps
     ├── Dockerfile
     └── requirements.txt
     ```
   - Docker setup para desenvolvimento local

2. **System Monitor (WebSocket)**
   - Endpoint WS que streama a cada 2s: CPU %, RAM %, disco, network
   - O **núcleo central muda de cor** em tempo real:
     - Verde (< 40% CPU) → Amarelo (40-70%) → Vermelho (> 70%)
     - Intensidade do pulso = proporcional à carga
   - Anéis ao redor do núcleo representam métricas individuais:
     - Anel interno = CPU (espessura varia)
     - Anel externo = RAM (cor varia)

3. **GitHub Webhook / Polling**
   - Endpoint que recebe webhooks do GitHub (push, star, fork)
   - Quando alguém dá star → satélite correspondente emite flash de luz
   - Quando você faz push → trail de partículas do núcleo ao satélite
   - Fallback: polling a cada 5min se webhook não configurado

4. **PostgreSQL — Persistência**
   - Salvar layout customizado (posição dos satélites se o user mover)
   - Histórico de métricas (pra mostrar gráficos temporais)
   - Configurações do dashboard (tema, satélites visíveis, etc.)

5. **API REST complementar**
   - `GET /api/repos` — lista repos com dados enriquecidos
   - `GET /api/metrics/history` — histórico de métricas do sistema
   - `POST /api/layout` — salvar layout custom
   - `GET /api/layout` — carregar layout

#### Entregável
Backend funcional com WebSockets streamando métricas que afetam a cena 3D em tempo real. Núcleo reage a CPU/RAM. Push events geram animações.

---

### Fase 5 — "Singularidade": Shaders, Partículas e Polimento Visual
**Duração estimada:** ~2 semanas (20-30h)
**Branch:** `feat/phase-5-visual-polish`

#### O que aprender
- Post-processing pipeline (R3F)
- Shader basics (GLSL — vertex e fragment)
- Particle systems (BufferGeometry + Points)
- Efeitos atmosféricos

#### Tarefas
1. **Post-Processing**
   - Bloom (brilho neon em objetos emissivos)
   - Vignette (escurecimento nas bordas)
   - Chromatic Aberration (sutil, nos cantos)
   - Tone mapping (filmic)
   - Screen-space ambient occlusion (SSAO)

2. **Particle Systems**
   - Partículas flutuantes no ambiente (poeira espacial)
   - Trail de partículas nos satélites orbitando
   - Explosão de partículas em eventos (novo star, push)
   - Partículas subindo do núcleo quando CPU alta (tipo calor)

3. **Custom Shaders**
   - Shader holográfico no grid do chão (linhas pulsantes)
   - Shader de "energia" no núcleo (tipo plasma)
   - Fresnel effect nos satélites (brilho nas bordas)

4. **Ciclo Visual**
   - Transição suave de tema (dark azulado ↔ dark avermelhado)
   - Pulsação global sutil sincronizada com heartbeat dos dados
   - Efeito de "glitch" quando métricas ficam críticas

5. **Áudio (Opcional)**
   - Hum ambiente sutil (sintetizado com Web Audio API)
   - Sons de feedback em interações (hover, click, data event)
   - Volume reativo à atividade dos dados

#### Entregável
Visual de nível profissional — bloom neon, partículas, shaders custom. A cena parece saída de um filme sci-fi.

---

### Fase 6 — "Deploy & Showcase": README, CI/CD e Apresentação
**Duração estimada:** ~1 semana (10-15h)
**Branch:** `feat/phase-6-deploy`

#### Tarefas
1. **README de Impacto**
   - GIF/vídeo hero no topo mostrando o dashboard em ação
   - Badges (tech stack, deploy status, license)
   - Seções: Overview, Demo Link, Features, Tech Stack, Architecture, Getting Started, Roadmap
   - Diagrama de arquitetura (Mermaid ou imagem)
   - Screenshots de cada feature

2. **CI/CD**
   - GitHub Actions: lint, type check, build, deploy
   - Auto-deploy: push na main → Vercel (front) + Render (back)

3. **Performance & SEO**
   - Lazy loading do canvas 3D
   - Loading screen animada enquanto Three.js inicializa
   - Meta tags e Open Graph para preview bonito ao compartilhar link
   - Lighthouse score > 90

4. **Demo Pública**
   - URL funcional que qualquer pessoa pode abrir
   - Fallback gracioso se backend não responder (dados mockados)
   - Mobile responsive (câmera e controles adaptados)

---

## Métricas de Sucesso

| Critério | Meta |
|---|---|
| Tempo total de desenvolvimento | 12-16 semanas |
| Commits significativos | 150+ |
| README com GIF/vídeo | ✅ |
| Deploy público funcional | ✅ |
| Backend com WebSockets | ✅ |
| Interação 3D completa | ✅ |
| Post-processing visual | ✅ |
| Mobile responsivo | ✅ |
| CI/CD automatizado | ✅ |

---

## Referências para Estudo

### Three.js / R3F
- [Three.js Journey](https://threejs-journey.com/) — melhor curso de Three.js
- [R3F Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Drei Storybook](https://drei.pmnd.rs/) — todos os helpers visuais
- [Shadertoy](https://www.shadertoy.com/) — inspiração para shaders

### FastAPI
- [FastAPI WebSockets](https://fastapi.tiangolo.com/advanced/websockets/)
- [psutil docs](https://psutil.readthedocs.io/)

### Inspiração Visual
- [Awwwards — 3D websites](https://www.awwwards.com/websites/three-js/)
- [Codrops](https://tympanus.net/codrops/) — experimentos web criativos
- Bruno Simon's portfolio (threejs-journey.com)

---

*Documento gerado em: Março 2026*
*Última atualização do roadmap: Fase 1*
