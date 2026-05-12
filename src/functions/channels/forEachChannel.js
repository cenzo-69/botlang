'use strict';

// $forEachChannel[code;separator?]
// Iterates over every channel in the guild.
// Inside code use $channelID, $channelName, $loopIndex.
// Returns all iterations joined by separator (default newline).
module.exports = async (context, args) => {
  const code = String(args[0] ?? '');
  const sep  = args[1] !== undefined ? String(args[1]) : '\n';

  const guild = context.message?.guild;
  if (!guild) return '[forEachChannel error: no guild]';

  const channels = [...guild.channels.cache.values()];
  const results  = [];

  for (let i = 0; i < channels.length; i++) {
    const ch = channels[i];
    const vars = new Map(context.variables);
    vars.set('$channelID',   ch.id);
    vars.set('$channelName', ch.name);
    vars.set('$loopIndex',   String(i + 1));

    const subCtx = Object.assign(Object.create(Object.getPrototypeOf(context)), context, { variables: vars });
    try {
      const result = await context.runtime.execute(code, subCtx);
      results.push(result);
    } catch (e) {
      results.push(`[error: ${e.message}]`);
    }
  }

  return results.join(sep);
};
