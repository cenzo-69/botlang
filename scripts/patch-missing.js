'use strict';
/**
 * Adds the 24 remaining missing function entries to functions.json
 * Run: node scripts/patch-missing.js
 */
const fs   = require('fs');
const path = require('path');

const current = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'functions.json'), 'utf8'));
const existingKeys = new Set(current.functions.map(f => f.key.toLowerCase()));

function fn(name, key, category, description, syntax, args, returns, lazy, examples) {
  return { name, key, category, description, syntax, args, returns, lazy, examples };
}
function arg(name, type, required, description) {
  return { name, type, required: !!required, lazy: false, description };
}
function ex(code, output) { return { code, output }; }

const PATCH = [

  // ── message ──────────────────────────────────────────────────────────────
  fn('$addPage', 'addpage', 'message',
    'Adds a paginated page to the embed paginator, creating a multi-page response.',
    '$addPage[content]',
    [arg('content','string',true,'Embed or message content for this page.')],
    'string (empty)', [],
    [ex('$addPage[Page 1 content]\n$addPage[Page 2 content]', '')]),

  // ── channels ─────────────────────────────────────────────────────────────
  fn('$clearMessages', 'clearmessages', 'channels',
    'Bulk-deletes messages in a channel. Returns the number deleted.',
    '$clearMessages[channelID;amount;deletePinned?;deleteBots?]',
    [arg('channelID','snowflake',true,'Channel ID to clear.'), arg('amount','number',true,'Number of messages to delete (1–100).'), arg('deletePinned','boolean',false,'"true" to also delete pinned messages. Default: false.'), arg('deleteBots','boolean',false,'"true" to also delete bot messages. Default: true.')],
    'number', [],
    [ex('$clearMessages[$channelID;50]', '50')]),

  fn('$startTyping', 'starttyping', 'channels',
    'Shows the typing indicator in a channel for approximately 10 seconds.',
    '$startTyping[channelID?]',
    [arg('channelID','snowflake',false,'Channel ID. Defaults to current channel.')],
    'string (empty)', [],
    [ex('$startTyping', '')]),

  // ── statement / control ───────────────────────────────────────────────────
  fn('$default', 'defaultfunc', 'control',
    'Returns rightHand if leftHand is falsy or empty; otherwise returns leftHand.',
    '$default[leftHand;rightHand]',
    [arg('leftHand','string',true,'Primary value.'), arg('rightHand','string',true,'Fallback value returned when leftHand is empty/falsy.')],
    'string', [],
    [ex('$default[;fallback]', 'fallback'), ex('$default[hello;fallback]', 'hello')]),

  fn('$return', 'returnfunc', 'control',
    'Returns a value from the current code block and stops further execution.',
    '$return[value?]',
    [arg('value','string',false,'Value to return. Defaults to empty string.')],
    'string', [],
    [ex('$if[$username==Admin;$return[Hello Admin]]\nHi!', 'Hello Admin')]),

  // ── cooldown ──────────────────────────────────────────────────────────────
  fn('$deleteCooldown', 'deletecooldown', 'cooldown',
    'Removes the current user\'s active global cooldown, resetting it immediately.',
    '$deleteCooldown',
    [],
    'string (empty)', [],
    [ex('$deleteCooldown', '')]),

  fn('$guildCooldown', 'guildcooldown', 'cooldown',
    'Applies a per-guild cooldown. Stops execution and sends an error if still active.',
    '$guildCooldown[time;errorMsg?]',
    [arg('time','string',true,'Duration string e.g. "30s", "5m".'), arg('errorMsg','string',false,'Message to send when on cooldown.')],
    'string (error or empty)', [],
    [ex('$guildCooldown[1m;This server is on cooldown!]', '')]),

  // ── embeds ────────────────────────────────────────────────────────────────
  fn('$deleteField', 'deletefield', 'embeds',
    'Removes a field at the given index from an embed builder.',
    '$deleteField[fieldIndex;embedIndex?]',
    [arg('fieldIndex','number',true,'Zero-based field index.'), arg('embedIndex','number',false,'Embed builder index. Default: 0.')],
    'string (empty)', [],
    [ex('$deleteField[0]', '')]),

  fn('$editField', 'editfield', 'embeds',
    'Edits an existing field in an embed builder.',
    '$editField[fieldIndex;name?;value?;inline?;embedIndex?]',
    [arg('fieldIndex','number',true,'Zero-based field index.'), arg('name','string',false,'New field name.'), arg('value','string',false,'New field value.'), arg('inline','boolean',false,'"true" or "false" to set inline mode.'), arg('embedIndex','number',false,'Embed builder index. Default: 0.')],
    'string (empty)', [],
    [ex('$editField[0;Updated Title;New Value;false]', '')]),

  // ── discord ───────────────────────────────────────────────────────────────
  fn('$djsVersion', 'djsversion', 'discord',
    'Returns the currently installed discord.js version string.',
    '$djsVersion',
    [],
    'string', [],
    [ex('discord.js v$djsVersion', 'discord.js v14.15.2')]),

  fn('$typeof', 'typeof', 'discord',
    'Returns the JavaScript type of a value ("string", "number", "boolean", "object", "undefined").',
    '$typeof[value]',
    [arg('value','string',true,'Value to inspect.')],
    'string', [],
    [ex('$typeof[42]', 'number'), ex('$typeof[hello]', 'string')]),

  fn('$userCount', 'usercount', 'discord',
    'Returns the total number of unique users cached by the bot.',
    '$userCount',
    [],
    'number', [],
    [ex('$userCount', '15432')]),

  // ── emojis ────────────────────────────────────────────────────────────────
  fn('$emoji', 'emoji', 'emojis',
    'Formats a custom emoji as <:name:id> or <a:name:id> for use in messages.',
    '$emoji[emojiID]',
    [arg('emojiID','snowflake',true,'Custom emoji ID to format.')],
    'string', [],
    [ex('$emoji[123456789]', '<:pepe:123456789>')]),

  fn('$emojiAnimated', 'emojianimated', 'emojis',
    'Returns "true" if the given custom emoji is animated (GIF).',
    '$emojiAnimated[emojiID]',
    [arg('emojiID','snowflake',true,'Custom emoji ID.')],
    'string (true/false)', [],
    [ex('$emojiAnimated[123456789]', 'false')]),

  fn('$emojiCreatedAt', 'emojicreatedat', 'emojis',
    'Returns the ISO creation date of a custom emoji.',
    '$emojiCreatedAt[emojiID]',
    [arg('emojiID','snowflake',true,'Custom emoji ID.')],
    'string (ISO date)', [],
    [ex('$emojiCreatedAt[123456789]', '2022-03-01T12:00:00.000Z')]),

  fn('$emojiNames', 'emojinames', 'emojis',
    'Returns all custom emoji names in a guild as a separated string.',
    '$emojiNames[guildID?;separator?]',
    [arg('guildID','snowflake',false,'Guild ID. Defaults to current guild.'), arg('separator','string',false,'Separator. Default: ", ".')],
    'string', [],
    [ex('$emojiNames', 'pepe, kek, gachi')]),

  // ── member ────────────────────────────────────────────────────────────────
  fn('$memberHighestRoleID', 'memberhighestroleid', 'member',
    'Returns the ID of the highest-positioned role the member has in a guild.',
    '$memberHighestRoleID[guildID;userID?]',
    [arg('guildID','snowflake',true,'Guild ID.'), arg('userID','snowflake',false,'User ID. Defaults to message author.')],
    'string (snowflake)', [],
    [ex('$memberHighestRoleID[$guildID]', '123456789')]),

  fn('$memberJoinedAt', 'memberjoinedat', 'member',
    'Returns the ISO date the user joined the guild.',
    '$memberJoinedAt[guildID;userID?]',
    [arg('guildID','snowflake',true,'Guild ID.'), arg('userID','snowflake',false,'User ID. Defaults to message author.')],
    'string (ISO date)', [],
    [ex('$memberJoinedAt[$guildID]', '2022-05-10T14:00:00.000Z')]),

  // ── math ──────────────────────────────────────────────────────────────────
  fn('$sum', 'sum', 'math',
    'Adds all provided numbers together (alias for $add with multiple args).',
    '$sum[n1;n2;...]',
    [arg('n','number',true,'Two or more numbers to sum.')],
    'number', [],
    [ex('$sum[1;2;3;4;5]', '15')]),

  // ── number ────────────────────────────────────────────────────────────────
  fn('$parseInt', 'parseintfunc', 'number',
    'Parses a string to an integer with an optional radix (base).',
    '$parseInt[value;radix?]',
    [arg('value','string',true,'String to parse.'), arg('radix','number',false,'Base to use (2–36). Default: 10.')],
    'number', [],
    [ex('$parseInt[ff;16]', '255'), ex('$parseInt[42.9]', '42')]),

  // ── roles ─────────────────────────────────────────────────────────────────
  fn('$roleCreatedAt', 'rolecreatedat', 'roles',
    'Returns the ISO creation date of a role.',
    '$roleCreatedAt[guildID;roleID]',
    [arg('guildID','snowflake',true,'Guild ID.'), arg('roleID','snowflake',true,'Role ID.')],
    'string (ISO date)', [],
    [ex('$roleCreatedAt[$guildID;$roleid[Moderator]]', '2021-03-15T08:00:00.000Z')]),

  // ── strings ───────────────────────────────────────────────────────────────
  fn('$indexOf', 'indexof', 'strings',
    'Returns the index of the first occurrence of a search string in text, or -1.',
    '$indexOf[text;search;fromIndex?]',
    [arg('text','string',true,'Input string.'), arg('search','string',true,'Substring to search for.'), arg('fromIndex','number',false,'Starting index. Default: 0.')],
    'number', [],
    [ex('$indexOf[hello world;world]', '6')]),

  fn('$toLowerCase', 'tolowercase', 'strings',
    'Converts text to lowercase (alias for $lowercase).',
    '$toLowerCase[text]',
    [arg('text','string',true,'Text to convert.')],
    'string', [],
    [ex('$toLowerCase[HELLO]', 'hello')]),

  fn('$toUpperCase', 'touppercase', 'strings',
    'Converts text to UPPERCASE (alias for $uppercase).',
    '$toUpperCase[text]',
    [arg('text','string',true,'Text to convert.')],
    'string', [],
    [ex('$toUpperCase[hello]', 'HELLO')]),

];

const newEntries = PATCH.filter(e => !existingKeys.has(e.key.toLowerCase()));
console.log(`Patching: ${newEntries.length} new entries (${PATCH.length - newEntries.length} skipped as existing)`);

const output = {
  meta:       current.meta,
  categories: current.categories,
  functions:  [...current.functions, ...newEntries],
};

const outPath = path.join(__dirname, '..', 'functions.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`Total functions now: ${output.functions.length}`);
