'use strict';

// ─── Documentation database ──────────────────────────────────────────────────
// Each entry: name (lowercase key), category, syntax, desc, example
const DOCS = [
  // ── Discord ──────────────────────────────────────────────────────────────
  { name:'username',        cat:'discord',  syntax:'$username',                       desc:'Username of the message author',                         ex:'Hi $username!  →  Hi TestUser!' },
  { name:'userid',          cat:'discord',  syntax:'$userID',                         desc:'User ID of the message author',                          ex:'$userID  →  123456789' },
  { name:'authorid',        cat:'discord',  syntax:'$authorID',                       desc:'User ID of the author — alias for $userID',              ex:'$onlyIf[$authorID==123]  →  (guard)' },
  { name:'usertag',         cat:'discord',  syntax:'$userTag',                        desc:'Author\'s display name / tag',                           ex:'$userTag  →  TestUser' },
  { name:'channelid',       cat:'discord',  syntax:'$channelID',                      desc:'ID of the current channel',                              ex:'$channelID  →  111222333' },
  { name:'channelname',     cat:'discord',  syntax:'$channelName',                    desc:'Name of the current channel',                            ex:'You are in #$channelName' },
  { name:'guildid',         cat:'discord',  syntax:'$guildID',                        desc:'ID of the current server',                               ex:'$guildID  →  987654321' },
  { name:'guildname',       cat:'discord',  syntax:'$guildName',                      desc:'Name of the current server',                             ex:'Server: $guildName' },
  { name:'membercount',     cat:'discord',  syntax:'$memberCount',                    desc:'Total member count of the server',                       ex:'$memberCount members  →  1042 members' },
  { name:'avatar',          cat:'discord',  syntax:'$avatar[userID?]',                desc:'Avatar URL — defaults to author if no ID given',         ex:'$avatar[$mentioned[1;true]]' },
  { name:'mentioned',       cat:'discord',  syntax:'$mentioned[index;fallback]',      desc:'User ID of the nth mention. fallback=true → author ID',  ex:'$mentioned[1;true]  →  123456789' },
  { name:'sendmessage',     cat:'discord',  syntax:'$sendMessage[text;channelID?]',   desc:'Send a message to the channel (or a specific one)',       ex:'$sendMessage[Hello $username!]' },
  { name:'reply',           cat:'discord',  syntax:'$reply[text]',                    desc:'Reply to the triggering message',                        ex:'$reply[Done!]' },
  { name:'deletemessage',   cat:'discord',  syntax:'$deleteMessage[delayMs?]',        desc:'Delete the triggering message after optional delay',      ex:'$deleteMessage[2000]  →  deletes after 2s' },

  // ── Message parsing ───────────────────────────────────────────────────────
  { name:'message',         cat:'message',  syntax:'$message  /  $message[n]',        desc:'Full input after command, or the nth word (1-based)',    ex:'!say hi world  →  $message[1] = hi' },
  { name:'nomentionmessage',cat:'message',  syntax:'$noMentionMessage[n?]',           desc:'Input with Discord mentions stripped. Optional nth word', ex:'!say @x hi  →  $noMentionMessage = hi' },
  { name:'argscount',       cat:'message',  syntax:'$argsCount',                      desc:'Number of space-separated words in the command input',   ex:'!cmd a b c  →  $argsCount = 3' },
  { name:'arg',             cat:'message',  syntax:'$arg[n]',                         desc:'nth word of input — alias for $message[n]',              ex:'$arg[2]  →  second word' },
  { name:'commandname',     cat:'message',  syntax:'$commandName',                    desc:'The triggered command name (without prefix)',             ex:'!ping  →  $commandName = ping' },

  // ── Variables ─────────────────────────────────────────────────────────────
  { name:'var',             cat:'variables',syntax:'$var[name;value]',                desc:'Set a session-scoped variable. Returns empty string',    ex:'$var[score;10]$getVar[score]  →  10' },
  { name:'setvar',          cat:'variables',syntax:'$setVar[name;value]',             desc:'Set a session variable — explicit alias for $var',       ex:'$setVar[hp;100]' },
  { name:'getvar',          cat:'variables',syntax:'$getVar[name;default?]',          desc:'Read a variable. Returns default if not set',            ex:'$getVar[score;0]  →  10' },
  { name:'deletevar',       cat:'variables',syntax:'$deleteVar[name]',               desc:'Remove a variable from the session scope',               ex:'$deleteVar[score]' },

  // ── Control flow ──────────────────────────────────────────────────────────
  { name:'if',              cat:'control',  syntax:'$if[cond;then;else?]',            desc:'Run then or else branch. Only matched branch executes',  ex:'$if[5>3;YES;NO]  →  YES' },
  { name:'onlyif',          cat:'control',  syntax:'$onlyIf[condition]',              desc:'Halt execution silently if condition is false',          ex:'$onlyIf[$argsCount>=1]' },
  { name:'equals',          cat:'control',  syntax:'$equals[a;b;then?;else?]',        desc:'String equality check — returns true/false or branches', ex:'$equals[hi;hi;match;no]  →  match' },
  { name:'loop',            cat:'control',  syntax:'$loop[count;body]',              desc:'Repeat body N times. Max 1000. Body is lazy-evaluated',  ex:'$loop[3;Item $loopNumber\n]' },
  { name:'loopindex',       cat:'control',  syntax:'$loopIndex',                     desc:'Current loop iteration — 0-based',                       ex:'$loop[3;[$loopIndex]]  →  [0][1][2]' },
  { name:'loopnumber',      cat:'control',  syntax:'$loopNumber',                    desc:'Current loop iteration — 1-based',                       ex:'$loop[3;$loopNumber. ]  →  1. 2. 3.' },
  { name:'stop',            cat:'control',  syntax:'$stop',                          desc:'Immediately halt execution. No further output is added',  ex:'hi$stopthis never runs  →  hi' },

  // ── Logic ─────────────────────────────────────────────────────────────────
  { name:'and',             cat:'logic',    syntax:'$and[val1;val2;...]',             desc:'Returns true only if ALL values are truthy',             ex:'$and[true;true;true]  →  true' },
  { name:'or',              cat:'logic',    syntax:'$or[val1;val2;...]',              desc:'Returns true if ANY value is truthy',                    ex:'$or[false;true]  →  true' },
  { name:'not',             cat:'logic',    syntax:'$not[value]',                    desc:'Inverts a boolean — true→false, false→true',             ex:'$not[$equals[a;b]]  →  true' },

  // ── Math ──────────────────────────────────────────────────────────────────
  { name:'math',            cat:'math',     syntax:'$math[expression]',              desc:'Safe arithmetic: + - * / % ^ (). No JavaScript eval',    ex:'$math[(2+3)*4^2]  →  80' },
  { name:'random',          cat:'math',     syntax:'$random[min;max]  /  $random[max]', desc:'Random integer. One arg = 0 to max, two args = min to max', ex:'$random[1;6]  →  4' },

  // ── Strings ───────────────────────────────────────────────────────────────
  { name:'upper',           cat:'strings',  syntax:'$upper[text]',                   desc:'Convert text to UPPERCASE',                              ex:'$upper[hello]  →  HELLO' },
  { name:'lower',           cat:'strings',  syntax:'$lower[text]',                   desc:'Convert text to lowercase',                              ex:'$lower[HELLO]  →  hello' },
  { name:'length',          cat:'strings',  syntax:'$length[text]',                  desc:'Number of characters in text',                           ex:'$length[hello]  →  5' },
  { name:'trim',            cat:'strings',  syntax:'$trim[text]',                    desc:'Strip leading and trailing whitespace',                   ex:'$trim[  hi  ]  →  hi' },
  { name:'replace',         cat:'strings',  syntax:'$replace[text;find;replacement]',desc:'Replace first occurrence of find with replacement',      ex:'$replace[hi world;world;there]  →  hi there' },
  { name:'includes',        cat:'strings',  syntax:'$includes[text;search]',         desc:'Returns true if text contains search, false otherwise',   ex:'$includes[hello;ell]  →  true' },
  { name:'slice',           cat:'strings',  syntax:'$slice[text;start;end?]',        desc:'Extract a substring by character index (0-based)',        ex:'$slice[hello;1;4]  →  ell' },
  { name:'split',           cat:'strings',  syntax:'$split[text;sep;index?]',        desc:'Split by separator. No index = count, index = element',  ex:'$split[a,b,c;,;2]  →  b' },
  { name:'repeat',          cat:'strings',  syntax:'$repeat[text;n;sep?]',           desc:'Repeat text n times with optional separator',            ex:'$repeat[ha;3;-]  →  ha-ha-ha' },
  { name:'newline',         cat:'strings',  syntax:'$newline',                       desc:'Inserts a literal newline character (\\n)',               ex:'line1$newlineline2  →  two lines' },
  { name:'space',           cat:'strings',  syntax:'$space[n?]',                     desc:'Insert n spaces (default 1)',                            ex:'a$space[3]b  →  a   b' },

  // ── Misc ──────────────────────────────────────────────────────────────────
  { name:'time',            cat:'misc',     syntax:'$time  /  $time[format]',        desc:'Unix timestamp, or formatted date. Tokens: YYYY MM DD HH mm ss', ex:'$time[YYYY-MM-DD]  →  2026-05-10' },
  { name:'eval',            cat:'misc',     syntax:'$eval[code]',                    desc:'Re-run code through the framework parser. NOT JavaScript', ex:'$eval[$upper[hello]]  →  HELLO' },
  { name:'evaldjs',         cat:'misc',     syntax:'$evalDJS[code]',                 desc:'JS eval — DISABLED by default. See src/dev/evalDJS.js',   ex:'Opt-in: runtime.register(\'evalDJS\', require(...))' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Extract properly-cased function name from the syntax field
// e.g. "$userID[...]" → "userID",  "$time  /  $time[format]" → "time"
function displayName(doc) {
  return doc.syntax.split(/[\[\/\s]/)[0].slice(1); // strip leading $
}

// ─── Category metadata ────────────────────────────────────────────────────────
const CAT_EMOJI = {
  discord:   '🔵',
  message:   '📨',
  variables: '📦',
  control:   '🔀',
  logic:     '🔣',
  math:      '🔢',
  strings:   '🔤',
  misc:      '⚙️',
};
const CAT_ORDER = ['discord','message','variables','control','logic','math','strings','misc'];

// ─── Formatting helpers ───────────────────────────────────────────────────────

function formatFull(doc) {
  return [
    `📖 **$${doc.name}**`,
    `\`\`\``,
    `Syntax    : ${doc.syntax}`,
    `Category  : ${doc.cat}`,
    ``,
    `${doc.desc}`,
    ``,
    `Example   : ${doc.ex}`,
    `\`\`\``,
  ].join('\n');
}

function formatCompact(doc) {
  return `\`${doc.syntax.padEnd(36)}\` ${doc.desc}`;
}

function formatCategoryList() {
  const lines = ['📚 **CenzoJS Functions** — use `!find <name>` to look up any function\n'];
  for (const cat of CAT_ORDER) {
    const entries = DOCS.filter(d => d.cat === cat);
    const names   = entries.map(d => `\`$${displayName(d)}\``).join(' ');
    lines.push(`${CAT_EMOJI[cat]} **${cat}** (${entries.length})`);
    lines.push(names);
    lines.push('');
  }
  lines.push(`_Total: ${DOCS.length} functions_`);
  return lines.join('\n');
}

// ─── $find[query?] ────────────────────────────────────────────────────────────

module.exports = async (context, args) => {
  const raw   = (args[0] || '').trim();
  const query = raw.toLowerCase();

  // No query → full category listing
  if (!query) return formatCategoryList();

  // Category filter: "discord", "math", "strings", etc.
  if (CAT_ORDER.includes(query)) {
    const entries = DOCS.filter(d => d.cat === query);
    const header  = `${CAT_EMOJI[query]} **${query}** — ${entries.length} functions\n`;
    return header + entries.map(formatCompact).join('\n');
  }

  // Exact name match → full detail
  const exact = DOCS.find(d => d.name === query);
  if (exact) return formatFull(exact);

  // Partial match — search name, syntax, description, and example
  const matches = DOCS.filter(d =>
    d.name.includes(query) ||
    d.syntax.toLowerCase().includes(query) ||
    d.desc.toLowerCase().includes(query) ||
    d.ex.toLowerCase().includes(query) ||
    displayName(d).toLowerCase().includes(query)
  );

  if (!matches.length) {
    return `❌ **No functions found for \`${raw}\`**\n\nTry: \`!find discord\` \`!find math\` \`!find strings\` or just \`!find\` for the full list.`;
  }

  if (matches.length === 1) return formatFull(matches[0]);

  // Multiple matches
  const header = `🔍 **${matches.length} result${matches.length > 1 ? 's' : ''} for \`${raw}\`:**\n`;
  const body   = matches.map(formatCompact).join('\n');
  const footer = matches.length > 8 ? `\n_Use \`!find <exact name>\` for full details._` : '';

  return header + body + footer;
};
