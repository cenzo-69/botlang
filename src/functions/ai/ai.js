'use strict';

// $ai[prompt;systemPrompt?;maxTokens?]
// Sends a one-shot prompt to OpenAI and returns the reply text.
// Requires OPENAI_API_KEY in environment variables.
module.exports = async (context, args) => {
  const prompt      = String(args[0] !== undefined ? args[0] : '').trim();
  const sysPrompt   = String(args[1] !== undefined ? args[1] : '').trim();
  const maxTokens   = parseInt(args[2]) || 512;

  if (!prompt) return '[error: $ai requires a prompt]';

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return '[error: $ai — OPENAI_API_KEY is not set]';

  const messages = [];
  if (sysPrompt) messages.push({ role: 'system', content: sysPrompt });
  messages.push({ role: 'user', content: prompt });

  try {
    const res  = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body:    JSON.stringify({ model: 'gpt-4o-mini', messages, max_tokens: maxTokens }),
    });
    const data = await res.json();
    if (data.error) return `[error: $ai — ${data.error.message}]`;
    const reply = data.choices?.[0]?.message?.content ?? '';
    const used  = (context.variables.get('__ai_tokens__') || 0) + (data.usage?.total_tokens || 0);
    context.variables.set('__ai_tokens__', used);
    return reply.trim();
  } catch (err) {
    return `[error: $ai — ${err.message}]`;
  }
};
