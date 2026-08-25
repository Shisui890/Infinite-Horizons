# PRD — MELHORIAS

## PAINEL DO PARADOXO TEMPORAL

### Documento de evolução do produto

**Produto:** Painel do Paradoxo Temporal
**Documento:** Melhorias e Expansões
**Versão:** 1.0
**Status:** Planejamento
**Aplicação:** Web
**Base:** PRD principal do Painel do Paradoxo Temporal

---

# 1. OBJETIVO DESTE DOCUMENTO

Este documento define as melhorias que deverão ser incorporadas ao projeto principal para ampliar sua profundidade técnica, visual e de utilização.

As funcionalidades aqui descritas não substituem os requisitos do PRD principal.

Elas funcionam como uma camada de evolução.

O objetivo é fazer com que o sistema deixe de ser apenas:

> "um grafo que detecta paradoxos"

e evolua para:

> **um ambiente completo de experimentação temporal e interdimensional.**

---

# 2. PRINCÍPIOS DAS MELHORIAS

Todas as novas funcionalidades deverão respeitar os seguintes princípios:

### 2.1. Não comprometer o núcleo

As melhorias não poderão criar dependências desnecessárias entre interface e motor de simulação.

### 2.2. Ser modulares

Cada novo sistema deverá poder ser desenvolvido, testado e desativado independentemente.

### 2.3. Preservar o desempenho

Experimentos complexos não poderão bloquear a interface.

### 2.4. Priorizar entendimento

Mesmo funcionalidades matematicamente complexas deverão possuir representação visual compreensível.

### 2.5. Preservar o caráter experimental

O usuário deverá sentir que está realizando experimentos em uma realidade simulada.

---

# 3. MELHORIA 01 — MODO MÁQUINA DO TEMPO

## 3.1. Conceito

Adicionar um controle temporal global que permita navegar pelo universo como se o usuário estivesse observando diferentes momentos da realidade.

---

## 3.2. Interface

Na parte inferior do mapa:

```text
1900      1950      2000      2050      2100      2150
──────────●─────────●──────────●─────────●──────────●
                               ▲
                           PRESENTE
```

O usuário poderá arrastar o cursor.

---

## 3.3. Comportamento

Ao mover o cursor:

1. identificar o instante selecionado;
2. reconstruir o estado daquele momento;
3. atualizar eventos visíveis;
4. atualizar viajantes presentes;
5. atualizar indicadores;
6. recalcular a representação da dimensão.

---

## 3.4. Modos

### Histórico

Visualiza acontecimentos passados.

### Presente

Mostra a situação atual.

### Futuro

Exibe acontecimentos previstos ou já existentes.

### Livre

Permite navegar para qualquer ponto da escala.

---

# 4. MELHORIA 02 — REPLAY TEMPORAL

## 4.1. Conceito

Permitir que o usuário reproduza uma alteração como uma sequência temporal animada.

---

## 4.2. Exemplo

```text
EVENTO ALTERADO
       ↓
PROPAGAÇÃO
       ↓
EVENTO 02
       ↓
EVENTO 03
       ↓
RAMIFICAÇÃO
       ↓
PARADOXO
       ↓
QUEDA DA INTEGRIDADE
```

---

## 4.3. Controles

```text
◀
▶
▶▶
⏸
⟳
```

Com velocidade:

```text
0.5x
1x
2x
5x
10x
```

---

## 4.4. Benefício

O usuário não apenas verá o resultado.

Ele poderá **assistir à cadeia causal sendo formada**.

---

# 5. MELHORIA 03 — EFEITO BORBOLETA

## 5.1. Objetivo

Criar um mecanismo para medir o impacto de uma alteração.

---

## 5.2. Métrica

```ts
interface ButterflyImpact {
  directEffects: number;
  indirectEffects: number;
  affectedDimensions: number;
  affectedTravelers: number;
  affectedAnchors: number;

  totalScore: number;
}
```

---

## 5.3. Exibição

```text
IMPACTO DA ALTERAÇÃO

Diretos                 6
Indiretos              31
Dimensões afetadas      3
Viajantes afetados      2

IMPACT SCORE

█████████████████░░ 87%
```

---

# 6. MELHORIA 04 — SISTEMA DE ÂNCORAS TEMPORAIS

## 6.1. Conceito

Alguns eventos poderão ser classificados como fundamentais para uma realidade.

Esses eventos serão chamados de:

**Âncoras Temporais.**

---

## 6.2. Características

Uma âncora poderá possuir:

```text
Estabilidade
Resistência
Importância
Dependências
```

---

## 6.3. Exemplo

```text
⚓ ÂNCORA TEMPORAL

Evento:
Primeiro contato interdimensional

Resistência:
94%

Alteração:
Tentativa 03

Resultado:
REALIDADE CORRIGIU O EVENTO
```

---

## 6.4. Comportamento

Quando uma âncora sofrer alteração:

1. calcular resistência;
2. calcular consequências;
3. determinar se a mudança permanece;
4. determinar se ocorre autocorreção;
5. determinar se ocorre ramificação;
6. atualizar integridade.

---

# 7. MELHORIA 05 — AUTOCORREÇÃO TEMPORAL

## 7.1. Conceito

Universos poderão possuir uma propriedade chamada:

**Autocorreção.**

Quando uma alteração ameaça uma âncora ou estrutura fundamental, o sistema poderá tentar encontrar uma forma alternativa de manter o acontecimento.

---

## 7.2. Exemplo

O usuário tenta impedir um evento.

A realidade responde:

```text
ALTERAÇÃO DETECTADA

Evento essencial ameaçado.

Buscando continuidade causal...

████████████████ 100%

RESULTADO:
Evento preservado através de causalidade alternativa.
```

---

## 7.3. Resultado

Possíveis resultados:

```text
PRESERVED
ALTERED
BRANCHED
COLLAPSED
PARADOX
```

---

# 8. MELHORIA 06 — MODELOS TEMPORAIS CONFIGURÁVEIS

O usuário poderá escolher o comportamento da realidade.

---

## 8.1. Linha Única

```text
A → B → C → D
```

As alterações modificam a realidade atual.

---

## 8.2. Ramificação

```text
A → B
    ├── C
    └── D
```

Alterações criam novas linhas.

---

## 8.3. Multiverso

Cada realidade possui sua própria estrutura.

---

## 8.4. Autocorretivo

Eventos fundamentais tendem a ser preservados.

---

## 8.5. Probabilístico

As consequências possuem probabilidades.

---

# 9. MELHORIA 07 — MOTOR PROBABILÍSTICO

## 9.1. Objetivo

Permitir experimentos em que uma alteração possa produzir múltiplos resultados possíveis.

---

## 9.2. Exemplo

```text
ALTERAÇÃO:

Remover evento EVT-021
```

Resultados:

```text
Cenário A — 61%
Cenário B — 22%
Cenário C — 11%
Cenário D — 6%
```

---

## 9.3. Interface

```text
FUTUROS POSSÍVEIS

A █████████████████ 61%

B ███████ 22%

C ███ 11%

D ██ 6%
```

---

# 10. MELHORIA 08 — SIMULAÇÃO MONTE CARLO

Para o modo probabilístico, o sistema poderá executar múltiplas simulações independentes.

Exemplo:

```text
Simulações executadas:
10.000

Resultados:

Futuro A: 5.924
Futuro B: 2.186
Futuro C: 1.142
Futuro D: 748
```

A implementação deverá utilizar Web Workers ou processamento no servidor para evitar travamento da interface.

---

# 11. MELHORIA 09 — FUTUROS POSSÍVEIS

Ao selecionar um ponto temporal, o sistema poderá calcular futuros possíveis.

```text
                 PRESENTE
                     │
             ┌───────┼───────┐
             ↓       ↓       ↓
           FUTURO A FUTURO B FUTURO C
```

Cada futuro possuirá:

* integridade;
* divergência;
* número de paradoxos;
* eventos principais;
* viajantes;
* risco.

---

# 12. MELHORIA 10 — MAPA DE CALOR CAUSAL

Adicionar visualização de intensidade.

Eventos com grande influência possuirão maior destaque.

Exemplo conceitual:

```text
●
  ●
    █ EVENTO CRÍTICO
      ●
       ●
```

O usuário poderá ativar:

**Mapa de influência causal**

---

# 13. MELHORIA 11 — INVESTIGAÇÃO DE PARADOXO

Todo paradoxo deverá poder ser investigado.

Botão:

```text
[ INVESTIGAR PARADOXO ]
```

---

## 13.1. Resultado

```text
PARADOXO DO AVÔ

ORIGEM
↓
VIAGEM
↓
INTERVENÇÃO
↓
EVENTO ALTERADO
↓
DEPENDÊNCIA ROMPIDA
↓
ORIGEM INVALIDADA
↓
CONTRADIÇÃO
```

---

# 14. MELHORIA 12 — GRAFO DA CAUSA DO PARADOXO

Ao investigar, somente os nós envolvidos no paradoxo deverão ser enfatizados.

Os demais poderão ficar visualmente reduzidos.

Isso criará um:

**Paradox Focus Mode**

---

# 15. MELHORIA 13 — DETECTOR DE LOOP CAUSAL

O sistema deverá identificar ciclos.

```text
A → B → C
↑       ↓
└───────┘
```

---

## 15.1. Explicação

Em vez de simplesmente emitir erro:

> "Ciclo detectado."

o sistema deverá explicar:

> **Loop causal encontrado.**
>
> C depende de A, porém A só pode existir porque C ocorre.

---

# 16. MELHORIA 14 — DETECTOR DE INFORMAÇÃO SEM ORIGEM

O sistema deverá detectar quando uma informação aparece no universo sem uma origem causal identificável.

Exemplo:

```text
Futuro
 ↓
informação
 ↓
passado
 ↓
informação utilizada
 ↓
futuro
```

O sistema classificará como:

**Bootstrap Causal**

---

# 17. MELHORIA 15 — SISTEMA DE VERSÕES DOS VIAJANTES

Um mesmo viajante poderá possuir várias instâncias.

```text
V-001
├── V-001-A
├── V-001-B
└── V-001-C
```

Cada uma poderá possuir:

* dimensão;
* origem;
* estado;
* histórico.

---

# 18. MELHORIA 16 — CONFLITO ENTRE DUPLICATAS

Caso duas versões temporalmente incompatíveis apareçam:

```text
V-001-A
      +
V-001-B
      ↓
CONFLITO DE IDENTIDADE
```

O sistema deverá alertar:

```text
⚠ DUPLICAÇÃO TEMPORAL
```

---

# 19. MELHORIA 17 — SISTEMA DE REGRAS DO UNIVERSO

Cada universo poderá possuir regras próprias.

Exemplo:

```text
REGRAS

[✓] Ramificações permitidas
[✓] Viagens dimensionais
[✓] Paradoxos reduzem integridade
[ ] Eventos-âncora podem ser destruídos
[✓] Autocorreção
[ ] Duplicatas são permitidas
```

---

# 20. MELHORIA 18 — EDITOR DE REGRAS

Criar uma interface dedicada:

```text
REGRAS DA REALIDADE

Modelo temporal:
[ Multiverso ]

Autocorreção:
[ 78% ]

Resistência das âncoras:
[ 90% ]

Paradoxos:
[ Reduzem integridade ]

Duplicatas:
[ Permitidas ]
```

---

# 21. MELHORIA 19 — SIMULAÇÃO SEGURA

Antes de aplicar uma alteração significativa:

```text
PRÉ-VISUALIZAÇÃO DA ALTERAÇÃO

Eventos afetados: 54
Dimensões: 4
Viajantes: 3
Paradoxos previstos: 2

Integridade:
91% → 29%

[ APLICAR ]
[ CANCELAR ]
```

---

# 22. MELHORIA 20 — RAMIFICAÇÃO EXPERIMENTAL

O usuário poderá testar uma mudança sem alterar o universo original.

Fluxo:

```text
UNIVERSO ORIGINAL
       ↓
EXPERIMENTO
       ↓
NOVA RAMIFICAÇÃO
```

---

# 23. MELHORIA 21 — MODO LABORATÓRIO

Criar um espaço dedicado a experiências.

Nome:

**Laboratório Temporal**

O usuário poderá:

* criar universos temporários;
* testar alterações;
* comparar resultados;
* executar múltiplos experimentos;
* descartar os resultados.

---

# 24. MELHORIA 22 — DESAFIOS TEMPORAIS

Adicionar uma área de desafios.

Exemplo:

```text
DESAFIO #001

INTEGRIDADE INICIAL:
27%

OBJETIVO:
Restaurar para 80%.

RESTRIÇÕES:
Não apagar o viajante.

TEMPO:
Livre
```

---

# 25. MELHORIA 23 — SISTEMA DE OBJETIVOS

Cada desafio possuirá objetivos.

```text
OBJETIVOS

✓ Reduzir paradoxos para 0
○ Integridade > 80%
○ Manter V-001
○ Não criar nova dimensão
```

---

# 26. MELHORIA 24 — PONTUAÇÃO DE EXPERIMENTO

O sistema poderá calcular uma pontuação.

```text
PRECISÃO
EFICIÊNCIA
INTEGRIDADE
PARADOXOS
ALTERAÇÕES
```

Exemplo:

```text
RESULTADO

Temporal Score:
9.420
```

Essa mecânica deverá ser opcional e não interferir no simulador principal.

---

# 27. MELHORIA 25 — MODO OBSERVADOR

Permitir observar uma simulação sem poder alterar nada.

Útil para:

* apresentações;
* aulas;
* demonstrações;
* compartilhamento.

---

# 28. MELHORIA 26 — MODO APRESENTAÇÃO AVANÇADO

Tela limpa:

```text
UNIVERSO Ω-07

INTEGRIDADE
████████████░░ 73%

PARADOXOS
02

DIVERGÊNCIA
48%
```

O mapa ocupará praticamente toda a tela.

---

# 29. MELHORIA 27 — COMPARTILHAMENTO DE EXPERIMENTOS

Cada experimento poderá receber um identificador:

```text
TP-8F4A-91C2
```

O usuário poderá compartilhar esse código.

---

# 30. MELHORIA 28 — LINK DIRETO

Exemplo:

```text
/app/experiment/TP-8F4A-91C2
```

Ao acessar, o experimento poderá ser aberto automaticamente.

---

# 31. MELHORIA 29 — EXPORTAÇÃO DO EXPERIMENTO

Formatos:

```text
JSON
SVG
PNG
PDF
```

---

# 32. MELHORIA 30 — RELATÓRIO AUTOMÁTICO

Gerar relatório:

```text
RELATÓRIO DA SIMULAÇÃO

Universo:
Ω-07

Alteração:
EVT-042 removido

Eventos afetados:
73

Paradoxos:
2

Integridade:
94% → 31%

Dimensões:
4

Viajantes:
3

Conclusão:
Colapso temporal crítico.
```

---

# 33. MELHORIA 31 — MODO CIENTÍFICO

Adicionar informações técnicas ao mapa:

```text
NÓ:
EVT-042

GRAU:
17

DEPENDÊNCIAS:
12

CENTRALIDADE:
0.82

INFLUÊNCIA:
94

PESO TEMPORAL:
0.61
```

---

# 34. MELHORIA 32 — MATRIZ CAUSAL

Visualização opcional:

```text
     A B C D E
A    0 1 0 0 1
B    0 0 1 0 0
C    0 0 0 1 0
D    0 0 0 0 1
E    0 0 0 0 0
```

Essa ferramenta será destinada principalmente a usuários interessados na parte matemática.

---

# 35. MELHORIA 33 — ÍNDICE DE PARADOXO

Além da integridade:

```text
INTEGRIDADE TEMPORAL
██████████████░░ 73%

RISCO DE PARADOXO
████████████████░ 84%

DIVERGÊNCIA
████████░░░░░░░░ 42%
```

---

# 36. MELHORIA 34 — RISCO FUTURO

O motor poderá estimar se uma realidade está caminhando para um colapso.

```text
RISCO TEMPORAL

Atual:
63%

Tendência:
↑ aumentando

Previsão:
Colapso provável em 14 eventos.
```

Esse valor deverá ser apresentado como estimativa do modelo, não como certeza.

---

# 37. MELHORIA 35 — EVENTOS INFLUENTES

Criar ranking:

```text
EVENTOS MAIS INFLUENTES

01 — EVT-002       97%
02 — EVT-041       91%
03 — EVT-019       88%
04 — EVT-092       74%
```

Ao clicar, o sistema deverá destacar suas consequências.

---

# 38. MELHORIA 36 — BUSCA INTELIGENTE

A busca deverá aceitar:

```text
"eventos após 2050"
"paradoxos críticos"
"viajantes em Ω-02"
"eventos afetados por EVT-042"
```

Inicialmente poderá ser implementada como busca estruturada.

Interpretação por linguagem natural poderá ser adicionada posteriormente.

---

# 39. MELHORIA 37 — COMMAND PALETTE AVANÇADO

Atalho:

```text
CTRL + K
```

Com comandos:

```text
Criar evento
Criar viajante
Viajar
Criar dimensão
Criar ramificação
Investigar paradoxo
Executar simulação
Abrir laboratório
Comparar universos
Exportar
```

---

# 40. MELHORIA 38 — TERMINAL TEMPORAL

Adicionar um console visual opcional.

Exemplo:

```text
> timeline.inspect("EVT-042")

EVENT:
EVT-042

> simulation.propagate()

Affected nodes: 32

> paradox.scan()

GrandfatherParadox: TRUE

> universe.integrity()

42.8%
```

---

# 41. MELHORIA 39 — SISTEMA DE EXPERIMENTOS SALVOS

Cada experiência poderá ser armazenada.

```text
MEUS EXPERIMENTOS

Experimento 01
Experimento 02
Experimento 03
Experimento 04
```

Cada um possuirá:

* nome;
* data;
* universo;
* objetivo;
* resultado;
* integridade final.

---

# 42. MELHORIA 40 — COMPARAÇÃO DE EXPERIMENTOS

Permitir:

```text
Experimento A
VS
Experimento B
```

Comparar:

```text
Integridade
Paradoxos
Eventos
Dimensões
Viajantes
Divergência
```

---

# 43. MELHORIA 41 — CLONAGEM DE EXPERIMENTO

Botão:

```text
[ DUPLICAR EXPERIMENTO ]
```

Criará uma cópia independente.

---

# 44. MELHORIA 42 — HISTÓRICO VISUAL

Em vez de somente um log:

```text
ALTERAÇÕES

● Criado EVT-001
│
● Criado EVT-002
│
● Criado V-001
│
● Viagem temporal
│
● Alteração EVT-004
│
🔴 Paradoxo
```

---

# 45. MELHORIA 43 — RESTAURAÇÃO VISUAL

O usuário poderá selecionar uma versão histórica:

```text
RESTaurar para:

17:31
17:32
17:35
17:41
17:42
```

---

# 46. MELHORIA 44 — SISTEMA DE CHECKPOINTS

O usuário poderá manualmente marcar:

```text
[ CRIAR CHECKPOINT ]
```

Exemplo:

```text
Checkpoint:
"Antes da viagem de Chronos"
```

---

# 47. MELHORIA 45 — SISTEMA DE EVENTOS FIXOS

Eventos podem ser classificados:

```text
NORMAL
IMPORTANTE
CRÍTICO
ÂNCORA
ABSOLUTO
```

Quanto maior o nível, maior sua resistência à alteração.

---

# 48. MELHORIA 46 — EVENTO ABSOLUTO

Um evento absoluto representará um acontecimento que o modelo atual considera praticamente impossível de remover.

Ao tentar modificá-lo:

```text
⚠ EVENTO ABSOLUTO

O motor considera este acontecimento fundamental à estrutura atual do universo.
```

---

# 49. MELHORIA 47 — DIVERGÊNCIA ENTRE REALIDADES

Cada dimensão terá:

```text
Divergence Score
```

Exemplo:

```text
Ω-01 → referência
Ω-02 → 12%
Ω-03 → 44%
Ω-04 → 88%
```

---

# 50. MELHORIA 48 — COMPARADOR DE REALIDADES

Selecionar duas dimensões:

```text
Ω-01
VS
Ω-04
```

Mostrar:

```text
Eventos compartilhados: 82

Eventos diferentes: 131

Pontos de divergência: 7

Paradoxos exclusivos: 3
```

---

# 51. MELHORIA 49 — PONTOS DE FUSÃO

Futuramente, dimensões poderão ser fundidas.

```text
Ω-02
  \
   → Ω-X
  /
Ω-03
```

O sistema deverá analisar conflitos antes da fusão.

---

# 52. MELHORIA 50 — CONFLITO DIMENSIONAL

Quando duas realidades forem incompatíveis:

```text
⚠ CONFLITO INTERDIMENSIONAL

Eventos incompatíveis:
17

Viajantes duplicados:
2

Paradoxos potenciais:
4
```

---

# 53. MELHORIA 51 — SISTEMA DE CAMADAS

O mapa poderá possuir layers:

```text
☑ Eventos
☑ Causalidade
☑ Viajantes
☑ Dimensões
☑ Paradoxos
☑ Influência
☑ Âncoras
☐ Estatísticas
```

---

# 54. MELHORIA 52 — FILTRO DE PARADOXOS

Permitir visualizar somente:

```text
Todos
Avô
Bootstrap
Predestinação
Loop
Dimensional
Críticos
```

---

# 55. MELHORIA 53 — ALERTA PROGRESSIVO

Os alertas não deverão surgir sempre como popups invasivos.

Escalonamento:

```text
Nível 1:
Badge

Nível 2:
Toast

Nível 3:
Painel de alerta

Nível 4:
Modo crítico

Nível 5:
Colapso
```

---

# 56. MELHORIA 54 — EVENTOS EM COLAPSO

Um evento entrando em colapso deverá possuir animação específica.

Visual:

```text
ESTÁVEL
↓
INSTÁVEL
↓
FRATURADO
↓
COLAPSADO
```

---

# 57. MELHORIA 55 — LINHAS DE CAUSALIDADE ANIMADAS

Quando uma propagação acontecer:

```text
●━━━━━━●━━━━━━●
        ↑
     propagação
```

A energia visual percorrerá a conexão.

---

# 58. MELHORIA 56 — PORTAIS DIMENSIONAIS

Viagens entre dimensões deverão utilizar uma linguagem visual diferente da viagem temporal.

Temporal:

```text
●────────────●
```

Dimensional:

```text
Ω-01 ●
      ╲
       ╲ ◉
        ╲
         ● Ω-02
```

---

# 59. MELHORIA 57 — TIPOS DE VIAGEM

Adicionar:

```text
Viagem temporal
Viagem dimensional
Viagem temporal + dimensional
Transferência de informação
Transferência de objeto
Transferência de indivíduo
```

---

# 60. MELHORIA 58 — INFORMAÇÃO TEMPORAL

Informações também poderão viajar.

Exemplo:

```text
Mensagem do futuro
        ↓
       1950
        ↓
Descoberta antecipada
```

Isso poderá gerar seus próprios paradoxos.

---

# 61. MELHORIA 59 — OBJETOS TEMPORAIS

Futuramente, objetos poderão viajar.

```ts
interface TemporalObject {
  id: string;
  name: string;

  originTimestamp: number;
  currentTimestamp: number;

  originDimensionId: string;
  currentDimensionId: string;
}
```

Isso permite criar:

* objetos duplicados;
* objetos sem origem;
* objetos enviados antes de serem criados.

---

# 62. MELHORIA 60 — ECOSSISTEMA TEMPORAL

A longo prazo, a aplicação poderá deixar de simular somente eventos.

Ela poderá simular:

```text
Eventos
Pessoas
Objetos
Informações
Dimensões
Civilizações
Tecnologias
```

Tudo conectado pelo grafo causal.

---

# 63. PRIORIDADE DAS MELHORIAS

As melhorias deverão ser divididas em três níveis.

## PRIORIDADE ALTA

Implementar após o MVP:

* Máquina do Tempo;
* Replay;
* Investigação de paradoxos;
* Âncoras;
* Efeito Borboleta;
* Simulação segura;
* Modelos temporais;
* Histórico visual;
* Comparação de realidades.

---

## PRIORIDADE MÉDIA

Depois da estabilização:

* Probabilidade;
* Monte Carlo;
* Futuro possível;
* Desafios;
* Laboratório;
* Terminal;
* Matriz causal;
* Métricas avançadas.

---

## PRIORIDADE BAIXA / FUTURA

Após o produto principal:

* fusão dimensional;
* objetos temporais;
* IA;
* colaboração;
* marketplace/biblioteca de universos;
* APIs externas;
* universos públicos.

---

# 64. ARQUITETURA DAS MELHORIAS

O núcleo deverá evoluir para:

```text
TemporalGraph
      ↓
PropagationEngine
      ↓
ParadoxEngine
      ↓
IntegrityEngine
      ↓
ProbabilityEngine
      ↓
BranchingEngine
      ↓
UniverseRuleEngine
```

---

# 65. NOVOS MÓDULOS

Adicionar:

```text
src/engine/
├── anchors/
├── probability/
├── branching/
├── replay/
├── prediction/
├── rules/
├── divergence/
├── experiments/
└── comparison/
```

---

# 66. NOVOS SERVIÇOS

```text
AnchorService
ProbabilityService
ReplayService
ExperimentService
ComparisonService
PredictionService
RuleService
DivergenceService
```

---

# 67. NOVOS TIPOS

```ts
Paradox
Anchor
Experiment
TemporalRule
ProbabilityOutcome
ReplayFrame
DivergencePoint
FutureScenario
ButterflyImpact
TemporalCheckpoint
```

---

# 68. REQUISITO IMPORTANTE — MODULARIDADE

Nenhuma melhoria poderá assumir que outra melhoria está ativa.

Exemplo:

O sistema deverá funcionar normalmente mesmo sem:

* probabilidades;
* desafios;
* autocorreção;
* objetos temporais.

Isso permitirá implementar o produto por etapas.

---

# 69. REQUISITO DE COMPATIBILIDADE

Universos criados na versão inicial deverão permanecer acessíveis depois da inclusão das melhorias.

Os novos campos deverão possuir valores padrão.

---

# 70. MIGRAÇÃO

Ao abrir um universo antigo:

```text
Universo versão 1.0
       ↓
Migração
       ↓
Universo versão 1.1
```

O sistema não deverá apagar dados existentes.

---

# 71. PERFORMANCE DAS MELHORIAS

Funcionalidades pesadas, como:

* Monte Carlo;
* previsão;
* análise global;
* comparação de universos grandes;

deverão utilizar:

**Web Workers**

ou:

**processamento no servidor.**

---

# 72. EXPERIÊNCIA FINAL

Com essas melhorias, o usuário deverá conseguir realizar uma sequência como:

```text
Criar universo
      ↓
Criar eventos
      ↓
Criar viajante
      ↓
Viajar ao passado
      ↓
Alterar evento
      ↓
Simular sem aplicar
      ↓
Ver Efeito Borboleta
      ↓
Visualizar futuros possíveis
      ↓
Aplicar alteração
      ↓
Propagação
      ↓
Âncora ameaçada
      ↓
Autocorreção
      ↓
Paradoxo detectado
      ↓
Investigar
      ↓
Comparar com realidade original
      ↓
Salvar checkpoint
      ↓
Criar ramificação
      ↓
Comparar universos
```

---

# 73. EXPERIÊNCIA DE "LABORATÓRIO"

A aplicação deverá passar a transmitir a sensação de:

> **Laboratório de realidade.**

O usuário não estará somente olhando uma linha temporal.

Ele estará:

**observando, alterando, testando, comparando e investigando universos.**

---

# 74. RESULTADO ESPERADO

Com a implementação dessas melhorias, o produto deverá alcançar quatro características principais:

### Profundidade

O sistema possui regras e modelos complexos.

### Clareza

O usuário entende visualmente o que aconteceu.

### Experimentação

O usuário pode testar hipóteses.

### Rejogabilidade

Cada alteração pode produzir experiências diferentes.

---

# 75. VISÃO DE LONGO PRAZO

O Painel do Paradoxo Temporal deverá evoluir para uma plataforma na qual o usuário consiga responder perguntas experimentais como:

> "O que acontece se este evento nunca existir?"

> "Qual é a menor alteração capaz de impedir este futuro?"

> "Qual realidade possui maior estabilidade?"

> "Qual acontecimento influencia mais o universo?"

> "É possível impedir esse paradoxo sem apagar o viajante?"

> "Qual futuro apresenta a maior probabilidade?"

> "Quantas realidades podem surgir dessa alteração?"

---

# 76. DEFINIÇÃO FINAL

As melhorias propostas neste documento deverão transformar o projeto de um **editor de linhas temporais** em um:

# LABORATÓRIO DE SIMULAÇÃO TEMPORAL E INTERDIMENSIONAL

O sistema deverá combinar:

```text
GRAFOS
+
CAUSALIDADE
+
SIMULAÇÃO
+
PROBABILIDADE
+
RAMIFICAÇÕES
+
PARADOXOS
+
DIMENSÕES
+
VISUALIZAÇÃO
+
EXPERIMENTAÇÃO
```

O resultado esperado é uma aplicação que não apenas mostra uma realidade, mas permite ao usuário **experimentar diferentes modelos de realidade e observar matematicamente suas consequências.**
