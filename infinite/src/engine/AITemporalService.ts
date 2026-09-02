import type {
  Universe,
  TemporalEvent,
  Paradox,
  AIConfig,
  AIButterflyResult,
  AIUniverseInsight,
  HistoricalResearch,
  AIFutureScenario,
  AIParadoxResolution,
  SimulationLog,
  Dimension,
  ScientificExplanation,
} from '../types/temporal';
import { EventStatus, CausalRelation } from '../types/temporal';
import { SimulationService } from './SimulationService';

const AI_STORAGE_KEY = 'infinite-horizons:ai-config';

function loadInitialConfig(): AIConfig {
  const envProvider = (import.meta.env.VITE_AI_PROVIDER as 'builtin' | 'openrouter' | 'custom_api') || 'openrouter';
  const envEndpoint = import.meta.env.VITE_AI_ENDPOINT || '/api/temporal';
  const envApiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
  const envModel = import.meta.env.VITE_OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

  try {
    const saved = localStorage.getItem(AI_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        provider: parsed.provider || envProvider,
        endpoint: parsed.endpoint || envEndpoint,
        apiKey: parsed.apiKey || envApiKey,
        openRouterModel: parsed.openRouterModel || envModel,
        autoButterflyEnabled: parsed.autoButterflyEnabled !== undefined ? parsed.autoButterflyEnabled : true,
      };
    }
  } catch {
    // Ignore storage parse error
  }

  return {
    provider: envProvider,
    endpoint: envEndpoint,
    apiKey: envApiKey,
    openRouterModel: envModel,
    autoButterflyEnabled: true,
  };
}

export class AITemporalService {
  private static config: AIConfig = loadInitialConfig();
  private static responseCache = new Map<string, { data: unknown; timestamp: number }>();

  public static getConfig(): AIConfig {
    return this.config;
  }

  public static updateConfig(newConfig: Partial<AIConfig>) {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(this.config));
    } catch {
      // Storage quota or error
    }
  }

  /**
   * Extrai e faz parse seguro de JSON retornado por LLMs
   */
  public static extractJson<T>(raw: string): T | null {
    if (!raw) return null;
    try {
      const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      const cleaned = match ? match[0] : raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned) as T;
    } catch {
      return null;
    }
  }

  /**
   * Recupera resposta do cache se válida (< 10 minutos)
   */
  public static getCached<T>(key: string): T | null {
    const cached = this.responseCache.get(key);
    if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
      return cached.data as T;
    }
    return null;
  }

  /**
   * Salva resposta em cache
   */
  public static setCache(key: string, data: unknown) {
    this.responseCache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Testa a conexão com o OpenRouter ou API customizada e mede a latência em milissegundos
   */
  public static async testConnection(): Promise<{ success: boolean; latencyMs: number; message: string }> {
    const startTime = performance.now();
    if (this.config.provider === 'openrouter') {
      if (!this.config.apiKey) {
        return { success: false, latencyMs: 0, message: 'Chave de API do OpenRouter não configurada.' };
      }

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
            'HTTP-Referer': 'https://infinite-horizons.app',
            'X-Title': 'Infinite Horizons Temporal Simulator',
          },
          body: JSON.stringify({
            model: this.config.openRouterModel || 'anthropic/claude-3.5-sonnet',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Ping' }],
          }),
        });

        const latencyMs = Math.round(performance.now() - startTime);

        if (response.ok) {
          return {
            success: true,
            latencyMs,
            message: `Conectado com sucesso ao OpenRouter (${this.config.openRouterModel}) em ${latencyMs}ms.`,
          };
        } else {
          const errData = await response.json().catch(() => ({}));
          const errMsg = (errData as any)?.error?.message || response.statusText;
          return { success: false, latencyMs, message: `Erro HTTP ${response.status}: ${errMsg}` };
        }
      } catch (err: any) {
        const latencyMs = Math.round(performance.now() - startTime);
        return { success: false, latencyMs, message: `Falha de rede ao conectar com OpenRouter: ${err?.message || err}` };
      }
    }

    // Provedor custom_api
    try {
      const endpoint = this.config.endpoint || '/api/temporal';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'ping' }),
      });
      const latencyMs = Math.round(performance.now() - startTime);
      if (response.ok) {
        return { success: true, latencyMs, message: `Servidor Serverless conectado em ${latencyMs}ms.` };
      }
      return { success: false, latencyMs, message: `Endpoint respondeu com status ${response.status}.` };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      return { success: false, latencyMs, message: `Erro ao conectar com endpoint: ${err?.message || err}` };
    }
  }

  /**
   * Realiza pesquisa histórica/científica com OpenRouter, Backend Serverless ou Repositórios Científicos
   */
  public static async researchHistoricalEvent(query: string): Promise<HistoricalResearch> {
    // 1. Conexão direta ao OpenRouter se configurado no frontend
    if (this.config.provider === 'openrouter' && this.config.apiKey) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
            'HTTP-Referer': 'https://infinite-horizons.app',
            'X-Title': 'Infinite Horizons Temporal Simulator',
          },
          body: JSON.stringify({
            model: this.config.openRouterModel || 'anthropic/claude-3.5-sonnet',
            temperature: 0.1,
            messages: [
              {
                role: 'system',
                content:
                  'Você é o Oráculo Científico do Infinite Horizons. Retorne APENAS um objeto JSON com: title, description (detalhando fatos e teorias físicas/históricas reais), year (número), category ("CIENTÍFICO", "OBSERVAÇÃO", "COSMOLOGIA", "FÍSICA TEÓRICA", "HISTÓRICO"), importance (1-100), source (deve citar periódicos acadêmicos reais: arXiv, Physical Review, The Astrophysical Journal, Nature ou Science - NUNCA cite Wikipedia), evidenceKind ("documented_fact" ou "scientific_theory"), confidence (1-100), uncertainty.',
              },
              { role: 'user', content: `Pesquise minuciosamente o tema científico ou histórico com fontes primárias: "${query}"` },
            ],
          }),
        });

        if (response.ok) {
          const res = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
          const raw = res.choices?.[0]?.message?.content;
          if (raw) {
            const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
            const data = JSON.parse(clean) as Partial<HistoricalResearch>;
            if (data.title && data.description && data.year) {
              return {
                title: data.title,
                description: data.description,
                year: Number(data.year),
                category: data.category || 'CIENTÍFICO',
                importance: Number(data.importance) || 90,
                source: data.source || `arXiv / Physical Review (${this.config.openRouterModel || 'Claude 3.5'})`,
                evidenceKind: data.evidenceKind || 'scientific_theory',
                confidence: Number(data.confidence) || 95,
                uncertainty: data.uncertainty,
              };
            }
          }
        }
      } catch (err) {
        console.warn('OpenRouter direto falhou, tentando endpoint local:', err);
      }
    }

    // 2. Endpoint Serverless backend (/api/temporal)
    const endpoint = this.config.endpoint;
    if (this.config.provider === 'custom_api' && endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: 'historical_event_research', query, language: 'pt-BR' }),
        });
        if (response.ok) {
          const data = (await response.json()) as Partial<HistoricalResearch>;
          if (data.title && data.description && data.year) {
            return {
              title: data.title,
              description: data.description,
              year: Number(data.year),
              category: data.category || 'CIENTÍFICO',
              importance: Number(data.importance) || 90,
              source: data.source || 'Base de Dados Acadêmica (arXiv / APS)',
              evidenceKind: data.evidenceKind || 'scientific_theory',
              confidence: Number(data.confidence) || 95,
              uncertainty: data.uncertainty,
            };
          }
        }
      } catch (err) {
        console.warn('Endpoint serverless falhou:', err);
      }
    }

    // 3. Fallback Científico Baseado em Literatura Primária (Sem Wikipedia)
    return {
      title: query.trim(),
      description: `Investigação física fundamentada em princípios de relatividade e gravitação quântica. O tema "${query.trim()}" representa uma coordenada de interesse em variedades de espaço-tempo.`,
      year: new Date().getFullYear(),
      category: 'FÍSICA TEÓRICA',
      importance: 90,
      source: 'https://arxiv.org/archive/hep-th',
      evidenceKind: 'scientific_theory',
      confidence: 90,
      uncertainty: 'Artigo ou hipótese registrada no repositório de física teórica arXiv / INSPIRE-HEP.',
    };
  }

  /**
   * Constrói uma linha de universo temporal inteira usando OpenRouter ou API Serverless
   */
  public static async createUniverseFromTopic(
    topic: string,
    mode: 'historical' | 'theoretical' = 'theoretical'
  ): Promise<{ universe: Universe; logs: SimulationLog[] }> {
    // 1. OpenRouter direto
    if (this.config.provider === 'openrouter' && this.config.apiKey) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
            'HTTP-Referer': 'https://infinite-horizons.app',
            'X-Title': 'Infinite Horizons Temporal Simulator',
          },
          body: JSON.stringify({
            model: this.config.openRouterModel || 'anthropic/claude-3.5-sonnet',
            temperature: 0.2,
            messages: [
              {
                role: 'system',
                content:
                  'Você é o Motor de Síntese de Realidade do Infinite Horizons. Gere um universo físico-temporal consistente. Retorne APENAS um JSON com: universeName, description, events (array com 4 a 8 eventos ordenados cronologicamente: title, description, year, category, importance, sourceUrl [deve ser link real de arXiv, Physical Review, IOP, Nature ou similar - NUNCA Wikipedia], evidenceKind, evidenceConfidence, uncertainty, causes [array de IDs])',
              },
              {
                role: 'user',
                content: `Sintetize uma linha temporal científica para o tema: "${topic}". Modo: ${mode}`,
              },
            ],
          }),
        });

        if (response.ok) {
          const res = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
          const raw = res.choices?.[0]?.message?.content;
          if (raw) {
            const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
            const data = JSON.parse(clean) as {
              universeName?: string;
              description?: string;
              events?: Array<Partial<TemporalEvent> & { causes?: string[] }>;
            };
            if (data.events && data.events.length >= 2) {
              return this.buildGeneratedUniverse(topic, data.universeName, data.description, data.events, mode);
            }
          }
        }
      } catch (err) {
        console.warn('OpenRouter direto falhou na síntese:', err);
      }
    }

    // 2. Endpoint Serverless backend
    const endpoint = this.config.endpoint;
    if (this.config.provider === 'custom_api' && endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task: 'create_universe_from_topic',
            topic,
            mode,
            language: 'pt-BR',
          }),
        });
        if (response.ok) {
          const data = (await response.json()) as {
            universeName?: string;
            description?: string;
            events?: Array<Partial<TemporalEvent> & { causes?: string[] }>;
          };
          if (data.events && data.events.length >= 2) {
            return this.buildGeneratedUniverse(topic, data.universeName, data.description, data.events, mode);
          }
        }
      } catch (err) {
        console.warn('Endpoint serverless falhou na síntese:', err);
      }
    }

    // 3. Fallback Acadêmico Grounded (Repositórios Primários)
    const fallbackEvents: Array<Partial<TemporalEvent> & { causes?: string[] }> = [
      {
        title: `Eletrodinâmica de Maxwell & Constância de c`,
        description: `Unificação dos campos elétricos e magnéticos em quatro equações diferenciais, deduzindo a propagação de ondas eletromagnéticas com velocidade universal c = 1/√(μ₀ε₀).`,
        year: 1865,
        category: 'ELETROMAGNETISMO',
        importance: 98,
        sourceUrl: 'https://royalsocietypublishing.org/doi/10.1098/rstl.1865.0008',
        evidenceKind: 'scientific_theory',
        evidenceConfidence: 100,
        causes: [],
      },
      {
        title: `Relatividade Especial & Invariância de Lorentz: ${topic}`,
        description: `Formulação da invariância das leis físicas em referenciais inerciais, introdução do continuum espaço-tempo de Minkowski e equivalência massa-energia (E = mc²).`,
        year: 1905,
        category: 'FÍSICA TEÓRICA',
        importance: 100,
        sourceUrl: 'https://einsteinpapers.press.princeton.edu/vol2-doc/311',
        evidenceKind: 'scientific_theory',
        evidenceConfidence: 100,
        causes: ['generated-0'],
      },
      {
        title: `Relatividade Geral & Curvatura do Espaço-Tempo`,
        description: `Albert Einstein formula a gravitação como dinâmica geométrica induzida pelo tensor de energia-momento (G_μν + Λg_μν = 8πG/c⁴ T_μν).`,
        year: 1915,
        category: 'FÍSICA TEÓRICA',
        importance: 99,
        sourceUrl: 'https://einsteinpapers.press.princeton.edu/vol6-doc/225',
        evidenceKind: 'scientific_theory',
        evidenceConfidence: 99,
        causes: ['generated-1'],
      },
      {
        title: `Correspondência Holográfica & Teoria de Cordas: ${topic}`,
        description: `Integração de ${topic} com a teoria quântica de campos e variedades compactas de Calabi-Yau em 11 dimensões.`,
        year: 1997,
        category: 'SUPERSTRING THEORY',
        importance: 94,
        sourceUrl: 'https://arxiv.org/abs/hep-th/9711200',
        evidenceKind: 'scientific_theory',
        evidenceConfidence: 90,
        causes: ['generated-2'],
      },
      {
        title: `Confirmação Observacional Contemporânea`,
        description: `Detecção de assinaturas métricas compatíveis com o modelo por meio de observatórios interferométricos e telescópios de horizonte de eventos.`,
        year: 2019,
        category: 'OBSERVAÇÃO',
        importance: 96,
        sourceUrl: 'https://iopscience.iop.org/article/10.3847/2041-8213/ab0ec7',
        evidenceKind: 'documented_fact',
        evidenceConfidence: 98,
        causes: ['generated-3'],
      },
    ];

    return this.buildGeneratedUniverse(
      topic,
      `${topic} — Modelo de Física Teórica`,
      `Linha de investigação fundamentada em literatura primária revisada por pares (arXiv, Physical Review e The Astrophysical Journal).`,
      fallbackEvents,
      mode
    );
  }

  private static buildGeneratedUniverse(
    topic: string,
    name: string | undefined,
    description: string | undefined,
    sourceEvents: Array<Partial<TemporalEvent> & { causes?: string[] }>,
    mode: 'historical' | 'theoretical' = 'theoretical'
  ): { universe: Universe; logs: SimulationLog[] } {
    const dimensionId = `dim-generated-${Date.now()}`;
    const universeId = `univ-generated-${Date.now()}`;
    const orderedEvents = sourceEvents
      .filter(event => event.title && Number.isFinite(Number(event.year)))
      .sort((a, b) => Number(a.year) - Number(b.year));

    const events: TemporalEvent[] = orderedEvents.map((event, index) => {
      const id = `generated-${index}`;
      const causes = (event.causes || [])
        .map(cause => {
          const indexMatch = String(cause).match(/^\[?(\d+)\]?$/);
          return indexMatch ? `generated-${indexMatch[1]}` : String(cause);
        })
        .filter(cause => orderedEvents.some(candidate => candidate.id === cause) || cause.startsWith('generated-'));
      const normalizedCauses = causes.length || index === 0 ? causes : [`generated-${index - 1}`];
      return {
        id,
        dimensionId,
        title: String(event.title),
        description: event.description,
        sourceUrl: event.sourceUrl,
        evidenceKind: event.evidenceKind || 'scientific_theory',
        evidenceConfidence: event.evidenceConfidence || 80,
        uncertainty: event.uncertainty,
        year: Number(event.year),
        category: event.category || (mode === 'theoretical' ? 'FÍSICA TEÓRICA' : 'CIENTÍFICO'),
        importance: Math.max(1, Math.min(100, Number(event.importance) || 80)),
        position: { x: Math.min(840, Math.max(90, index * 120 + 90)), y: 140 + (index % 3) * 70 },
        status: EventStatus.STABLE,
        parents: normalizedCauses,
        children: [],
        causes: normalizedCauses,
        consequences: [],
        isAnchor: index === 0 || index === orderedEvents.length - 1,
      };
    });

    const edges = events.slice(1).map((event, index) => ({
      id: `edge-generated-${index}`,
      source: events[index].id,
      target: event.id,
      type: CausalRelation.CAUSES,
      active: true,
      confidence: 80,
      evidence: 'Relação causal inferida pela ordem cronológica e leis de conservação física.',
    }));

    events.forEach((event, index) => {
      if (events[index + 1]) {
        event.children = [events[index + 1].id];
        event.consequences = [events[index + 1].id];
      }
    });

    const dimension: Dimension = {
      id: dimensionId,
      universeId,
      name: mode === 'theoretical' ? 'Modelagem Teórico-Causal' : 'Reconstrução Documental',
      designation: 'Ω-GEN',
      color: '#00d4ff',
      events,
      integrity: 100,
    };

    const universe: Universe = {
      id: universeId,
      name: name || `${topic} — Modelo de Investigação`,
      description:
        description ||
        `Modelo temporal estruturado para investigar as conexões causais e dinâmicas do espaço-tempo em torno de "${topic}".`,
      temporalIntegrity: 100,
      dimensions: [dimension],
      travelers: [],
      edges,
      paradoxes: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return {
      universe,
      logs: [
        {
          id: `log-generated-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          message: `Linha de realidade gerada para "${topic}" com ${events.length} marcos físicos/históricos estruturados.`,
          type: 'success',
        },
      ],
    };
  }

  public static analyzeUniverse(universe: Universe): AIUniverseInsight {
    const events = universe.dimensions.flatMap(dimension => dimension.events);
    const connectedIds = new Set(universe.edges.flatMap(edge => [edge.source, edge.target]));
    const exposedEvents = events.filter(event =>
      [EventStatus.ALTERED, EventStatus.UNSTABLE, EventStatus.PARADOXICAL, EventStatus.DIVERGED].includes(event.status)
    ).length;
    const affectedTravelers = universe.travelers.filter(traveler => traveler.status !== 'normal').length;
    const paradoxPressure = universe.paradoxes.length * 15;
    const exposurePressure = events.length ? (exposedEvents / events.length) * 35 : 0;
    const connectivityBonus = events.length ? (connectedIds.size / events.length) * 10 : 0;
    const risk = Math.max(0, Math.min(100, 100 - universe.temporalIntegrity + paradoxPressure + exposurePressure - connectivityBonus));
    const health = risk >= 50 ? 'critical' : risk >= 20 ? 'watch' : 'stable';
    const healthLabel = health === 'critical' ? 'COLAPSO CAUSAL IMINENTE' : health === 'watch' ? 'FLUTUAÇÃO GEOMÉTRICA' : 'CONTINUUM ESTÁVEL';
    const recommendation =
      health === 'critical'
        ? 'A curvatura causal está sob tensão máxima. Isole a ramificação divergente em uma nova dimensão (Ω-03) ou ancore o evento de origem para evitar aniquilação causal.'
        : health === 'watch'
        ? 'Detectadas flutuações de coerência quântica. Verifique os cones de luz e reforce a autoconsistência de Novikov antes da próxima intervenção.'
        : 'As geodésicas do espaço-tempo estão perfeitamente congruentes. O modelo admite novas hipóteses e simulações com preservação da métrica.';

    return {
      health,
      healthLabel,
      confidence: Math.min(99, Math.round(75 + Math.min(20, events.length * 2.5) + (universe.edges.length ? 4 : 0))),
      eventCount: events.length,
      exposedEvents,
      connectedEvents: connectedIds.size,
      affectedTravelers,
      recommendation,
    };
  }

  /**
   * Fornece dossiê de física teórica e cosmologia realista para qualquer evento
   */
  public static explainEventWithPhysics(event: TemporalEvent): ScientificExplanation[] {
    const causalLinks = event.causes.length + event.consequences.length;
    return [
      {
        title: 'Relatividade Geral & Cones de Luz de Minkowski',
        laymanTitle: 'A Gravidade Dobra o Espaço e o Tempo (Einstein)',
        status: 'established',
        statusLabel: 'TEORIA CONSOLIDADA',
        theoryBadge: 'EINSTEIN / MINKOWSKI',
        formula: 'ds² = -c²dt² + dx² + dy² + dz²  |  G_μν + Λg_μν = (8πG/c⁴) T_μν',
        explanation: `A gravitação de Einstein modela o evento como um vértice no tecido quadridimensional do espaço-tempo. Conectado a ${causalLinks} geodésica(s), este nó respeita a velocidade limite da luz (c) em seu cone de luz futuro e passado. Intervenções transmitem ondas de curvatura gravitacional pela métrica.`,
        laymanFormulaMeaning: 'O lado esquerdo (G_μν) mede o quanto o tecido do espaço-tempo está afundado e curvado. O lado direito (T_μν) representa a massa e a energia dos corpos celestes. O termo "c" é a velocidade máxima da luz. Em resumo: a matéria diz ao espaço como se curvar, e o espaço curvado diz à matéria como se mover.',
        laymanExplanation: 'O espaço e o tempo não são um cenário rígido, mas uma malha elástica que se deforma com o peso de estrelas e planetas. Nada no universo consegue viajar mais rápido do que a luz (c), o que impede que qualquer causa afete o futuro instantaneamente.',
      },
      {
        title: 'Teoria das Supercordas & Teoria M (11D)',
        laymanTitle: 'Toda a Matéria é Feita de Cordas Vibrantes em 11 Dimensões',
        status: 'supported',
        statusLabel: 'FRONTEIRA MATEMÁTICA',
        theoryBadge: 'CALABI-YAU / D-BRANAS',
        formula: 'S = (1 / 4πα\') ∫ d²σ √(-γ) γᵃᵇ ∂_a X^μ ∂_b X^ν η_μν  (10D / 11D)',
        explanation: `Na escala de Planck (~10⁻³⁵ m), o evento não é pontual, mas o modo vibracional harmônico de uma supercorda aberta ou fechada. As 6 dimensões espaciais extras compactificadas em uma variedade de Calabi-Yau determinam as constantes fundamentais desta realidade no String Landscape.`,
        laymanFormulaMeaning: 'Esta equação calcula a energia e o movimento de uma pequena fita elástica (uma corda microscópica) se deslocando pelo espaço-tempo. Conforme essa corda vibra em notas diferentes dentro de 11 dimensões, ela dá origem a partículas de luz, elétrons ou gravidade.',
        laymanExplanation: 'Se pudéssemos dar um zoom infinito na matéria, não veríamos bolinhas duras, mas pequenos laços de energia vibrando como cordas de violino. Diferentes notas musicais criam todas as forças e partículas que existem na natureza.',
      },
      {
        title: 'Mecânica Quântica & Multiverso Everettiano (Muitos Mundos)',
        laymanTitle: 'O Multiverso Quântico: Todas as Escolhas Acontecem em Ramos Paralelos',
        status: 'supported',
        statusLabel: 'INTERPRETAÇÃO QUÂNTICA',
        theoryBadge: 'EVERETT / DECOERÊNCIA',
        formula: '|Ψ(t)⟩ = ∑ cᵢ |ψᵢ(t)⟩ ⊗ |Ambienteᵢ(t)⟩  |  iℏ ∂/∂t |Ψ⟩ = Ĥ |Ψ⟩',
        explanation: `A decoerência quântica postula que a alteração de um resultado não destrói o estado anterior, mas bifurca o vetor de estado universal |Ψ⟩ em dois ramos ortogonais e não-interferentes. Cada decisão dá origem a uma dimensão paralela física real e causalmente autônoma.`,
        laymanFormulaMeaning: 'O símbolo |Ψ⟩ representa a "Função de Onda", que guarda todas as probabilidades possíveis do universo. O símbolo ∑ (somatório) mostra que todas as alternativas coexistem. Quando uma medição ocorre, a realidade se divide em caminhos paralelos independentes sem apagar nenhum futuro.',
        laymanExplanation: 'No mundo subatômico das partículas, o acaso reina: um elétron pode tomar dois caminhos ao mesmo tempo. Segundo a teoria dos muitos mundos, o universo se divide a cada evento quântico, criando ramificações onde cada possibilidade acontece em um mundo paralelo real.',
      },
      {
        title: 'Termodinâmica & Censura Cronológica de Hawking / Novikov',
        laymanTitle: 'A Flecha do Tempo e a Lei Contra Paradoxos (Novikov)',
        status: 'established',
        statusLabel: 'LEI FUNDAMENTAL',
        theoryBadge: 'NOVIKOV / HAWKING',
        formula: 'ΔS_total ≥ 0  |  P(paradoxo) = 0 (Autoconsistência de Novikov)',
        explanation: `A 2ª Lei da Termodinâmica define a seta do tempo irreversível através do aumento contínuo da entropia (S). O Princípio de Autoconsistência de Igor Novikov impõe que a probabilidade de ocorrência de qualquer evento que gere um paradoxo autodestrutivo é estritamente zero no universo contínuo.`,
        laymanFormulaMeaning: 'ΔS ≥ 0 diz que a "desordem" (entropia S) do universo sempre aumenta, explicando por que um copo quebrado nunca se remonta sozinho. Já P(paradoxo) = 0 é a regra matemática de que a probabilidade de uma contradição no tempo (como impedir seus próprios pais de se conhecerem) é estritamente ZERO.',
        laymanExplanation: 'O tempo só flui para a frente porque a natureza sempre caminha da ordem para a desordem. Se alguém conseguisse viajar ao passado, as próprias leis da física impediriam qualquer ação que gerasse uma contradição lógica.',
      },
      {
        title: 'Teoria do Caos & Atratores Não-Lineares de Lorenz',
        laymanTitle: 'A Matemática do Efeito Borboleta (Equações de Lorenz)',
        status: 'established',
        statusLabel: 'SISTEMAS COMPLEXOS',
        theoryBadge: 'LORENZ / EFEITO BORBOLETA',
        formula: 'dx/dt = σ(y - x),  dy/dt = x(ρ - z) - y,  dz/dt = xy - βz  |  Δx(t) ~ e^(λt)',
        explanation: event.consequences.length
          ? `O evento possui ${event.consequences.length} consequência(s) acoplada(s). O expoente de Lyapunov (λ > 0) dita que perturbações infinitesimais nas condições iniciais amplificam-se exponencialmente com o tempo, reorganizando o atrator causal em trajetórias completamente divergentes.`
          : 'Nenhuma consequência dependente conectada no momento. O efeito borboleta se manifestará assim que novas geodésicas causais forem traçadas.',
        laymanFormulaMeaning: 'dx/dt, dy/dt e dz/dt medem como três variáveis ligadas (como vento, calor e pressão) mudam com o tempo. As letras gregas (σ, ρ, β) são propriedades do ambiente. O termo e^(λt) é a chave: ele mostra que qualquer mudança minúscula no início se multiplica exponencialmente com o passar do tempo.',
        laymanExplanation: 'Esta é a fórmula exata do "Efeito Borboleta": em sistemas conectados e complexos (como o clima ou a história humana), uma alteração quase imperceptível no passado (como atrasar um trem por 10 segundos) cresce em cascata e altera totalmente o futuro.',
      },
    ];
  }

  /**
   * Simula o Efeito Borboleta não linear com IA
   */
  public static async simulateUnexpectedButterflyEffect(
    universe: Universe,
    targetEvent: TemporalEvent
  ): Promise<{ result: AIButterflyResult; updatedUniverse: Universe }> {
    // 1. OpenRouter direto se configurado
    if (this.config.provider === 'openrouter' && this.config.apiKey) {
      try {
        const prompt = `O evento "${targetEvent.title}" (Ano ${targetEvent.year}, Importância ${targetEvent.importance}/100, Categoria ${targetEvent.category}) teve seu estado alterado para "${targetEvent.status}" no laboratório temporal.
Integridade da realidade: ${universe.temporalIntegrity}%.
Com base em física teórica (cones de luz, relatividade, efeito borboleta e mecânica quântica), gere o impacto e anomalias decorrentes.
Retorne APENAS um JSON:
- "impactScore": número de 1 a 100
- "summary": explicação do choque causal no tecido do espaço-tempo
- "unexpectedEffects": array de 3 a 5 consequências científicas ou históricas
- "generatedAnomalies": array de 1 a 2 novos eventos derivados com: "title", "year" (ano futuro ou contemporâneo), "description", "category", "severity" ("low", "medium", "high", "critical")`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
            'HTTP-Referer': 'https://infinite-horizons.app',
            'X-Title': 'Infinite Horizons Temporal Simulator',
          },
          body: JSON.stringify({
            model: this.config.openRouterModel || 'google/gemini-2.0-flash-001',
            temperature: 0.2,
            messages: [
              {
                role: 'system',
                content:
                  'Você é o Motor de Efeito Borboleta e Dinâmica Causal do Infinite Horizons. Gere resultados instigantes, realistas e fundamentados em física. Retorne APENAS JSON válido.',
              },
              { role: 'user', content: prompt },
            ],
          }),
        });

        if (response.ok) {
          const res = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
          const raw = res.choices?.[0]?.message?.content;
          if (raw) {
            const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
            const data = JSON.parse(clean) as AIButterflyResult;
            if (data.summary && data.impactScore) {
              return this.applyAIResultToUniverse(universe, targetEvent, data);
            }
          }
        }
      } catch (err) {
        console.warn('OpenRouter direto falhou no Efeito Borboleta:', err);
      }
    }

    // 2. Endpoint Serverless
    if (this.config.provider === 'custom_api' && this.config.endpoint) {
      try {
        const response = await fetch(this.config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task: 'create_temporal_universe',
            topic: `Intervenção no evento ${targetEvent.title}`,
            mode: 'theoretical',
          }),
        });
        if (response.ok) {
          const data = (await response.json()) as Partial<AIButterflyResult>;
          if (data.summary && data.impactScore) {
            return this.applyAIResultToUniverse(universe, targetEvent, data as AIButterflyResult);
          }
        }
      } catch (err) {
        console.warn('Endpoint custom_api falhou, usando cálculo topológico interno:', err);
      }
    }

    // 3. Motor Topológico Determinístico Grounded no Grafo
    const allEvents = universe.dimensions.flatMap(dimension => dimension.events);
    const descendants = new Set<string>();
    const pending = [targetEvent.id];
    while (pending.length) {
      const currentId = pending.pop();
      if (!currentId || descendants.has(currentId)) continue;
      descendants.add(currentId);
      const current = allEvents.find(event => event.id === currentId);
      current?.children.forEach(childId => pending.push(childId));
    }
    const impactScore = Math.min(100, Math.round((descendants.size / Math.max(1, allEvents.length)) * 70 + targetEvent.importance * 0.3));

    const aiResult: AIButterflyResult = {
      impactScore,
      summary: `A perturbação no nó métrico "${targetEvent.title}" propagou ondas de curvatura por ${descendants.size} evento(s) subsequentes no cone de luz causal.`,
      unexpectedEffects: [
        `Reorganização das geodésicas em ${descendants.size - 1} evento(s) dependente(s) via equações de campo.`,
        `${targetEvent.children.length} ramo(s) causal(is) direto(s) sofreram desfasamento de fase quântica.`,
        `Preservação do princípio de autoconsistência de Novikov exigiu dissipação de entropia nas fronteiras.`,
      ],
      generatedAnomalies: [
        {
          title: `Flutuação Quântica Residual Pós-${targetEvent.year}`,
          year: targetEvent.year + 4,
          description: `Ruptura pontual da métrica induzida pela reconfiguração causal de "${targetEvent.title}".`,
          category: 'FÍSICA TEÓRICA',
          severity: impactScore > 75 ? 'critical' : impactScore > 40 ? 'medium' : 'low',
        },
      ],
    };

    return this.applyAIResultToUniverse(universe, targetEvent, aiResult);
  }

  private static applyAIResultToUniverse(
    universe: Universe,
    targetEvent: TemporalEvent,
    aiResult: AIButterflyResult
  ): { result: AIButterflyResult; updatedUniverse: Universe } {
    const dim = universe.dimensions.find(d => d.id === targetEvent.dimensionId) || universe.dimensions[0];
    if (!dim) return { result: aiResult, updatedUniverse: universe };

    // Injeta anomalias geradas pela IA como eventos reais na linha do tempo
    for (const anomaly of aiResult.generatedAnomalies || []) {
      const anomalyId = `evt-ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const anomalyEvent: TemporalEvent = {
        id: anomalyId,
        dimensionId: dim.id,
        title: `[ANOMALIA QUÂNTICA] ${anomaly.title}`,
        description: anomaly.description,
        year: anomaly.year,
        category: anomaly.category || 'FÍSICA TEÓRICA',
        importance: 88,
        position: { x: Math.min(840, Math.max(90, (anomaly.year - 1915) * 6)), y: 230 + Math.random() * 60 },
        status: EventStatus.DIVERGED,
        parents: [targetEvent.id],
        children: [],
        causes: [targetEvent.id],
        consequences: [],
        isAIAnomaly: true,
        evidenceKind: 'model_result',
        evidenceConfidence: 75,
      };

      dim.events.push(anomalyEvent);
      universe.edges.push({
        id: `edg-ai-${Date.now()}`,
        source: targetEvent.id,
        target: anomalyId,
        type: CausalRelation.DERIVES,
        active: true,
        evidence: 'Geodésica divergente induzida pelo efeito borboleta quântico.',
      });

      targetEvent.children.push(anomalyId);
      targetEvent.consequences.push(anomalyId);
    }

    SimulationService.updateSimulation(universe);
    return { result: aiResult, updatedUniverse: { ...universe } };
  }

  /**
   * Gera 3 cenários probabilísticos fundamentados para o futuro da linha temporal
   */
  public static predictFutures(universe: Universe): AIFutureScenario[] {
    const currentIntegrity = universe.temporalIntegrity;

    return [
      {
        id: 'fut-alpha',
        title: 'Cenário Alpha — Reestabilização Geodésica (Novikov Congruente)',
        probability: Math.min(90, Math.max(15, Math.round(currentIntegrity * 0.8))),
        predictedIntegrity: Math.min(100, currentIntegrity + 10),
        summary:
          'O continuum quadridimensional absorve as perturbações através da censura cronológica, restaurando a causalidade determinística e os cones de luz originais.',
        keyEvents: [
          'Preservação da invariância de Lorentz e estabilidade métrica',
          'Dissipação assintótica das flutuações quânticas nos horizontes de eventos',
        ],
      },
      {
        id: 'fut-beta',
        title: 'Cenário Beta — Bifurcação em Multiverso de Everett (Decoerência)',
        probability: Math.round((100 - currentIntegrity) * 0.65),
        predictedIntegrity: Math.max(25, currentIntegrity - 15),
        summary:
          'A superposição de estados colapsa em ramos ortogonais: a realidade original segue intacta enquanto a linha alterada se expande como um ramo independente em 11 dimensões.',
        keyEvents: [
          'Criação espontânea de uma nova variedade dimensional (Ω-03)',
          'Emaranhamento não-local entre os observadores das duas realidades',
        ],
      },
      {
        id: 'fut-gamma',
        title: 'Cenário Gamma — Singularidade Nua & Colapso Causal',
        probability: Math.max(5, 100 - currentIntegrity - 15),
        predictedIntegrity: 8,
        summary:
          'A cascata de curvas tipo tempo fechadas (CTCs) ultrapassa o limite de Planck, resultando na perda irreversível da ordem temporal e aniquilação das geodésicas.',
        keyEvents: [
          'Violação macroscópica do princípio de causalidade',
          'Necessidade de restauração de nós âncoras fundamentais',
        ],
      },
    ];
  }

  /**
   * Propõe 3 resoluções cirúrgicas de paradoxo baseadas em física e causalidade
   */
  public static suggestParadoxResolutions(paradox: Paradox, events: TemporalEvent[]): AIParadoxResolution[] {
    const originEvent = events.find(e => e.id === paradox.eventId);

    return [
      {
        id: 'res-1',
        title: 'Ancoragem Relativística por Causalidade Alternativa',
        description: `Recalibrar as equações de campo em "${originEvent?.title || 'o nó perturbado'}", estabelecendo uma nova geodésica compatível com o princípio de Novikov sem romper o continuum.`,
        successRate: 88,
        actionType: 'anchor_event',
        targetEventId: originEvent?.id,
      },
      {
        id: 'res-2',
        title: 'Isolamento em Variedade Dimensional de Calabi-Yau (Multiverso)',
        description:
          'Transferir a ramificação paradoxal para uma nova dimensão Ω-03 governada por D-branas independentes, preservando a Realidade Primária 100% íntegra.',
        successRate: 95,
        actionType: 'create_branch',
      },
      {
        id: 'res-3',
        title: 'Restauração Estrita do Estado Quântico Fundamental',
        description: 'Reverter o evento alterado ao seu estado quântico fundamental de menor energia (ESTÁVEL), eliminando imediatamente o loop causal.',
        successRate: 100,
        actionType: 'restore_origin',
        targetEventId: originEvent?.id,
      },
    ];
  }

  /**
   * Conversação livre em tempo real com o Oráculo Físico via SSE / Streaming
   */
  public static async streamChatWithOracle(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    onChunk: (accumulatedText: string) => void
  ): Promise<string> {
    // 1. OpenRouter com streaming ativo
    if (this.config.provider === 'openrouter' && this.config.apiKey) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
            'HTTP-Referer': 'https://infinite-horizons.app',
            'X-Title': 'Infinite Horizons AI Co-Pilot',
          },
          body: JSON.stringify({
            model: this.config.openRouterModel || 'anthropic/claude-3.5-sonnet',
            temperature: 0.2,
            stream: true,
            messages,
          }),
        });

        if (response.ok && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let accumulated = '';
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith(':')) continue;
              if (trimmed === 'data: [DONE]') break;

              if (trimmed.startsWith('data: ')) {
                try {
                  const data = JSON.parse(trimmed.slice(6)) as {
                    choices?: Array<{ delta?: { content?: string } }>;
                  };
                  const chunk = data.choices?.[0]?.delta?.content;
                  if (chunk) {
                    accumulated += chunk;
                    onChunk(accumulated);
                  }
                } catch {
                  // Ignore JSON parse errors in stream chunks
                }
              }
            }
          }

          if (accumulated.trim()) return accumulated;
        }
      } catch (err) {
        console.warn('Streaming do OpenRouter falhou, aplicando fallback acústico:', err);
      }
    }

    // 2. Fallback de Simulação Local com Streaming Sintético
    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
    const fallbackAnswer = `Analisando a questão sob o ponto de vista da Relatividade Geral e Gravitação Quântica:

Para a premissa levantada ("${lastUserMsg.slice(0, 100)}"):

1. **Estrutura Métrica**: As geodésicas de espaço-tempo respeitam a invariância do intervalo de Minkowski $ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2$. Qualquer intervenção causal propaga uma onda de curvatura no cone de luz futuro.
2. **Censura Cronológica de Novikov**: As equações de campo proíbem soluções com autocontradição lógica ($P(\\text{paradoxo}) = 0$). O universo auto-ajusta probabilidades para preservar a integridade.
3. **Recomendação**: Para explorar esta hipótese com máxima estabilidade, recomenda-se criar uma bifurcação dimensional ($\\\\Omega\\\\text{-03}$) ou ancorar os nós antecedentes.`;

    let current = '';
    const words = fallbackAnswer.split(' ');
    for (let i = 0; i < words.length; i++) {
      current += (i === 0 ? '' : ' ') + words[i];
      onChunk(current);
      await new Promise(r => setTimeout(r, 20));
    }
    return current;
  }
}

