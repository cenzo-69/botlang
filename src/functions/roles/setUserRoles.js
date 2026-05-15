'use strict';

const { argError } = require('../../core/fnError');

// $setUserRoles[userID;roleID;roleID;...;reason?]
// Replaces all of a member's roles with the provided list.
// The last arg is treated as the reason if it starts with a letter and doesn't look like a snowflake.
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!userID) return argError(context, 'user ID', 'Snowflake', userID);
  if (!context.message?.guild) return '[error: Not in a guild!]';

  const rest = args.slice(1).map(a => String(a).trim()).filter(Boolean);
  if (!rest.length) return '[error: $setUserRoles requires at least one roleID!]';

  const snowflakeRe = /^\d{15,20}$/;
  let roleIDs = rest;
  let reason  = 'No reason provided';
  if (rest.length > 1 && !snowflakeRe.test(rest[rest.length - 1])) {
    reason  = rest.pop();
    roleIDs = rest;
  }

  try {
    const member = await context.message.guild.members.fetch(userID).catch(() => null);
    if (!member) return '[error: Member not found!]';
    await member.roles.set(roleIDs, reason);
    return '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
