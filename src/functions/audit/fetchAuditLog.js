'use strict';
// $fetchAuditLog[guildID;type;property;index?;separator?]
// type: 1=GuildUpdate, 20=MemberKick, 21=MemberPrune, 22=MemberBanAdd, etc.
// property: id|userId|targetId|reason|actionType|createdAt
module.exports = async (context, args) => {
  const guildID  = String(args[0] !== undefined ? args[0] : '').trim();
  const type     = parseInt(args[1] !== undefined ? args[1] : 0);
  const property = String(args[2] !== undefined ? args[2] : 'id').toLowerCase();
  const index    = parseInt(args[3] !== undefined ? args[3] : 0) || 0;
  const sep      = String(args[4] !== undefined ? args[4] : ', ');
  if (!guildID)  return '[error: $fetchAuditLog — guildID is required]';
  if (isNaN(type)) return '[error: $fetchAuditLog — type must be an audit log action integer]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    if (!guild) return '[error: $fetchAuditLog — guild not found]';
    const logs  = await guild.fetchAuditLogs({ type, limit: Math.max(1, index + 1) });
    const entry = [...logs.entries.values()][index];
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
  } catch (err) { return `[error: $fetchAuditLog — ${err.message}]`; }
};
