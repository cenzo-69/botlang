'use strict';

const { resolveMember } = require('../../core/resolveUser');

// $userRoles[userID?;separator?]
// Returns a separated list of role IDs the user holds (excluding @everyone).
// Default separator is ", ".
module.exports = async (context, args) => {
  const member = await resolveMember(context, args[0]);
  if (!member) return '';
  const sep = args[1] !== undefined ? args[1] : ', ';
  return [...member.roles.cache.values()]
    .filter(r => r.name !== '@everyone')
    .map(r => r.id)
    .join(sep);
};
