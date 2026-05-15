'use strict';

const { argError } = require('../../core/fnError');
// $webhookEdit[webhookID;name?;avatarURL?;channelID?;reason?]  — edits a webhook
module.exports = async (context, args) => {
  const id        = String(args[0] !== undefined ? args[0] : '').trim();
  const name      = args[1] !== undefined ? String(args[1]).trim() : undefined;
  const avatar    = args[2] !== undefined ? String(args[2]).trim() : undefined;
  const channelID = args[3] !== undefined ? String(args[3]).trim() : undefined;
  const reason    = args[4] !== undefined ? String(args[4]) : undefined;
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const wh = await context.client?.fetchWebhook(id);
    if (!wh) return '[error: Webhook not found!]';
    const opts = {};
    if (name)      opts.name   = name;
    if (avatar)    opts.avatar = avatar;
    if (channelID) opts.channel = channelID;
    if (reason)    opts.reason  = reason;
    await wh.edit(opts);
    return '';
  } catch (err) { return `[error: ${err.message}!]`; }
};
