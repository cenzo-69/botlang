'use strict';

// ─── Documentation database ───────────────────────────────────────────────────
const DOCS = [
  // ── Discord ──────────────────────────────────────────────────────────────
  { name:'username',         cat:'discord',   syntax:'$username',                        desc:'Username of the message author',                          ex:'Hi $username!  →  Hi TestUser!' },
  { name:'userid',           cat:'discord',   syntax:'$userID',                          desc:'User ID of the message author',                           ex:'$userID  →  123456789' },
  { name:'authorid',         cat:'discord',   syntax:'$authorID',                        desc:'User ID of the author — alias for $userID',               ex:'$onlyIf[$authorID==123456789]' },
  { name:'usertag',          cat:'discord',   syntax:'$userTag',                         desc:'Author display name / tag',                               ex:'$userTag  →  TestUser' },
  { name:'channelid',        cat:'discord',   syntax:'$channelID',                       desc:'ID of the current channel',                               ex:'$channelID  →  111222333' },
  { name:'channelname',      cat:'discord',   syntax:'$channelName',                     desc:'Name of the current channel',                             ex:'You are in #$channelName' },
  { name:'guildid',          cat:'discord',   syntax:'$guildID',                         desc:'ID of the current server',                                ex:'$guildID  →  987654321' },
  { name:'guildname',        cat:'discord',   syntax:'$guildName',                       desc:'Name of the current server',                              ex:'Server: $guildName' },
  { name:'membercount',      cat:'discord',   syntax:'$memberCount',                     desc:'Total member count of the server',                        ex:'$memberCount  →  1042' },
  { name:'avatar',           cat:'discord',   syntax:'$avatar[userID?]',                 desc:'Avatar URL — defaults to author if no userID given',      ex:'$avatar[$mentioned[1;true]]' },
  { name:'mentioned',        cat:'discord',   syntax:'$mentioned[index;fallback]',       desc:'User ID of the nth mention. fallback=true → author ID',   ex:'$mentioned[1;true]  →  123456789' },
  { name:'sendmessage',      cat:'discord',   syntax:'$sendMessage[text;channelID?]',    desc:'Send a message to the current (or a specific) channel',   ex:'$sendMessage[Hello $username!]' },
  { name:'reply',            cat:'discord',   syntax:'$reply[text]',                     desc:'Reply to the triggering message',                         ex:'$reply[Done!]' },
  { name:'deletemessage',    cat:'discord',   syntax:'$deleteMessage[delayMs?]',         desc:'Delete the triggering message after optional ms delay',   ex:'$deleteMessage[2000]' },

  // ── Message parsing ───────────────────────────────────────────────────────
  { name:'message',          cat:'message',   syntax:'$message  /  $message[n]',         desc:'Full input after the command, or the nth word (1-based)', ex:'!say hi world → $message[1] = hi' },
  { name:'nomentionmessage', cat:'message',   syntax:'$noMentionMessage[n?]',            desc:'Command input with all Discord mentions stripped',        ex:'!say @x hi there → $noMentionMessage = hi there' },
  { name:'argscount',        cat:'message',   syntax:'$argsCount',                       desc:'Number of space-separated words in the command input',    ex:'!cmd a b c → $argsCount = 3' },
  { name:'arg',              cat:'message',   syntax:'$arg[n]',                          desc:'Nth word of input — alias for $message[n]',               ex:'$arg[2]  →  second word' },
  { name:'commandname',      cat:'message',   syntax:'$commandName',                     desc:'The triggered command name without prefix',               ex:'!ping  →  $commandName = ping' },

  // ── Variables ─────────────────────────────────────────────────────────────
  { name:'var',              cat:'variables', syntax:'$var[name;value]',                 desc:'Set a session-scoped variable. Returns empty string',     ex:'$var[score;10]$getVar[score]  →  10' },
  { name:'setvar',           cat:'variables', syntax:'$setVar[name;value]',              desc:'Set a session variable — explicit alias for $var',        ex:'$setVar[hp;100]' },
  { name:'getvar',           cat:'variables', syntax:'$getVar[name;default?]',           desc:'Read a variable. Returns default if not set',             ex:'$getVar[score;0]  →  10' },
  { name:'deletevar',        cat:'variables', syntax:'$deleteVar[name]',                 desc:'Remove a variable from the session scope',                ex:'$deleteVar[score]' },

  // ── Control flow ──────────────────────────────────────────────────────────
  { name:'if',               cat:'control',   syntax:'$if[condition;then;else?]',        desc:'Run then or else branch — only the matched branch runs',  ex:'$if[5>3;YES;NO]  →  YES' },
  { name:'onlyif',           cat:'control',   syntax:'$onlyIf[condition]',               desc:'Silently halt execution if condition is false',           ex:'$onlyIf[$argsCount>=1]' },
  { name:'equals',           cat:'control',   syntax:'$equals[a;b;then?;else?]',         desc:'String equality — returns true/false or branches',        ex:'$equals[hi;hi;match;no]  →  match' },
  { name:'loop',             cat:'control',   syntax:'$loop[count;body]',                desc:'Repeat body N times (max 1000). Body is lazy-evaluated',  ex:'$loop[3;Item $loopNumber\n]' },
  { name:'loopindex',        cat:'control',   syntax:'$loopIndex',                       desc:'Current loop iteration — 0-based',                        ex:'$loop[3;[$loopIndex]]  →  [0][1][2]' },
  { name:'loopnumber',       cat:'control',   syntax:'$loopNumber',                      desc:'Current loop iteration — 1-based',                        ex:'$loop[3;$loopNumber. ]  →  1. 2. 3.' },
  { name:'stop',             cat:'control',   syntax:'$stop',                            desc:'Immediately halt execution, no further output added',     ex:'hi$stopnever runs  →  hi' },

  // ── Logic ─────────────────────────────────────────────────────────────────
  { name:'and',              cat:'logic',     syntax:'$and[v1;v2;...]',                  desc:'Returns true only if ALL values are truthy',              ex:'$and[true;true]  →  true' },
  { name:'or',               cat:'logic',     syntax:'$or[v1;v2;...]',                   desc:'Returns true if ANY value is truthy',                     ex:'$or[false;true]  →  true' },
  { name:'not',              cat:'logic',     syntax:'$not[value]',                      desc:'Inverts a boolean — true→false, false→true',              ex:'$not[$equals[a;b]]  →  true' },

  // ── Math ──────────────────────────────────────────────────────────────────
  { name:'math',             cat:'math',      syntax:'$math[expression]',                desc:'Safe arithmetic: + − × / % ^ () — no JavaScript eval',   ex:'$math[(2+3)*4^2]  →  80' },
  { name:'random',           cat:'math',      syntax:'$random[min;max]  /  $random[max]',desc:'Random integer. One arg = 0–max, two args = min–max',     ex:'$random[1;6]  →  4' },

  // ── Strings ───────────────────────────────────────────────────────────────
  { name:'upper',            cat:'strings',   syntax:'$upper[text]',                     desc:'Convert text to UPPERCASE',                               ex:'$upper[hello]  →  HELLO' },
  { name:'lower',            cat:'strings',   syntax:'$lower[text]',                     desc:'Convert text to lowercase',                               ex:'$lower[HELLO]  →  hello' },
  { name:'length',           cat:'strings',   syntax:'$length[text]',                    desc:'Number of characters in text',                            ex:'$length[hello]  →  5' },
  { name:'trim',             cat:'strings',   syntax:'$trim[text]',                      desc:'Strip leading and trailing whitespace',                   ex:'$trim[  hi  ]  →  hi' },
  { name:'replace',          cat:'strings',   syntax:'$replace[text;find;replacement]',  desc:'Replace the first occurrence of find in text',            ex:'$replace[hi world;world;there]  →  hi there' },
  { name:'includes',         cat:'strings',   syntax:'$includes[text;search]',           desc:'Returns true if text contains search string',             ex:'$includes[hello;ell]  →  true' },
  { name:'slice',            cat:'strings',   syntax:'$slice[text;start;end?]',          desc:'Extract a substring by 0-based character index',          ex:'$slice[hello;1;4]  →  ell' },
  { name:'split',            cat:'strings',   syntax:'$split[text;sep;index?]',          desc:'Split by separator. No index = word count, index = word', ex:'$split[a,b,c;,;2]  →  b' },
  { name:'repeat',           cat:'strings',   syntax:'$repeat[text;n;sep?]',             desc:'Repeat text n times with an optional separator',          ex:'$repeat[ha;3;-]  →  ha-ha-ha' },
  { name:'newline',          cat:'strings',   syntax:'$newline',                         desc:'Inserts a literal newline character (\\n)',                ex:'line1$newlineline2  →  two lines' },
  { name:'space',            cat:'strings',   syntax:'$space[n?]',                       desc:'Insert n spaces (default 1)',                             ex:'a$space[3]b  →  a   b' },

  // ── Misc ──────────────────────────────────────────────────────────────────
  { name:'time',             cat:'misc',      syntax:'$time  /  $time[format]',          desc:'Unix timestamp, or formatted date. Tokens: YYYY MM DD HH mm ss', ex:'$time[YYYY-MM-DD]  →  2026-05-10' },
  { name:'eval',             cat:'misc',      syntax:'$eval[code]',                      desc:'Re-run code as framework syntax — NOT JavaScript',        ex:'$eval[$message]  →  executes user input as code' },
  { name:'evaldjs',          cat:'misc',      syntax:'$evalDJS[code]',                   desc:'JS eval — DISABLED by default. Opt-in via runtime.register', ex:'See src/dev/evalDJS.js' },
];

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Strip $ prefix so both "!find $loop" and "!find loop" work identically
function normalise(raw) {
  return raw.trim().replace(/^\$/, '').toLowerCase();
}

// Extract properly-cased display name from the syntax field
// "$userID[...]"  →  "userID"    "$time  /  $time[...]"  →  "time"
function displayName(doc) {
  return doc.syntax.split(/[\[\/\s]/)[0].slice(1);
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatFull(doc) {
  return [
    `📖 **$${displayName(doc)}**`,
    '```',
    `Syntax    : ${doc.syntax}`,
    `Category  : ${doc.cat}`,
    '',
    doc.desc,
    '',
    `Example   : ${doc.ex}`,
    '```',
  ].join('\n');
}

function formatCompact(doc) {
  const pad = 36;
  return `\`${doc.syntax.padEnd(pad)}\` ${doc.desc}`;
}

function formatCategoryList() {
  const lines = ['📚 **CenzoJS Functions** — use `!find $function` to look up any function\n'];
  for (const cat of CAT_ORDER) {
    const entries = DOCS.filter(d => d.cat === cat);
    const names   = entries.map(d => `\`$${displayName(d)}\``).join(' ');
    lines.push(`${CAT_EMOJI[cat]} **${cat}** (${entries.length})`);
    lines.push(names);
    lines.push('');
  }
  lines.push(`_${DOCS.length} functions total_`);
  return lines.join('\n');
}

// ─── $find[query?] ────────────────────────────────────────────────────────────

module.exports = async (context, args) => {
  // Strip leading $ so both "!find $loop" and "!find loop" work
  const query = normalise(args[0] || '');

  // ── No query: full overview ────────────────────────────────────────────────
  if (!query) return formatCategoryList();

  // ── Category filter ────────────────────────────────────────────────────────
  if (CAT_ORDER.includes(query)) {
    const entries = DOCS.filter(d => d.cat === query);
    const header  = `${CAT_EMOJI[query]} **${query}** — ${entries.length} functions\n`;
    return header + entries.map(formatCompact).join('\n');
  }

  // ── Exact name match → full detail ────────────────────────────────────────
  const exact = DOCS.find(d => d.name === query);
  if (exact) return formatFull(exact);

  // ── Partial / keyword search ───────────────────────────────────────────────
  const matches = DOCS.filter(d =>
    d.name.includes(query) ||
    displayName(d).toLowerCase().includes(query) ||
    d.syntax.toLowerCase().includes(query) ||
    d.desc.toLowerCase().includes(query) ||
    d.ex.toLowerCase().includes(query)
  );

  if (!matches.length) {
    return [
      `❌ **No functions found for \`$${args[0] ? normalise(args[0]) : ''}\`**`,
      '',
      'Try a category: `!find discord` `!find math` `!find strings` `!find control`',
      'Or browse everything with `!find`',
    ].join('\n');
  }

  if (matches.length === 1) return formatFull(matches[0]);

  const header = `🔍 **${matches.length} results for \`$${query}\`:**\n`;
  const body   = matches.map(formatCompact).join('\n');
  const tip    = matches.length > 6 ? `\n_Tip: \`!find $${query}\` on the exact name for full details_` : '';
  return header + body + tip;
};
