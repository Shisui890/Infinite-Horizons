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
  CounterfactualAnalysis,
} from '../types/temporal';
import { EventStatus, CausalRelation } from '../types/temporal';
import { SimulationService } from './SimulationService';
import { GraphEngine } from './GraphEngine';
import { formatHistoricalYear } from '../utils/formatters';
import type { CausalBacktrackingPlan } from './CausalBacktrackingEngine';

export interface AIEpistemicAudit {
  verdict: 'approved' | 'restricted' | 'critical_barrier';
  verdictLabel: string;
  verdictScore: number;
  thermodynamicAssessment: string;
  entropyDeltaFormula: string;
  lorentzInvarianceCheck: string;
  causalFeasibilityRatio: number;
  materialHurdles: Array<{
    material: string;
    requiredPurityOrTolerance: string;
    historicalAvailabilityYear: number;
    acceleratedFeasibility: string;
  }>;
  primaryAcademicSources: Array<{
    author: string;
    title: string;
    year: number;
    journalOrInstitution: string;
    doiOrCitation: string;
  }>;
  expertConsensusSummary: string;
}

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
        title: `Experimento de Michelson-Morley & Crise do Éter`,
        description: `Medição interferométrica com resultado nulo para o vento do éter luminoso, refutando o meio estacionário da física clássica e abrindo caminho direto para a Relatividade Especial.`,
        year: 1887,
        category: 'FÍSICA EXPERIMENTAL',
        importance: 97,
        sourceUrl: 'https://www.aip.org/history/exhibits/gap/Michelson/01_Michelson.html',
        evidenceKind: 'documented_fact',
        evidenceConfidence: 100,
        causes: ['generated-0'],
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
        causes: ['generated-1'],
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
        causes: ['generated-2'],
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
        causes: ['generated-3'],
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
        causes: ['generated-4'],
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
        const prompt = `O evento "${targetEvent.title}" (${formatHistoricalYear(targetEvent.year)}, Importância ${targetEvent.importance}/100, Categoria ${targetEvent.category}) teve seu estado alterado para "${targetEvent.status}" no laboratório temporal.
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

  /**
   * Executa auditoria científica profunda por IA sobre um plano de Engenharia Reversa (Causal Backtracking)
   */
  public static async auditBacktrackingWithAI(plan: CausalBacktrackingPlan): Promise<AIEpistemicAudit> {
    const cacheKey = `audit-bt-${plan.goalId}-${plan.targetDesiredYear}`;
    const cached = this.getCached<AIEpistemicAudit>(cacheKey);
    if (cached) return cached;

    // 1. Chamada via OpenRouter se API Key configurada
    if (this.config.provider === 'openrouter' && this.config.apiKey) {
      try {
        const prompt = `Analise como Comitê de Pares Científicos a aceleração da tecnologia "${plan.targetTitle}" para o ano ${plan.targetDesiredYear} d.C. (histórico real: ${plan.originalHistoricalYear} d.C., salto de ${plan.totalShiftYears} anos).
Gargalo físico atual: ${plan.primaryBottleneckFormula} - ${plan.bottleneckExplanation}.
Pré-requisitos: ${plan.prerequisiteSteps.map(s => s.originalTitle + ' (' + s.requiredAcceleratedYear + ')').join(', ')}.

Avalie com máximo rigor científico e retorne estritamente um JSON com:
- "verdict": "approved" | "restricted" | "critical_barrier"
- "verdictLabel": título curto em maiúsculas
- "verdictScore": número de 0 a 100
- "thermodynamicAssessment": análise das leis da termodinâmica e dissipação de calor
- "entropyDeltaFormula": fórmula em LaTeX
- "lorentzInvarianceCheck": validação de limites de causalidade relativística
- "causalFeasibilityRatio": probabilidade factual em %
- "materialHurdles": array de 2 a 3 objetos { "material", "requiredPurityOrTolerance", "historicalAvailabilityYear", "acceleratedFeasibility" }
- "primaryAcademicSources": array de 2 a 3 papers históricos reais com { "author", "title", "year", "journalOrInstitution", "doiOrCitation" }
- "expertConsensusSummary": parecer colegiado conclusivo sem ficção`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          signal: AbortSignal.timeout(2000),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
            'HTTP-Referer': 'https://infinite-horizons.app',
            'X-Title': 'Infinite Horizons Epistemic Auditor',
          },
          body: JSON.stringify({
            model: this.config.openRouterModel || 'anthropic/claude-3.5-sonnet',
            temperature: 0.15,
            messages: [
              {
                role: 'system',
                content: 'Você é o Auditor Epistêmico de Física e História da Ciência do Infinite Horizons. Forneça análises com rigor acadêmico de pós-graduação, equações KaTeX e fontes primárias históricas. Retorne APENAS JSON.',
              },
              { role: 'user', content: prompt },
            ],
          }),
        });

        if (response.ok) {
          const res = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
          const raw = res.choices?.[0]?.message?.content || '';
          const parsed = this.extractJson<AIEpistemicAudit>(raw);
          if (parsed && parsed.verdict && parsed.primaryAcademicSources?.length) {
            this.setCache(cacheKey, parsed);
            return parsed;
          }
        }
      } catch (err) {
        console.warn('Auditoria online falhou, aplicando modelo epistêmico determinístico:', err);
      }
    }

    // 2. Modelo Físico Epistêmico Determinístico Baseado em Domínio
    const titleLower = plan.targetTitle.toLowerCase();
    let audit: AIEpistemicAudit;

    if (titleLower.includes('quântic') || titleLower.includes('quantum') || titleLower.includes('qubit')) {
      audit = {
        verdict: 'restricted',
        verdictLabel: 'VIABILIDADE CONDICIONADA A CRIOGENIA PROFUNDA',
        verdictScore: 72,
        thermodynamicAssessment:
          'A taxa de decoerência termodinâmica $\\Gamma = \\tau^{-1}$ diverge exponencialmente se $k_B T > \\Delta E$. Em meados do século XX, a liquefação de hélio por Samuel Collins (1946) permitia atingir $4.2\\text{ K}$, mas a supressão de ruído térmico para portas de Clifford exige refrigeração por diluição de $^3\\text{He}/^4\\text{He}$ ($< 20\\text{ mK}$) e blindagem magnética de Permalloy.',
        entropyDeltaFormula: '\\Delta S_{\\text{total}} \\ge k_B \\ln 2 \\quad \\implies \\quad E_{\\text{dissipada}} \\ge k_B T \\ln 2',
        lorentzInvarianceCheck:
          'Invariância de Lorentz plenamente obedecida: o colapso e correlações quânticas de Bell respeitam o Teorema de Não-Comunicação ($v_{\\text{sinal}} \\le c$).',
        causalFeasibilityRatio: 72,
        materialHurdles: [
          {
            material: 'Hélio-3 Isotópico Puro',
            requiredPurityOrTolerance: 'Pureza isotópica > 99.98% para ciclo de diluição fracionada',
            historicalAvailabilityYear: 1948,
            acceleratedFeasibility: 'Exige reatores nucleares moderados a água pesada para produção por decaimento de trítio.',
          },
          {
            material: 'Junções Josephson Supercondutoras',
            requiredPurityOrTolerance: 'Barreira isolante de AlOx com espessura controlada de ~1.2 nm',
            historicalAvailabilityYear: 1962,
            acceleratedFeasibility: 'Pode ser antecipada via evaporação térmica sob vácuo de difusão de vapor de mercúrio.',
          },
          {
            material: 'Blindagem de Mu-Metal / Crioperm',
            requiredPurityOrTolerance: 'Permeabilidade magnética inicial $\\mu_r > 80.000$',
            historicalAvailabilityYear: 1923,
            acceleratedFeasibility: 'Tecnologia já disponível em fundições metalúrgicas europeias na década de 1930.',
          },
        ],
        primaryAcademicSources: [
          {
            author: 'John von Neumann',
            title: 'Mathematische Grundlagen der Quantenmechanik',
            year: 1932,
            journalOrInstitution: 'Springer Berlin',
            doiOrCitation: 'ISBN: 978-3-540-59207-5',
          },
          {
            author: 'Samuel C. Collins',
            title: 'A Helium Cryostat',
            year: 1947,
            journalOrInstitution: 'Review of Scientific Instruments 18(3), 157-167',
            doiOrCitation: '10.1063/1.1740911',
          },
          {
            author: 'David Deutsch',
            title: 'Quantum theory, the Church-Turing principle and the universal quantum computer',
            year: 1985,
            journalOrInstitution: 'Proc. R. Soc. Lond. A 400, 97-117',
            doiOrCitation: '10.1098/rspa.1985.0070',
          },
        ],
        expertConsensusSummary:
          'Consenso de especialistas em física do estado sólido: a coerência de qubits em 1950 é teoricamente viável através de ressonadores mecânicos supercondutores ou cavidades de micro-ondas de klystron, embora a contagem de qubits físicos permaneça restrita a $N \\le 8$ devido à ausência de litografia óptica ultravioleta.',
      };
    } else if (titleLower.includes('nuclear') || titleLower.includes('fissão') || titleLower.includes('átom')) {
      audit = {
        verdict: 'approved',
        verdictLabel: 'VIABILIDADE FÍSICA RIGOROSAMENTE COMPROVADA',
        verdictScore: 84,
        thermodynamicAssessment:
          'Balanço energético de quebra de núcleos pesados ($Q = [M(^{235}\\text{U}) + m_n - \\sum M_f] c^2 \\approx 200\\text{ MeV}$). A dissipação térmica em regime estacionário é governada pelas equações de Fourier de condução em urânio metálico com barras de cádmio para captura de nêutrons ressonantes.',
        entropyDeltaFormula: 'k_{\\text{eff}} = \\frac{\\text{nêutrons produzidos}}{\\text{nêutrons absorvidos + perdidos}} \\ge 1.0',
        lorentzInvarianceCheck:
          'Cinemática de conservação do quadrivetor momento $p^\\mu = (E/c, \\mathbf{p})$ perfeitamente invariante sob o grupo de Poincaré $SO(1,3)$.',
        causalFeasibilityRatio: 84,
        materialHurdles: [
          {
            material: 'Grafite de Pureza Nuclear',
            requiredPurityOrTolerance: 'Contaminação de Boro < 0.5 ppm para evitar seção de choque parasitária',
            historicalAvailabilityYear: 1941,
            acceleratedFeasibility: 'Síntese carbotérmica por eletrodos de grafite Acheson (já dominada industrialmente em 1905).',
          },
          {
            material: 'Urânio Metálico Purificado',
            requiredPurityOrTolerance: 'Isótopos pesados sem contaminação por terras raras neutrofílicas',
            historicalAvailabilityYear: 1942,
            acceleratedFeasibility: 'Redução térmica de tetrafluoreto de urânio ($UF_4$) por cálcio em cadinhos refratários.',
          },
        ],
        primaryAcademicSources: [
          {
            author: 'Ernest Rutherford',
            title: 'The Scattering of alpha and beta Particles by Matter and the Structure of the Atom',
            year: 1911,
            journalOrInstitution: 'Philosophical Magazine, Series 6, 21: 669-688',
            doiOrCitation: '10.1080/14786440508637080',
          },
          {
            author: 'James Chadwick',
            title: 'Possible Existence of a Neutron',
            year: 1932,
            journalOrInstitution: 'Nature 129, 312',
            doiOrCitation: '10.1038/129312a0',
          },
          {
            author: 'Lise Meitner & Otto Robert Frisch',
            title: 'Disintegration of Uranium by Neutrons: a New Type of Nuclear Reaction',
            year: 1939,
            journalOrInstitution: 'Nature 143, 239-240',
            doiOrCitation: '10.1038/143239a0',
          },
        ],
        expertConsensusSummary:
          'Comitê histórico-físico: se a descoberta do nêutron for antecipada para o Laboratório Cavendish por Rutherford e Chadwick antes da Primeira Guerra, uma pilha atômica crítica subcrítica ($k \\approx 1.01$) era plenamente edificável com o parque químico e metalúrgico de 1910.',
      };
    } else if (titleLower.includes('lunar') || titleLower.includes('aeroespacial') || titleLower.includes('foguete')) {
      audit = {
        verdict: 'restricted',
        verdictLabel: 'EXIGÊNCIA DE METALURGIA REFRATÁRIA AVANÇADA',
        verdictScore: 76,
        thermodynamicAssessment:
          'Termodinâmica de expansão em tubeira de De Laval: $v_e = \\sqrt{\\frac{2\\gamma}{\\gamma - 1} \\frac{R T_c}{M} \\left[1 - \\left(\\frac{p_e}{p_c}\\right)^{\\frac{\\gamma - 1}{\\gamma}}\\right]}$. Pressões de câmara $p_c > 50\\text{ bar}$ demandam resfriamento regenerativo da garganta contra fluxo de calor crítico $> 20\\text{ MW/m}^2$.',
        entropyDeltaFormula: '\\Delta v = I_{\\text{sp}} g_0 \\ln\\left(\\frac{m_0}{m_f}\\right) \\quad \\ge \\quad 9.400\\text{ m/s (LEO)}',
        lorentzInvarianceCheck:
          'Velocidades orbitais ($v \\sim 7.8\\text{ km/s} \\approx 2.6 \\times 10^{-5} c$) operam no regime newtoniano clássico com correções relativísticas de Schwarzschild $\\Delta t / t \\approx -10^{-10}$ para telemetria.',
        causalFeasibilityRatio: 76,
        materialHurdles: [
          {
            material: 'Turbobombas de Alta Pressão',
            requiredPurityOrTolerance: 'Palhetas de turbina em ligas de níquel resistentes a choque térmico de LOX/Álcool',
            historicalAvailabilityYear: 1944,
            acceleratedFeasibility: 'Desenvolvimento antecipado de turbocompressores de aviação por Auguste Rateau (1916).',
          },
          {
            material: 'Giroscópios de Navegação Inercial',
            requiredPurityOrTolerance: 'Taxa de deriva < 0.5 graus/hora com mancais de esferas de precisão',
            historicalAvailabilityYear: 1938,
            acceleratedFeasibility: 'Sistemas eletromecânicos de Anschütz-Kaempfe e Elmer Sperry (1911) adaptáveis para três eixos.',
          },
        ],
        primaryAcademicSources: [
          {
            author: 'Konstantin Tsiolkovsky',
            title: 'Exploration of Cosmic Space by Means of Reaction Devices',
            year: 1903,
            journalOrInstitution: 'Nauchnoye Obozreniye (Revisão Científica)',
            doiOrCitation: 'Arquivo da Academia de Ciências da URSS',
          },
          {
            author: 'Robert H. Goddard',
            title: 'A Method of Reaching Extreme Altitudes',
            year: 1919,
            journalOrInstitution: 'Smithsonian Miscellaneous Collections 71(2)',
            doiOrCitation: 'Smithsonian Inst. Pub. 2540',
          },
          {
            author: 'Hermann Oberth',
            title: 'Die Rakete zu den Planetenräumen (O Foguete no Espaço Interplanetário)',
            year: 1923,
            journalOrInstitution: 'R. Oldenbourg Verlag, München',
            doiOrCitation: 'OCLC: 247065961',
          },
        ],
        expertConsensusSummary:
          'Conselho Aeroespacial: a colocação de um satélite orbital na década de 1920 e subsequente pouso lunar tripulado em 1930 é fisicamente possível utilizando querosene/LOX ou etanol/LOX em estágios múltiplos, substituindo computadores eletrônicos por computadores analógicos diferenciais de Vannevar Bush (1931).',
      };
    } else if (titleLower.includes('dna') || titleLower.includes('genétic') || titleLower.includes('molecular')) {
      audit = {
        verdict: 'approved',
        verdictLabel: 'ALTO ÍNDICE DE PLAUSIBILIDADE HISTÓRICA',
        verdictScore: 89,
        thermodynamicAssessment:
          'A dupla hélice é estabilizada entalpicamente por ligações de hidrogênio ($-12\\text{ a }-20\\text{ kJ/mol}$) e compensação entrópica hidrofóbica com empilhamento de anéis de purina e pirimidina na conformação B-DNA hidratada a 92% de umidade relativa.',
        entropyDeltaFormula: 'n\\lambda = 2d \\sin \\theta \\quad \\implies \\quad F(h,k,l) = \\sum f_j e^{2\\pi i (hx_j + ky_j + lz_j)}',
        lorentzInvarianceCheck:
          'Comprimento de onda dos raios-X de emissão $K_\\alpha$ do Cobre ($\\lambda = 0.154\\text{ nm}$) não viola nenhuma restrição quântica ou relativística.',
        causalFeasibilityRatio: 89,
        materialHurdles: [
          {
            material: 'Câmara de Difração com Controle de Umidade',
            requiredPurityOrTolerance: 'Atmosfera de hidrogênio com controle de vapor saturado a 92% para manter conformação B',
            historicalAvailabilityYear: 1951,
            acceleratedFeasibility: 'Vidraria de laboratório e tubos de raios-X de William Coolidge (1913) eram suficientes.',
          },
          {
            material: 'Microcâmeras de Raios-X de Alta Colimação',
            requiredPurityOrTolerance: 'Colimadores capilares de chumbo com abertura < 0.2 mm',
            historicalAvailabilityYear: 1928,
            acceleratedFeasibility: 'William Henry Bragg e William Lawrence Bragg já dominavam o arranjo em 1913 na Universidade de Leeds.',
          },
        ],
        primaryAcademicSources: [
          {
            author: 'William Henry Bragg & William Lawrence Bragg',
            title: 'The Reflection of X-rays by Crystals',
            year: 1913,
            journalOrInstitution: 'Proc. R. Soc. Lond. A 88, 428-438',
            doiOrCitation: '10.1098/rspa.1913.0040',
          },
          {
            author: 'Rosalind Franklin & Raymond Gosling',
            title: 'Molecular Configuration in Sodium Thymonucleate',
            year: 1953,
            journalOrInstitution: 'Nature 171, 740-741',
            doiOrCitation: '10.1038/171740a0',
          },
          {
            author: 'J. D. Watson & F. H. C. Crick',
            title: 'Molecular Structure of Nucleic Acids: A Structure for Deoxyribose Nucleic Acid',
            year: 1953,
            journalOrInstitution: 'Nature 171, 737-738',
            doiOrCitation: '10.1038/171737a0',
          },
        ],
        expertConsensusSummary:
          'Colegiado de Biofísica: a estrutura helicoidal do DNA é o marco contrafactual mais viável para antecipação precoce, pois todos os instrumentos empíricos (cristalografia de raios-X e química orgânica de purinas) já existiam no rescaldo da Primeira Guerra Mundial.',
      };
    } else {
      audit = {
        verdict: 'restricted',
        verdictLabel: 'ANÁLISE ANALÍTICA GERAL APROVADA',
        verdictScore: Math.min(85, Math.max(50, plan.overallFeasibilityScore)),
        thermodynamicAssessment: `A aceleração de "${plan.targetTitle}" para ${plan.targetDesiredYear} d.C. respeita a conservação local de energia-momento ($T^{\\mu\\nu}_{;\\nu} = 0$). As etapas exigem convergência de ferramental industrial e difusão de conhecimento colegiado.`,
        entropyDeltaFormula: `\\Delta S_{\\text{descoberta}} \\approx -k_B \\ln\\left(\\frac{\\Omega_{\\text{possibilidades}}}{\\Omega_{\\text{factual}}}\\right) \\quad \\text{compensado por } \\Delta S_{\\text{ambiente}} > 0`,
        lorentzInvarianceCheck: 'Nenhuma contradição causal em curvas temporais fechadas (ausência de CTCs).',
        causalFeasibilityRatio: plan.overallFeasibilityScore,
        materialHurdles: [
          {
            material: 'Instrumentação de Precisão Dedicada',
            requiredPurityOrTolerance: 'Tolerâncias mecânicas compatíveis com o estado da arte do período',
            historicalAvailabilityYear: plan.targetDesiredYear - 5,
            acceleratedFeasibility: 'Depende de oficinas mecânicas especializadas e financiamento institucional prioritário.',
          },
        ],
        primaryAcademicSources: [
          {
            author: 'Albert Einstein',
            title: 'Zur Elektrodynamik bewegter Körper (Sobre a Eletrodinâmica dos Corpos em Movimento)',
            year: 1905,
            journalOrInstitution: 'Annalen der Physik 17, 891-921',
            doiOrCitation: '10.1002/andp.19053221004',
          },
          {
            author: 'Claude E. Shannon',
            title: 'A Mathematical Theory of Communication',
            year: 1948,
            journalOrInstitution: 'Bell System Technical Journal 27, 379-423',
            doiOrCitation: '10.1002/j.1538-7305.1948.tb01338.x',
          },
        ],
        expertConsensusSummary:
          `O plano retrocausal apresenta consistência lógica no grafo de dependências, exigindo o cumprimento sequencial das ${plan.prerequisiteSteps.length} etapas precursoras.`,
      };
    }

    this.setCache(cacheKey, audit);
    return audit;
  }

  /**
   * Responde dúvidas de engenharia e contorno de gargalos históricos com IA
   */
  public static async consultAIBacktrackingBypass(
    question: string,
    plan: CausalBacktrackingPlan
  ): Promise<string> {
    const q = question.trim();
    if (!q) return '';

    if (this.config.provider === 'openrouter' && this.config.apiKey) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          signal: AbortSignal.timeout(2000),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
            'HTTP-Referer': 'https://infinite-horizons.app',
            'X-Title': 'Infinite Horizons Tech Specialist',
          },
          body: JSON.stringify({
            model: this.config.openRouterModel || 'anthropic/claude-3.5-sonnet',
            temperature: 0.2,
            messages: [
              {
                role: 'system',
                content:
                  'Você é um historiador da tecnologia e físico teórico sênior. Responda como um cientista real de ponta, explicando métodos práticos, componentes de época e rigor matemático para contornar gargalos técnicos no passado.',
              },
              {
                role: 'user',
                content: `Meta contrafactual: "${plan.targetTitle}" antecipada para ${plan.targetDesiredYear} d.C.
Gargalo: ${plan.primaryBottleneckFormula} (${plan.bottleneckExplanation}).
Pergunta do pesquisador: "${q}".
Forneça a resolução técnica mais fundamentada e precisa cientificamente.`,
              },
            ],
          }),
        });

        if (response.ok) {
          const res = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
          const ans = res.choices?.[0]?.message?.content;
          if (ans) return ans;
        }
      } catch (err) {
        console.warn('Consulta online falhou, usando modelo histórico interno:', err);
      }
    }

    // Resposta determinística contextual de alta precisão
    return `Análise do Comitê Histórico para "${q}":
No contexto de ${plan.targetDesiredYear} d.C., os pesquisadores pioneiros liderados por ${plan.pioneerCandidates.join(', ')} poderiam contornar esta limitação substituindo componentes inexistentes por arranjos físico-químicos contemporâneos:

1. **Abordagem de Engenharia**: A equação governante $${plan.primaryBottleneckFormula}$ indica que a variável crítica é o tempo de resposta do sistema. Em vez de circuitos integrados modernos, a solução factível residiria em válvulas termiônicas de catodo frio (como os tiratrons de gás nobre) e tubos de vácuo secundário de alta transcondutância.
2. **Materiais Substitutos**: Utilização de cristal de quartzo piezoelétrico cortado no ângulo AT para estabilização de frequência, juntamente com bobinas enroladas em núcleos de ferrita com isolamento de seda e verniz de baquelite.
3. **Precedente Documentado**: Mecanismos de compensação análogos foram empregados com sucesso em Bletchley Park (computador Colossus de Tommy Flowers, 1943) e no ciclotrão de Ernest Lawrence em Berkeley (1932), demonstrando viabilidade empírica sem violação de leis de conservação.`;
  }

  /**
   * Fornece auditoria de rigor científico e revisão por pares para qualquer evento
   */
  public static auditEventScientificRigor(event: TemporalEvent): AIEpistemicAudit {
    const status = event.scientificStatus || 'theoretical_untested';
    const isProven = status === 'proven';
    const isSupported = status === 'theoretical_untested' || status === 'computational';

    return {
      verdict: isProven ? 'approved' : isSupported ? 'restricted' : 'critical_barrier',
      verdictLabel: isProven
        ? 'COMPROVADO EXPERIMENTALMENTE (CONSENSO CIENTÍFICO)'
        : isSupported
        ? 'BASE TEÓRICA CONSISTENTE (AGUARDANDO MEDIÇÕES DIRETAS)'
        : 'HIPÓTESE ESPECULATIVA / CONJECTURA NÃO-CONFIRMADA',
      verdictScore: isProven ? 98 : isSupported ? 75 : 45,
      thermodynamicAssessment:
        `O evento "${event.title}" (${formatHistoricalYear(event.year)}) está ancorado na conservação local de energia-momento ($T^{\\mu\\nu}_{;\\nu} = 0$) e na 2ª Lei da Termodinâmica ($\\Delta S \\ge 0$).`,
      entropyDeltaFormula: 'S = -k_B \\sum p_i \\ln p_i \\quad \\implies \\quad \\Delta S_{\\text{universo}} > 0',
      lorentzInvarianceCheck:
        'Intervalo de espaço-tempo $ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2$ preservado como escalar invariante sob transformações de Lorentz.',
      causalFeasibilityRatio: isProven ? 100 : isSupported ? 80 : 50,
      materialHurdles: [
        {
          material: 'Aparato Experimental do Marco Histórico',
          requiredPurityOrTolerance: 'Conforme registrado nas publicações científicas originais do autor',
          historicalAvailabilityYear: event.year,
          acceleratedFeasibility: 'Marco historicamente consolidado e validado por replicação em múltiplos laboratórios mundiais.',
        },
      ],
      primaryAcademicSources: [
        {
          author: event.academicCitation ? event.academicCitation.split('(')[0].trim() : 'Comitê Científico Internacional',
          title: event.title,
          year: event.year,
          journalOrInstitution: event.doi ? `DOI: ${event.doi}` : 'Arquivos Históricos da Ciência',
          doiOrCitation: event.doi || 'Referência Acadêmica Registrada',
        },
      ],
      expertConsensusSummary:
        `Status epistemológico: ${status.toUpperCase()} (${event.evidenceKind || 'documentado'}). O marco possui rigor factual e fundamenta as ramificações posteriores da física moderna.`,
    };
  }

  /**
   * Gera uma análise contrafactual rigorosa sobre o que aconteceria caso um evento
   * fosse suprimido ou alterado no continuum espaço-temporal.
   */
  public static generateCounterfactualAnalysis(
    targetEvent: TemporalEvent,
    universe: Universe,
    action: 'erase' | 'alter' | 'branch' = 'erase'
  ): CounterfactualAnalysis {
    const allEvents = universe.dimensions.flatMap(d => d.events);
    const descendants = Array.from(GraphEngine.getDescendants(targetEvent.id, universe.edges));
    const descendantEvents = allEvents.filter(e => descendants.includes(e.id));
    const directChildren = GraphEngine.getChildren(targetEvent.id, universe.edges);

    // Identificação de desdobramentos específicos para os eventos descendentes
    const brokenDescendants = descendantEvents.slice(0, 6).map(desc => {
      let consequence = '';
      if (desc.category === 'MILITAR' || desc.category === 'GEOPOLÍTICA') {
        consequence = `Sem "${targetEvent.title}", a conjuntura geopolítica de ${desc.year} não atingiria a massa crítica necessária para este desfecho.`;
      } else if (desc.category === 'FÍSICA TEÓRICA' || desc.category === 'CIENTÍFICO') {
        consequence = `O paradigma epistêmico que possibilitou "${desc.title}" em ${desc.year} seria atrasado ou formulado sob outra base teórica.`;
      } else if (desc.category === 'TECNOLOGIA') {
        consequence = `A infraestrutura e as patentes tecnológicas de ${desc.year} seriam adiadas por ausência do salto causal precursor.`;
      } else {
        consequence = `O cone de luz causal deste marco é seccionado, impedindo a recepção do sinal histórico emitido em ${targetEvent.year}.`;
      }
      return {
        id: desc.id,
        title: desc.title,
        year: desc.year,
        consequenceIfMissing: consequence,
      };
    });

    // Análise contextual contrafactual baseada na categoria e dados do evento
    const titleLower = targetEvent.title.toLowerCase();
    let whatIfNonExistent = '';
    let alternateHistoryHypothesis = '';

    if (
      titleLower.includes('polônia') ||
      titleLower.includes('polonia') ||
      titleLower.includes('guerra mundial') ||
      titleLower.includes('segunda guerra')
    ) {
      whatIfNonExistent =
        `Caso a invasão da Polônia em ${targetEvent.year} não tivesse ocorrido, a crise diplomática europeia não teria desencadeado a mobilização imediata das garantias de segurança anglo-francesas. O esforço industrial massivo focado em armas nucleares (Projeto Manhattan) e computação criptográfica em Bletchley Park seria desacelerado ou redirecionado, alterando profundamente o ritmo da revolução digital e da física nuclear aplicada.`;
      alternateHistoryHypothesis =
        'Preservação temporária da ordem de Versalhes, com polarização regional contida e desenvolvimento retardado de reatores nucleares e tecnologia de radar por micro-ondas.';
    } else if (
      titleLower.includes('relatividade') ||
      titleLower.includes('lorentz') ||
      titleLower.includes('einstein')
    ) {
      whatIfNonExistent =
        `A ausência da formulação teórica de "${targetEvent.title}" (${targetEvent.year}) manteria a física presa às inconsistências do éter luminífero clássico. O atraso na unificação espaço-temporal comprometeria diretamente o desenvolvimento posterior da física quântica relativística (Equação de Dirac), da astrofísica de altas energias e da sincronicidade atômica exigida por sistemas modernos de navegação por satélite (GPS).`;
      alternateHistoryHypothesis =
        'Continuidade do programa mecanicista de Maxwell-Lorentz, adiando em pelo menos duas décadas a compreensão da dilatação temporal e da equivalência massa-energia ($E=mc^2$).';
    } else if (
      titleLower.includes('apollo') ||
      titleLower.includes('lua') ||
      titleLower.includes('sputnik') ||
      titleLower.includes('gagarin') ||
      titleLower.includes('telescópio') ||
      titleLower.includes('webb') ||
      titleLower.includes('hubble')
    ) {
      whatIfNonExistent =
        `Sem o marco de "${targetEvent.title}" (${targetEvent.year}), o vetor aeroespacial e astronômico perderia seu ponto de ancoragem causal mais relevante. O investimento estatal e privado em engenharia de propulsão, materiais de isolamento térmico avançados e transmissão telemétrica por micro-ondas sofreria retração, atrasando o mapeamento cosmológico profundo e a observação da radiação primordial do universo.`;
      alternateHistoryHypothesis =
        'Exploração planetária postergada para a virada do milênio, com foco temporário restrito a balística suborbital e satélites meteorológicos de baixa altitude.';
    } else {
      whatIfNonExistent =
        `Se o evento "${targetEvent.title}" (${targetEvent.year}) fosse suprimido do continuum, todo o cone de luz futuro emitido a partir de suas coordenadas espaço-temporais seria cancelado ($ds^2 > 0$ em relação às trajetórias dependentes). Na dinâmica de sistemas complexos, isso remove ${directChildren.length} causa(s) direta(s) e reorganiza as geodésicas de ${descendantEvents.length} marco(s) subsequente(s), gerando uma divergência causal acumulada proporcional ao expoente de Lyapunov do atrator histórico.`;
      alternateHistoryHypothesis =
        `A evolução temporal da linha "${universe.name}" derivaria para um novo ramo ortogonal de decoerência, forçando as leis de conservação e a causalidade de Novikov a reequilibrar os vetores de estado sem os efeitos desencadeados por "${targetEvent.title}".`;
    }

    const causalSummary = action === 'erase'
      ? `Supressão irreversível de "${targetEvent.title}" (${targetEvent.year}) com anulação de ${descendantEvents.length} consequência(s) subsequente(s) no cone de luz.`
      : `Perturbação do estado de "${targetEvent.title}" (${targetEvent.year}), induzindo desfasamento de probabilidade nos ramos derivados.`;

    const physicalPrinciples = [
      {
        principle: 'Estrutura Causal & Cones de Luz de Minkowski',
        formula: 'ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2',
        implication: 'A velocidade da luz c é a taxa máxima de transmissão causal; anular o vértice no passado extingue a emissão de sinais para todo o cone de luz futuro.',
      },
      {
        principle: 'Divergência Exponencial de Lyapunov (Efeito Borboleta)',
        formula: '|\\Delta x(t)| \\sim |\\Delta x_0| \\, e^{\\lambda t} \\quad (\\lambda > 0)',
        implication: 'Variações infinitesimais no ponto de bifurcação amplificam-se exponencialmente, transformando pequenas alterações locais em destinos globais divergentes.',
      },
      {
        principle: 'Interpretação de Muitos Mundos de Everett & Decoerência',
        formula: '|\\Psi(t)\\rangle = \\sum c_i |\\psi_i(t)\\rangle \\otimes |\\text{Ambiente}_i(t)\\rangle',
        implication: 'A realidade não é apagada em sentido absoluto, mas bifurcada: cria-se um ramo ortogonal onde este evento nunca ocorreu, enquanto a linha original subsiste em decoerência.',
      },
      {
        principle: 'Princípio de Autoconsistência Global de Novikov',
        formula: '\\Delta S_{\\text{total}} \\ge 0 \\quad\\Big|\\quad \\mathcal{P}(\\text{paradoxo}) = 0',
        implication: 'O continuum físico impõe probabilidade nula a contradições temporais insolúveis, forçando o ajuste termodinâmico da nova história.',
      },
    ];

    return {
      targetEventTitle: targetEvent.title,
      targetEventYear: targetEvent.year,
      causalSummary,
      whatIfNonExistent,
      brokenDescendants,
      alternateHistoryHypothesis,
      physicalPrinciples,
    };
  }

  /**
   * Consulta a IA (OpenRouter / GPT-4o) para gerar um relatório contrafactual
   * aprofundado, rigorosamente acadêmico e não-ficcional sobre a ausência do evento.
   */
  public static async fetchAICounterfactualReport(
    targetEvent: TemporalEvent,
    universe: Universe
  ): Promise<string> {
    const cacheKey = `counterfactual:${universe.id}:${targetEvent.id}`;
    const cached = this.getCached<string>(cacheKey);
    if (cached) return cached;

    if (this.config.provider === 'openrouter' && this.config.apiKey) {
      try {
        const prompt = `Analise a causalidade contrafactual com rigor acadêmico absoluto:
O evento "${targetEvent.title}" (Ano ${targetEvent.year}, Categoria: ${targetEvent.category}, Importância: ${targetEvent.importance}/100) foi suprimido ou impedido de ocorrer no continuum temporal.
Descrição factual original do evento: "${targetEvent.description}".
Contexto da realidade: "${universe.name}".

DIRETRIZES MANDATÓRIAS (ESTRITAMENTE ACADÊMICO & NÃO-FICÇÃO):
1. Explique com profundidade historiográfica ou física: O que a ciência e a historiografia reconhecida sustentam que teria acontecido caso esse evento NUNCA tivesse existido?
2. Quais desenvolvimentos científicos, tecnológicos, institucionais ou cosmológicos específicos seriam adiados, inviabilizados ou tomariam rumos alternativos?
3. Fundamente a resposta em teorias formais (Cones de luz de Minkowski, Interpretação de Muitos Mundos de Everett, Dinâmica não linear de Lyapunov) ou historiadores e fontes primárias reais.
4. É TERMINANTEMENTE PROIBIDO usar fantasia, ficção científica clichê ou magia. Mantenha tom de artigo científico e utilize Markdown formal com equações em LaTeX ($...$).`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
            'HTTP-Referer': 'https://infinite-horizons.app',
            'X-Title': 'Infinite Horizons Counterfactual Analysis',
          },
          body: JSON.stringify({
            model: this.config.openRouterModel || 'openai/gpt-4o-mini',
            temperature: 0.2,
            max_tokens: 1200,
            messages: [
              {
                role: 'system',
                content:
                  'Você é o Historiador da Ciência e Físico Causal do laboratório Infinite Horizons. Sua função é elaborar análises contrafactuais estritamente acadêmicas, fundamentadas em fontes primárias e física teórica formal, sem nenhum teor ficcional ou fantasioso.',
              },
              { role: 'user', content: prompt },
            ],
          }),
        });

        if (response.ok) {
          const res = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
          const content = res.choices?.[0]?.message?.content;
          if (content) {
            this.responseCache.set(cacheKey, { data: content, timestamp: Date.now() });
            return content;
          }
        }
      } catch (err) {
        console.warn('Falha na chamada remota de contrafactual IA:', err);
      }
    }

    // Grounded fallback synthesis
    const local = this.generateCounterfactualAnalysis(targetEvent, universe);
    const synthesis = `### Análise Contrafactual Acadêmica: Ausência de "${local.targetEventTitle}" (${local.targetEventYear})

${local.whatIfNonExistent}

#### Ramificação Causal e Hipótese Histórica Alternativa
${local.alternateHistoryHypothesis}

${local.brokenDescendants.length > 0 ? `#### Desdobramentos nos Marcos Subsequentes\n${local.brokenDescendants.map(d => `- **${d.title} (${d.year})**: ${d.consequenceIfMissing}`).join('\n')}` : ''}

#### Fundamentação em Leis Físicas
- **Cones de Luz de Minkowski**: $ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2$ — Nenhuma influência causal transita mais rápido que a luz no vácuo;
- **Divergência de Lyapunov**: $|\\Delta x(t)| \\sim e^{\\lambda t}$ — A supressão perturba a trajetória do atrator histórico;
- **Bifurcação de Everett**: $|\\Psi(t)\\rangle = \\sum c_i |\\psi_i\\rangle$ — A conservação de probabilidade projeta a realidade em um ramo ortogonal e causalmente autônomo.`;

    this.responseCache.set(cacheKey, { data: synthesis, timestamp: Date.now() });
    return synthesis;
  }
}

