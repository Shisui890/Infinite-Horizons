# Infinite-Horizons 🌌⏳

Infinite-Horizons é um laboratório visual avançado e observatório interativo para experimentar causalidade, viagens temporais, mecânica quântica, relatividade geral e cosmologia observacional da NASA.

O fluxo principal permite explorar temas históricos e conceituais (como `Segunda Guerra Mundial`, `Paradoxos de Fermi`, `Origem do Universo`), gerando grafos causais com nós dinâmicos. Cada evento pode ser modificado, bifurcado ou inspecionado para analisar o efeito borboleta e o colapso de coerência temporal.

## 🔬 Rigor Científico e Módulos Principais

1. **Simulador Causal e Linhas Temporais Paralelas**: Grafos dinâmicos em Canvas 2D, cálculo de integridade temporal e detecção em tempo real de paradoxos lógicos (*Grandfather*, *Bootstrap* e *Predestination Paradoxes*).
2. **NASA Cosmology Observatory ("Nosso Universo")**: Portal com 8 pilares cosmológicos oficiais da NASA (Big Bang, CMB, Expansão com Hubble, Matéria Escura, Energia Escura, Buracos Negros, Estruturas Cósmicas e Destino Final), orrery estelar 3D e scanner espectroscópico de alvos cósmicos.
3. **Cone de Luz de Minkowski 3D**: Visualizador em Three.js demonstrando relações causais tipo-tempo, tipo-espaço e tipo-luz.
4. **Simulação Monte Carlo com Web Workers**: Execução estocástica em background para previsão de estabilidade temporal e diretrizes prescritivas.
5. **Formulação Matemática de Alta Precisão (KaTeX)**: Visualização de equações fundamentais da física relativística, atratores de Lorenz e mecânica quântica.
6. **Assistente IA e Zero-Token Knowledge Bank**: Base de conhecimento heurística integrada offline e suporte a API temporal serverless.

## 🚀 Executar Localmente

```bash
# Dentro do diretório infinite/
npm install
npm run dev
```

Acesse em `http://localhost:5173`.

## 🌐 Publicar na Vercel

O repositório já possui `vercel.json` na raiz configurado para monorepo com Vite e Serverless Functions:
- Raiz do repositório como `Root Directory`.
- Build automático em `infinite` gerando `infinite/dist`.
- Serverless API `/api/temporal` para integração segura com OpenAI / Azure OpenAI.

Para publicar pela CLI:
```bash
npx vercel --prod
```

Para validar a build de produção:
```bash
npm run build
```

## 🛠️ Stack Tecnológica

- **React 19** + **TypeScript**
- **Vite 8** + **Rolldown** + **Babel React Compiler**
- **Three.js** (Renderização 3D de cones de luz e astros)
- **KaTeX** (Fórmulas matemáticas)
- **Zustand** (Estado global reativo)
- **Web Workers** (Monte Carlo multithreaded)
- **Oxlint** & **Vitest**

