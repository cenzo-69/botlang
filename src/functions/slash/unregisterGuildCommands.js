'use strict';

const { REST, Routes } = require('discord.js');

// $unregisterGuildCommands[guildID?]
// Removes ALL slash commands from the guild. Pass guildID to target a specific guild.
// Returns the number of commands cleared.
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim()
    || context.message?.guild?.id;

  if (!guildID) return '[error: $unregisterGuildCommands — no guildID]';
  if (!context.client) return '[error: $unregisterGuildCommands — no client]';

  try {
    const rest = new REST({ version: '10' }).setToken(context.client.token);
    const existing = await rest.get(Routes.applicationGuildCommands(context.client.user.id, guildID));
    await rest.put(Routes.applicationGuildCommands(context.client.user.id, guildID), { body: [] });
    return String(existing.length ?? 0);
  } catch (err) {
    return `[error: $unregisterGuildCommands — ${err.message}]`;
  }
};
