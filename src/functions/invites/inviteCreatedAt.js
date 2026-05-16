'use strict';

const { argError } = require('../../core/fnError');

// $inviteCreatedAt[code;format?]
// Returns the creation time of an invite in the requested format.
//
// format options:
//   iso      (default) — "2024-01-01T00:00:00.000Z"
//   unix               — Unix timestamp in seconds
//   ms                 — Unix timestamp in milliseconds
//   discord            — <t:unix:R> relative Discord timestamp
//   discord:F          — <t:unix:F> full date+time
//   discord:D          — <t:unix:D> short date
//   discord:T          — <t:unix:T> short time
//   discord:R          — <t:unix:R> relative (same as discord)
module.exports = async (context, args) => {
  const code   = String(args[0] !== undefined ? args[0] : '').trim();
  const format = String(args[1] !== undefined ? args[1] : 'iso').trim().toLowerCase();

  if (!code) return argError(context, 'code', 'string', code);
  if (!context.client) return '[error: No client!]';

  try {
    const invite = await context.client.fetchInvite(code);
    const date   = invite.createdAt ?? null;

    if (!date) return '';

    const unix = Math.floor(date.getTime() / 1000);

    switch (format) {
      case 'unix':      return String(unix);
      case 'ms':        return String(date.getTime());
      case 'discord':
      case 'discord:r': return `<t:${unix}:R>`;
      case 'discord:f': return `<t:${unix}:F>`;
      case 'discord:d': return `<t:${unix}:D>`;
      case 'discord:t': return `<t:${unix}:T>`;
      default:          return date.toISOString();
    }
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
