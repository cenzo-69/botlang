'use strict';

// $aiAgent[prompt;systemPrompt?;maxTokens?]
// An AI agent that can reason and call back into $ai if needed.
// In practice this is a richer $ai call with a more capable system prompt.
// For full function-calling, integrate tool definitions in your bot layer.
module.exports = async (context, args) => {
  const prompt    = String(args[0] !== undefined ? args[0] : '').trim();
  const sysPrompt = String(args[1] !== undefined ? args[1] : 'You are a helpful assistant agent. Think step by step and provide a complete answer.').trim();
  const maxTokens = parseInt(args[2]) || 1024;

  if (!prompt) return '[error: $aiAgent requires a prompt]';

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return '[error: $aiAgent — OPENAI_API_KEY is not set]';

  const messages = [
    { role: 'system', content: sysPrompt },
    { role: 'user',   content: prompt },
  ];

  try {
    const res  = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body:    JSON.stringify({ model: 'gpt-4o', messages, max_tokens: maxTokens }),
    });
    const data = await res.json();
    if (data.error) return `[error: $aiAgent — ${data.error.message}]`;
    const reply = data.choices?.[0]?.message?.content ?? '';
    const used  = (context.variables.get('__ai_tokens__') || 0) + (data.usage?.total_tokens || 0);
    context.variables.set('__ai_tokens__', used);
    return reply.trim();
  } catch (err) {
    return `[error: $aiAgent — ${err.message}]`;
  }
};
