'use strict';

// $getAttachments[(index)]
// Returns attachment URLs from the triggering message.
// With no index: returns all URLs separated by ", ".
// With index: returns the URL of that attachment (1-based).
module.exports = async (context, args) => {
  const attachments = [...(context.message?.attachments?.values() ?? [])];
  if (!attachments.length) return '';
  const index = parseInt(args[0]);
  if (!isNaN(index)) return attachments[index - 1]?.url ?? '';
  return attachments.map(a => a.url).join(', ');
};
