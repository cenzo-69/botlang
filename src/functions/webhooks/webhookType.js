'use strict';

const { argError } = require('../../core/fnError');
// $webhookType[webhookID]  — returns webhook type (Incoming/ChannelFollower/Application)
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const wh    = await context.client?.fetchWebhook(id);
    const types = { 1: 'Incoming', 2: 'ChannelFollower', 3: 'Application' };
    return types[wh?.type] ?? String(wh?.type ?? '');
  } catch (err) { return `[error: $webhookType — ${err.message}]`; }
};
