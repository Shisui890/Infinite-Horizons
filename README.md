# Infinite Horizons 🌌⏳

> **Laboratório Visual Definitivo de Causalidade Temporal, Cosmologia Científica e Multiverso**

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-purple.svg)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-black.svg)](https://threejs.org/)
[![KaTeX](https://img.shields.io/badge/KaTeX-Math-green.svg)](https://katex.org/)
[![NASA Open Data](https://img.shields.io/badge/NASA-Cosmology_Data-red.svg)](https://science.nasa.gov/universe/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)

**Infinite Horizons** é uma plataforma e laboratório interativo de física teórica e cosmologia computacional. O sistema permite simular, experimentar e visualizar os impactos de alterações causais em linhas temporais, explorar o multiverso através do efeito borboleta e analisar a estrutura do cosmos real com base em dados astronômicos e observacionais da **NASA**.

---

## 🚀 Visão Geral e Propósito do Projeto

O objetivo do **Infinite Horizons** é unir o rigor da física moderna (Relatividade Geral, Mecânica Quântica, Teoria do Caos e Termodinâmica Estatística) a uma experiência visual imersiva e de nível museu científico.

A aplicação responde a perguntas fundamentais:
- *O que acontece quando alteramos uma premissa causal no passado de uma linha temporal?*
- *Como o efeito borboleta propaga divergências ao longo de ramos temporais paralelos?*
- *Como a física relativística de Minkowski define a fronteira entre eventos causalmente conectados e causalmente desconectados?*
- *Quais são as evidências empíricas reais da NASA sobre a origem, expansão e destino do nosso universo?*

---

## 🔬 Principais Funcionalidades

### 1. ⏳ Motor de Simulação Causal & Linha Temporal Interativa
- **Grafo Causal em Canvas 2D**: Visualização fluida e de alto desempenho de nós de eventos e conexões de causa e efeito.
- **Propagação Temporal Dinâmica**: Edição, bifurcação, deleção e inserção de pontos de divergência na linha do tempo.
- **Detector de Paradoxos Temporais**: Identificação em tempo real de paradoxos lógicos como:
  - *Grandfather Paradox* (Paradoxo do Avô)
  - *Bootstrap Paradox* (Laço de Informação Ontológica)
  - *Predestination Paradox* (Paradoxo da Predestinação)
- **Métrica de Integridade Temporal**: Cálculo contínuo da coerência da linha temporal com base na entropia causal.
- **Replay Temporal & Time Scrubbing**: Inspeção passo a passo da evolução temporal dos eventos.

### 2. 🪐 NASA Cosmology Observatory ("Nosso Universo")
- **8 Pilares Cosmológicos Oficiais da NASA**:
  1. *Big Bang e Época da Inflação Cósmica*
  2. *Radiação Cósmica de Fundo em Micro-ondas (CMB)* (Missões COBE, WMAP e Planck)
  3. *Expansão do Espaço e Constante de Hubble* (Telescópios Hubble e JWST)
  4. *Matéria Escura e Lentes Gravitacionais*
  5. *Energia Escura e Aceleração Cósmica*
  6. *Buracos Negros e Singularidades de Espaço-Tempo*
  7. *Formação de Galáxias e Teias Cósmicas em Grande Escala*
  8. *Destinos Finais do Universo* (Big Freeze, Big Rip, Big Crunch)
- **Stellar Orrery Canvas 3D**: Planetário orbital e visualizador de alvos cósmicos.
- **Target Scanner Panel**: Analisador espectroscópico e telemetria astronômica.

### 3. 🌐 Espaçotempo de Minkowski 3D (Three.js)
- Visualização interativa tridimensional do cone de luz relativístico.
- Distinção geométrica entre intervalos:
  - **Tipo-Tempo (Timelike)**: Conexão causal direta dentro do cone de luz.
  - **Tipo-Luz (Lightlike / Null)**: Fronteira percorrida por fótons no vácuo ($c$).
  - **Tipo-Espaço (Spacelike)**: Região fora do cone de luz, causalmente inacessível sem violação da velocidade da luz.

### 4. 🎲 Simulação Monte Carlo Probabilística (Web Workers)
- Execução assíncrona em segundo plano sem congelamento da interface (multi-threaded via Web Worker).
- Milhares de iterações estocásticas simulando a estabilidade e variabilidade de ramos temporais.
- Diretrizes prescritivas de estabilização temporal calculadas a partir de desvios padrão estatísticos.

### 5. 📐 Renderizador de Fórmulas Matemáticas com KaTeX
- Renderização tipográfica de precisão para as equações centrais da física teórica:
  - Equações de Campo de Einstein ($G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4} T_{\mu\nu}$)
  - Métrica de Alcubierre e Curvatura Espaçotempo
  - Relação de Indeterminação de Heisenberg ($\Delta x \cdot \Delta p \geq \frac{\hbar}{2}$)
  - Entropia de Bekenstein-Hawking de Buracos Negros ($S_{BH} = \frac{k c^3 A}{4 G \hbar}$)
  - Efeito Borboleta e Atrator de Lorenz ($\dot{x} = \sigma(y - x)$, $\dot{y} = x(\rho - z) - y$, $\dot{z} = xy - \beta z$)

### 6. 🧠 Assistente IA & Zero-Token Knowledge Bank
- **Drawer de Assistente IA Integrado**: Consulta histórica, depuração de eventos e análise de coerência.
- **Zero-Token Knowledge Bank**: Base de conhecimento offline integrada sem necessidade de consumo de tokens externos ou chaves de API, com buscas semânticas instantâneas.
- **Suporte a Provedores Customizados**: Compatível com endpoints Vercel Serverless `/api/temporal`, OpenAI e Azure OpenAI.

### 7. 💻 Terminal Temporal CLI & Ferramentas Pro
- **Temporal CLI**: Terminal integrado com comandos interativos (`help`, `status`, `entropy`, `diverge`, `reset`, `warp`).
- **Modo Conferência / Auditório**: Visualização limpa para projeção em aulas, apresentações e seminários acadêmicos.
- **Acessibilidade Completa**: Suporte total a atalhos de teclado (`?`, `Ctrl+K`, `Space`, setas direcionais) e leitores de tela.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Bundler & Tooling** | [Vite 8](https://vitejs.dev/) + [Rolldown](https://rolldown.rs/) + [Babel React Compiler](https://react.dev/learn/react-compiler) |
| **Renderização 3D** | [Three.js](https://threejs.org/) + Canvas API |
| **Tipografia Matemática** | [KaTeX](https://katex.org/) |
| **Gerenciamento de Estado** | [Zustand 5](https://github.com/pmndrs/zustand) |
| **Concorrência** | Web Workers dedicados para Simulações Monte Carlo |
| **Linter & Performance** | [Oxlint](https://oxc-project.github.io/) |
| **Design & Estilo** | Modern Vanilla CSS com Glassmorphism, Dark Mode Cósmico e Sistema HSL |
| **Deploy & Serveless API** | [Vercel](https://vercel.com/) (Node.js Serverless Functions para `/api/temporal`) |

---

## 📦 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 20+ recomendada)
- npm

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/Shisui890/Infinite-Horizons.git
   cd "Infinite Horizons/infinite"
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em `http://localhost:5173`.

4. **Compilar para produção:**
   ```bash
   npm run build
   ```

---

## 🌐 Deploy na Vercel

O repositório já inclui configuração completa para Vercel através do [`vercel.json`](file:///c:/Users/shisui/Desktop/Infinite%20Horizons/vercel.json) na raiz:
- O diretório raiz (`Root Directory`) na Vercel deve permanecer como a raiz do repositório.
- A pasta `infinite` executa o build e publica `infinite/dist`.
- O endpoint serverless de IA em `/api/temporal` protege credenciais e aceita modelos OpenAI ou Azure OpenAI.

Para publicar via Vercel CLI:
```bash
npx vercel --prod
```

---

## 📜 Licença e Créditos

Desenvolvido para entusiastas da física, estudantes, cientistas e curiosos sobre o espaço e o tempo.
Dados e imagens cosmológicas cortesia de programas e missões públicas da **NASA** (Hubble, James Webb Space Telescope, Planck e Goddard Space Flight Center).
