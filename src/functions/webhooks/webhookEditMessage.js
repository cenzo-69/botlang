'use strict';
// $webhookEditMessage[webhookID;messageID;newContent;threadID?]  — edits a webhook message
module.exports = async (context, args) => {
  const id        = String(args[0] !== undefined ? args[0] : '').trim();
  const messageID = String(args[1] !== undefined ? args[1] : '').trim();
  const content   = String(args[2] !== undefined ? args[2] : '');
  const threadID  = args[3] !== undefined ? String(args[3]).trim() : undefined;
  if (!id || !messageID) return '[error: $webhookEditMessage — webhookID and messageID are required]';
  try {
    const wh   = await context.client?.fetchWebhook(id);
    if (!wh)   return '[error: $webhookEditMessage — webhook not found]';
    const opts = { content };
    if (threadID) opts.threadId = threadID;
    await wh.editMessage(messageID, opts);
    return '';
  } catch (err) { return `[error: $webhookEditMessage — ${err.message}]`; }
};
