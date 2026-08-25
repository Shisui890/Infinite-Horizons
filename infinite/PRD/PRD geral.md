# PRD — PAINEL DO PARADOXO TEMPORAL

## Documento de Requisitos de Produto

**Nome do produto:** Painel do Paradoxo Temporal
**Categoria:** Simulador matemático, temporal e interdimensional
**Plataforma:** Web
**Tipo:** Aplicação web interativa
**Status:** Projeto / Desenvolvimento
**Idioma inicial:** Português-Brasil
**Tema:** Ciência, matemática, viagens temporais, causalidade, dimensões e ficção científica
**Stack principal:** TypeScript + D3.js
**Arquitetura sugerida:** Frontend React/Next.js + motor de simulação TypeScript + API Node.js + PostgreSQL

---

# PARTE 01 — VISÃO GERAL

## 1.1. Resumo

O **Painel do Paradoxo Temporal** é uma aplicação web interativa que permite ao usuário construir, observar e modificar linhas temporais fictícias, simulando as consequências matemáticas e causais de viagens no tempo e entre dimensões.

O sistema representa acontecimentos como nós de um grafo temporal.

Cada acontecimento possui relações de causa e consequência.

Quando um usuário altera determinado evento, o motor de simulação identifica os eventos afetados, propaga a alteração pela estrutura causal e recalcula o estado da linha temporal.

O objetivo é permitir que o usuário responda visualmente a perguntas como:

> "O que aconteceria se esse acontecimento nunca tivesse ocorrido?"

> "E se um viajante do futuro interferisse nesse evento?"

> "A alteração impediria a própria existência do viajante?"

> "Essa mudança criaria uma nova realidade ou destruiria a atual?"

> "Duas dimensões podem compartilhar o mesmo evento?"

---

# PARTE 02 — PROBLEMA

## 2.1. Problema que o produto resolve

Ferramentas comuns de diagramas permitem desenhar acontecimentos, mas não possuem um mecanismo de causalidade que reaja automaticamente às alterações.

O Painel do Paradoxo Temporal transforma o diagrama em um **sistema computacional simulável**.

O usuário não apenas desenha:

**ele modifica o universo e observa suas consequências.**

---

# PARTE 03 — OBJETIVO DO PRODUTO

## 3.1. Objetivo principal

Criar um simulador visual capaz de:

1. criar universos temporais;
2. criar dimensões;
3. criar eventos;
4. conectar eventos por relações causais;
5. criar viajantes;
6. realizar viagens temporais;
7. realizar viagens dimensionais;
8. alterar eventos;
9. propagar automaticamente alterações;
10. detectar paradoxos;
11. identificar conflitos causais;
12. calcular estabilidade temporal;
13. criar ramificações temporais;
14. registrar histórico das alterações;
15. permitir desfazer simulações;
16. salvar universos;
17. carregar universos posteriormente;
18. apresentar as consequências de forma visual.

---

# PARTE 04 — PRINCÍPIOS DO SISTEMA

O produto deverá seguir cinco princípios fundamentais.

## 4.1. Causalidade

Eventos podem depender de outros eventos.

```text
A → B → C → D
```

Uma alteração em A pode afetar B, C e D.

---

## 4.2. Propagação

Toda alteração relevante deverá gerar uma propagação pela cadeia causal.

---

## 4.3. Consistência temporal

O sistema deverá verificar se as alterações introduzidas continuam sendo logicamente compatíveis com a existência dos acontecimentos e viajantes envolvidos.

---

## 4.4. Separação dimensional

Cada dimensão deverá possuir sua própria estrutura temporal, podendo compartilhar determinados eventos ou possuir eventos equivalentes.

---

## 4.5. Rastreabilidade

Toda alteração deverá possuir histórico.

O sistema deverá conseguir responder:

> Quem alterou este evento?

> Qual era o estado anterior?

> Quais eventos foram afetados?

> Qual paradoxo foi criado?

> Qual viagem provocou a alteração?

---

# PARTE 05 — CONCEITO DO UNIVERSO

O universo simulado será composto por:

```text
UNIVERSO
│
├── Dimensão Ω-01
│   ├── Linha temporal
│   ├── Eventos
│   └── Viajantes
│
├── Dimensão Ω-02
│   ├── Linha temporal
│   ├── Eventos
│   └── Viajantes
│
└── Dimensão Ω-03
    ├── Linha temporal
    ├── Eventos
    └── Viajantes
```

O usuário poderá trabalhar com um universo contendo múltiplas realidades.

---

# PARTE 06 — MODELO DE DADOS

## 6.1. Universo

```ts
interface Universe {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;

  dimensions: Dimension[];
  travelers: Traveler[];

  temporalIntegrity: number;

  status: UniverseStatus;
}
```

---

# 6.2. Dimensão

```ts
interface Dimension {
  id: string;
  universeId: string;

  name: string;
  designation: string;

  color: string;

  events: TemporalEvent[];

  integrity: number;

  status: DimensionStatus;
}
```

Exemplo:

```text
Dimensão:
Ω-01

Nome:
Realidade Primária

Integridade:
96%
```

---

# 6.3. Evento

O evento será a principal entidade do sistema.

```ts
interface TemporalEvent {
  id: string;

  dimensionId: string;

  title: string;
  description?: string;

  timestamp: number;

  duration?: number;

  position: {
    x: number;
    y: number;
  };

  status: EventStatus;

  importance: number;

  parents: string[];
  children: string[];

  causes: string[];
  consequences: string[];

  originalState: EventState;
  currentState: EventState;

  alteredBy?: string[];

  createdAt: number;
  updatedAt: number;
}
```

---

# PARTE 07 — ESTADOS DOS EVENTOS

Cada evento poderá possuir diferentes estados.

```ts
enum EventStatus {
  STABLE = "stable",
  ALTERED = "altered",
  UNSTABLE = "unstable",
  COLLAPSED = "collapsed",
  PARADOXICAL = "paradoxical",
  ERASED = "erased",
  DIVERGED = "diverged"
}
```

## 7.1. Stable

Evento funcionando normalmente.

---

## 7.2. Altered

Evento modificado pelo usuário ou por consequência causal.

---

## 7.3. Unstable

Evento ainda existente, mas com consequências potencialmente perigosas.

---

## 7.4. Collapsed

O evento deixou de ser logicamente sustentável na realidade atual.

---

## 7.5. Paradoxical

O evento participa de uma contradição causal.

---

## 7.6. Erased

O evento foi removido da linha temporal.

---

## 7.7. Diverged

O evento gerou uma ramificação.

---

# PARTE 08 — VIAJANTES

O sistema deverá possuir uma entidade específica para viajantes.

```ts
interface Traveler {
  id: string;

  name: string;

  originDimensionId: string;

  originTimestamp: number;

  currentDimensionId: string;

  currentTimestamp: number;

  originEventId?: string;

  status: TravelerStatus;

  travelHistory: TravelRecord[];
}
```

---

# PARTE 09 — STATUS DOS VIAJANTES

```ts
enum TravelerStatus {
  NORMAL = "normal",
  TRAVELING = "traveling",
  DISPLACED = "displaced",
  ORIGIN_THREATENED = "origin_threatened",
  PARADOXICAL = "paradoxical",
  ERASED = "erased",
  DUPLICATED = "duplicated"
}
```

---

# PARTE 10 — VIAGEM TEMPORAL

Cada viagem deverá ser registrada.

```ts
interface TemporalTravel {
  id: string;

  travelerId: string;

  originDimensionId: string;
  originTimestamp: number;

  destinationDimensionId: string;
  destinationTimestamp: number;

  purpose?: string;

  createdAt: number;

  effects: string[];
}
```

---

# PARTE 11 — VIAGEM DIMENSIONAL

Além de viajar no tempo, o usuário poderá trocar de realidade.

```text
Ω-01 / 2080
     │
     │ viagem dimensional
     ▼
Ω-04 / 1730
```

A viagem dimensional deverá ser representada por uma ligação especial entre grafos.

---

# PARTE 12 — GRAFO TEMPORAL

## 12.1. Modelo

O sistema utilizará um grafo direcionado.

```text
Evento A
   │
   ├── Evento B
   │      │
   │      └── Evento C
   │
   └── Evento D
```

Cada conexão representa uma relação causal.

---

# 12.2. Arestas

```ts
interface CausalEdge {
  id: string;

  source: string;
  target: string;

  type: CausalRelation;

  strength: number;

  temporalWeight: number;

  active: boolean;
}
```

---

# PARTE 13 — TIPOS DE RELAÇÕES

```ts
enum CausalRelation {
  CAUSES = "causes",
  ENABLES = "enables",
  PREVENTS = "prevents",
  DEPENDS_ON = "depends_on",
  CONTRADICTS = "contradicts",
  DERIVES = "derives",
  CONNECTS_DIMENSIONS = "connects_dimensions"
}
```

Exemplos:

```text
A CAUSES B
A ENABLES B
A PREVENTS B
A CONTRADICTS B
```

---

# PARTE 14 — MOTOR DE PROPAGAÇÃO

O coração do sistema será o motor de propagação causal.

Nome sugerido:

```text
CausalPropagationEngine
```

---

## 14.1. Fluxo

```text
ALTERAÇÃO
    ↓
Identificar evento
    ↓
Encontrar dependências
    ↓
Adicionar eventos à fila
    ↓
Recalcular estados
    ↓
Propagar consequências
    ↓
Verificar contradições
    ↓
Verificar paradoxos
    ↓
Atualizar integridade
    ↓
Atualizar interface
```

---

# PARTE 15 — ALGORITMO

A implementação inicial poderá utilizar uma combinação de:

**BFS**, **DFS**, ordenação topológica e detecção de ciclos.

Pseudoalgoritmo:

```ts
function propagateChange(eventId: string) {
  const queue = [eventId];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    if (visited.has(currentId)) {
      continue;
    }

    visited.add(currentId);

    const current = graph.getNode(currentId);

    recalculateEvent(current);

    const consequences = graph.getChildren(currentId);

    for (const consequence of consequences) {
      queue.push(consequence.id);
    }
  }

  paradoxDetector.run();
  integrityEngine.recalculate();
}
```

A implementação final deverá otimizar a propagação para não recalcular nós que não foram afetados.

---

# PARTE 16 — DETECÇÃO DE PARADOXOS

O sistema terá um mecanismo dedicado:

```text
ParadoxDetectionEngine
```

Ele deverá verificar múltiplas categorias.

---

# PARTE 17 — PARADOXO DO AVÔ

O caso mais importante do MVP.

### Exemplo

```text
Viajante nasce em 2100
        ↓
Viaja para 1900
        ↓
Interfere nos antepassados
        ↓
Origem do viajante deixa de acontecer
        ↓
Viajante não deveria existir
        ↓
Mas o viajante já está em 1900
```

Resultado:

```text
⚠ PARADOXO DO AVÔ
```

---

# PARTE 18 — REGRA DO PARADOXO DO AVÔ

O algoritmo deverá identificar:

```text
Traveler
    ↓
Historical Intervention
    ↓
Origin Dependency
    ↓
Origin Invalidated
```

Quando isso acontecer:

```ts
paradox.type = "GRANDFATHER_PARADOX";
```

O sistema deverá:

1. marcar os eventos envolvidos;
2. marcar o viajante;
3. reduzir a integridade temporal;
4. exibir alerta;
5. destacar a cadeia causal;
6. registrar o evento no log.

---

# PARTE 19 — OUTROS PARADOXOS

O sistema deverá permitir expansão para outros paradoxos.

### Paradoxo de Bootstrap

Um objeto ou informação não possui origem causal clara.

```text
A recebe informação de B
B recebe a mesma informação de A
```

---

### Paradoxo de Predestinação

O viajante volta ao passado e provoca exatamente o acontecimento que o fez viajar.

```text
A → B → C → A
```

---

### Contradição temporal

Dois eventos tornam-se simultaneamente obrigatórios e impossíveis.

---

### Duplicação temporal

O mesmo indivíduo ocupa estados incompatíveis da linha temporal.

---

### Colapso causal

Uma alteração elimina uma sequência necessária de eventos.

---

# PARTE 20 — NÍVEL DE GRAVIDADE

Os paradoxos terão gravidade:

```ts
enum ParadoxSeverity {
  LOW,
  MEDIUM,
  HIGH,
  CRITICAL,
  CATASTROPHIC
}
```

Visualmente:

```text
LOW          → aviso
MEDIUM       → instabilidade
HIGH         → alerta
CRITICAL     → colapso
CATASTROPHIC → ruptura temporal
```

---

# PARTE 21 — INTEGRIDADE TEMPORAL

Cada universo deverá possuir um índice de integridade.

```ts
interface IntegrityState {
  value: number;
  previousValue: number;

  delta: number;

  status:
    | "stable"
    | "warning"
    | "critical"
    | "collapsed";
}
```

Valor:

```text
100% = realidade totalmente estável

80%+ = estável

60–79% = atenção

40–59% = instável

20–39% = crítico

0–19% = colapso iminente
```

---

# PARTE 22 — COLAPSO TEMPORAL

Quando a integridade chegar a um limite crítico, o sistema não deverá simplesmente apagar tudo.

Ele deverá apresentar uma sequência de eventos.

```text
INTEGRIDADE: 12%

⚠ COLAPSO TEMPORAL IMINENTE

Eventos afetados: 47
Dimensões afetadas: 3
Viajantes em risco: 2
Paradoxos ativos: 5
```

O usuário poderá visualizar a cadeia responsável pelo colapso.

---

# PARTE 23 — RAMIFICAÇÕES

Uma alteração não necessariamente deve destruir a realidade original.

O usuário poderá escolher:

```text
ALTERAÇÃO DETECTADA

[ Reescrever linha temporal ]

[ Criar nova ramificação ]

[ Cancelar alteração ]
```

---

# PARTE 24 — LINHA TEMPORAL RAMIFICADA

Exemplo:

```text
                ┌─── Ω-01-A
                │
──────●─────────●────────●
                │
                └─── Ω-01-B
```

A realidade original continua existindo.

A realidade alterada torna-se uma nova ramificação.

---

# PARTE 25 — MODELOS TEMPORAIS

O sistema poderá oferecer três modelos.

## Modelo 1 — Linha única

Toda alteração modifica a realidade atual.

```text
A → B → C
```

---

## Modelo 2 — Ramificação

Alterações criam novas realidades.

```text
A → B ─→ C
     └→ D
```

---

## Modelo 3 — Multiverso

Cada dimensão possui sua própria linha temporal.

```text
Ω-01
│
├── passado
├── presente
└── futuro

Ω-02
│
├── passado
├── presente
└── futuro
```

---

# PARTE 26 — INTERFACE PRINCIPAL

A página principal da aplicação deverá funcionar como o **Centro de Controle Temporal**.

Estrutura:

```text
┌────────────────────────────────────────────────────────────┐
│ LOGO      UNIVERSO     SIMULAÇÃO     VIAJANTES     ⚙      │
├───────────┬──────────────────────────────────────┬─────────┤
│           │                                      │         │
│ DIMENSÕES │          MAPA TEMPORAL              │ EVENTO  │
│           │                                      │         │
│ Ω-01      │       ●────●────●────●              │ STATUS  │
│ Ω-02      │            │                         │         │
│ Ω-03      │            ●────●                    │ DETALHES│
│           │                                      │         │
│           │                                      │         │
├───────────┴──────────────────────────────────────┴─────────┤
│ INTEGRIDADE  ████████████████░░ 86%   PARADOXOS: 02        │
└────────────────────────────────────────────────────────────┘
```

---

# PARTE 27 — MENU PRINCIPAL

O menu deverá conter:

**Visão Geral**

**Linha Temporal**

**Dimensões**

**Viajantes**

**Paradoxos**

**Simulação**

**Histórico**

**Biblioteca**

**Configurações**

---

# PARTE 28 — HOME / LANDING PAGE

Antes de entrar no simulador, o site deverá possuir uma apresentação visual do produto.

Hero:

```text
PAINEL DO
PARADOXO TEMPORAL

O passado não é fixo.

[ INICIAR SIMULAÇÃO ]
```

A página poderá apresentar:

* conceito;
* funcionamento;
* exemplos;
* recursos;
* demonstração visual;
* botão para iniciar simulador.

---

# PARTE 29 — CRIAÇÃO DE UNIVERSO

Ao iniciar uma simulação:

```text
CRIAR UNIVERSO

Nome:
[ Universo Inicial ]

Modelo temporal:
(•) Linha única
( ) Ramificação
( ) Multiverso

Ano inicial:
[ 0000 ]

Ano final:
[ 5000 ]

Dimensão inicial:
[ Ω-01 ]

[ CRIAR UNIVERSO ]
```

---

# PARTE 30 — EDITOR DE EVENTOS

O usuário deverá conseguir criar:

```text
[ + NOVO EVENTO ]
```

Campos:

```text
Nome
Descrição
Ano
Dimensão
Importância
Categoria
Estado
```

---

# PARTE 31 — CATEGORIAS DE EVENTOS

Exemplos:

```text
HISTÓRICO
CIENTÍFICO
POLÍTICO
TECNOLÓGICO
NASCIMENTO
MORTE
GUERRA
DESCOBERTA
CATÁSTROFE
ENCONTRO
VIAGEM
CRIAÇÃO
DESTRUIÇÃO
```

As categorias terão impacto principalmente visual e semântico.

---

# PARTE 32 — CRIAÇÃO DE CONEXÕES

O usuário poderá ligar um evento a outro.

Exemplo:

```text
Evento A
     ↓
[ Causa ]
     ↓
Evento B
```

A interface deverá permitir criar conexões por:

* arrastar;
* selecionar origem;
* selecionar destino;
* escolher relação causal.

---

# PARTE 33 — PAINEL DE EVENTO

Ao clicar em um evento:

```text
EVENTO #EVT-019

A Descoberta da Máquina

Ano:
2047

Dimensão:
Ω-01

Estado:
ALTERADO

Integridade:
74%

Causas:
EVT-013

Consequências:
EVT-020
EVT-024
EVT-041

Alterado por:
Viajante #02
```

Abaixo:

```text
[ EDITAR ]

[ SIMULAR ALTERAÇÃO ]

[ CRIAR RAMIFICAÇÃO ]

[ EXCLUIR ]

[ VER CADEIA CAUSAL ]
```

---

# PARTE 34 — SIMULAÇÃO DE ALTERAÇÃO

Quando o usuário seleciona "Simular Alteração", o sistema deverá abrir um painel.

```text
SIMULAR ALTERAÇÃO

Evento:
Descoberta da Máquina

Nova condição:

○ Evento nunca aconteceu
○ Evento aconteceu antes
○ Evento aconteceu depois
○ Evento teve resultado diferente
○ Evento foi causado por outro evento

[ EXECUTAR SIMULAÇÃO ]
```

---

# PARTE 35 — MODO COMPARAÇÃO

O usuário deverá conseguir comparar:

```text
LINHA ORIGINAL

vs.

LINHA ALTERADA
```

Exemplo:

```text
ORIGINAL             ALTERADA

● Fundação           ● Fundação
│                    │
● Descoberta         × Descoberta
│                    │
● Guerra             ● Nova Guerra
│                    │
● Colonização        ● Colapso
```

---

# PARTE 36 — VIAGENS

Tela:

```text
NOVA VIAGEM

Viajante:
[ Chronos ]

Origem:
Ω-01 / 2087

Destino:
Ω-01 / 1950

Tipo:
(•) Temporal
( ) Dimensional
( ) Temporal + Dimensional

Objetivo:
[ Alterar evento ]

[ EXECUTAR VIAGEM ]
```

---

# PARTE 37 — EXECUÇÃO DA VIAGEM

A viagem não deverá simplesmente mover o personagem.

O sistema deverá:

1. identificar origem;
2. identificar destino;
3. verificar eventos existentes;
4. inserir o viajante no momento correto;
5. identificar eventos que podem ser influenciados;
6. calcular possibilidades;
7. atualizar relações;
8. detectar paradoxos;
9. atualizar integridade;
10. registrar a viagem.

---

# PARTE 38 — VISUALIZAÇÃO DA VIAGEM

Durante a viagem deverá existir animação:

```text
Ω-01 / 2087
      │
      │
      │ ✦
      │  ✦
      │   ✦
      ▼
Ω-01 / 1950
```

A interface poderá apresentar partículas atravessando a conexão.

---

# PARTE 39 — PAINEL DOS PARADOXOS

Todos os paradoxos deverão aparecer em uma central.

```text
PARADOXOS ATIVOS

┌─────────────────────────────────────────────┐
│ 🔴 PARADOXO DO AVÔ                         │
│ Gravidade: CRÍTICA                         │
│ Dimensão: Ω-01                             │
│ Evento: EVT-029                            │
│ Integridade perdida: -31%                  │
│ [ INVESTIGAR ]                             │
└─────────────────────────────────────────────┘
```

---

# PARTE 40 — INVESTIGAÇÃO DE PARADOXO

Ao abrir um paradoxo:

```text
ORIGEM
  ↓
VIAGEM
  ↓
INTERVENÇÃO
  ↓
EVENTO ALTERADO
  ↓
CONSEQUÊNCIA
  ↓
ORIGEM INVALIDADA
  ↓
PARADOXO
```

O usuário poderá percorrer toda a cadeia.

---

# PARTE 41 — HISTÓRICO DE SIMULAÇÃO

Toda ação deverá ser registrada.

```ts
interface SimulationAction {
  id: string;

  timestamp: number;

  type: SimulationActionType;

  actor?: string;

  targetId?: string;

  previousState?: unknown;

  newState?: unknown;

  effects: string[];
}
```

Tipos:

```text
CREATE_EVENT
UPDATE_EVENT
DELETE_EVENT
CREATE_TRAVELER
TIME_TRAVEL
DIMENSION_TRAVEL
CREATE_BRANCH
DETECT_PARADOX
ROLLBACK
```

---

# PARTE 42 — DESFAZER

O sistema deverá suportar:

```text
CTRL + Z
```

e botão:

**Desfazer última alteração**

O rollback deverá restaurar:

* eventos;
* conexões;
* viajantes;
* dimensões;
* integridade;
* paradoxos.

---

# PARTE 43 — REDO

Também deverá existir:

```text
CTRL + SHIFT + Z
```

para refazer alterações desfeitas.

---

# PARTE 44 — D3.JS

O D3.js será utilizado exclusivamente como camada principal de visualização dos dados do grafo.

Responsabilidades:

* renderização dos nós;
* renderização das conexões;
* zoom;
* pan;
* seleção;
* animações;
* posicionamento;
* agrupamento;
* destaque de caminhos;
* transições;
* visualização das ramificações.

---

# PARTE 45 — MOTOR DE GRAFO

O motor não deverá depender diretamente da interface.

Arquitetura:

```text
D3.js
  ↑
View Model
  ↑
Simulation State
  ↑
Temporal Engine
  ↑
Graph Engine
  ↑
Data Model
```

Isso permitirá futuramente criar:

* API;
* modo multiplayer;
* testes automatizados;
* simulações em servidor;
* importação/exportação.

---

# PARTE 46 — ARQUITETURA FRONTEND

Arquitetura recomendada:

```text
React
│
├── App Shell
├── Dashboard
├── TimelineCanvas
├── EventPanel
├── TravelerPanel
├── DimensionPanel
├── ParadoxPanel
├── SimulationPanel
└── HistoryPanel
```

---

# PARTE 47 — ESTADO DA APLICAÇÃO

Um store global poderá conter:

```ts
interface SimulationState {
  universe: Universe | null;

  selectedEventId?: string;
  selectedTravelerId?: string;

  activeDimensionId?: string;

  simulationMode: SimulationMode;

  history: SimulationAction[];

  undoStack: SimulationAction[];
  redoStack: SimulationAction[];

  activeParadoxes: Paradox[];

  isSimulating: boolean;
}
```

---

# PARTE 48 — BACKEND

Para uma versão realmente persistente, o sistema deverá possuir backend.

Arquitetura:

```text
Browser
   ↓
Frontend
   ↓
API
   ↓
Simulation Services
   ↓
Database
```

---

# PARTE 49 — API

Endpoints sugeridos:

```http
POST   /api/universes
GET    /api/universes
GET    /api/universes/:id
PATCH  /api/universes/:id
DELETE /api/universes/:id
```

Eventos:

```http
POST   /api/universes/:id/events
PATCH  /api/events/:id
DELETE /api/events/:id
```

Viajantes:

```http
POST /api/universes/:id/travelers
GET  /api/universes/:id/travelers
POST /api/travelers/:id/travel
```

Simulação:

```http
POST /api/universes/:id/simulate
POST /api/universes/:id/rollback
```

Paradoxos:

```http
GET /api/universes/:id/paradoxes
```

---

# PARTE 50 — BANCO DE DADOS

PostgreSQL recomendado.

Tabelas principais:

```text
users
universes
dimensions
events
causal_edges
travelers
travels
paradoxes
simulation_actions
timeline_snapshots
```

---

# PARTE 51 — SNAPSHOTS

O sistema deverá salvar estados completos da simulação.

```text
Snapshot #01
Snapshot #02
Snapshot #03
Snapshot #04
```

Isso permitirá:

* rollback;
* comparação;
* recuperação;
* histórico;
* experimentação.

---

# PARTE 52 — IMPORTAÇÃO E EXPORTAÇÃO

O usuário deverá poder exportar um universo.

Formato:

```text
.json
```

Exemplo:

```json
{
  "universe": "...",
  "dimensions": [],
  "events": [],
  "travelers": [],
  "paradoxes": []
}
```

Também poderá importar um arquivo anteriormente salvo.

---

# PARTE 53 — AUTOSAVE

A aplicação deverá salvar automaticamente alterações.

Exemplo:

```text
✓ Todas as alterações salvas
```

Ou:

```text
Salvando...
```

---

# PARTE 54 — MODO OFFLINE

O frontend deverá possuir suporte a persistência local para permitir uso sem conexão temporária.

Tecnologias possíveis:

```text
IndexedDB
```

ou

```text
localStorage
```

Para grandes universos, preferir IndexedDB.

---

# PARTE 55 — ESTÉTICA

A identidade deverá ser baseada em:

**Cosmos + Tecnologia + Espaço-tempo + Dimensões**

Não deverá parecer um dashboard corporativo tradicional.

---

# PARTE 56 — DIREÇÃO VISUAL

### Fundo

Quase preto, com:

* estrelas;
* nebulosas;
* partículas;
* gradientes espaciais;
* ruído extremamente sutil.

### Elementos

Painéis translúcidos.

### Bordas

Delicadas linhas luminosas.

### Estados

Azul/ciano:

estável.

Roxo:

dimensional.

Amarelo:

atenção.

Vermelho:

paradoxo.

Branco:

eventos críticos/importantes.

---

# PARTE 57 — TIPOGRAFIA

A interface deverá utilizar uma fonte tecnológica para títulos e uma fonte altamente legível para informações.

Hierarquia:

```text
Título principal
↓
Título de seção
↓
Nome do evento
↓
Dados
↓
Metadados
```

---

# PARTE 58 — ANIMAÇÕES

A aplicação deverá utilizar animações com propósito funcional.

Exemplos:

### Propagação

Uma onda percorre os eventos afetados.

```text
● → ● → ● → ●
```

---

### Paradoxo

A cadeia afetada pulsa e começa a sofrer distorção visual.

---

### Viagem

Uma partícula percorre a linha temporal.

---

### Ramificação

A linha original se divide suavemente.

---

# PARTE 59 — EFEITO DE COLAPSO

Quando um universo estiver próximo do colapso:

* reduzir a estabilidade visual;
* fazer eventos afetados piscarem suavemente;
* apresentar distorções;
* destacar relações;
* atualizar indicadores;
* mostrar alertas.

As animações nunca deverão prejudicar acessibilidade ou usabilidade.

---

# PARTE 60 — RESPONSIVIDADE

A aplicação deverá funcionar em:

```text
Desktop
Notebook
Tablet
Celular
```

Porém, o **modo de edição completo do grafo será otimizado para telas grandes**.

Em dispositivos menores:

```text
Mapa temporal
↓
Painel de informações
↓
Controles
```

deverão se tornar painéis empilhados.

---

# PARTE 61 — ACESSIBILIDADE

A aplicação deverá possuir:

* navegação por teclado;
* foco visual;
* labels;
* contraste adequado;
* suporte a leitores de tela para controles;
* alternativa textual para eventos;
* não depender apenas de cor para indicar estados.

Por exemplo:

```text
🔴 PARADOXICAL
```

e não somente um ponto vermelho.

---

# PARTE 62 — BUSCA

Deverá existir busca global.

O usuário poderá pesquisar:

```text
Evento
Viajante
Dimensão
Paradoxo
Ano
ID
```

Exemplo:

```text
Buscar:
[ Fundação da Colônia             ]
```

Resultado:

```text
EVT-047
Fundação da Colônia
Ω-02
2147
```

---

# PARTE 63 — FILTROS

Filtros:

```text
Dimensão
Período
Estado
Tipo de evento
Importância
Paradoxos
Viajantes
```

---

# PARTE 64 — CONTROLES DO MAPA

O mapa deverá possuir:

```text
[ + ]
[ - ]
[ ⌂ ]
[ ⛶ ]
[ F ]
[ ⟳ ]
```

Onde:

* `+` zoom;
* `-` zoom out;
* `⌂` centralizar;
* `⛶` tela cheia;
* `F` localizar seleção;
* `⟳` reorganizar grafo.

---

# PARTE 65 — ORGANIZAÇÃO DO GRAFO

O usuário poderá escolher:

```text
Organização:

○ Temporal
○ Causal
○ Dimensional
○ Hierárquica
○ Automática
```

---

# PARTE 66 — MODO TEMPORAL

No modo temporal, o eixo X representa o tempo.

```text
1900 ─── 1950 ─── 2000 ─── 2050 ─── 2100
```

---

# PARTE 67 — MODO CAUSAL

A posição enfatiza dependências:

```text
CAUSA
 ↓
EVENTO
 ↓
CONSEQUÊNCIA
```

---

# PARTE 68 — MODO DIMENSIONAL

Dimensões aparecem como planos/layers independentes.

```text
Ω-01
─────────────

Ω-02
─────────────

Ω-03
─────────────
```

---

# PARTE 69 — MULTIVERSO

O modo multiverso deverá permitir visualizar múltiplas realidades simultaneamente.

```text
                Ω-01
                 │
                ●
               / \
              /   \
            Ω-02  Ω-03
             │      │
             ●      ●
```

---

# PARTE 70 — COMPARAÇÃO DE DIMENSÕES

O usuário poderá selecionar:

```text
Comparar:

Ω-01
vs
Ω-03
```

O sistema deverá destacar:

* eventos iguais;
* eventos diferentes;
* eventos inexistentes;
* eventos alterados;
* pontos de divergência.

---

# PARTE 71 — EVENTOS EQUIVALENTES

Duas dimensões podem conter eventos semanticamente equivalentes.

Exemplo:

```text
Ω-01:
"A humanidade descobre energia X"

Ω-02:
"A humanidade descobre energia Y"
```

O sistema poderá representar ambos como eventos equivalentes, porém diferentes.

---

# PARTE 72 — PONTO DE DIVERGÊNCIA

Quando duas linhas deixam de ser equivalentes:

```text
──────────●──────────●────────
          │
          ├──────── Ω-01
          │
          └──────── Ω-02
```

O sistema deverá armazenar:

```ts
interface DivergencePoint {
  id: string;
  sourceEventId: string;

  sourceDimensionId: string;
  targetDimensionId: string;

  timestamp: number;
}
```

---

# PARTE 73 — IA / SUGESTÕES FUTURAS

A primeira versão não dependerá de IA.

Entretanto, a arquitetura deverá permitir posteriormente funcionalidades como:

> "Qual evento está mais provavelmente causando o colapso?"

> "Mostre três maneiras de salvar esta linha temporal."

> "Crie uma realidade onde o evento X nunca aconteceu."

Essas funcionalidades deverão ser desacopladas do motor principal.

---

# PARTE 74 — PERFORMANCE

O maior desafio técnico será o tamanho do grafo.

O sistema deverá ser projetado para suportar inicialmente:

```text
1.000 eventos
10.000 conexões
100 viajantes
50 dimensões
```

sem comprometer a experiência de uso em hardware comum.

---

# PARTE 75 — OTIMIZAÇÃO DO GRAFO

Não recalcular todos os nós a cada alteração.

Deverá ser utilizado:

```text
Dirty Nodes
```

Quando um evento muda:

```text
Evento alterado
      ↓
Nós dependentes
      ↓
Somente esses nós são recalculados
```

---

# PARTE 76 — CACHE

Resultados de cálculos que não sofreram alterações poderão ser armazenados.

```ts
Map<EventId, CalculatedState>
```

Quando uma alteração acontece, somente caches dependentes serão invalidados.

---

# PARTE 77 — WEB WORKERS

Para simulações maiores, o motor poderá rodar em:

```text
Web Worker
```

Assim:

```text
UI Thread
   │
   └── Worker
         │
         └── Simulation Engine
```

A interface continuará responsiva durante cálculos pesados.

---

# PARTE 78 — TESTES

O projeto deverá possuir três níveis.

### Unitários

Testar:

* grafo;
* propagação;
* paradoxos;
* integridade;
* viagens.

### Integração

Testar:

* API + banco;
* simulação + persistência;
* rollback;
* importação.

### E2E

Testar fluxos reais:

```text
Criar universo
→ Criar eventos
→ Criar viajante
→ Viajar
→ Alterar evento
→ Detectar paradoxo
→ Salvar
→ Reabrir
```

---

# PARTE 79 — CASOS DE TESTE CRÍTICOS

## Caso 01

Evento alterado sem dependências.

Resultado:

```text
Somente o evento é atualizado.
```

---

## Caso 02

Evento com várias consequências.

Resultado:

```text
Toda cadeia afetada é recalculada.
```

---

## Caso 03

Evento inexistente.

Resultado:

```text
Erro controlado.
```

---

## Caso 04

Ciclo causal.

Resultado:

```text
Ciclo detectado.
```

---

## Caso 05

Viajante elimina sua origem.

Resultado:

```text
PARADOXO DO AVÔ
```

---

## Caso 06

Ramificação.

Resultado:

```text
Nova linha criada.
```

---

## Caso 07

Viagem dimensional.

Resultado:

```text
Viajante transferido para outra dimensão.
```

---

# PARTE 80 — SISTEMA DE NOTIFICAÇÕES

O sistema deverá possuir notificações.

Exemplos:

```text
✓ Universo criado

✓ Evento alterado

⚠ Linha temporal instável

⚠ Novo paradoxo detectado

🔴 Colapso temporal detectado

✓ Nova dimensão criada
```

---

# PARTE 81 — CENTRAL DE ALERTAS

Alertas críticos deverão possuir uma central.

```text
ALERTAS

🔴 2 Paradoxos críticos
🟠 4 Eventos instáveis
🟡 8 Eventos alterados
```

Ao clicar, o sistema deverá navegar até a origem do problema.

---

# PARTE 82 — CONFIGURAÇÕES

O usuário poderá configurar:

```text
Tema
Animações
Escala temporal
Modelo temporal
Unidades de tempo
Exibição de eventos
Intensidade visual
Idioma
```

---

# PARTE 83 — ESCALA TEMPORAL

O sistema deverá aceitar:

```text
anos
meses
dias
horas
minutos
segundos
```

O formato interno deverá trabalhar com uma representação numérica normalizada para permitir comparação.

---

# PARTE 84 — PRECISÃO

O sistema deverá separar:

```text
tempo lógico
```

de:

```text
tempo visual
```

Isso permitirá representar universos com grandes intervalos temporais sem comprometer o motor.

---

# PARTE 85 — SEGURANÇA

Mesmo sendo uma aplicação de simulação, o backend deverá implementar:

* autenticação;
* autorização;
* validação de entrada;
* rate limiting;
* proteção contra manipulação de IDs;
* sanitização;
* controle de acesso aos universos;
* logs.

---

# PARTE 86 — AUTENTICAÇÃO

A primeira versão poderá possuir:

```text
Criar conta
Entrar
Sair
```

Opcionalmente:

```text
OAuth
```

posteriormente.

---

# PARTE 87 — PROPRIEDADE DOS UNIVERSOS

Cada universo deverá possuir proprietário.

```ts
interface UniversePermission {
  userId: string;
  universeId: string;

  role:
    | "owner"
    | "editor"
    | "viewer";
}
```

---

# PARTE 88 — COMPARTILHAMENTO

Futuramente poderá existir:

```text
Compartilhar universo
```

com:

```text
Somente leitura
Editor
Controle total
```

---

# PARTE 89 — URLS

Cada universo poderá ter uma URL:

```text
/app/universe/8f32a
```

Cada evento:

```text
/app/universe/8f32a/event/evt-042
```

Isso permitirá links diretos.

---

# PARTE 90 — PROGRESSIVE WEB APP

Uma versão futura poderá utilizar PWA para permitir:

* instalação;
* cache;
* execução offline;
* abertura rápida.

---

# PARTE 91 — ANALYTICS DO SISTEMA

A aplicação poderá armazenar métricas técnicas não sensíveis:

```text
tempo médio de simulação
quantidade média de eventos
quantidade de paradoxos
tempo de renderização
erros
```

Essas métricas ajudarão a otimizar o produto.

---

# PARTE 92 — MODO DEMONSTRAÇÃO

O site deverá possuir um universo pré-configurado.

Exemplo:

```text
UNIVERSO: O EXPERIMENTO CHRONOS
```

Ele começará estável.

O usuário poderá experimentar alterações sem precisar criar tudo manualmente.

---

# PARTE 93 — TUTORIAL

Na primeira utilização:

```text
PASSO 1
Este é um evento.

PASSO 2
Eventos possuem causas e consequências.

PASSO 3
Crie um viajante.

PASSO 4
Envie-o ao passado.

PASSO 5
Observe o efeito da alteração.

PASSO 6
Procure por paradoxos.
```

---

# PARTE 94 — MODO SANDBOX

Deverá existir um modo livre:

```text
SANDBOX TEMPORAL
```

Neste modo:

* não existe universo padrão;
* o usuário pode experimentar;
* regras podem ser alteradas;
* o histórico pode ser apagado;
* universos podem ser duplicados.

---

# PARTE 95 — DUPLICAÇÃO DE UNIVERSO

O usuário poderá fazer:

```text
Duplicar universo
```

Exemplo:

```text
Universo A
     ↓
Duplicar
     ↓
Universo A — Original
Universo A — Experimento
```

Isso será importante para testes.

---

# PARTE 96 — RESET

Botão:

```text
RESETAR SIMULAÇÃO
```

Deverá exigir confirmação:

```text
Isso removerá todas as alterações deste estado.

[ CANCELAR ] [ CONFIRMAR ]
```

---

# PARTE 97 — EXPORTAÇÃO VISUAL

Futuramente:

```text
Exportar PNG
Exportar SVG
Exportar PDF
```

da linha temporal atual.

---

# PARTE 98 — MODO APRESENTAÇÃO

O usuário poderá esconder todos os painéis e apresentar apenas o universo.

```text
[ MODO APRESENTAÇÃO ]
```

Com:

```text
Nome do universo
Mapa temporal
Integridade
Paradoxos
```

---

# PARTE 99 — ARQUITETURA DE DIRETÓRIOS

Estrutura sugerida:

```text
src/
│
├── app/
│
├── components/
│   ├── timeline/
│   ├── events/
│   ├── travelers/
│   ├── paradoxes/
│   ├── dimensions/
│   └── ui/
│
├── engine/
│   ├── graph/
│   ├── propagation/
│   ├── paradox/
│   ├── integrity/
│   ├── timeline/
│   └── simulation/
│
├── domain/
│   ├── events/
│   ├── travelers/
│   ├── dimensions/
│   └── universes/
│
├── store/
│
├── services/
│
├── api/
│
├── hooks/
│
├── utils/
│
└── types/
```

---

# PARTE 100 — SEPARAÇÃO DE RESPONSABILIDADES

O código não deverá misturar:

```text
UI
```

com:

```text
Regras matemáticas
```

Por exemplo, o botão "simular" não deverá conter a implementação inteira do algoritmo.

Deverá chamar:

```ts
simulationEngine.simulate(...)
```

---

# PARTE 101 — SERVIÇOS PRINCIPAIS

Os serviços deverão incluir:

```text
GraphService
TimelineService
TravelerService
DimensionService
SimulationService
ParadoxService
IntegrityService
SnapshotService
HistoryService
```

---

# PARTE 102 — MOTOR DE SIMULAÇÃO

Classe principal:

```ts
class TemporalSimulationEngine {
  simulate(input: SimulationInput): SimulationResult;

  propagate(eventId: string): PropagationResult;

  detectParadoxes(): Paradox[];

  recalculateIntegrity(): number;

  createBranch(): Universe;

  rollback(snapshotId: string): Universe;
}
```

---

# PARTE 103 — RESULTADO DA SIMULAÇÃO

Cada execução deverá retornar algo semelhante a:

```ts
interface SimulationResult {
  success: boolean;

  affectedEvents: string[];

  affectedDimensions: string[];

  affectedTravelers: string[];

  paradoxes: Paradox[];

  integrityBefore: number;
  integrityAfter: number;

  createdBranches: string[];

  warnings: string[];
}
```

---

# PARTE 104 — MODO SECO DO MOTOR

O motor deverá funcionar sem interface gráfica.

Isso permitirá testar:

```ts
const result = engine.simulate(input);
```

independentemente do navegador.

Esse ponto é importante para testes automatizados e futura execução no servidor.

---

# PARTE 105 — DESIGN SYSTEM

Criar componentes reutilizáveis:

```text
Button
IconButton
Panel
Card
Modal
Drawer
Tooltip
Badge
StatusIndicator
ProgressBar
TimelineNode
TimelineEdge
Alert
Toast
Tabs
Dropdown
Slider
Search
CommandPalette
```

---

# PARTE 106 — COMMAND PALETTE

Atalho:

```text
CTRL + K
```

Abrirá:

```text
O que deseja fazer?

Criar evento
Criar viajante
Criar dimensão
Criar viagem
Encontrar evento
Abrir paradoxos
Executar simulação
Salvar universo
```

Isso dará ao sistema uma sensação de ferramenta profissional.

---

# PARTE 107 — ATALHOS

```text
CTRL + K → Comandos
CTRL + Z → Desfazer
CTRL + SHIFT + Z → Refazer
F → Centralizar seleção
ESC → Fechar painel
SPACE → Pausar simulação
DELETE → Excluir seleção
```

---

# PARTE 108 — ESTADO DE SIMULAÇÃO

O sistema deverá possuir:

```text
IDLE
SIMULATING
PROPAGATING
ANALYZING
PARADOX_DETECTED
COMPLETED
FAILED
```

Isso deverá ser mostrado na interface quando relevante.

---

# PARTE 109 — PAUSA

Simulações grandes poderão ser pausadas.

```text
SIMULAÇÃO EM ANDAMENTO

██████████░░░░░ 63%

[ PAUSAR ]
```

---

# PARTE 110 — CANCELAMENTO

O usuário poderá cancelar operações demoradas.

```text
[ CANCELAR SIMULAÇÃO ]
```

O estado anterior permanecerá intacto até que a simulação seja confirmada.

---

# PARTE 111 — TRANSAÇÕES

Alterações críticas deverão funcionar de maneira transacional.

Fluxo:

```text
Estado anterior
        ↓
Simulação
        ↓
Validação
        ↓
Resultado
        ↓
Commit
```

Se falhar:

```text
Rollback automático
```

---

# PARTE 112 — SIMULAÇÃO PREVIEW

Antes de aplicar:

```text
PREVIEW DA SIMULAÇÃO

Eventos afetados: 23
Dimensões afetadas: 2
Viajantes afetados: 1
Paradoxos previstos: 1

Integridade:
92% → 61%

[ APLICAR ] [ CANCELAR ]
```

Isso será importante para impedir alterações acidentais.

---

# PARTE 113 — LINHA TEMPORAL ORIGINAL

O sistema deverá sempre manter uma referência ao estado original.

```text
Original
↓
Alterações
↓
Estado atual
```

Isso permite comparar o antes/depois.

---

# PARTE 114 — COMPARADOR TEMPORAL

Interface:

```text
┌─────────────────┬─────────────────┐
│ ORIGINAL        │ ATUAL           │
├─────────────────┼─────────────────┤
│ Evento A        │ Evento A        │
│ Evento B        │ Evento B        │
│ Evento C        │ [REMOVIDO]      │
│ Evento D        │ Evento X        │
└─────────────────┴─────────────────┘
```

---

# PARTE 115 — SISTEMA DE FILA

Eventos afetados serão processados através de uma fila.

```text
Queue<EventId>
```

Isso ajudará a controlar propagação.

---

# PARTE 116 — DETECÇÃO DE CICLOS

O sistema deverá possuir detecção de ciclos.

```text
A → B → C → A
```

Dependendo do contexto, poderá ser:

* paradoxo;
* loop causal;
* ciclo permitido;
* ciclo proibido.

As regras deverão ser configuráveis.

---

# PARTE 117 — GRAU DE INFLUÊNCIA

Cada evento poderá possuir:

```ts
influenceScore: number;
```

Eventos importantes influenciarão mais elementos.

Exemplo:

```text
Importância:
95/100
```

Alterar esse evento poderá afetar muito mais a integridade.

---

# PARTE 118 — EVENTOS FIXOS

O sistema poderá permitir:

```text
EVENTO FIXO
```

Eventos fixos não podem ser alterados normalmente.

Exemplo:

```text
"Evento fundamental"
```

Ao tentar modificar:

```text
⚠ Este evento é considerado uma âncora temporal.
```

---

# PARTE 119 — ÂNCORAS TEMPORAIS

Uma âncora será um evento extremamente resistente a alterações.

```ts
anchor: boolean;
```

Isso criará maior profundidade na simulação.

---

# PARTE 120 — NÍVEL DE DIVERGÊNCIA

Cada realidade poderá possuir:

```text
Divergence Score
```

Exemplo:

```text
Divergência:
73%
```

Quanto maior, maior a distância em relação à linha original.

---

# PARTE 121 — MÉTRICAS DA REALIDADE

Painel:

```text
INTEGRIDADE        81%
DIVERGÊNCIA        34%
PARADOXOS           2
EVENTOS           184
DIMENSÕES            4
VIAJANTES            7
```

---

# PARTE 122 — DASHBOARD ANALÍTICO

Além do mapa, poderá existir uma visão analítica.

Gráficos:

* integridade ao longo do tempo;
* quantidade de alterações;
* quantidade de paradoxos;
* eventos mais influentes;
* dimensões mais instáveis.

---

# PARTE 123 — LOG DE EVENTOS

Terminal visual:

```text
[17:42:08] EVT-039 alterado
[17:42:08] Propagação iniciada
[17:42:09] EVT-042 afetado
[17:42:09] EVT-053 colapsou
[17:42:09] V-002 origem comprometida
[17:42:09] PARADOXO DO AVÔ DETECTADO
```

Esse terminal reforçará a sensação de sistema científico.

---

# PARTE 124 — CONSOLE DE SIMULAÇÃO

Uma interface técnica opcional poderá mostrar:

```text
> simulation.start()

> propagation.nodes = 24

> causal.conflicts = 3

> paradox.scan()

> grandfather_paradox = TRUE

> integrity = 42%

> simulation.complete()
```

---

# PARTE 125 — EXPERIÊNCIA DO USUÁRIO

O fluxo principal deverá ser:

```text
Entrar
 ↓
Criar universo
 ↓
Criar dimensão
 ↓
Criar eventos
 ↓
Conectar eventos
 ↓
Criar viajante
 ↓
Realizar viagem
 ↓
Alterar passado
 ↓
Executar simulação
 ↓
Observar propagação
 ↓
Detectar consequências
 ↓
Analisar paradoxos
 ↓
Salvar / ramificar
```

---

# PARTE 126 — MVP

O MVP deverá obrigatoriamente possuir:

### Núcleo

* grafo temporal;
* eventos;
* conexões;
* propagação;
* alteração de eventos;
* integridade.

### Viagem

* criação de viajante;
* viagem temporal;
* viagem dimensional básica.

### Paradoxos

* paradoxo do avô;
* detecção de ciclos;
* alertas.

### Interface

* mapa D3;
* painel de evento;
* painel de viajantes;
* painel de paradoxos;
* painel de integridade.

### Persistência

* salvar universo;
* carregar universo;
* histórico;
* undo/redo.

---

# PARTE 127 — VERSÃO 2

Após o MVP:

* ramificações;
* multiverso;
* comparação de dimensões;
* snapshots;
* exportação;
* modo apresentação;
* analytics;
* command palette;
* atalhos.

---

# PARTE 128 — VERSÃO 3

Posteriormente:

* colaboração;
* compartilhamento;
* IA;
* simulações avançadas;
* biblioteca pública de universos;
* desafios;
* rankings opcionais;
* geração procedural de universos;
* API pública.

---

# PARTE 129 — EXEMPLO DE SIMULAÇÃO

Universo:

```text
Ω-01
```

Eventos:

```text
E1 — Nascimento de Alex — 2000
E2 — Descoberta científica — 2020
E3 — Máquina temporal — 2050
E4 — Primeira viagem — 2060
```

Relações:

```text
E1 → E2
E2 → E3
E3 → E4
```

Viajante:

```text
Alex
Origem: 2060
```

Viagem:

```text
2060 → 1990
```

Alteração:

```text
Alex impede um acontecimento necessário para E1.
```

O sistema calcula:

```text
E1 inválido
↓
origem de Alex inválida
↓
Alex não deveria existir
↓
paradoxo
```

Resultado:

```text
🔴 PARADOXO DO AVÔ

Integridade:
100% → 38%

Eventos afetados:
19

Viajantes afetados:
1
```

---

# PARTE 130 — EXPERIÊNCIA VISUAL DESSE EXEMPLO

A linha deverá começar:

```text
●──────●──────●──────●
2000   2020   2050   2060
```

Após a alteração:

```text
●──────×──────⚠──────🔴
2000   2020   2050   2060
```

A conexão causal também deverá mudar visualmente.

---

# PARTE 131 — REGRAS DE NEGÓCIO

### Regra 01

Nenhum evento poderá apontar para um evento inexistente.

### Regra 02

Uma viagem deverá possuir origem e destino válidos.

### Regra 03

Um viajante deverá possuir dimensão de origem.

### Regra 04

Toda alteração deverá gerar uma ação no histórico.

### Regra 05

Todo paradoxo deverá possuir origem rastreável.

### Regra 06

O estado da integridade nunca deverá ser atualizado manualmente pela interface.

O motor será responsável por calculá-lo.

---

# PARTE 132 — INTEGRIDADE DO MOTOR

A interface nunca deverá possuir regra como:

```ts
integrity -= 20;
```

A regra deverá estar no domínio.

Exemplo:

```ts
integrityEngine.calculate({
  affectedEvents,
  causalConflicts,
  paradoxes,
  travelerConflicts
});
```

Isso evita lógica duplicada.

---

# PARTE 133 — CONTRATOS DE DOMÍNIO

Todos os cálculos importantes deverão possuir interfaces e tipos fortes em TypeScript.

Objetivo:

```text
menos erros
mais previsibilidade
mais facilidade de manutenção
```

Evitar:

```ts
any
```

no núcleo do simulador.

---

# PARTE 134 — LOGGING

No desenvolvimento:

```text
DEBUG
INFO
WARN
ERROR
CRITICAL
```

Na produção, logs detalhados deverão poder ser desativados.

---

# PARTE 135 — TRATAMENTO DE ERROS

A interface não deverá apresentar erros técnicos incompreensíveis.

Em vez de:

```text
Cannot read properties of undefined
```

mostrar:

```text
Não foi possível completar a simulação.

A estrutura temporal contém uma relação inválida.

[ VER DETALHES ]
```

---

# PARTE 136 — OBSERVABILIDADE

Erros graves deverão possuir:

```text
simulationId
universeId
eventId
timestamp
engineVersion
```

para facilitar diagnóstico.

---

# PARTE 137 — VERSIONAMENTO DO MOTOR

Como as regras matemáticas poderão evoluir:

```ts
engineVersion: "1.0.0"
```

deverá ser armazenada junto aos universos.

Isso evita incompatibilidade futura.

---

# PARTE 138 — MIGRAÇÕES

O banco deverá possuir migrações para alterações no modelo.

Nunca alterar a estrutura de produção manualmente sem migração.

---

# PARTE 139 — SEGURANÇA DE DADOS

O usuário somente poderá acessar universos autorizados.

Nenhum `universeId` enviado pelo navegador deverá ser considerado confiável.

O servidor deverá verificar:

```text
usuário → permissão → universo
```

---

# PARTE 140 — UX DE CONFIRMAÇÃO

Ações destrutivas deverão pedir confirmação:

* apagar evento;
* apagar dimensão;
* resetar universo;
* excluir universo;
* remover viajante.

---

# PARTE 141 — PERFORMANCE VISUAL

D3 deverá evitar criar milhares de elementos DOM individuais quando não for necessário.

Para grafos muito grandes, deverá ser considerada a utilização de:

```text
SVG
```

para escalas menores e alternativas de renderização mais eficientes para universos grandes.

---

# PARTE 142 — LAZY LOADING

Módulos pesados poderão ser carregados somente quando necessários.

Exemplo:

```text
Analytics
Exportação
Editor avançado
```

---

# PARTE 143 — BANCO LOCAL + NUVEM

Estrutura recomendada:

```text
Local simulation
      ↓
IndexedDB
      ↓
Sincronização
      ↓
PostgreSQL
```

Isso torna o editor mais resistente a perda de conexão.

---

# PARTE 144 — AUTOSSALVAMENTO

Após alterações:

```text
debounce 500–1500 ms
```

e então sincronizar.

Evitar enviar uma requisição para cada movimento visual do usuário.

---

# PARTE 145 — MOVIMENTO DOS NÓS

A posição visual dos eventos não deverá alterar sua posição temporal lógica.

Separar:

```ts
timestamp
```

de:

```ts
visualPosition
```

---

# PARTE 146 — RECONSTRUÇÃO DO GRAFO

A posição poderá ser recalculada automaticamente.

Exemplo:

```text
Layout Temporal
```

ou manualmente:

```text
Layout Livre
```

---

# PARTE 147 — MODO EDITOR LIVRE

O usuário poderá mover eventos visualmente sem mudar suas datas.

Esse comportamento deverá ser claramente separado de alterações temporais.

---

# PARTE 148 — MODO CIENTÍFICO

Poderá existir uma camada técnica opcional:

```text
Mostrar IDs
Mostrar pesos
Mostrar dependências
Mostrar ciclos
Mostrar matriz causal
```

---

# PARTE 149 — MATRIZ CAUSAL

Futuramente:

```text
       A  B  C  D
A      0  1  0  0
B      0  0  1  0
C      0  0  0  1
D      0  0  0  0
```

Isso atenderá usuários interessados no aspecto matemático.

---

# PARTE 150 — DOCUMENTAÇÃO INTERNA

O código deverá possuir documentação para:

* estruturas de dados;
* algoritmo de propagação;
* regras de paradoxos;
* cálculo de integridade;
* sistema dimensional.

---

# PARTE 151 — DEFINIÇÃO DE PRONTO

Uma funcionalidade somente será considerada pronta quando:

1. estiver implementada;
2. possuir tratamento de erros;
3. possuir testes;
4. possuir estado de loading;
5. possuir estado vazio;
6. possuir feedback visual;
7. funcionar em desktop;
8. não quebrar as simulações existentes.

---

# PARTE 152 — CRITÉRIOS DE ACEITE DO MVP

O MVP estará aprovado quando o usuário conseguir:

```text
Criar universo
       ↓
Criar dimensão
       ↓
Criar 10+ eventos
       ↓
Conectar eventos
       ↓
Criar viajante
       ↓
Viajar para o passado
       ↓
Alterar evento
       ↓
Executar propagação
       ↓
Detectar paradoxo
       ↓
Visualizar cadeia causal
       ↓
Ver integridade mudar
       ↓
Salvar
       ↓
Fechar
       ↓
Abrir novamente
       ↓
Encontrar universo intacto
```

---

# PARTE 153 — CRITÉRIOS VISUAIS

A aplicação será considerada visualmente aprovada quando:

* o mapa for o elemento central;
* as relações causais forem claramente visíveis;
* paradoxos forem imediatamente perceptíveis;
* o usuário conseguir identificar a dimensão atual;
* integridade estiver sempre acessível;
* o visual transmitir sensação de sistema temporal avançado;
* a estética cósmica não comprometer legibilidade;
* animações não prejudicarem navegação.

---

# PARTE 154 — CRITÉRIOS TÉCNICOS

O sistema deverá:

* utilizar TypeScript no núcleo;
* utilizar D3.js na visualização;
* possuir tipos fortes;
* possuir testes para o motor;
* suportar persistência;
* permitir rollback;
* detectar ciclos;
* detectar paradoxo do avô;
* separar domínio de apresentação;
* permitir execução do motor sem a UI.

---

# PARTE 155 — ROADMAP

## FASE 01 — Fundação

```text
Setup
Arquitetura
Design system
Modelos
Estado
```

---

## FASE 02 — Motor

```text
Graph Engine
Propagation Engine
Integrity Engine
Paradox Engine
```

---

## FASE 03 — Visualização

```text
D3 Timeline
Nodes
Edges
Zoom
Pan
Selection
```

---

## FASE 04 — Editor

```text
Events
Dimensions
Travelers
Connections
```

---

## FASE 05 — Simulação

```text
Temporal travel
Dimensional travel
Propagation
Paradox detection
```

---

## FASE 06 — Persistência

```text
API
Database
Autosave
Snapshots
History
```

---

## FASE 07 — Refinamento

```text
Animations
Accessibility
Performance
Responsive
Error handling
```

---

# PARTE 156 — FUTURO DO PRODUTO

Depois de consolidado, o Painel do Paradoxo Temporal poderá evoluir de um simulador para uma plataforma.

Possíveis módulos:

```text
Biblioteca de universos
Universos compartilhados
Desafios temporais
Experimentos
Modo multiplayer
Competições
API
Plugins
IA
Simulações procedurais
```

---

# PARTE 157 — DIFERENCIAL

O principal diferencial do produto não será simplesmente possuir uma linha do tempo bonita.

O diferencial será:

> **A linha do tempo reage ao usuário.**

Cada evento possui dependências.

Cada alteração pode gerar consequências.

Cada consequência pode gerar conflitos.

Cada conflito pode gerar paradoxos.

E cada paradoxo altera o estado geral da realidade.

---

# PARTE 158 — VISÃO FINAL DO PRODUTO

A aplicação deverá parecer um sistema operacional científico construído para monitorar o tecido do espaço-tempo.

Ao abrir o sistema, o usuário deverá sentir que está entrando em um:

```text
CENTRO DE CONTROLE TEMPORAL
```

No centro estará o universo.

Ao redor dele:

```text
DIMENSÕES
VIAJANTES
PARADOXOS
INTEGRIDADE
HISTÓRICO
SIMULAÇÃO
```

O usuário cria um evento.

Cria outro.

Relaciona ambos.

Cria um viajante.

Envia o viajante ao passado.

Altera um acontecimento.

E então observa o sistema reagir:

```text
ALTERAÇÃO DETECTADA
        ↓
PROPAGAÇÃO INICIADA
        ↓
17 EVENTOS AFETADOS
        ↓
2 DIMENSÕES AFETADAS
        ↓
1 VIAJANTE EM RISCO
        ↓
PARADOXO DETECTADO
        ↓
INTEGRIDADE: 100% → 43%
        ↓
⚠ PARADOXO DO AVÔ
```

Esse é o núcleo da experiência.

---

# PARTE 159 — FRASE DE POSICIONAMENTO

**PAINEL DO PARADOXO TEMPORAL**

### Observe o passado.

### Altere a realidade.

### Enfrente as consequências.

---

# PARTE 160 — DEFINIÇÃO FINAL DO PRODUTO

O **Painel do Paradoxo Temporal** será uma aplicação web interativa de simulação temporal e dimensional baseada em grafos causais.

O sistema deverá permitir que o usuário construa universos, crie acontecimentos, estabeleça relações de causalidade, manipule linhas temporais, envie viajantes através do espaço-tempo e observe matematicamente as consequências dessas interferências.

A aplicação deverá transformar alterações abstratas em uma experiência visual clara por meio de D3.js, enquanto o núcleo TypeScript será responsável por toda a lógica de grafos, propagação, consistência causal, integridade temporal e detecção de paradoxos.

O projeto deverá ser desenvolvido de maneira modular para que o simulador possa crescer posteriormente para modelos de multiverso, colaboração, compartilhamento, IA e simulações extremamente complexas sem exigir a reescrita do núcleo.

**O produto final não deverá ser um simples visualizador de linha do tempo.**

**Deverá ser um simulador vivo de causalidade temporal.**
