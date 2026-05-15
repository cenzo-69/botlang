'use strict';

module.exports = {
  name:        'eventtest',
  description: 'Guide for testing all active CenzoJS events',
  slash:       true,
  ephemeral:   false,

  code: `
$title[🧪 Event Testing Guide]
$color[ED4245]
$author[CenzoJS — Active Events]
$authorIcon[$botAvatar]
$description[**9 events** are now active and will post visible output when triggered. Most guild events (join/leave/ban/role/channel) post to your server's **System Channel**. Message and reaction events post to the **channel where the action happened**.]

$addField[👋 onMemberJoin; Have a user join your server (or use a second account).$newlinePosts a welcome embed to the system channel.; false]
$addField[🚪 onMemberLeave; Have a user leave (or kick them then undo).$newlinePosts a farewell message to the system channel.; false]
$addField[⭐ onReactionAdd; Add any emoji reaction to any message in any channel.$newlinePosts a reaction log **in that same channel**.; false]
$addField[🔊 onVoiceStateUpdate; Join, leave, or move between voice channels.$newlinePosts joined/left/moved status to the system channel.; false]
$addField[🔨 onBanAdd; Ban any user (can be unbanned immediately).$newlinePosts ban details to the system channel.; false]
$addField[🎭 onRoleCreate; Create a new role in Server Settings → Roles.$newlinePosts the new role name + color to the system channel.; false]
$addField[📢 onChannelCreate; Create any new channel (text, voice, etc.).$newlinePosts the channel name + type to the system channel.; false]
$addField[🗑️ onMessageDelete; Delete any message in any channel.$newlinePosts deleted content **in that channel** (empty if Discord didn't cache it).; false]
$addField[✏️ onMessageEdit; Edit any message.$newlinePosts before → after **in that channel** (before may be empty if not cached).; false]

$addField[⚠️ System Channel Required; Events that post to the system channel won't appear if no system channel is set.$newlineFix: **Server Settings → Overview → System Messages Channel** → pick any channel.; false]
$addField[🔕 Dormant Events (16); \`onBanRemove\` · \`onRoleDelete\` · \`onRoleUpdate\` · \`onChannelDelete\` · \`onChannelUpdate\`$newline\`onMemberUpdate\` · \`onReactionRemove\` · \`onGuildUpdate\` · \`onPresenceUpdate\`$newline\`onThreadCreate\` · \`onThreadDelete\` · \`onInviteCreate\` · \`onInviteDelete\`$newline\`onEmojiCreate\` · \`onMessage\` · \`guildCreate\`$newlineEdit any file in \`events/\` and add a \`code:\` property to activate one.; false]

$footer[/eventtest — CenzoJS]
$timestamp
  `,
};
