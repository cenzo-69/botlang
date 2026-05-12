'use strict';
// $sendDM[userID;message;allowFail?]  — sends a DM to the specified user
// allowFail: "true" = return empty string instead of error if DMs are closed
module.exports = async (context, args) => {
  const userID    = String(args[0] !== undefined ? args[0] : '').trim();
  const message   = String(args[1] !== undefined ? args[1] : '');
  const allowFail = args[2] === 'true';
  if (!userID)  return '[error: $sendDM — userID is required]';
  if (!message) return '[error: $sendDM — message is required]';
  try {
    const user    = await context.client?.users.fetch(userID);
    if (!user)    return '[error: $sendDM — user not found]';
    const channel = await user.createDM();
    const sent    = await channel.send(message);
    return sent.id;
  } catch (err) {
    if (allowFail) return '';
    return `[error: $sendDM — ${err.message}]`;
  }
};
