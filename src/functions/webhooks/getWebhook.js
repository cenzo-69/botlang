'use strict';

const { argError } = require('../../core/fnError');
// $getWebhook[webhookID;property?]  — fetches a webhook and returns a property
// property: id|name|token|url|channelID|guildID|avatarURL|type
module.exports = async (context, args) => {
  const id  = String(args[0] !== undefined ? args[0] : '').trim();
  const ret = String(args[1] !== undefined ? args[1] : 'id').toLowerCase();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const wh = await context.client?.fetchWebhook(id);
    if (!wh) return '[error: $getWebhook — webhook not found]';
    switch (ret) {
      case 'name':      return wh.name ?? '';
      case 'token':     return wh.token ?? '';
      case 'url':       return wh.url ?? '';
      case 'channelid': return wh.channelId ?? '';
      case 'guildid':   return wh.guildId ?? '';
      case 'avatarurl': return wh.avatarURL() ?? '';
      case 'type':      return String(wh.type);
      default:          return wh.id;
    }
  } catch (err) { return `[error: $getWebhook — ${err.message}]`; }
};
