'use strict';

const { Events } = require('discord.js');

/**
 * InviteTracker
 *
 * Caches guild invites on startup and after every change, then compares
 * use-counts on guildMemberAdd to detect which invite a new member used.
 *
 * Attach to the Discord.js client so $functions can reach it:
 *   client._cenzoInviteTracker = new InviteTracker(client);
 *
 * Public helpers used by invite $functions:
 *   tracker.getInviterOf(memberID)              → userID | null
 *   tracker.getInviteCodeUsedBy(memberID)       → code   | null
 *   tracker.getInviterRecord(guildID, userID)   → { real, fake, left, bonus }
 *   tracker.addBonus(guildID, userID, n)
 *   tracker.removeBonus(guildID, userID, n)
 *   tracker.resetInvites(guildID, userID)
 *   tracker.getLeaderboard(guildID, limit)      → [{ userID, total, real, left, bonus, fake }]
 */
class InviteTracker {
  constructor(client) {
    this.client = client;

    // Map<guildID, Map<code, uses>>
    this._cache = new Map();

    // Map<memberID, { inviterID, inviteCode, guildID, joinedAt }>
    this._joined = new Map();

    // Map<`${guildID}:${userID}`, { real, fake, left, bonus }>
    this._inviterData = new Map();

    this._wire();
  }

  // ── Initialise: cache all invites after the client is ready ───────────────

  async init() {
    let cached = 0;
    for (const [, guild] of this.client.guilds.cache) {
      if (await this._cacheGuild(guild)) cached++;
    }
    console.log(`[InviteTracker] Cached invites for ${cached}/${this.client.guilds.cache.size} guild(s).`);
  }

  async _cacheGuild(guild) {
    try {
      const invites = await guild.invites.fetch();
      const map     = new Map();
      for (const [code, invite] of invites) map.set(code, invite.uses ?? 0);
      this._cache.set(guild.id, map);
      return true;
    } catch {
      return false;
    }
  }

  // ── Internal Discord event wiring ─────────────────────────────────────────

  _wire() {
    // Cache invites when the bot joins a new guild
    this.client.on(Events.GuildCreate, async (guild) => {
      await this._cacheGuild(guild);
    });

    // Keep cache in sync when invites are created / deleted
    this.client.on(Events.InviteCreate, (invite) => {
      const gMap = this._cache.get(invite.guild?.id);
      if (gMap) gMap.set(invite.code, invite.uses ?? 0);
    });

    this.client.on(Events.InviteDelete, (invite) => {
      const gMap = this._cache.get(invite.guild?.id);
      if (gMap) gMap.delete(invite.code);
    });

    // Detect which invite a new member used
    this.client.on(Events.GuildMemberAdd, async (member) => {
      const guild  = member.guild;
      const oldMap = this._cache.get(guild.id) ?? new Map();

      let newInvites;
      try { newInvites = await guild.invites.fetch(); } catch { return; }

      // Find the invite whose use count increased
      let usedCode  = null;
      let inviterID = null;

      for (const [code, invite] of newInvites) {
        if ((invite.uses ?? 0) > (oldMap.get(code) ?? 0)) {
          usedCode  = code;
          inviterID = invite.inviter?.id ?? null;
          break;
        }
      }

      // Refresh cache regardless
      const newMap = new Map();
      for (const [code, invite] of newInvites) newMap.set(code, invite.uses ?? 0);
      this._cache.set(guild.id, newMap);

      if (!usedCode || !inviterID) return;

      // Record the join
      this._joined.set(member.id, {
        inviterID,
        inviteCode: usedCode,
        guildID:    guild.id,
        joinedAt:   new Date(),
      });

      // Increment inviter's real invite count
      const rec = this._getOrCreateRecord(guild.id, inviterID);
      rec.real += 1;
    });

    // Track left members so inviter's "left" counter grows
    this.client.on(Events.GuildMemberRemove, (member) => {
      const joinRec = this._joined.get(member.id);
      if (!joinRec) return;

      const rec = this._getOrCreateRecord(member.guild.id, joinRec.inviterID);
      rec.left += 1;
    });
  }

  // ── Internal helpers ──────────────────────────────────────────────────────

  _key(guildID, userID) { return `${guildID}:${userID}`; }

  _getOrCreateRecord(guildID, userID) {
    const k = this._key(guildID, userID);
    if (!this._inviterData.has(k)) {
      this._inviterData.set(k, { real: 0, fake: 0, left: 0, bonus: 0 });
    }
    return this._inviterData.get(k);
  }

  // ── Public API ────────────────────────────────────────────────────────────

  getInviterOf(memberID) {
    return this._joined.get(memberID)?.inviterID ?? null;
  }

  getInviteCodeUsedBy(memberID) {
    return this._joined.get(memberID)?.inviteCode ?? null;
  }

  getInviterRecord(guildID, userID) {
    return this._getOrCreateRecord(guildID, userID);
  }

  /** Total = real + bonus - left - fake */
  getTotalInvites(guildID, userID) {
    const r = this.getInviterRecord(guildID, userID);
    return Math.max(0, r.real + r.bonus - r.left - r.fake);
  }

  addBonus(guildID, userID, amount) {
    const rec = this._getOrCreateRecord(guildID, userID);
    rec.bonus = (rec.bonus ?? 0) + Number(amount);
  }

  removeBonus(guildID, userID, amount) {
    const rec = this._getOrCreateRecord(guildID, userID);
    rec.bonus = Math.max(0, (rec.bonus ?? 0) - Number(amount));
  }

  resetInvites(guildID, userID) {
    const k = this._key(guildID, userID);
    this._inviterData.set(k, { real: 0, fake: 0, left: 0, bonus: 0 });
  }

  /**
   * Returns a sorted leaderboard array for a guild.
   * @param {string} guildID
   * @param {number} limit
   * @returns {{ userID, total, real, bonus, left, fake }[]}
   */
  getLeaderboard(guildID, limit = 10) {
    const results = [];
    for (const [key, rec] of this._inviterData) {
      const [gid, uid] = key.split(':');
      if (gid !== guildID) continue;
      const total = Math.max(0, rec.real + rec.bonus - rec.left - rec.fake);
      results.push({ userID: uid, total, real: rec.real, bonus: rec.bonus, left: rec.left, fake: rec.fake });
    }
    return results.sort((a, b) => b.total - a.total).slice(0, limit);
  }
}

module.exports = InviteTracker;
