type Task = 'historical_event_research' | 'create_temporal_universe';

interface RequestBody {
  task?: Task;
  query?: string;
  topic?: string;
  mode?: 'historical' | 'theoretical';
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function getModelConfig() {
  const isAzure = Boolean(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY);
  return isAzure
    ? {
        url: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION || '2024-10-21'}`,
        key: process.env.AZURE_OPENAI_API_KEY,
        header: 'api-key',
      }
    : {
        url: 'https://api.openai.com/v1/chat/completions',
        key: process.env.OPENAI_API_KEY,
        header: 'Authorization',
      };
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: RequestBody;
  try {
    body = await request.json() as RequestBody;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const subject = body.query || body.topic;
  if (!subject?.trim() || !body.task) return json({ error: 'task and query/topic are required' }, 400);

  const config = getModelConfig();
  if (!config.key) return json({ error: 'AI provider is not configured on the server' }, 503);

  const instruction = body.task === 'historical_event_research'
    ? `Research the historical subject "${subject}". Return ONLY JSON with title, description, year, category, importance, source, evidenceKind, confidence, uncertainty. Never invent a source. Use documented facts and state uncertainty.`
    : `Create a temporal model for "${subject}" in ${body.mode === 'theoretical' ? 'theoretical model mode' : 'historical reconstruction mode'}. Return ONLY JSON with universeName, description and events. Include 4 to 8 events, each with title, description, year, category, importance, sourceUrl, evidenceKind, evidenceConfidence, uncertainty. Use only documented observations or established theories. Do not invent sources, people, measurements or discoveries. Causal links must be expressed with causes using event indexes such as [0], [1].`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  headers[config.header] = config.header === 'Authorization' ? `Bearer ${config.key}` : config.key || '';
  const response = await fetch(config.url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || undefined,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are a careful research assistant. Separate fact, scientific theory and inference. Output valid JSON only.' },
        { role: 'user', content: instruction },
      ],
    }),
  });

  if (!response.ok) return json({ error: 'AI provider request failed' }, 502);
  const result = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = result.choices?.[0]?.message?.content;
  if (!content) return json({ error: 'AI provider returned no content' }, 502);

  try {
    return json(JSON.parse(content));
  } catch {
    return json({ error: 'AI provider returned invalid structured data' }, 502);
  }
}
