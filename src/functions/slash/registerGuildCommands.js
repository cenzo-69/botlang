'use strict';

const { REST, Routes } = require('discord.js');

// $registerGuildCommands[name;description;guildID?;...]
// Registers one or more slash commands in a guild.
// Args come in pairs: name, description (repeat for multiple commands).
// The last arg can be a guildID (if it doesn't contain spaces and looks like a snowflake).
// Returns the number of commands registered.
module.exports = async (context, args) => {
  if (!context.client) return '[error: $registerGuildCommands — no client]';
  if (!context.message?.guild) return '[error: $registerGuildCommands — not in a guild]';

  const all = args.map(a => String(a)).filter(Boolean);
  const snowflakeRe = /^\d{15,20}$/;

  let guildID = context.message.guild.id;
  let pairs   = all;

  if (all.length % 2 !== 0 && snowflakeRe.test(all[all.length - 1])) {
    guildID = all.pop();
  }

  const commands = [];
  for (let i = 0; i + 1 < pairs.length; i += 2) {
    commands.push({ name: pairs[i].toLowerCase().replace(/\s+/g, '_'), description: pairs[i + 1] || 'No description' });
  }
  if (!commands.length) return '[error: $registerGuildCommands — no name/description pairs provided]';

  try {
    const rest = new REST({ version: '10' }).setToken(context.client.token);
    await rest.put(
      Routes.applicationGuildCommands(context.client.user.id, guildID),
      { body: commands },
    );
    return String(commands.length);
  } catch (err) {
    return `[error: $registerGuildCommands — ${err.message}]`;
  }
};
