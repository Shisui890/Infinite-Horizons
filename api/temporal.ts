type Task = 'historical_event_research' | 'create_temporal_universe';

interface RequestBody {
  task?: Task;
  query?: string;
  topic?: string;
  mode?: 'historical' | 'theoretical';
  model?: string;
  language?: string;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function getModelConfig(customModel?: string) {
  // 1. OpenRouter (prioridade quando configurado ou chave sk-or- detectada)
  const openRouterKey = process.env.OPENROUTER_API_KEY || (process.env.OPENAI_API_KEY?.startsWith('sk-or-') ? process.env.OPENAI_API_KEY : undefined);
  if (openRouterKey) {
    return {
      provider: 'openrouter',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      key: openRouterKey,
      header: 'Authorization',
      model: customModel || process.env.OPENROUTER_MODEL || process.env.OPENAI_MODEL || 'anthropic/claude-3.5-sonnet',
      extraHeaders: {
        'HTTP-Referer': 'https://infinite-horizons.app',
        'X-Title': 'Infinite Horizons Temporal Simulator',
      },
    };
  }

  // 2. Azure OpenAI
  const isAzure = Boolean(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY);
  if (isAzure) {
    return {
      provider: 'azure',
      url: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION || '2024-10-21'}`,
      key: process.env.AZURE_OPENAI_API_KEY,
      header: 'api-key',
      model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini',
      extraHeaders: {},
    };
  }

  // 3. OpenAI Padrão
  return {
    provider: 'openai',
    url: 'https://api.openai.com/v1/chat/completions',
    key: process.env.OPENAI_API_KEY,
    header: 'Authorization',
    model: customModel || process.env.OPENAI_MODEL || 'gpt-4o-mini',
    extraHeaders: {},
  };
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') return json({ error: 'Método não permitido' }, 405);

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return json({ error: 'Corpo JSON inválido' }, 400);
  }

  const subject = body.query || body.topic;
  if (!subject?.trim() || !body.task) {
    return json({ error: 'Os campos "task" e "query/topic" são obrigatórios' }, 400);
  }

  const config = getModelConfig(body.model);
  if (!config.key) {
    return json(
      {
        error:
          'Nenhum provedor de IA configurado no servidor. Defina OPENROUTER_API_KEY (recomendado) ou OPENAI_API_KEY no arquivo .env.',
      },
      503
    );
  }

  const systemPrompt = `Você é o Oráculo Científico e Pesquisador Físico-Temporal do laboratório Infinite Horizons.
Sua missão é estruturar dados históricos, observações cosmológicas e modelos de física teórica com rigor e realismo (ex.: Relatividade Geral de Einstein, Teoria das Supercordas/Teoria M em 11 dimensões, Mecânica Quântica e Multiverso de Everett, Termodinâmica e Princípio de Novikov).
SEMPRE separe fatos documentados, teorias científicas estabelecidas e hipóteses matemáticas especulativas.
Retorne SEMPRE E APENAS JSON válido, sem texto introdutório ou markdown ao redor.`;

  const instruction =
    body.task === 'historical_event_research'
      ? `Pesquise minuciosamente o tema científico ou evento: "${subject}".
Retorne APENAS um objeto JSON com os seguintes campos:
- "title": título do evento/descoberta
- "description": descrição rica, clara e fundamentada (citando cientistas, teorias ou experimentos reais)
- "year": ano numérico (ex: 1915, 1965, 2015, 2022)
- "category": uma entre "CIENTÍFICO", "HISTÓRICO", "TECNOLÓGICO", "OBSERVAÇÃO", "COSMOLOGIA", "FÍSICA TEÓRICA"
- "importance": número de 1 a 100 indicando o impacto causal
- "source": citação da fonte ou artigo/experimento (ex: "Albert Einstein, Annalen der Physik", "LIGO Scientific Collaboration", "ESA/NASA JWST")
- "evidenceKind": "documented_fact" para observações/experimentos comprovados ou "scientific_theory" para modelos matemáticos
- "confidence": número de 1 a 100
- "uncertainty": nota sobre limitações experimentais ou premissas do modelo`
      : `Crie um modelo temporal-causal fascinante e realista para o tema: "${subject}" em modo ${
          body.mode === 'theoretical' ? 'MODELO TEÓRICO / FÍSICA AVANÇADA' : 'RECONSTRUÇÃO HISTÓRICO-CIENTÍFICA'
        }.
Retorne APENAS um objeto JSON com:
- "universeName": nome cativante e rigoroso para a linha de realidade
- "description": síntese da premissa física/histórica
- "events": array contendo entre 4 e 8 eventos temporais ordenados cronologicamente. Cada evento deve conter:
  - "title": título marcante
  - "description": detalhes do marco, premissas teóricas ou descoberta
  - "year": ano numérico
  - "category": "CIENTÍFICO", "OBSERVAÇÃO", "COSMOLOGIA", "FÍSICA TEÓRICA", "HISTÓRICO" ou "TECNOLÓGICO"
  - "importance": número de 1 a 100
  - "sourceUrl": link ou referência da teoria/publicação
  - "evidenceKind": "documented_fact" ou "scientific_theory"
  - "evidenceConfidence": número de 1 a 100
  - "uncertainty": margem de incerteza do modelo
  - "causes": array com índices ou IDs de eventos que causam este (ex: ["[0]"] para o primeiro evento da lista)`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config.extraHeaders,
  };
  headers[config.header] = config.header === 'Authorization' ? `Bearer ${config.key}` : config.key || '';

  try {
    const payload: Record<string, unknown> = {
      model: config.model,
      temperature: 0.15,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: instruction },
      ],
    };

    // response_format json_object if supported
    if (config.provider === 'openai' || config.provider === 'azure') {
      payload.response_format = { type: 'json_object' };
    }

    const response = await fetch(config.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return json(
        { error: `Falha na requisição ao provedor ${config.provider}: ${response.status} — ${errorText}` },
        502
      );
    }

    const result = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = result.choices?.[0]?.message?.content;
    if (!content) return json({ error: 'O provedor de IA retornou uma resposta vazia' }, 502);

    // Limpar delimitadores de markdown caso o modelo tenha incluído ```json ... ```
    const cleanContent = content
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleanContent);
    return json(parsed);
  } catch (error) {
    return json(
      { error: `Erro ao processar dados de IA: ${error instanceof Error ? error.message : String(error)}` },
      502
    );
  }
}
