'use strict';
// $isSlashCommand  — returns "true" if the current interaction is a slash command
module.exports = async (context) => {
  const i = context.interaction;
  return String(!!(i && i.isChatInputCommand?.()));
};
