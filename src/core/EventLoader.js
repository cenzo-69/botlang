'use strict';

const fs   = require('fs');
const path = require('path');

/**
 * Loads event files from the `events/` directory.
 *
 * Each event file exports an object with:
 *   name     {string}   — Discord.js event name (e.g. 'messageCreate')
 *   once     {boolean}  — fire once only (default: false)
 *   type     {string}   — 'event' (optional label, ignored here)
 *
 * Handler (choose one):
 *   code     {string}   — CenzoJS script. Context is built from event args.
 *   execute  {function} — async (client, runtime, ...eventArgs) => {}
 *
 * CenzoJS context mapping per event:
 *   messageCreate / messageUpdate / messageDelete  → message
 *   guildMemberAdd / guildMemberRemove             → member (message = fake)
 *   guildCreate / guildDelete                      → guild (message = fake)
 *   voiceStateUpdate                               → newState.member (message = fake)
 *   interactionCreate                              → interaction-based (see index.js)
 *   ready / clientReady                            → client
 *
 * Example event file:
 *   module.exports = {
 *     name: 'guildMemberAdd',
 *     code: 'Welcome $username to the server!',
 *   };
 */
class EventLoader {
  constructor(client, runtime) {
    this.client  = client;
    this.runtime = runtime;
    this._loaded = [];
  }

  load(eventsDir) {
    if (!fs.existsSync(eventsDir)) {
      console.log('[Events] No events/ directory found — skipping.');
      return this;
    }

    const files = fs.readdirSync(eventsDir)
      .filter(f => f.endsWith('.js') || f.endsWith('.cj'));

    for (const file of files) {
      try {
        const evt = require(path.join(eventsDir, file));
        if (!evt.name) {
          console.warn(`[Events] ${file} missing "name" property — skipped.`);
          continue;
        }

        const handler = evt.execute
          ? (...args) => evt.execute(this.client, this.runtime, ...args)
              .catch(e => console.error(`[Events:${evt.name}] ${e.message}`))
          : (...args) => this._runCode(evt, ...args);

        if (evt.once) {
          this.client.once(evt.name, handler);
        } else {
          this.client.on(evt.name, handler);
        }

        this._loaded.push(evt.name);
        console.log(`[Events] Registered: ${evt.name} (${file})`);
      } catch (err) {
        console.error(`[Events] Failed to load ${file}: ${err.message}`);
      }
    }

    return this;
  }

  // ── Code-based event runner ────────────────────────────────────────────────
  async _runCode(evt, ...args) {
    if (!evt.code) return;

    try {
      const { message, member, guild, extraVars } = this._resolveContext(evt.name, args);

      const Context = require('./Context');
      const ast     = this.runtime.parse(evt.code);

      // Build a fake message-like object if there's no real message
      const ctx = new Context({
        message,
        client:      this.client,
        variables:   new Map(Object.entries(extraVars ?? {})),
        depth:       0,
        runtime:     this.runtime,
        commandName: evt.name,
        commandInput: '',
        commandArgs:  [],
        noMentionInput: '',
      });

      // Inject extra context data into variables
      if (member) ctx.variables.set('__event_member_id__', member.id ?? '');
      if (guild)  ctx.variables.set('__event_guild_id__',  guild.id  ?? '');

      const result = await this.runtime.executeAST(ast, ctx);
      const embed  = this.runtime._buildEmbed(ctx);
      const comps  = this.runtime._buildComponents(ctx);

      // If there's output or embed, send it to a configured channel
      if ((result?.trim() || embed || comps.length) && message?.channel) {
        const payload = {};
        if (result?.trim())  payload.content    = result.trim();
        if (embed)           payload.embeds     = [embed];
        if (comps.length)    payload.components = comps;
        await message.channel.send(payload).catch(e => console.error(`[Events:${evt.name}] Send failed: ${e.message}`));
      }
    } catch (err) {
      console.error(`[Events:${evt.name}] Runtime error: ${err.format?.() ?? err.message}`);
    }
  }

  // ── Build context from event arguments ────────────────────────────────────
  _resolveContext(eventName, args) {
    const primary   = args[0];
    const secondary = args[1];
    let message = null, member = null, guild = null;

    switch (eventName) {
      // ── Message events ──────────────────────────────────────────────────────
      case 'messageCreate':
      case 'messageUpdate':
        message = (eventName === 'messageUpdate') ? secondary : primary;
        break;

      case 'messageDelete':
        message = primary;
        break;

      // ── Member events ───────────────────────────────────────────────────────
      case 'guildMemberAdd':
      case 'guildMemberRemove':
        member  = primary;
        guild   = primary.guild;
        message = this._fakeMemberMessage(primary);
        break;

      // ── Guild events ────────────────────────────────────────────────────────
      case 'guildCreate':
      case 'guildDelete':
        guild   = primary;
        message = this._fakeGuildMessage(primary);
        break;

      // ── Voice events ────────────────────────────────────────────────────────
      case 'voiceStateUpdate': {
        const newState = secondary ?? primary;
        member  = newState.member;
        guild   = newState.guild;
        message = this._fakeMemberMessage(member, guild);
        break;
      }

      // ── Ready ────────────────────────────────────────────────────────────────
      case 'ready':
      case 'clientReady':
        message = null;
        break;

      // ── Default: try to use first arg as message ──────────────────────────
      default:
        if (primary?.constructor?.name === 'Message') message = primary;
        break;
    }

    return { message, member, guild };
  }

  _fakeMemberMessage(member, guild) {
    if (!member) return null;
    return {
      author:    member.user,
      member,
      guild:     guild ?? member.guild,
      guildId:   (guild ?? member.guild)?.id,
      channel:   (guild ?? member.guild)?.systemChannel ?? null,
      channelId: (guild ?? member.guild)?.systemChannelId ?? null,
      client:    this.client,
      content:   '',
      mentions:  { users: new Map(), roles: new Map(), channels: new Map() },
      id:        member.id,
      createdAt: new Date(),
      _isEvent:  true,
    };
  }

  _fakeGuildMessage(guild) {
    if (!guild) return null;
    return {
      author:    guild.client?.user,
      member:    null,
      guild,
      guildId:   guild.id,
      channel:   guild.systemChannel ?? null,
      channelId: guild.systemChannelId ?? null,
      client:    this.client,
      content:   '',
      mentions:  { users: new Map(), roles: new Map(), channels: new Map() },
      id:        guild.id,
      createdAt: new Date(),
      _isEvent:  true,
    };
  }
}

module.exports = EventLoader;
