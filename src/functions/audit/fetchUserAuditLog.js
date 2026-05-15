'use strict';

const { argError } = require('../../core/fnError');
// $fetchUserAuditLog[guildID;userID?;type;property;index?;separator?]
module.exports = async (context, args) => {
  const guildID  = String(args[0] !== undefined ? args[0] : '').trim();
  const userID   = String(args[1] !== undefined ? args[1] : '').trim();
  const type     = parseInt(args[2] !== undefined ? args[2] : 0);
  const property = String(args[3] !== undefined ? args[3] : 'id').toLowerCase();
  const index    = parseInt(args[4] !== undefined ? args[4] : 0) || 0;
  if (!guildID) return argError(context, 'guild ID', 'Snowflake', guildID);
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    if (!guild) return '[error: Guild not found!]';
    const logs  = await guild.fetchAuditLogs({ type, limit: 100 });
    let entries = [...logs.entries.values()];
    if (userID) entries = entries.filter(e => e.executor?.id === userID);
    const entry = entries[index];
    if (!entry) return '';
    switch (property) {
      case 'id':         return entry.id;
      case 'userid':     return entry.executor?.id ?? '';
      case 'targetid':   return entry.targetId ?? '';
      case 'reason':     return entry.reason ?? '';
      case 'actiontype': return String(entry.action);
      case 'createdat':  return entry.createdAt.toISOString();
      default:           return entry.id;
    }
  } catch (err) { return `[error: ${err.message}!]`; }
};
