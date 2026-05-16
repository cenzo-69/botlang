'use strict';

const path = require('path');
const fs   = require('fs');

const {
  Client,
  Events,
  Partials,
  GatewayIntentBits: DefaultIntents,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');

const Runtime        = require('./core/Runtime');
const EventLoader    = require('./core/EventLoader');
const Context        = require('./core/Context');
const InviteTracker  = require('./core/InviteTracker');
const { registerSlashCommands } = require('./core/SlashRegistry');

const CMD_EXTS = ['.js', '.cj'];

/**
 * CenzoClient — the main public-facing class.
 *
 * Usage:
 *   const { cenzoClient, GatewayIntentBits } = require('@cenzotz/cenzojs');
 *
 *   const client = new cenzoClient({
 *     token:   process.env.TOKEN,
 *     intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, ... ],
 *     prefix:  ['!'],
 *     folders: {
 *       commands:     './commands',
 *       events:       './events',
 *       interactions: './interactions',  // buttons / modals / selects
 *       functions:    './functions',     // custom $functions
 *     },
 *   });
 */
class CenzoClient {
  constructor(config = {}) {
    const {
      token,
      intents       = [],
      prefix        = ['!'],
      folders       = {},
      dbUrl,
      autoStart     = true,
    } = config;

    this.token    = token || process.env.DISCORD_TOKEN || process.env.TOKEN;
    this.prefixes = Array.isArray(prefix) ? prefix : [prefix];
    this.folders  = {
      commands:     folders.commands     ?? './commands',
      events:       folders.events       ?? './events',
      interactions: folders.interactions ?? null,
      functions:    folders.functions    ?? null,
    };

    if (dbUrl) process.env.DATABASE_URL = dbUrl;

    // Discord.js client
    this.djsClient = new Client({
      intents: intents.length ? intents : [
        DefaultIntents.Guilds,
        DefaultIntents.GuildMessages,
        DefaultIntents.GuildMembers,
        DefaultIntents.GuildMessageReactions,
        DefaultIntents.GuildVoiceStates,
        DefaultIntents.GuildModeration,
        DefaultIntents.MessageContent,
        DefaultIntents.DirectMessages,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });

    // CenzoJS runtime
    this.runtime = new Runtime();

    // Load custom functions if folder specified
    if (this.folders.functions) {
      const absDir = path.resolve(this.folders.functions);
      if (fs.existsSync(absDir)) this.runtime.loader.load(absDir);
    }

    // Command and handler maps
    this.commands = new Map();
    this.handlers = new Map();

    // Invite tracker — attach to client so $functions can access it
    this.inviteTracker = new InviteTracker(this.djsClient);
    this.djsClient._cenzoInviteTracker = this.inviteTracker;

    this._loadCommands();
    this._loadEvents();
    this._wireHandlers();

    if (autoStart) this.start();
  }

  // ── Command loader ─────────────────────────────────────────────────────────

  _loadCommands() {
    const dirs = [this.folders.commands, this.folders.interactions].filter(Boolean);

    for (const dir of dirs) {
      const absDir = path.resolve(dir);
      if (!fs.existsSync(absDir)) continue;

      for (const file of fs.readdirSync(absDir).filter(f => CMD_EXTS.some(e => f.endsWith(e)))) {
        try {
          const cmd = require(path.join(absDir, file));
          if (!cmd.name || !cmd.code) continue;

          const nameKey = cmd.name.toLowerCase();

          if (cmd.type === 'button' && cmd.customID) {
            this.handlers.set(`button:${cmd.customID}`, cmd);
          } else if (cmd.type === 'modal' && cmd.customID) {
            this.handlers.set(`modal:${cmd.customID}`, cmd);
          } else if (cmd.type === 'selectmenu' && cmd.customID) {
            this.handlers.set(`selectmenu:${cmd.customID}`, cmd);
          } else {
            this.commands.set(nameKey, cmd);
          }

          const tag = cmd.slash             ? ' [slash]'
            : cmd.type === 'button'         ? ' [button]'
            : cmd.type === 'modal'          ? ' [modal]'
            : cmd.type === 'selectmenu'     ? ' [selectMenu]'
            : '';

          console.log(`[Commands] Loaded: ${cmd.name} (${path.extname(file)})${tag}`);
        } catch (err) {
          console.error(`[Commands] Failed to load ${file}: ${err.message}`);
        }
      }
    }
  }

  // ── Event loader ───────────────────────────────────────────────────────────

  _loadEvents() {
    if (this.folders.events) {
      const absDir = path.resolve(this.folders.events);
      if (fs.existsSync(absDir)) {
        const loader = new EventLoader(this.djsClient, this.runtime);
        loader.load(absDir);
      }
    }
  }

  // ── Message + interaction wiring ───────────────────────────────────────────

  _wireHandlers() {

    // Prefix message handler
    this.djsClient.on(Events.MessageCreate, async (message) => {
      if (message.author.bot) return;

      const content    = message.content;
      const usedPrefix = this.prefixes.find(p => content.startsWith(p));
      if (!usedPrefix) return;

      const raw     = content.slice(usedPrefix.length).trim();
      const cmdName = (raw.match(/\S+/) || [''])[0].toLowerCase();
      const cmd     = this.commands.get(cmdName);
      if (!cmd || cmd.type === 'slash') return;

      try {
        const { text, embed, components } = await this.runtime.runForCommandFull(cmd.code, message, usedPrefix);
        await this._sendPayload(message.channel, { text, embed, components });
      } catch (err) {
        console.error(`[Runtime Error] ${err.format?.() ?? err.message}`);
        await message.channel.send(
          err.toDiscord?.() ?? `❌ **${err.name ?? 'Error'}:** ${err.message}`
        ).catch(() => {});
      }
    });

    // Interaction handler
    this.djsClient.on(Events.InteractionCreate, async (interaction) => {

      if (interaction.isChatInputCommand()) {
        const cmd = this.commands.get(interaction.commandName.toLowerCase());
        if (!cmd) return;
        const showed = await this._tryShowModal(interaction, cmd, this._buildSlashArgs(interaction));
        if (showed) return;
        await this._deferIfNeeded(interaction, cmd.ephemeral ?? false);
        await this._runInteraction(interaction, cmd, this._buildSlashArgs(interaction));
        return;
      }

      if (interaction.isContextMenuCommand()) {
        const cmd = this.commands.get(interaction.commandName.toLowerCase());
        if (!cmd) return;
        await this._deferIfNeeded(interaction, cmd.ephemeral ?? false);
        await this._runInteraction(interaction, cmd, []);
        return;
      }

      if (interaction.isAutocomplete()) {
        const cmd = this.commands.get(interaction.commandName.toLowerCase());
        if (!cmd?.autocomplete) return;
        try { await cmd.autocomplete(interaction); } catch {}
        return;
      }

      if (interaction.isButton()) {
        const prefix     = interaction.customId.split(':')[0];
        const handlerCmd = this.handlers.get(`button:${prefix}`)
                        ?? this.handlers.get(`button:${interaction.customId}`);
        if (!handlerCmd) return;
        const extraArgs = interaction.customId.split(':').slice(1);
        const showed = await this._tryShowModal(interaction, handlerCmd, extraArgs);
        if (showed) return;
        await this._deferIfNeeded(interaction, handlerCmd.ephemeral ?? false, true);
        await this._runInteraction(interaction, handlerCmd, extraArgs);
        return;
      }

      if (interaction.isAnySelectMenu()) {
        const prefix     = interaction.customId.split(':')[0];
        const handlerCmd = this.handlers.get(`selectmenu:${prefix}`)
                        ?? this.handlers.get(`selectmenu:${interaction.customId}`);
        if (!handlerCmd) return;
        await this._deferIfNeeded(interaction, handlerCmd.ephemeral ?? false, true);
        await this._runInteraction(interaction, handlerCmd, interaction.values ?? []);
        return;
      }

      if (interaction.isModalSubmit()) {
        const prefix     = interaction.customId.split(':')[0];
        const handlerCmd = this.handlers.get(`modal:${prefix}`)
                        ?? this.handlers.get(`modal:${interaction.customId}`);
        if (!handlerCmd) return;
        await this._deferIfNeeded(interaction, handlerCmd.ephemeral ?? false);
        await this._runInteraction(interaction, handlerCmd, []);
        return;
      }
    });

    // Ready
    this.djsClient.once(Events.ClientReady, async (c) => {
      console.log(`✅ CenzoJS — Logged in as ${c.user.tag}`);
      console.log(`📦 Loaded ${this.runtime.loader.list().length} functions`);

      const cmdList = [...this.commands.keys()];
      const hndList = [...this.handlers.keys()];
      if (cmdList.length) console.log(`🤖 Commands: ${cmdList.join(', ')}`);
      if (hndList.length) console.log(`🔘 Handlers: ${hndList.join(', ')}`);

      await this.inviteTracker.init();

      const guildIds = (process.env.SLASH_GUILD_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
      await registerSlashCommands(this.token, c.user.id, this.commands, guildIds);
    });
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  async start() {
    if (!this.token) {
      console.error('❌ CenzoJS: No token provided. Pass token: in config or set DISCORD_TOKEN env var.');
      process.exit(1);
    }
    try {
      await this.djsClient.login(this.token);
    } catch (err) {
      console.error(`❌ CenzoJS: Login failed — ${err.message}`);
      process.exit(1);
    }
    return this;
  }

  // ── Interaction runner ─────────────────────────────────────────────────────

  async _runInteraction(interaction, cmd, extraArgs = []) {
    const fakeMsg = this._buildFakeMessage(interaction);
    try {
      const ast = this.runtime.parse(cmd.code);
      const ctx = new Context({
        message:        fakeMsg,
        interaction,
        client:         this.djsClient,
        variables:      new Map(),
        depth:          0,
        runtime:        this.runtime,
        commandName:    interaction.commandName ?? interaction.customId ?? cmd.name,
        commandInput:   extraArgs.join(' '),
        commandArgs:    extraArgs,
        noMentionInput: extraArgs.join(' '),
      });

      const rawText = await this.runtime.executeAST(ast, ctx);
      const text    = ctx._out?.stopMessage !== null ? (ctx._out?.stopMessage ?? rawText) : rawText;
      const embed   = this.runtime._buildEmbed(ctx);
      const comps   = this.runtime._buildComponents(ctx);
      const payload = this._buildPayload(text, embed, comps);

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(payload).catch(() => {});
      } else {
        await interaction.reply({ ...payload, ephemeral: cmd.ephemeral ?? false }).catch(() => {});
      }
    } catch (err) {
      console.error(`[Interaction Error] ${err.format?.() ?? err.message}`);
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

  async _tryShowModal(interaction, cmd, extraArgs = []) {
    const fakeMsg = this._buildFakeMessage(interaction);
    try {
      const ast = this.runtime.parse(cmd.code);
      const ctx = new Context({
        message:        fakeMsg,
        interaction,
        client:         this.djsClient,
        variables:      new Map(),
        depth:          0,
        runtime:        this.runtime,
        commandName:    interaction.commandName ?? interaction.customId ?? cmd.name,
        commandInput:   extraArgs.join(' '),
        commandArgs:    extraArgs,
        noMentionInput: extraArgs.join(' '),
      });

      await this.runtime.executeAST(ast, ctx);
      if (!ctx._modalDef?.inputs?.length) return false;

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
    } catch { return false; }
  }

  async _deferIfNeeded(interaction, ephemeral = false, update = false) {
    if (interaction.deferred || interaction.replied) return;
    try {
      if (update && interaction.deferUpdate) {
        await interaction.deferUpdate();
      } else {
        await interaction.deferReply({ ephemeral });
      }
    } catch {}
  }

  _buildSlashArgs(interaction) {
    return (interaction.options?.data ?? []).map(o => String(o.value ?? ''));
  }

  _buildPayload(text, embed, components) {
    const payload = {};
    if (text?.trim())      payload.content    = text.trim();
    if (embed)             payload.embeds     = [embed];
    if (components.length) payload.components = components;
    if (!payload.content && !payload.embeds && !payload.components) {
      payload.content = '\u200b';
    }
    return payload;
  }

  async _sendPayload(channel, { text, embed, components }) {
    const payload = this._buildPayload(text, embed, components);
    if (payload.content === '\u200b') return;
    await channel.send(payload);
  }

  _buildFakeMessage(interaction) {
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
      client:         this.djsClient,
      content:        '',
      mentions:       { users: new Map(), roles: new Map(), channels: new Map(), has: () => false },
      id:             interaction.id,
      createdAt:      new Date(),
      deletable:      false,
      _isInteraction: true,
    };
  }
}

module.exports = CenzoClient;
