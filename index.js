'use strict';

require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Events,
  Partials,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');

const path = require('path');
const fs   = require('fs');

const { Runtime }               = require('./src');
const { registerSlashCommands } = require('./src/core/SlashRegistry');
const EventLoader               = require('./src/core/EventLoader');

// ─── Client ────────────────────────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// ─── Runtime ──────────────────────────────────────────────────────────────────

const runtime = new Runtime();

// ─── Command loader ───────────────────────────────────────────────────────────

const commands   = new Map();  // name → command def
const handlers   = new Map();  // customID / type → command def (buttons, modals, etc.)
const CMD_EXTS   = ['.js', '.cj'];
const commandDir = path.join(__dirname, 'commands');

if (fs.existsSync(commandDir)) {
  for (const file of fs.readdirSync(commandDir).filter(f => CMD_EXTS.some(e => f.endsWith(e)))) {
    try {
      const cmd = require(path.join(commandDir, file));
      if (!cmd.name || !cmd.code) continue;

      const nameKey = cmd.name.toLowerCase();

      // Register by type
      if (cmd.type === 'button' && cmd.customID) {
        handlers.set(`button:${cmd.customID}`, cmd);
      } else if (cmd.type === 'modal' && cmd.customID) {
        handlers.set(`modal:${cmd.customID}`, cmd);
      } else if (cmd.type === 'selectmenu' && cmd.customID) {
        handlers.set(`selectmenu:${cmd.customID}`, cmd);
      } else {
        commands.set(nameKey, cmd);
      }

      const tag = cmd.slash || cmd.type === 'slash' ? ' [slash]'
        : cmd.type === 'button'     ? ' [button]'
        : cmd.type === 'modal'      ? ' [modal]'
        : cmd.type === 'selectmenu' ? ' [selectMenu]'
        : '';
      console.log(`[Commands] Loaded: ${cmd.name} (${path.extname(file)})${tag}`);
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
  if (!cmd) return;
  if (cmd.type === 'slash') return; // slash-only commands skip prefix

  try {
    const { text, embed, components } = await runtime.runForCommandFull(cmd.code, message, PREFIX);
    await sendPayload(message.channel, { text, embed, components });
  } catch (err) {
    const formatted = err.format?.() ?? err.message;
    console.error(`[Runtime Error] ${formatted}`);
    await message.channel.send(err.toDiscord?.() ?? `❌ **${err.name ?? 'Error'}:** ${err.message}`).catch(() => {});
  }
});

// ─── Interaction handler ───────────────────────────────────────────────────────

client.on(Events.InteractionCreate, async (interaction) => {

  // ── Slash commands ──────────────────────────────────────────────────────────
  if (interaction.isChatInputCommand()) {
    const cmd = commands.get(interaction.commandName.toLowerCase());
    if (!cmd) return;

    await deferIfNeeded(interaction, cmd.ephemeral ?? false);
    await runInteraction(interaction, cmd, buildSlashArgs(interaction));
    return;
  }

  // ── Context menu commands ───────────────────────────────────────────────────
  if (interaction.isContextMenuCommand()) {
    const cmd = commands.get(interaction.commandName.toLowerCase());
    if (!cmd) return;
    await deferIfNeeded(interaction, cmd.ephemeral ?? false);
    await runInteraction(interaction, cmd, []);
    return;
  }

  // ── Autocomplete ────────────────────────────────────────────────────────────
  if (interaction.isAutocomplete()) {
    const cmd = commands.get(interaction.commandName.toLowerCase());
    if (!cmd?.autocomplete) return;
    try {
      await cmd.autocomplete(interaction);
    } catch (err) {
      console.error(`[Autocomplete:${interaction.commandName}] ${err.message}`);
    }
    return;
  }

  // ── Buttons ─────────────────────────────────────────────────────────────────
  if (interaction.isButton()) {
    const prefix     = interaction.customId.split(':')[0];
    const handlerCmd = handlers.get(`button:${prefix}`) ?? handlers.get(`button:${interaction.customId}`);
    if (!handlerCmd) return;
    const extraArgs  = interaction.customId.split(':').slice(1);
    // Run code first WITHOUT deferring so $showModal can fire before any reply
    const showed = await tryShowModal(interaction, handlerCmd, extraArgs);
    if (showed) return;
    await deferIfNeeded(interaction, handlerCmd.ephemeral ?? false, true);
    await runInteraction(interaction, handlerCmd, extraArgs);
    return;
  }

  // ── Select menus ────────────────────────────────────────────────────────────
  if (interaction.isAnySelectMenu()) {
    const prefix     = interaction.customId.split(':')[0];
    const handlerCmd = handlers.get(`selectmenu:${prefix}`) ?? handlers.get(`selectmenu:${interaction.customId}`);
    if (!handlerCmd) return;
    await deferIfNeeded(interaction, handlerCmd.ephemeral ?? false, true);
    await runInteraction(interaction, handlerCmd, interaction.values ?? []);
    return;
  }

  // ── Modal submits ────────────────────────────────────────────────────────────
  if (interaction.isModalSubmit()) {
    const prefix     = interaction.customId.split(':')[0];
    const handlerCmd = handlers.get(`modal:${prefix}`) ?? handlers.get(`modal:${interaction.customId}`);
    if (!handlerCmd) return;
    await deferIfNeeded(interaction, handlerCmd.ephemeral ?? false);
    await runInteraction(interaction, handlerCmd, []);
    return;
  }
});

// ─── Core interaction runner ──────────────────────────────────────────────────

async function runInteraction(interaction, cmd, extraArgs = []) {
  const Context = require('./src/core/Context');
  const fakeMsg = buildFakeMessage(interaction);

  try {
    const ast  = runtime.parse(cmd.code);
    const ctx  = new Context({
      message:        fakeMsg,
      interaction,
      client,
      variables:      new Map(),
      depth:          0,
      runtime,
      commandName:    interaction.commandName ?? interaction.customId ?? cmd.name,
      commandInput:   extraArgs.join(' '),
      commandArgs:    extraArgs,
      noMentionInput: extraArgs.join(' '),
    });

    const rawText = await runtime.executeAST(ast, ctx);
    const text    = ctx._out?.stopMessage !== null ? (ctx._out?.stopMessage ?? rawText) : rawText;
    const embed   = runtime._buildEmbed(ctx);
    const comps   = runtime._buildComponents(ctx);

    const payload = buildPayload(text, embed, comps);

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(payload).catch(() => {});
    } else {
      await interaction.reply({ ...payload, ephemeral: cmd.ephemeral ?? false }).catch(() => {});
    }
  } catch (err) {
    const formatted = err.format?.() ?? err.message;
    console.error(`[Interaction Error] ${formatted}`);

    const errPayload = {
      content:   err.toDiscord?.() ?? `❌ **${err.name ?? 'Error'}:** ${err.message}`,
      ephemeral: true,
    };
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(errPayload).catch(() => {});
    } else {
      await interaction.reply(errPayload).catch(() => {});
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function deferIfNeeded(interaction, ephemeral = false, update = false) {
  if (interaction.deferred || interaction.replied) return;
  try {
    if (update && interaction.deferUpdate) {
      await interaction.deferUpdate();
    } else {
      await interaction.deferReply({ ephemeral });
    }
  } catch {}
}

/**
 * Runs a button command's code WITHOUT deferring.
 * If the code called $showModal, builds and shows the Discord modal, returns true.
 * Returns false if no modal was requested (caller should then defer + run normally).
 */
async function tryShowModal(interaction, cmd, extraArgs = []) {
  const Context = require('./src/core/Context');
  const fakeMsg = buildFakeMessage(interaction);

  try {
    const ast = runtime.parse(cmd.code);
    const ctx = new Context({
      message:        fakeMsg,
      interaction,
      client,
      variables:      new Map(),
      depth:          0,
      runtime,
      commandName:    interaction.commandName ?? interaction.customId ?? cmd.name,
      commandInput:   extraArgs.join(' '),
      commandArgs:    extraArgs,
      noMentionInput: extraArgs.join(' '),
    });

    await runtime.executeAST(ast, ctx);

    if (!ctx._modalDef || !ctx._modalDef.inputs?.length) return false;

    const modal = new ModalBuilder()
      .setCustomId(ctx._modalDef.customId)
      .setTitle(ctx._modalDef.title.slice(0, 45));

    for (const inp of ctx._modalDef.inputs.slice(0, 5)) {
      const textInput = new TextInputBuilder()
        .setCustomId(inp.inputId)
        .setLabel((inp.label || inp.placeholder || 'Enter text').slice(0, 45))
        .setStyle(inp.style === 'paragraph' ? TextInputStyle.Paragraph : TextInputStyle.Short)
        .setRequired(inp.required !== false);

      if (inp.placeholder) textInput.setPlaceholder(inp.placeholder.slice(0, 100));

      modal.addComponents(new ActionRowBuilder().addComponents(textInput));
    }

    await interaction.showModal(modal);
    return true;
  } catch (err) {
    console.error(`[Modal Error] ${err.message}`);
    return false;
  }
}

function buildSlashArgs(interaction) {
  return (interaction.options?.data ?? []).map(o => String(o.value ?? ''));
}

function buildPayload(text, embed, components) {
  const payload = {};
  if (text?.trim())      payload.content    = text.trim();
  if (embed)             payload.embeds     = [embed];
  if (components.length) payload.components = components;
  if (!payload.content && !payload.embeds && !payload.components) {
    payload.content = '\u200b'; // zero-width space — prevents Discord "interaction failed"
  }
  return payload;
}

async function sendPayload(channel, { text, embed, components }) {
  const payload = buildPayload(text, embed, components);
  if (payload.content === '\u200b') return; // nothing to send for message commands
  await channel.send(payload);
}

function buildFakeMessage(interaction) {
  const user    = interaction.user ?? interaction.member?.user;
  const channel = interaction.channel;
  const guild   = interaction.guild;
  return {
    author:         user,
    member:         interaction.member ?? null,
    channel,
    guild,
    guildId:        interaction.guildId,
    channelId:      interaction.channelId,
    client,
    content:        '',
    mentions:       { users: new Map(), roles: new Map(), channels: new Map(), has: () => false },
    id:             interaction.id,
    createdAt:      new Date(),
    deletable:      false,
    _isInteraction: true,
  };
}

// ─── Ready ────────────────────────────────────────────────────────────────────

client.once(Events.ClientReady, async (c) => {
  console.log(`✅ Logged in as ${c.user.tag}`);
  console.log(`📦 Loaded ${runtime.loader.list().length} functions`);

  const cmdList  = [...commands.keys()];
  const hndList  = [...handlers.keys()].map(k => k.replace(':', ':'));
  console.log(`🤖 Commands: ${cmdList.join(', ') || 'none'}`);
  if (hndList.length) console.log(`🔘 Handlers: ${hndList.join(', ')}`);

  const token    = process.env.DISCORD_TOKEN || process.env.TOKEN;
  const clientId = c.user.id;
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
