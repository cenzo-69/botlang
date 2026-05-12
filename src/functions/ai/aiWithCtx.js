'use strict';

// $aiWithCtx[prompt;systemPrompt?;maxTokens?]
// Same as $ai but maintains conversation history across multiple calls in the same script run.
// History is stored in __ai_history__ context variable.
module.exports = async (context, args) => {
  const prompt    = String(args[0] !== undefined ? args[0] : '').trim();
  const sysPrompt = String(args[1] !== undefined ? args[1] : '').trim();
  const maxTokens = parseInt(args[2]) || 512;

  if (!prompt) return '[error: $aiWithCtx requires a prompt]';

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return '[error: $aiWithCtx — OPENAI_API_KEY is not set]';

  const history = context.variables.get('__ai_history__') || [];

  const messages = [];
  if (sysPrompt) messages.push({ role: 'system', content: sysPrompt });
  messages.push(...history, { role: 'user', content: prompt });

  try {
    const res  = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body:    JSON.stringify({ model: 'gpt-4o-mini', messages, max_tokens: maxTokens }),
    });
    const data = await res.json();
    if (data.error) return `[error: $aiWithCtx — ${data.error.message}]`;

    const reply = data.choices?.[0]?.message?.content ?? '';
    history.push({ role: 'user', content: prompt });
    history.push({ role: 'assistant', content: reply });
    context.variables.set('__ai_history__', history);

    const used = (context.variables.get('__ai_tokens__') || 0) + (data.usage?.total_tokens || 0);
    context.variables.set('__ai_tokens__', used);
    return reply.trim();
  } catch (err) {
    return `[error: $aiWithCtx — ${err.message}]`;
  }
};
