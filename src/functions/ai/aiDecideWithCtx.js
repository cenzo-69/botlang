'use strict';

// $aiDecideWithCtx[question]
// Like $aiDecide but uses the current $aiWithCtx conversation history as the content.
module.exports = async (context, args) => {
  const question = String(args[0] !== undefined ? args[0] : '').trim();
  if (!question) return '[error: $aiDecideWithCtx requires a question]';

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return '[error: $aiDecideWithCtx — OPENAI_API_KEY is not set]';

  const history = context.variables.get('__ai_history__') || [];

  const messages = [
    { role: 'system', content: 'You are a classifier. Answer ONLY with "true" or "false" based on the conversation.' },
    ...history,
    { role: 'user', content: question },
  ];

  try {
    const res  = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body:    JSON.stringify({ model: 'gpt-4o-mini', messages, max_tokens: 5 }),
    });
    const data = await res.json();
    if (data.error) return `[error: $aiDecideWithCtx — ${data.error.message}]`;
    const reply = (data.choices?.[0]?.message?.content ?? '').trim().toLowerCase();
    return reply.startsWith('true') ? 'true' : 'false';
  } catch (err) {
    return `[error: $aiDecideWithCtx — ${err.message}]`;
  }
};
