'use strict';

// $roleMembers[roleID;separator?]
// Returns a list of member IDs who have the given role.
module.exports = async (context, args) => {
  const roleID = String(args[0] ?? '').trim();
  const sep    = args[1] !== undefined ? String(args[1]) : ', ';

  const guild = context.message?.guild;
  if (!guild) return '[roleMembers error: no guild]';
  if (!roleID) return '[roleMembers error: no roleID provided]';

  try {
    await guild.members.fetch();
    const role = guild.roles.cache.get(roleID);
    if (!role) return '[roleMembers error: role not found]';
    return [...role.members.values()].map(m => m.id).join(sep);
  } catch (e) {
    return `[roleMembers error: ${e.message}]`;
  }
};
