'use strict';

require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Events,
  Partials,
} = require('discord.js');

const path = require('path');
const fs   = require('fs');

const { Runtime }                    = require('./src');
const { registerSlashCommands }      = require('./src/core/SlashRegistry');
const EventLoader                    = require('./src/core/EventLoader');

// ─── Client ────────────────────────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// ─── Runtime ──────────────────────────────────────────────────────────────────

const runtime = new Runtime();

// ─── Command loader ───────────────────────────────────────────────────────────

const commands    = new Map();
const CMD_EXTS    = ['.js', '.cj'];
const commandDir  = path.join(__dirname, 'commands');

if (fs.existsSync(commandDir)) {
  for (const file of fs.readdirSync(commandDir).filter(f => CMD_EXTS.some(e => f.endsWith(e)))) {
    try {
      const cmd = require(path.join(commandDir, file));
      if (cmd.name && cmd.code) {
        commands.set(cmd.name.toLowerCase(), cmd);
        const tag = cmd.slash ? ' [slash]' : '';
        console.log(`[Commands] Loaded: ${cmd.name} (${path.extname(file)})${tag}`);
      }
    } catch (err) {
      console.error(`[Commands] Failed to load ${file}: ${err.message}`);
    }
  }
}

// ─── Event loader ─────────────────────────────────────────────────────────────

const eventLoader = new EventLoader(client, runtime);
eventLoader.load(path.join(__dirname, 'events'));

// ─── Prefix message handler ────────────────────────────────────────────────────

const PREFIX = process.env.PREFIX || '!';

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const raw     = message.content.slice(PREFIX.length).trim();
  const cmdName = (raw.match(/\S+/) || [''])[0].toLowerCase();
  const cmd     = commands.get(cmdName);
  if (!cmd || cmd.slash === true) return;   // skip slash-only commands

  try {
    const { text, embed, components } = await runtime.runForCommandFull(cmd.code, message, PREFIX);
    const payload = {};
    if (text?.trim())      payload.content    = text.trim();
    if (embed)             payload.embeds     = [embed];
    if (components.length) payload.components = components;

    if (payload.content || payload.embeds || payload.components) {
      await message.channel.send(payload);
    }
  } catch (err) {
    const msg = err.format ? err.format() : err.message;
    console.error(`[Runtime Error] ${msg}`);
    await message.channel.send(`❌ **Runtime error:** ${err.message}`).catch(() => {});
  }
});

// ─── Slash command + interaction handler ──────────────────────────────────────

client.on(Events.InteractionCreate, async (interaction) => {
  // ── Slash commands ──────────────────────────────────────────────────────────
  if (interaction.isChatInputCommand()) {
    const cmd = commands.get(interaction.commandName.toLowerCase());
    if (!cmd) return;

    // Build a synthetic "message-like" object for the runtime
    const fakeMessage = buildFakeMessage(interaction, client);

    try {
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ ephemeral: cmd.ephemeral ?? false });
      }

      const ast     = runtime.parse(cmd.code);
      const Context = require('./src/core/Context');

      // Build option args from slash command options
      const rawOptions = interaction.options?.data ?? [];
      const cmdArgs    = rawOptions.map(o => String(o.value ?? ''));
      const cmdInput   = cmdArgs.join(' ');

      const context = new Context({
        message:        fakeMessage,
        interaction,
        client,
        variables:      new Map(),
        depth:          0,
        runtime,
        commandName:    interaction.commandName,
        commandInput:   cmdInput,
        commandArgs:    cmdArgs,
        noMentionInput: cmdInput,
      });

      const rawText = await runtime.executeAST(ast, context);

      const text       = context._out?.stopMessage !== null
        ? (context._out?.stopMessage ?? rawText)
        : rawText;
      const embed      = runtime._buildEmbed(context);
      const components = runtime._buildComponents(context);

      const payload = {};
      if (text?.trim())      payload.content    = text.trim();
      if (embed)             payload.embeds     = [embed];
      if (components.length) payload.components = components;

      if (!payload.content && !payload.embeds && !payload.components) {
        payload.content = '\u200b'; // zero-width space so Discord doesn't complain
      }

      await interaction.editReply(payload);
    } catch (err) {
      const msg = err.format ? err.format() : err.message;
      console.error(`[Slash Error] ${interaction.commandName}: ${msg}`);
      const errPayload = { content: `❌ **Error:** ${err.message}`, ephemeral: true };
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(errPayload).catch(() => {});
      } else {
        await interaction.reply({ ...errPayload }).catch(() => {});
      }
    }
    return;
  }

  // ── Button interactions ─────────────────────────────────────────────────────
  if (interaction.isButton()) {
    await runInteractionCode(interaction, 'button', client, runtime, commands);
    return;
  }

  // ── Select menu interactions ────────────────────────────────────────────────
  if (interaction.isStringSelectMenu()) {
    await runInteractionCode(interaction, 'selectMenu', client, runtime, commands);
    return;
  }

  // ── Modal submit ────────────────────────────────────────────────────────────
  if (interaction.isModalSubmit()) {
    await runInteractionCode(interaction, 'modal', client, runtime, commands);
    return;
  }
});

// ─── Helper: run command code triggered by an interaction ─────────────────────

async function runInteractionCode(interaction, type, client, runtime, commands) {
  // Find a handler command whose name matches the customId (or a registered handler)
  const handlerName = interaction.customId?.split(':')[0]?.toLowerCase();
  const cmd = commands.get(handlerName);
  if (!cmd) return;

  const fakeMessage = buildFakeMessage(interaction, client);

  try {
    const Context = require('./src/core/Context');
    const ast     = runtime.parse(cmd.code);

    const context = new Context({
      message:     fakeMessage,
      interaction,
      client,
      variables:   new Map(),
      depth:       0,
      runtime,
      commandName: handlerName,
      commandInput:  interaction.customId ?? '',
      commandArgs:   interaction.customId ? interaction.customId.split(':').slice(1) : [],
      noMentionInput: '',
    });

    const rawText = await runtime.executeAST(ast, context);
    const text       = context._out?.stopMessage ?? rawText;
    const embed      = runtime._buildEmbed(context);
    const components = runtime._buildComponents(context);

    const payload = {};
    if (text?.trim())      payload.content    = text.trim();
    if (embed)             payload.embeds     = [embed];
    if (components.length) payload.components = components;

    if (!payload.content && !payload.embeds && !payload.components) payload.content = '\u200b';

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(payload).catch(() => {});
    } else {
      await interaction.reply({ ...payload, ephemeral: cmd.ephemeral ?? false }).catch(() => {});
    }
  } catch (err) {
    console.error(`[Interaction:${type}] ${interaction.customId}: ${err.message}`);
    const errPayload = { content: `❌ **Error:** ${err.message}`, ephemeral: true };
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(errPayload).catch(() => {});
    } else {
      await interaction.reply({ ...errPayload }).catch(() => {});
    }
  }
}

// ─── Helper: build a message-like proxy from an interaction ───────────────────

function buildFakeMessage(interaction, client) {
  const user    = interaction.user ?? interaction.member?.user;
  const channel = interaction.channel;
  const guild   = interaction.guild;

  return {
    author:    user,
    member:    interaction.member,
    channel,
    guild,
    guildId:   interaction.guildId,
    channelId: interaction.channelId,
    client,
    content:   '',
    mentions:  { users: new Map(), roles: new Map(), channels: new Map() },
    id:        interaction.id,
    createdAt: new Date(),
    _isInteraction: true,
  };
}

// ─── Ready ────────────────────────────────────────────────────────────────────

client.once(Events.ClientReady, async (c) => {
  console.log(`✅ Logged in as ${c.user.tag}`);
  console.log(`📦 Loaded ${runtime.loader.list().length} functions`);
  console.log(`🤖 Commands: ${[...commands.keys()].join(', ') || 'none'}`);

  // Register slash commands
  const token    = process.env.DISCORD_TOKEN || process.env.TOKEN;
  const clientId = c.user.id;

  // SLASH_GUILD_IDS=123,456  → instant guild registration (for dev)
  // Leave blank for global registration
  const guildIds = (process.env.SLASH_GUILD_IDS || '')
    .split(',').map(s => s.trim()).filter(Boolean);

  await registerSlashCommands(token, clientId, commands, guildIds);
});

// ─── Login ────────────────────────────────────────────────────────────────────

const token = process.env.DISCORD_TOKEN || process.env.TOKEN;
if (!token) {
  console.error('❌ DISCORD_TOKEN is not set in .env');
  process.exit(1);
}

client.login(token).catch(err => {
  console.error(`❌ Login failed: ${err.message}`);
  process.exit(1);
});
