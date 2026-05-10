'use strict';

const { Runtime } = require('./src');

async function main() {
  const runtime = new Runtime();
  console.log('Loaded functions:', runtime.loader.list().sort().join(', '));
  console.log('');

  // ── Base mock (no command context) ──────────────────────────────────────────
  const mockMessage = {
    author:   { id: '123456789', username: 'TestUser', discriminator: '0' },
    guild:    { id: '987654321', name: 'Test Guild', memberCount: 42 },
    channel:  { id: '111222333', name: 'general', send: async (m) => m },
    content:  '!test hello world',
    mentions: { users: new Map() },
    client: {
      users: {
        fetch: async (id) => ({
          id,
          displayAvatarURL: () => 'https://cdn.discordapp.com/avatar.png',
        }),
      },
    },
    deletable: false,
    reply: async (m) => m,
  };

  // ── Command mock (has command context via runForCommand) ──────────────────
  // Simulates: !cmd hello world
  const cmdMockBase = {
    ...mockMessage,
    content: '!cmd hello world',
  };

  // Simulates: !cmd @User foo bar  (mention + two words)
  const cmdMockMention = {
    ...mockMessage,
    content: '!cmd <@999888777> foo bar',
  };

  // ── Test runner ────────────────────────────────────────────────────────────
  let passed = 0;
  let failed = 0;

  async function test(label, fn) {
    try {
      const result = await fn();
      console.log(`✅  [${label}]`);
      console.log(`    => ${JSON.stringify(result)}`);
      passed++;
    } catch (err) {
      console.error(`❌  [${label}] ERROR: ${err.message}`);
      failed++;
    }
  }

  // Shorthand: run with base mock (no command context)
  const run = (code) => runtime.runForMessage(code, mockMessage);

  // Shorthand: run with command context ("!cmd hello world")
  const runCmd = (code, msg = cmdMockBase) =>
    runtime.runForCommand(code, msg, '!');

  // ── Section 1: Core Discord functions ─────────────────────────────────────
  console.log('── Section 1: Discord ──────────────────────────────────────────');
  await test('Plain text',        () => run('Hello World'));
  await test('$username',         () => run('$username'));
  await test('$userID',           () => run('$userID'));
  await test('$authorID',         () => run('$authorID'));
  await test('$userTag',          () => run('$userTag'));
  await test('$channelID',        () => run('$channelID'));
  await test('$channelName',      () => run('$channelName'));
  await test('$guildID',          () => run('$guildID'));
  await test('$guildName',        () => run('$guildName'));
  await test('$memberCount',      () => run('$memberCount'));
  await test('$avatar[$userID]',  () => run('$avatar[$userID]'));

  // ── Section 2: Message parsing ────────────────────────────────────────────
  console.log('\n── Section 2: Message Parsing ──────────────────────────────────');
  await test('$commandName',      () => runCmd('$commandName'));
  await test('$message full',     () => runCmd('$message'));
  await test('$message[1]',       () => runCmd('$message[1]'));
  await test('$message[2]',       () => runCmd('$message[2]'));
  await test('$message oob',      () => runCmd('$message[99]'));
  await test('$argsCount 2',      () => runCmd('$argsCount'));
  await test('$argsCount 0',      () => runCmd('$argsCount', { ...mockMessage, content: '!cmd' }));
  await test('$noMentionMsg',     () => runCmd('$noMentionMessage', cmdMockMention));
  await test('$noMentionMsg[1]',  () => runCmd('$noMentionMessage[1]', cmdMockMention));
  await test('$noMentionMsg[2]',  () => runCmd('$noMentionMessage[2]', cmdMockMention));
  await test('$arg[1]',           () => runCmd('$arg[1]'));
  await test('$arg[2]',           () => runCmd('$arg[2]'));
  await test('$mentioned fallback',() => runCmd('$mentioned[1;true]'));

  // ── Section 3: $eval — framework re-execution (NO JavaScript) ────────────
  console.log('\n── Section 3: $eval (framework re-execution) ───────────────────');
  await test('$eval static text',  () => run('$eval[hello world]'));
  await test('$eval $username',    () => run('$eval[$username]'));
  await test('$eval $upper',       () => run('$eval[$upper[hello]]'));
  await test('$eval $math',        () => run('$eval[$math[2^10]]'));
  await test('$eval variable',     () => run('$eval[$var[n;42]$getVar[n]]'));
  await test('$eval $message',     () => runCmd('$eval[$message]',
    { ...mockMessage, content: '!cmd $upper[hello $username]' }));
  await test('$eval no JS',        () => run('$eval[1+1]'));   // returns "1+1", not "2"
  await test('$evalDJS disabled',  () => run('$evalDJS[1+1]'));

  // ── Section 4: Variables ──────────────────────────────────────────────────
  console.log('\n── Section 4: Variables ────────────────────────────────────────');
  await test('$var + $getVar',     () => run('$var[score;999]$getVar[score]'));
  await test('$setVar + $getVar',  () => run('$setVar[x;77]$getVar[x]'));
  await test('$getVar default',    () => run('$getVar[missing;fallback]'));
  await test('$deleteVar',         () => run('$var[k;hi]$deleteVar[k]$getVar[k;gone]'));
  await test('var shared in eval', () => run('$var[z;10]$eval[$getVar[z]]'));

  // ── Section 5: Control flow ───────────────────────────────────────────────
  console.log('\n── Section 5: Control Flow ─────────────────────────────────────');
  await test('$if true',           () => run('$if[5>3;YES;NO]'));
  await test('$if false',          () => run('$if[1>3;YES;NO]'));
  await test('$if ==',             () => run('$if[hello==hello;match;no match]'));
  await test('$if >=',             () => run('$if[5>=5;ok;fail]'));
  await test('$if !=',             () => run('$if[a!=b;diff;same]'));
  await test('$equals same',       () => run('$equals[a;a]'));
  await test('$equals diff',       () => run('$equals[a;b]'));
  await test('$equals branch',     () => run('$equals[x;x;MATCH;NO MATCH]'));
  await test('$onlyIf true',       () => run('$onlyIf[5>3]after'));
  await test('$onlyIf false stops',() => run('before$onlyIf[1>3]after'));
  await test('$onlyIf == true',    () => runCmd('$onlyIf[$argsCount>=1]got: $message'));
  await test('$stop',              () => run('$var[x;1]$stop$var[x;99]$getVar[x]'));

  // ── Section 6: Logic operators ────────────────────────────────────────────
  console.log('\n── Section 6: Logic ────────────────────────────────────────────');
  await test('$and true',          () => run('$and[true;true]'));
  await test('$and false',         () => run('$and[true;false]'));
  await test('$or true',           () => run('$or[false;true]'));
  await test('$or false',          () => run('$or[false;false]'));
  await test('$not true→false',    () => run('$not[true]'));
  await test('$not false→true',    () => run('$not[false]'));

  // ── Section 7: Loops ──────────────────────────────────────────────────────
  console.log('\n── Section 7: Loops ────────────────────────────────────────────');
  await test('$loop loopNumber',   () => run('$loop[3;Item $loopNumber\n]'));
  await test('$loop loopIndex',    () => run('$loop[3;Idx $loopIndex\n]'));
  await test('loop with vars',     () => run('$var[x;0]$loop[3;$var[x;$math[$getVar[x]+1]]]total:$getVar[x]'));
  await test('$setVar in loop',    () => run('$setVar[s;0]$loop[5;$setVar[s;$math[$getVar[s]+10]]]$getVar[s]'));

  // ── Section 8: Math ───────────────────────────────────────────────────────
  console.log('\n── Section 8: Math ─────────────────────────────────────────────');
  await test('$math basic',        () => run('$math[2+2]'));
  await test('$math power',        () => run('$math[2^10]'));
  await test('$math parens',       () => run('$math[(3+4)*2]'));
  await test('$math float',        () => run('$math[10/3]'));
  await test('$random range',      () => run('$random[1;6]'));

  // ── Section 9: Strings ────────────────────────────────────────────────────
  console.log('\n── Section 9: Strings ──────────────────────────────────────────');
  await test('$lower',             () => run('$lower[HELLO WORLD]'));
  await test('$upper',             () => run('$upper[hello world]'));
  await test('$length',            () => run('$length[hello]'));
  await test('$trim',              () => run('$trim[  hello  ]'));
  await test('$includes true',     () => run('$includes[hello world;world]'));
  await test('$includes false',    () => run('$includes[hello world;xyz]'));
  await test('$replace',           () => run('$replace[hello world;world;everyone]'));
  await test('$slice',             () => run('$slice[hello world;6]'));
  await test('$split count',       () => run('$split[a,b,c;,]'));
  await test('$split element',     () => run('$split[a,b,c;,;2]'));
  await test('$repeat',            () => run('$repeat[ab;3;-]'));
  await test('$newline',           () => run('line1$newlineline2'));
  await test('$space',             () => run('a$space[3]b'));
  await test('$time format',       () => run('$time[YYYY-MM-DD]'));
  await test('$time unix',         () => run('$time'));

  // ── Section 10: Nesting & edge cases ─────────────────────────────────────
  console.log('\n── Section 10: Nesting & edge cases ────────────────────────────');
  await test('$nested',            () => run('$upper[$username]'));
  await test('$deep nested',       () => run('$length[$upper[$username]]'));
  await test('complex nesting',    () => run('$if[$includes[$username;Test];$upper[$username];$lower[$username]]'));
  await test('$unknown passthrough',() => run('$unknownFunc'));
  await test('multiline code',     () => run('Line1\nLine2\n$upper[line3]'));
  await test('escape $ sign',      () => run('price: \\$100'));
  await test('escape semicolon',   () => run('$upper[a\\;b]'));

  // ── Results ────────────────────────────────────────────────────────────────
  console.log('');
  console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
