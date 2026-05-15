'use strict';

const { argError } = require('../../core/fnError');

// $poll[question;option1;option2;...;option9]
// Sends a formatted poll message to the channel and auto-adds number emoji reactions.
// Supports 2–9 options.
module.exports = async (context, args) => {
  const question = String(args[0] !== undefined ? args[0] : '').trim();
  const options  = args.slice(1).filter(a => String(a).trim() !== '');

  if (!question)          return argError(context, 'question', 'string', question);
  if (options.length < 2) return '[error: $poll requires at least 2 options!]';
  if (options.length > 9) return '[error: $poll supports up to 9 options!]';

  const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

  const lines = [`📊 **${question}**`, ''];
  options.forEach((opt, i) => lines.push(`${numberEmojis[i]} ${opt}`));

  const channel = context.message?.channel;
  if (!channel) return '[error: No channel!]';

  try {
    const sent = await channel.send(lines.join('\n'));
    for (let i = 0; i < options.length; i++) {
      await sent.react(numberEmojis[i]);
    }
    return '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
