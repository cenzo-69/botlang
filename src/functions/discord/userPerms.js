'use strict';

const { resolveMember } = require('../../core/resolveUser');

// $userPerms[userID?;returnAmount?;separator?]
// Returns the permission names of a member.
// returnAmount — how many to return (0 = all)
// separator    — default ", "
module.exports = async (context, args) => {
  const member       = await resolveMember(context, args[0]);
  const returnAmount = parseInt(args[1]) || 0;
  const sep          = String(args[2] !== undefined ? args[2] : '').trim() || ', ';

  if (!member) return '';

  const perms = member.permissions.toArray();
  const list  = returnAmount > 0 ? perms.slice(0, returnAmount) : perms;
  return list.join(sep);
};
