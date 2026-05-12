'use strict';

const { REST, Routes } = require('discord.js');

// $slashID[commandName;guildID?]
// Returns the ID of a registered slash command by name.
module.exports = async (context, args) => {
  const cmdName = String(args[0] !== undefined ? args[0] : '').trim().toLowerCase();
  const guildID = String(args[1] !== undefined ? args[1] : '').trim()
    || context.message?.guild?.id;

  if (!cmdName)  return '[error: $slashID requires a command name]';
  if (!context.client) return '[error: $slashID — no client]';

  try {
    const rest = new REST({ version: '10' }).setToken(context.client.token);
    const cmds = guildID
      ? await rest.get(Routes.applicationGuildCommands(context.client.user.id, guildID))
      : await rest.get(Routes.applicationCommands(context.client.user.id));
    const cmd = cmds.find(c => c.name === cmdName);
    return cmd?.id ?? '[error: $slashID — command not found]';
  } catch (err) {
    return `[error: $slashID — ${err.message}]`;
  }
};
