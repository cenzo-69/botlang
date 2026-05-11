'use strict';

// $uptime[format?]
// Returns the bot's uptime.
// format: "human" (default) → "2d 3h 15m 4s"
//         "seconds"         → raw seconds
//         "ms"              → raw milliseconds
module.exports = async (context, args) => {
  const format = String(args[0] !== undefined ? args[0] : '').trim().toLowerCase() || 'human';

  // Try client.uptime (ms since login); fall back to process.uptime (seconds since start)
  const ms = context.client?.uptime ?? Math.round(process.uptime() * 1000);

  if (format === 'ms')      return String(ms);
  if (format === 'seconds') return String(Math.floor(ms / 1000));

  // Human-readable
  let remaining = Math.floor(ms / 1000);
  const d = Math.floor(remaining / 86400); remaining %= 86400;
  const h = Math.floor(remaining / 3600);  remaining %= 3600;
  const m = Math.floor(remaining / 60);    remaining %= 60;
  const s = remaining;

  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(' ');
};
