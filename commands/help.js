'use strict';

module.exports = {
  name:        'help',
  description: 'Browse all CenzoJS functions by category',
  slash:       true,
  ephemeral:   false,

  code: `
$title[📚 CenzoJS Function Reference]
$color[5865F2]
$author[$botUsername]
$authorIcon[$botAvatar]
$description[**718 built-in functions** organised into 30+ categories. Select a category below to view every function in it, or use \`!find <name>\` to search for a specific one.]

$addField[💡 Quick Search; \`!find $random\` — look up a specific function$newline\`!find math\` — browse a whole category$newline\`!find\` — see the full category overview; false]
$addField[⚡ Available Categories; 🔵 Discord  📨 Message  🔨 Moderation  🎭 Roles  📢 Channels$newline📦 Variables  🗄️ Database  🔀 Control  🔣 Logic  🔢 Math$newline🔤 Strings  🖼️ Embeds  🧩 Components  🕐 Time  ⏳ Cooldown$newline😀 Reactions  🎲 Random  🌐 HTTP  🪝 Webhooks  🧵 Threads$newline🔐 Permissions  🔊 Voice  📋 JSON  🤖 AI  ⚡ Slash; false]

$addStringSelect[helpselect; 🔍 Pick a category to explore...; 1; 1]
$addStringSelectOption[helpselect; discord;    🔵 Discord;     User, server, channel and bot info]
$addStringSelectOption[helpselect; message;    📨 Message;     Send, reply, delete and parse messages]
$addStringSelectOption[helpselect; moderation; 🔨 Moderation;  Ban, kick, timeout, warn and purge]
$addStringSelectOption[helpselect; roles;      🎭 Roles;       Add, remove and query guild roles]
$addStringSelectOption[helpselect; channels;   📢 Channels;    Create, delete and configure channels]
$addStringSelectOption[helpselect; variables;  📦 Variables;   User, server and channel scoped variables]
$addStringSelectOption[helpselect; database;   🗄️ Database;    Persistent key-value SQL storage ($db)]
$addStringSelectOption[helpselect; control;    🔀 Control Flow; if, stop, return, loops and guards]
$addStringSelectOption[helpselect; logic;      🔣 Logic;       Boolean operators and comparisons]
$addStringSelectOption[helpselect; math;       🔢 Math;        Arithmetic, rounding and numeric utilities]
$addStringSelectOption[helpselect; strings;    🔤 Strings;     Text transform, split and inspect]
$addStringSelectOption[helpselect; embeds;     🖼️ Embeds;      Build and send rich Discord embeds]
$addStringSelectOption[helpselect; components; 🧩 Components;  Buttons, modals and select menus]
$addStringSelectOption[helpselect; time;       🕐 Time;        Current date, time and timestamp values]
$addStringSelectOption[helpselect; cooldown;   ⏳ Cooldown;    Per-user, server and global cooldowns]
$addStringSelectOption[helpselect; reactions;  😀 Reactions;   Add, get and remove message reactions]
$addStringSelectOption[helpselect; random;     🎲 Random;      Random text, numbers, users and colours]
$addStringSelectOption[helpselect; http;       🌐 HTTP;        GET, POST, PUT and DELETE requests]
$addStringSelectOption[helpselect; webhooks;   🪝 Webhooks;    Create and send webhook messages]
$addStringSelectOption[helpselect; threads;    🧵 Threads;     Create, archive and lock threads]
$addStringSelectOption[helpselect; permissions;🔐 Permissions; Check user and bot permissions]
$addStringSelectOption[helpselect; vc;         🔊 Voice;       Mute, deafen, move voice members]
$addStringSelectOption[helpselect; json;       📋 JSON;        Parse, navigate and mutate JSON data]
$addStringSelectOption[helpselect; ai;         🤖 AI;          OpenAI chat completions and decisions]
$addStringSelectOption[helpselect; slash;      ⚡ Slash;       Register and manage slash commands]

$footer[CenzoJS • 718 functions • Select a category above]
$timestamp
  `,
};
