module.exports = {
  name:        'testevents',
  description: 'Shows all 18 registered custom events and their Discord.js mappings',
  slash:       true,

  code: [
    '$title[📡 Custom Event System]',
    '$color[5865F2]',
    '$description[CenzoJS supports **18 custom events**. Edit any file in the `events/` folder and add a `code:` property to activate it.]',
    '$field[💬 Message Events;`onMessage` → messageCreate\n`onMessageDelete` → messageDelete\n`onMessageEdit` → messageUpdate;false]',
    '$field[👤 Member Events;`onMemberJoin` → guildMemberAdd\n`onMemberLeave` → guildMemberRemove\n`onMemberUpdate` → guildMemberUpdate;false]',
    '$field[🔨 Moderation;`onBanAdd` → guildBanAdd\n`onBanRemove` → guildBanRemove;true]',
    '$field[⭐ Reactions;`onReactionAdd` → messageReactionAdd\n`onReactionRemove` → messageReactionRemove;true]',
    '$field[🎭 Roles;`onRoleCreate` → roleCreate\n`onRoleDelete` → roleDelete\n`onRoleUpdate` → roleUpdate;false]',
    '$field[📂 Channels;`onChannelCreate` → channelCreate\n`onChannelDelete` → channelDelete\n`onChannelUpdate` → channelUpdate;false]',
    '$field[🏠 Server;`onGuildUpdate` → guildUpdate\n`onVoiceStateUpdate` → voiceStateUpdate;false]',
    '$field[How to use;Add `code: "your CenzoJS script"` to any event file.\nUse `$get[varName]` to access event-specific data.;false]',
    '$footer[Events directory: events/ | All events support code: and execute: handlers]',
  ].join('\n'),
};
