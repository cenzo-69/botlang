'use strict';

const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

/**
 * Registers slash commands with Discord's REST API.
 * Called once on bot ready.
 *
 * @param {string}    token    - Bot token
 * @param {string}    clientId - Bot application ID
 * @param {Map}       commands - Map of command definitions
 * @param {string[]}  [guildIds] - If set, registers to these guilds (instant). Otherwise global (up to 1h delay).
 */
async function registerSlashCommands(token, clientId, commands, guildIds = []) {
  const rest = new REST({ version: '10' }).setToken(token);

  const slashCommands = [...commands.values()]
    .filter(cmd => cmd.slash === true || cmd.type === 'slash')
    .map(cmd => buildSlashData(cmd));

  if (!slashCommands.length) {
    console.log('[Slash] No slash commands found to register.');
    return;
  }

  try {
    if (guildIds.length) {
      for (const guildId of guildIds) {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands });
        console.log(`[Slash] Registered ${slashCommands.length} command(s) to guild ${guildId}`);
      }
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
      console.log(`[Slash] Registered ${slashCommands.length} global slash command(s)`);
    }
  } catch (err) {
    console.error(`[Slash] Registration failed: ${err.message}`);
  }
}

function buildSlashData(cmd) {
  const data = {
    name:        String(cmd.name).toLowerCase(),
    description: cmd.description || `Run ${cmd.name}`,
    options:     [],
  };

  if (Array.isArray(cmd.options)) {
    data.options = cmd.options.map(opt => ({
      name:        opt.name,
      description: opt.description || opt.name,
      type:        resolveOptionType(opt.type),
      required:    opt.required ?? false,
      choices:     opt.choices || [],
    }));
  }

  return data;
}

function resolveOptionType(type) {
  const map = {
    string:      3,
    integer:     4,
    boolean:     5,
    user:        6,
    channel:     7,
    role:        8,
    mentionable: 9,
    number:      10,
    attachment:  11,
  };
  return map[String(type).toLowerCase()] ?? 3;
}

module.exports = { registerSlashCommands };
