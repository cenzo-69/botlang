'use strict';

// $aiDecide[content;question]
// Asks AI to answer a yes/no question about the content. Returns "true" or "false".
module.exports = async (context, args) => {
  const content  = String(args[0] !== undefined ? args[0] : '').trim();
  const question = String(args[1] !== undefined ? args[1] : '').trim();

  if (!content)  return '[error: $aiDecide requires content]';
  if (!question) return '[error: $aiDecide requires a question]';

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return '[error: $aiDecide — OPENAI_API_KEY is not set]';

  const messages = [
    { role: 'system', content: 'You are a classifier. Answer ONLY with "true" or "false" and nothing else.' },
    { role: 'user',   content: `Content: ${content}\nQuestion: ${question}` },
  ];

  try {
    const res  = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body:    JSON.stringify({ model: 'gpt-4o-mini', messages, max_tokens: 5 }),
    });
    const data = await res.json();
    if (data.error) return `[error: $aiDecide — ${data.error.message}]`;
    const reply = (data.choices?.[0]?.message?.content ?? '').trim().toLowerCase();
    return reply.startsWith('true') ? 'true' : 'false';
  } catch (err) {
    return `[error: $aiDecide — ${err.message}]`;
  }
};
