'use strict';

const fs   = require('fs');
const path = require('path');

/**
 * Maps CenzoJS friendly event names → Discord.js event names.
 * Event files can use either the friendly name or the raw Discord.js name.
 */
const EVENT_ALIASES = {
  onMessage:          'messageCreate',
  onMemberJoin:       'guildMemberAdd',
  onMemberLeave:      'guildMemberRemove',
  onMemberUpdate:     'guildMemberUpdate',
  onBanAdd:           'guildBanAdd',
  onBanRemove:        'guildBanRemove',
  onMessageDelete:    'messageDelete',
  onMessageEdit:      'messageUpdate',
  onReactionAdd:      'messageReactionAdd',
  onReactionRemove:   'messageReactionRemove',
  onRoleCreate:       'roleCreate',
  onRoleDelete:       'roleDelete',
  onRoleUpdate:       'roleUpdate',
  onChannelCreate:    'channelCreate',
  onChannelDelete:    'channelDelete',
  onChannelUpdate:    'channelUpdate',
  onGuildUpdate:      'guildUpdate',
  onVoiceStateUpdate: 'voiceStateUpdate',
};

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
          console.warn(`[Events] ${file} missing "name" — skipped.`);
          continue;
        }

        // Resolve friendly alias → Discord.js event name
        const discordEvent = EVENT_ALIASES[evt.name] ?? evt.name;

        const handler = evt.execute
          ? (...args) => evt.execute(this.client, this.runtime, ...args)
              .catch(e => console.error(`[Events:${evt.name}] ${e.message}`))
          : (...args) => this._runCode(evt, ...args);

        evt.once
          ? this.client.once(discordEvent, handler)
          : this.client.on(discordEvent, handler);

        this._loaded.push(evt.name);
        const aliasTag = EVENT_ALIASES[evt.name] ? ` → ${discordEvent}` : '';
        console.log(`[Events] Registered: ${evt.name}${aliasTag} (${file})`);
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
      const { message, extraVars } = await this._resolveContext(evt.name, args);

      const Context = require('./Context');
      const ast     = this.runtime.parse(evt.code);

      const ctx = new Context({
        message,
        client:         this.client,
        variables:      new Map(),
        depth:          0,
        runtime:        this.runtime,
        commandName:    evt.name,
        commandInput:   '',
        commandArgs:    [],
        noMentionInput: '',
      });

      // Inject event-specific variables (accessible via $get[varName])
      if (extraVars) {
        for (const [k, v] of Object.entries(extraVars)) {
          if (v !== null && v !== undefined) ctx.variables.set(k, String(v));
        }
      }

      const result = await this.runtime.executeAST(ast, ctx);
      const embed  = this.runtime._buildEmbed(ctx);
      const comps  = this.runtime._buildComponents(ctx);

      if ((result?.trim() || embed || comps.length) && message?.channel) {
        const payload = {};
        if (result?.trim())  payload.content    = result.trim();
        if (embed)           payload.embeds     = [embed];
        if (comps.length)    payload.components = comps;
        await message.channel.send(payload).catch(e =>
          console.error(`[Events:${evt.name}] Send failed: ${e.message}`)
        );
      }
    } catch (err) {
      console.error(`[Events:${evt.name}] Runtime error: ${err.format?.() ?? err.message}`);
    }
  }

  // ── Context resolution (async — reactions may need partial fetching) ───────
  async _resolveContext(eventName, args) {
    const discordEvent = EVENT_ALIASES[eventName] ?? eventName;

    switch (discordEvent) {

      // ── Message ─────────────────────────────────────────────────────────
      case 'messageCreate': {
        return { message: args[0], extraVars: {} };
      }

      case 'messageDelete': {
        const msg = args[0];
        return {
          message: msg.partial ? null : msg,
          extraVars: {
            deletedContent:   msg.partial ? '' : (msg.content ?? ''),
            deletedAuthorID:  msg.author?.id ?? '',
            deletedChannelID: msg.channelId ?? '',
            deletedMessageID: msg.id ?? '',
          },
        };
      }

      case 'messageUpdate': {
        const [oldMsg, newMsg] = args;
        let oldContent = '', newContent = '';
        try { if (oldMsg?.partial) await oldMsg.fetch(); oldContent = oldMsg?.content ?? ''; } catch {}
        try { if (newMsg?.partial) await newMsg.fetch(); newContent = newMsg?.content ?? ''; } catch {}
        return {
          message: newMsg?.partial ? null : newMsg,
          extraVars: {
            oldContent,
            newContent,
            editedAuthorID:  newMsg?.author?.id ?? '',
            editedChannelID: newMsg?.channelId ?? '',
            editedMessageID: newMsg?.id ?? '',
          },
        };
      }

      // ── Members ──────────────────────────────────────────────────────────
      case 'guildMemberAdd':
      case 'guildMemberRemove': {
        const member = args[0];
        return {
          message: this._fakeMemberMessage(member),
          extraVars: {
            memberID:       member.id,
            memberTag:      member.user?.tag ?? '',
            memberUsername: member.user?.username ?? '',
            memberAvatar:   member.user?.displayAvatarURL?.() ?? '',
            memberCount:    member.guild?.memberCount ?? 0,
            guildName:      member.guild?.name ?? '',
          },
        };
      }

      case 'guildMemberUpdate': {
        const [oldMember, newMember] = args;
        return {
          message: this._fakeMemberMessage(newMember),
          extraVars: {
            memberID:       newMember.id,
            memberTag:      newMember.user?.tag ?? '',
            memberUsername: newMember.user?.username ?? '',
            oldNickname:    oldMember.nickname ?? '',
            newNickname:    newMember.nickname ?? '',
            guildName:      newMember.guild?.name ?? '',
          },
        };
      }

      // ── Bans ─────────────────────────────────────────────────────────────
      case 'guildBanAdd':
      case 'guildBanRemove': {
        const ban = args[0];
        return {
          message: this._fakeGuildMessage(ban.guild),
          extraVars: {
            bannedUserID:   ban.user?.id ?? '',
            bannedUserTag:  ban.user?.tag ?? '',
            bannedUsername: ban.user?.username ?? '',
            banReason:      ban.reason ?? 'No reason provided',
            guildName:      ban.guild?.name ?? '',
          },
        };
      }

      // ── Reactions ────────────────────────────────────────────────────────
      case 'messageReactionAdd':
      case 'messageReactionRemove': {
        const [reaction, user] = args;
        if (reaction.message?.partial) {
          try { await reaction.message.fetch(); } catch {}
        }
        const msg = reaction.message;
        return {
          message: msg.partial ? this._fakeGuildMessage(msg.guild) : msg,
          extraVars: {
            reactionEmoji:    reaction.emoji?.name ?? '',
            reactionEmojiID:  reaction.emoji?.id ?? '',
            reactionIsCustom: reaction.emoji?.id ? 'true' : 'false',
            reactorID:        user.id,
            reactorTag:       user.tag ?? '',
            reactorUsername:  user.username ?? '',
            reactedMessageID: msg.id ?? '',
            reactedChannelID: msg.channelId ?? '',
            reactedAuthorID:  msg.author?.id ?? '',
            reactionCount:    String(reaction.count ?? 1),
          },
        };
      }

      // ── Roles ────────────────────────────────────────────────────────────
      case 'roleCreate':
      case 'roleDelete': {
        const role = args[0];
        return {
          message: this._fakeGuildMessage(role.guild),
          extraVars: {
            roleID:          role.id,
            roleName:        role.name,
            roleColor:       role.hexColor ?? '',
            rolePosition:    String(role.position ?? 0),
            roleMentionable: String(role.mentionable ?? false),
            guildName:       role.guild?.name ?? '',
          },
        };
      }

      case 'roleUpdate': {
        const [oldRole, newRole] = args;
        return {
          message: this._fakeGuildMessage(newRole.guild),
          extraVars: {
            roleID:       newRole.id,
            oldRoleName:  oldRole.name,
            newRoleName:  newRole.name,
            oldRoleColor: oldRole.hexColor ?? '',
            newRoleColor: newRole.hexColor ?? '',
            guildName:    newRole.guild?.name ?? '',
          },
        };
      }

      // ── Channels ─────────────────────────────────────────────────────────
      case 'channelCreate':
      case 'channelDelete': {
        const ch = args[0];
        return {
          message: this._fakeGuildMessage(ch.guild),
          extraVars: {
            channelID:   ch.id,
            channelName: ch.name ?? '',
            channelType: String(ch.type ?? ''),
            guildName:   ch.guild?.name ?? '',
          },
        };
      }

      case 'channelUpdate': {
        const [oldCh, newCh] = args;
        return {
          message: this._fakeGuildMessage(newCh.guild),
          extraVars: {
            channelID:      newCh.id,
            oldChannelName: oldCh.name ?? '',
            newChannelName: newCh.name ?? '',
            channelType:    String(newCh.type ?? ''),
            guildName:      newCh.guild?.name ?? '',
          },
        };
      }

      // ── Guild ────────────────────────────────────────────────────────────
      case 'guildUpdate': {
        const [oldGuild, newGuild] = args;
        return {
          message: this._fakeGuildMessage(newGuild),
          extraVars: {
            guildID:      newGuild.id,
            oldGuildName: oldGuild.name,
            newGuildName: newGuild.name,
            memberCount:  String(newGuild.memberCount ?? 0),
          },
        };
      }

      // ── Voice ────────────────────────────────────────────────────────────
      case 'voiceStateUpdate': {
        const [oldState, newState] = args;
        const member = newState.member ?? oldState.member;
        const guild  = newState.guild  ?? oldState.guild;
        const action = !oldState.channelId && newState.channelId ? 'joined'
                     : oldState.channelId && !newState.channelId ? 'left'
                     : 'moved';
        return {
          message: this._fakeMemberMessage(member, guild),
          extraVars: {
            memberID:       member?.id ?? '',
            memberTag:      member?.user?.tag ?? '',
            memberUsername: member?.user?.username ?? '',
            oldChannelID:   oldState.channelId ?? '',
            newChannelID:   newState.channelId ?? '',
            oldChannelName: oldState.channel?.name ?? '',
            newChannelName: newState.channel?.name ?? '',
            voiceAction:    action,
            guildName:      guild?.name ?? '',
          },
        };
      }

      // ── Fallback ─────────────────────────────────────────────────────────
      default: {
        const primary = args[0];
        let message = null;
        if (primary?.constructor?.name === 'Message') message = primary;
        return { message, extraVars: {} };
      }
    }
  }

  // ── Fake context builders ─────────────────────────────────────────────────
  _fakeMemberMessage(member, guild) {
    if (!member) return null;
    const g = guild ?? member.guild;
    return {
      author:    member.user,
      member,
      guild:     g,
      guildId:   g?.id,
      channel:   g?.systemChannel ?? null,
      channelId: g?.systemChannelId ?? null,
      client:    this.client,
      content:   '',
      mentions:  { users: new Map(), roles: new Map(), channels: new Map(), has: () => false },
      id:        member.id,
      createdAt: new Date(),
      _isEvent:  true,
    };
  }

  _fakeGuildMessage(guild) {
    if (!guild) return null;
    return {
      author:    guild.client?.user ?? null,
      member:    null,
      guild,
      guildId:   guild.id,
      channel:   guild.systemChannel ?? null,
      channelId: guild.systemChannelId ?? null,
      client:    this.client,
      content:   '',
      mentions:  { users: new Map(), roles: new Map(), channels: new Map(), has: () => false },
      id:        guild.id,
      createdAt: new Date(),
      _isEvent:  true,
    };
  }
}

module.exports = EventLoader;
