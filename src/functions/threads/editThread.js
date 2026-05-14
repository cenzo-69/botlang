'use strict';

const { argError } = require('../../core/fnError');

// $editThread[threadID;name?;archived?;archiveDuration?;locked?;slowmode?;reason?]
// Edits a thread's properties. Pass empty string to skip a field.
// archiveDuration: 60|1440|4320|10080 (minutes)
module.exports = async (context, args) => {
  const threadID       = String(args[0] !== undefined ? args[0] : '').trim();
  const name           = String(args[1] !== undefined ? args[1] : '').trim();
  const archivedRaw    = String(args[2] !== undefined ? args[2] : '').trim().toLowerCase();
  const archiveDurRaw  = String(args[3] !== undefined ? args[3] : '').trim();
  const lockedRaw      = String(args[4] !== undefined ? args[4] : '').trim().toLowerCase();
  const slowmodeRaw    = String(args[5] !== undefined ? args[5] : '').trim();
  const reason         = String(args[6] !== undefined ? args[6] : '').trim() || 'No reason provided';

  if (!threadID) return argError(context, 'thread ID', 'Snowflake', threadID);
  if (!context.client) return '[error: $editThread — no client]';

  try {
    const thread = await context.client.channels.fetch(threadID);
    if (!thread) return '[error: $editThread — thread not found]';

    const edits = {};
    if (name)                                      edits.name              = name;
    if (archivedRaw === 'true' || archivedRaw === 'false') edits.archived  = archivedRaw === 'true';
    if (archiveDurRaw !== '') {
      const d = parseInt(archiveDurRaw);
      if (!isNaN(d)) edits.autoArchiveDuration = d;
    }
    if (lockedRaw === 'true' || lockedRaw === 'false') edits.locked        = lockedRaw === 'true';
    if (slowmodeRaw !== '') {
      const s = parseInt(slowmodeRaw);
      if (!isNaN(s)) edits.rateLimitPerUser = s;
    }

    await thread.edit(edits, reason);
    return '';
  } catch (err) {
    return `[error: $editThread — ${err.message}]`;
  }
};
