'use strict';

// $randomCategoryID  — returns the ID of a random category channel in the guild
module.exports = async (context, args) => {
  const guild = context.message?.guild;
  if (!guild) return '[randomCategoryID error: no guild]';
  try {
    const channels = await guild.channels.fetch();
    const cats     = [...channels.values()].filter(c => c && c.type === 4); // CategoryChannel
    if (!cats.length) return '[randomCategoryID error: no categories]';
    return cats[Math.floor(Math.random() * cats.length)].id;
  } catch (err) {
    return `[randomCategoryID error: ${err.message}]`;
  }
};
