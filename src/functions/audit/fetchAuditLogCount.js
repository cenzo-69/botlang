'use strict';
// $fetchAuditLogCount[guildID;type;userID?]  — returns count of audit log entries of given type
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const type    = parseInt(args[1] !== undefined ? args[1] : 0);
  const userID  = String(args[2] !== undefined ? args[2] : '').trim();
  if (!guildID) return '[error: $fetchAuditLogCount — guildID is required]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    if (!guild) return '[error: $fetchAuditLogCount — guild not found]';
    const opts = { type, limit: 100 };
    const logs  = await guild.fetchAuditLogs(opts);
    let entries = [...logs.entries.values()];
    if (userID) entries = entries.filter(e => e.executor?.id === userID);
    return String(entries.length);
  } catch (err) { return `[error: $fetchAuditLogCount — ${err.message}]`; }
};
