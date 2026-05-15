'use strict';
// $messageFlags[separator?]  — returns flags of the current message
module.exports = async (context, args) => {
  const sep = String(args[0] !== undefined ? args[0] : ', ');
  const msg = context.message;
  if (!msg) return '[error: No message context available!]';
  return msg.flags?.toArray().join(sep) ?? '';
};
