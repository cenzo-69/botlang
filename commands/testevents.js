'use strict';

/**
 * /testevents — Lists all 26 registered CenzoJS events and their Discord.js mappings.
 * Run with: /testevents  or  !testevents
 */
module.exports = {
  name:        'testevents',
  description: 'List all 26 CenzoJS events and their Discord.js mappings',
  slash:       true,
  ephemeral:   false,

  code: [
    '$title[📡 CenzoJS Event System]',
    '$color[5865F2]',
    '$author[$botUsername]',
    '$authorIcon[$botAvatar]',
    '$description[CenzoJS supports **26 events** mapped to Discord.js event emitters.$newlineEdit any file in the `events/` folder and add a `code:` property to activate it.$newlineAccess event data inside code with **`$get[variableName]`**.]',

    // ── Messages ──
    '$addField[💬 Message Events (3);`onMessage` → messageCreate$newline`onMessageDelete` → messageDelete$newline`onMessageEdit` → messageUpdate;false]',

    // ── Members ──
    '$addField[👤 Member Events (3);`onMemberJoin` → guildMemberAdd$newline`onMemberLeave` → guildMemberRemove$newline`onMemberUpdate` → guildMemberUpdate;false]',

    // ── Moderation & Reactions ──
    '$addField[🔨 Moderation (2);`onBanAdd` → guildBanAdd$newline`onBanRemove` → guildBanRemove;true]',
    '$addField[⭐ Reactions (2);`onReactionAdd` → messageReactionAdd$newline`onReactionRemove` → messageReactionRemove;true]',

    // ── Roles & Channels ──
    '$addField[🎭 Roles (3);`onRoleCreate` → roleCreate$newline`onRoleDelete` → roleDelete$newline`onRoleUpdate` → roleUpdate;false]',
    '$addField[📢 Channels (3);`onChannelCreate` → channelCreate$newline`onChannelDelete` → channelDelete$newline`onChannelUpdate` → channelUpdate;false]',

    // ── Voice & Guild ──
    '$addField[🔊 Voice (1);`onVoiceStateUpdate` → voiceStateUpdate$newlineVars: memberID · memberUsername · oldChannelID · newChannelID · voiceAction;true]',
    '$addField[🏠 Server (1);`onGuildUpdate` → guildUpdate$newlineVars: guildID · oldGuildName · newGuildName · memberCount;true]',

    // ── NEW Events ──
    '$addField[🆕 NEW — Presence & Threads (3);`onPresenceUpdate` → presenceUpdate (oldStatus · newStatus)$newline`onThreadCreate` → threadCreate (threadID · threadName · parentChannelID)$newline`onThreadDelete` → threadDelete (threadID · threadName);false]',
    '$addField[🆕 NEW — Invites & Emojis (3);`onInviteCreate` → inviteCreate (inviteCode · inviterID · maxUses)$newline`onInviteDelete` → inviteDelete (inviteCode · channelID)$newline`onEmojiCreate` → emojiCreate (emojiID · emojiName · emojiURL);false]',

    // ── How to use ──
    '$addField[⚙️ How to Activate;1️⃣ Open any file in `events/`$newline2️⃣ Uncomment the `code:` block$newline3️⃣ Edit it with your CenzoJS script$newline4️⃣ Restart the bot — event fires automatically;false]',
    '$addField[📦 Available Variables;Inside every event `code:` block, use `$get[varName]` to read event-specific data. Each event file lists its available vars in the JSDoc comment at the top.;false]',

    '$footer[events/ directory — 26 events • code: and execute: handlers both supported]',
    '$timestamp',
  ].join('\n'),
};
