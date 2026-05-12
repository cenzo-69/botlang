'use strict';
// $userIDs[separator?]  — returns all cached user IDs
module.exports = async (context, args) => {
  const sep = String(args[0] !== undefined ? args[0] : ', ');
  return [...(context.client?.users.cache.keys() ?? [])].join(sep);
};
