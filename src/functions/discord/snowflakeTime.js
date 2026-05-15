'use strict';

const { argError } = require('../../core/fnError');

// $snowflakeTime[id;format?]
// Converts a Discord snowflake ID to a timestamp.
// format: "ms" (ms since epoch) | "s" (seconds) | "discord" → <t:...> tag (default)
const DISCORD_EPOCH = 1420070400000n;

module.exports = async (context, args) => {
  const id     = String(args[0] !== undefined ? args[0] : '').trim();
  const format = String(args[1] !== undefined ? args[1] : '').trim().toLowerCase() || 'discord';

  if (!id) return argError(context, 'id', 'string', id);

  try {
    const ms   = Number((BigInt(id) >> 22n) + DISCORD_EPOCH);
    const unix = Math.floor(ms / 1000);
    if (format === 'ms')      return String(ms);
    if (format === 's')       return String(unix);
    return `<t:${unix}:f>`;
  } catch {
    return '[error: Invalid snowflake ID!]';
  }
};
