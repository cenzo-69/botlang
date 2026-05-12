'use strict';

const { REST, Routes } = require('discord.js');

// $slashCommandsCount[guildID?]
// Returns the number of slash commands registered in the guild (or globally if no guildID).
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim()
    || context.message?.guild?.id;

  if (!context.client) return '[error: $slashCommandsCount — no client]';

  try {
    const rest = new REST({ version: '10' }).setToken(context.client.token);
    const cmds = guildID
      ? await rest.get(Routes.applicationGuildCommands(context.client.user.id, guildID))
      : await rest.get(Routes.applicationCommands(context.client.user.id));
    return String(cmds.length ?? 0);
  } catch (err) {
    return `[error: $slashCommandsCount — ${err.message}]`;
  }
};
