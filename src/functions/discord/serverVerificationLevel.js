'use strict';

// $serverVerificationLevel  — numeric verification level (0–4)
// 0=None, 1=Low, 2=Medium, 3=High, 4=VeryHigh
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  return String(context.message.guild.verificationLevel ?? 0);
};
