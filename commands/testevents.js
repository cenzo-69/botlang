'use strict';

module.exports = {
  name:        'testevents',
  description: 'List all 26 CenzoJS events and their Discord.js mappings',
  slash:       true,
  ephemeral:   false,

  code: `
$title[📡 CenzoJS Event System]
$color[5865F2]
$author[$botUsername]
$authorIcon[$botAvatar]
$description[CenzoJS supports **26 events** mapped to Discord.js event emitters. Edit any file in \`events/\` and add a \`code:\` property to activate it. Access event data with **\`$getVar[variableName]\`**.]

$addField[💬 Message Events (3);  \`onMessage\` → messageCreate$newline\`onMessageDelete\` → messageDelete$newline\`onMessageEdit\` → messageUpdate;   false]
$addField[👤 Member Events (3);   \`onMemberJoin\` → guildMemberAdd$newline\`onMemberLeave\` → guildMemberRemove$newline\`onMemberUpdate\` → guildMemberUpdate; false]
$addField[🔨 Moderation (2);      \`onBanAdd\` → guildBanAdd$newline\`onBanRemove\` → guildBanRemove;       true]
$addField[⭐ Reactions (2);        \`onReactionAdd\` → messageReactionAdd$newline\`onReactionRemove\` → messageReactionRemove; true]
$addField[🎭 Roles (3);           \`onRoleCreate\` → roleCreate$newline\`onRoleDelete\` → roleDelete$newline\`onRoleUpdate\` → roleUpdate; false]
$addField[📢 Channels (3);        \`onChannelCreate\` → channelCreate$newline\`onChannelDelete\` → channelDelete$newline\`onChannelUpdate\` → channelUpdate; false]
$addField[🔊 Voice (1);           \`onVoiceStateUpdate\` → voiceStateUpdate$newlineVars: memberID · memberUsername · oldChannelID · newChannelID · voiceAction; true]
$addField[🏠 Server (1);          \`onGuildUpdate\` → guildUpdate$newlineVars: guildID · oldGuildName · newGuildName · memberCount; true]
$addField[🕵️ Presence & Threads (3); \`onPresenceUpdate\` → presenceUpdate (oldStatus · newStatus)$newline\`onThreadCreate\` → threadCreate (threadID · threadName · parentChannelID)$newline\`onThreadDelete\` → threadDelete (threadID · threadName); false]
$addField[😀 Invites & Emojis (5); \`onInviteCreate\` → inviteCreate (inviteCode · inviterID · maxUses)$newline\`onInviteDelete\` → inviteDelete (inviteCode · channelID)$newline\`onEmojiCreate\` → emojiCreate (emojiID · emojiName · emojiURL)$newline\`onEmojiDelete\` → emojiDelete (emojiID · emojiName)$newline\`onEmojiUpdate\` → emojiUpdate (oldEmojiName · newEmojiName); false]

$addField[⚙️ How to Activate; 1️⃣ Open any file in \`events/\`$newline2️⃣ Uncomment the \`code:\` block$newline3️⃣ Edit it with your CenzoJS script$newline4️⃣ Restart the bot — event fires automatically; false]

$footer[events/ directory — 26 events • code: and execute: handlers both supported]
$timestamp
  `,
};
