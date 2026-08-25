# Infinite-Horizons

Infinite-Horizons e um laboratorio visual para experimentar causalidade, viagens temporais e realidades paralelas.

O fluxo principal começa pelo tema: descreva algo como `Segunda Guerra Mundial`, e o sistema cria uma linha temporal específica para esse assunto. Depois, cada evento pode ser modificado, apagado ou usado como ponto de uma viagem temporal para observar o efeito borboleta.

## Rigor científico

As explicações exibidas nos eventos distinguem relatividade geral, teoria do caos e teoria das cordas. A relatividade geral é tratada como teoria consolidada; o efeito borboleta é relacionado à sensibilidade a condições iniciais em sistemas caóticos; e a teoria das cordas é apresentada como proposta teórica sem confirmação experimental. Resultados do grafo são consequências das premissas inseridas, não previsões do mundo real.

O projeto combina uma interface de exploracao com um motor de simulacao que propaga alteracoes pela cadeia causal, mede a integridade temporal e detecta paradoxos emergentes.

## Executar localmente

```bash
npm install
npm run dev
```

## Publicar na Vercel

O repositorio ja possui `vercel.json` na raiz. Na criacao do projeto Vercel, mantenha a raiz do repositorio como `Root Directory`; o build sera executado dentro de `infinite` e o resultado publicado sera `infinite/dist`.

Para publicar pela CLI:

```bash
npx vercel
npx vercel --prod
```

O endpoint `/api/temporal` protege as credenciais e aceita OpenAI ou Azure OpenAI. Configure `OPENAI_API_KEY` e `OPENAI_MODEL`, ou `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY` e `AZURE_OPENAI_DEPLOYMENT`, em Project Settings > Environment Variables. As chaves nunca devem usar o prefixo `VITE_`.

Para validar a build de producao:

```bash
npm run build
```

## IA e pesquisa historica

Copie `.env.example` para `.env.local` para configurar um endpoint proprio:

```env
VITE_AI_ENDPOINT=https://seu-backend.example/api/temporal
VITE_AI_PROVIDER=custom_api
```

O frontend pesquisa fontes publicas como fallback. Chaves de provedores de IA devem permanecer no backend e nunca em variaveis `VITE_`.

As sessoes do simulador sao salvas automaticamente no armazenamento local do navegador e podem ser reiniciadas pelo botao `Resetar`.

## Stack

- React 19
- TypeScript
- Vite
- Canvas API para a visualizacao temporal
- Oxlint
