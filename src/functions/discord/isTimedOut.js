'use strict';

const { resolveMember } = require('../../core/resolveUser');

// $isTimedOut[userID?]
// Returns "true" if the member is currently timed out (in communication disabled state).
module.exports = async (context, args) => {
  const member = await resolveMember(context, args[0]);
  if (!member) return 'false';
  const until = member.communicationDisabledUntil;
  if (!until) return 'false';
  return String(until > new Date());
};
