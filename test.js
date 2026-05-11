'use strict';

const { Runtime } = require('./src');

async function main() {
  const runtime = new Runtime();
  console.log('Loaded functions:', runtime.loader.list().sort().join(', '));
  console.log('');

  // ── Expanded member map ────────────────────────────────────────────────────
  const mockMembers = new Map([
    ['123456789', {
      id:          '123456789',
      displayName: 'TestUser',
      joinedAt:    new Date('2022-01-01'),
      user: {
        id:               '123456789',
        bot:              false,
        username:         'TestUser',
        discriminator:    '0',
        createdAt:        new Date('2021-01-01'),
        bannerURL:        () => null,
        displayAvatarURL: () => 'https://cdn.discordapp.com/avatar.png',
      },
      roles: {
        cache: new Map([
          ['r1', { id: 'r1', name: '@everyone' }],
          ['r2', { id: 'r2', name: 'Member'    }],
        ]),
        add:    async () => {},
        remove: async () => {},
      },
      permissions: { has: () => true },
      timeout: async () => {},
      kick:    async () => {},
    }],
    ['111111111', {
      id:          '111111111',
      displayName: 'TestBot',
      joinedAt:    new Date('2022-06-01'),
      user: {
        id:               '111111111',
        bot:              true,
        username:         'TestBot',
        discriminator:    '0001',
        createdAt:        new Date('2021-06-01'),
        bannerURL:        () => null,
        displayAvatarURL: () => 'https://cdn.discordapp.com/botavatar.png',
      },
      roles: {
        cache: new Map([['r1', { id: 'r1', name: '@everyone' }]]),
        add:    async () => {},
        remove: async () => {},
      },
      permissions: { has: () => false },
      timeout: async () => {},
      kick:    async () => {},
    }],
  ]);

  // ── Base mock ──────────────────────────────────────────────────────────────
  const mockMessage = {
    author:    { id: '123456789', username: 'TestUser', discriminator: '0' },
    content:   '!test hello world',
    mentions:  { users: new Map() },
    deletable: false,
    reply:     async (m) => m,

    member: {
      id:          '123456789',
      displayName: 'TestUser',
      joinedAt:    new Date('2022-01-01'),
      user: {
        id:               '123456789',
        bot:              false,
        username:         'TestUser',
        createdAt:        new Date('2021-01-01'),
        bannerURL:        () => null,
        displayAvatarURL: () => 'https://cdn.discordapp.com/avatar.png',
      },
      roles: {
        cache: new Map([
          ['r1', { id: 'r1', name: '@everyone' }],
          ['r2', { id: 'r2', name: 'Member'    }],
        ]),
        add:    async () => {},
        remove: async () => {},
      },
      permissions: { has: () => true },
      timeout: async () => {},
      kick:    async () => {},
    },

    guild: {
      id:                         '987654321',
      name:                       'Test Guild',
      memberCount:                42,
      ownerId:                    '123456789',
      createdAt:                  new Date('2020-01-01'),
      premiumSubscriptionCount:   5,
      premiumTier:                1,
      vanityURLCode:              'testguild',
      verificationLevel:          2,
      iconURL:   () => 'https://cdn.discordapp.com/icons/987654321/icon.png',
      bannerURL: () => null,
      members: {
        // Handles both bulk-fetch (options obj / no arg) and single-member fetch (string)
        fetch: async (arg) => {
          if (arg && typeof arg === 'string') return mockMembers.get(arg) || null;
          return mockMembers;
        },
        cache: mockMembers,
        ban:   async () => {},
      },
      roles: {
        cache:  new Map([['r1', { id: 'r1', name: '@everyone' }], ['r2', { id: 'r2', name: 'Member' }]]),
        create: async ({ name }) => ({ id: 'newrole123', name }),
        fetch:  async (id) => ({ id, delete: async () => {} }),
      },
      emojis:   { cache: new Map([['e1', { id: 'e1' }]]) },
      channels: {
        cache:  new Map([['111222333', { id: '111222333' }]]),
        create: async ({ name }) => ({ id: 'newchan123', name }),
        fetch:  async (id) => ({
          id,
          delete:             async () => {},
          setName:            async () => {},
          setRateLimitPerUser: async () => {},
        }),
      },
    },

    channel: {
      id:    '111222333',
      name:  'general',
      topic: 'A test channel topic',
      send:  async (m) => m,
      messages: {
        fetch: async () => new Map([['msg1', { id: 'msg1' }]]),
      },
      bulkDelete: async () => new Map([['msg1', {}]]),
    },

    client: {
      ws:   { ping: 42 },
      user: {
        id:               '999000999',
        username:         'TestBot',
        displayAvatarURL: () => 'https://cdn.discordapp.com/avatars/999000999/bot.png',
      },
      users: {
        fetch: async (id) => ({
          id,
          username:         'TestUser',
          bot:              false,
          createdAt:        new Date('2021-01-01'),
          bannerURL:        () => null,
          displayAvatarURL: () => 'https://cdn.discordapp.com/avatar.png',
        }),
      },
      channels: {
        fetch: async (id) => ({
          id,
          send:                async () => ({}),
          delete:              async () => {},
          setName:             async () => {},
          setRateLimitPerUser: async () => {},
        }),
      },
    },
  };

  // ── Command mocks ─────────────────────────────────────────────────────────
  const cmdMockBase    = { ...mockMessage, content: '!cmd hello world' };
  const cmdMockMention = { ...mockMessage, content: '!cmd <@999888777> foo bar' };

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

  const run     = (code)                        => runtime.runForMessage(code, mockMessage);
  const runCmd  = (code, msg = cmdMockBase)     => runtime.runForCommand(code, msg, '!');
  const runFull = (code, msg = cmdMockBase)     => runtime.runForCommandFull(code, msg, '!');

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
  await test('$commandName',       () => runCmd('$commandName'));
  await test('$message full',      () => runCmd('$message'));
  await test('$message[1]',        () => runCmd('$message[1]'));
  await test('$message[2]',        () => runCmd('$message[2]'));
  await test('$message oob',       () => runCmd('$message[99]'));
  await test('$argsCount 2',       () => runCmd('$argsCount'));
  await test('$argsCount 0',       () => runCmd('$argsCount', { ...mockMessage, content: '!cmd' }));
  await test('$noMentionMsg',      () => runCmd('$noMentionMessage', cmdMockMention));
  await test('$noMentionMsg[1]',   () => runCmd('$noMentionMessage[1]', cmdMockMention));
  await test('$noMentionMsg[2]',   () => runCmd('$noMentionMessage[2]', cmdMockMention));
  await test('$arg[1]',            () => runCmd('$arg[1]'));
  await test('$arg[2]',            () => runCmd('$arg[2]'));
  await test('$mentioned fallback',() => runCmd('$mentioned[1;true]'));

  // ── Section 3: $eval ──────────────────────────────────────────────────────
  console.log('\n── Section 3: $eval (framework re-execution) ───────────────────');
  await test('$eval static text',  () => run('$eval[hello world]'));
  await test('$eval $username',    () => run('$eval[$username]'));
  await test('$eval $upper',       () => run('$eval[$upper[hello]]'));
  await test('$eval $math',        () => run('$eval[$math[2^10]]'));
  await test('$eval variable',     () => run('$eval[$var[n;42]$getVar[n]]'));
  await test('$eval $message',     () => runCmd('$eval[$message]',
    { ...mockMessage, content: '!cmd $upper[hello $username]' }));
  await test('$eval no JS',        () => run('$eval[1+1]'));
  await test('$evalDJS disabled',  () => run('$evalDJS[1+1]'));

  // ── Section 4: Variables ──────────────────────────────────────────────────
  console.log('\n── Section 4: Variables ────────────────────────────────────────');
  await test('$var + $getVar',     () => run('$var[score;999]$getVar[score]'));
  await test('$setVar + $getVar',  () => run('$setVar[x;77]$getVar[x]'));
  await test('$getVar default',    () => run('$getVar[missing;fallback]'));
  await test('$deleteVar',         () => run('$var[k;hi]$deleteVar[k]$getVar[k;gone]'));
  await test('var shared in eval', () => run('$var[z;10]$eval[$getVar[z]]'));

  // ── Section 5: Inline $if / control flow ─────────────────────────────────
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
  await test('$nested',             () => run('$upper[$username]'));
  await test('$deep nested',        () => run('$length[$upper[$username]]'));
  await test('complex nesting',     () => run('$if[$includes[$username;Test];$upper[$username];$lower[$username]]'));
  await test('$unknown passthrough',() => run('$unknownFunc'));
  await test('multiline code',      () => run('Line1\nLine2\n$upper[line3]'));
  await test('escape $ sign',       () => run('price: \\$100'));
  await test('escape semicolon',    () => run('$upper[a\\;b]'));

  // ── Section 11: Bot & server info ─────────────────────────────────────────
  console.log('\n── Section 11: Bot & Server Info ───────────────────────────────');
  await test('$ping',              () => run('$ping'));
  await test('$botID',             () => run('$botID'));
  await test('$botUsername',       () => run('$botUsername'));
  await test('$botAvatar',         () => run('$botAvatar'));
  await test('$serverIcon',        () => run('$serverIcon'));
  await test('$serverBanner',      () => run('$serverBanner'));
  await test('$channelTopic',      () => run('$channelTopic'));
  await test('$roleCount',         () => run('$roleCount'));
  await test('$emojiCount',        () => run('$emojiCount'));
  await test('$humanCount',        () => run('$humanCount'));
  await test('$botCount',          () => run('$botCount'));

  // ── Section 12: Random functions ──────────────────────────────────────────
  console.log('\n── Section 12: Random ──────────────────────────────────────────');
  await test('$randomText pick',   () => run('$randomText[alpha;beta;gamma]'));
  await test('$choose pick',       () => run('$choose[one;two;three]'));
  await test('$randomMemberID',    () => run('$randomMemberID'));
  await test('$randomChannelID',   () => run('$randomChannelID'));
  await test('$randomRoleID',      () => run('$randomRoleID'));

  // ── Section 13: Embed system ──────────────────────────────────────────────
  console.log('\n── Section 13: Embed System ────────────────────────────────────');
  await test('$title returns ""',        () => run('$title[My Title]'));
  await test('$description returns ""',  () => run('$description[Hello world]'));
  await test('$color returns ""',        () => run('$color[#ff0000]'));
  await test('$footer returns ""',       () => run('$footer[Footer text]'));
  await test('$footerIcon returns ""',   () => run('$footerIcon[https://example.com/icon.png]'));
  await test('$author returns ""',       () => run('$author[Bot Author]'));
  await test('$authorIcon returns ""',   () => run('$authorIcon[https://example.com/icon.png]'));
  await test('$thumbnail returns ""',    () => run('$thumbnail[https://example.com/thumb.png]'));
  await test('$image returns ""',        () => run('$image[https://example.com/img.png]'));
  await test('$timestamp returns ""',    () => run('$timestamp'));
  await test('$addField returns ""',     () => run('$addField[Score;9001;false]'));
  await test('$addField inline',         () => run('$addField[A;1;true]$addField[B;2;true]'));

  await test('embed EmbedBuilder built', async () => {
    const { text, embed } = await runFull(
      '$title[Test]$description[Hello]$color[#00ff00]$addField[Score;100;false]',
      { ...mockMessage, content: '!cmd' }
    );
    if (text !== '')               throw new Error(`expected empty text, got "${text}"`);
    if (!embed)                    throw new Error('expected EmbedBuilder, got null');
    if (!embed.data.title)         throw new Error('embed missing title');
    if (!embed.data.fields?.length) throw new Error('embed missing fields');
    return { title: embed.data.title, fields: embed.data.fields.length };
  });

  await test('embed null when nothing set', async () => {
    const { embed } = await runFull('Hello world', { ...mockMessage, content: '!cmd' });
    if (embed !== null) throw new Error('expected null embed');
    return null;
  });

  // ── Section 14: Database ──────────────────────────────────────────────────
  console.log('\n── Section 14: Database ────────────────────────────────────────');
  await test('$db.set + $db.get',  () => run('$db.set[_t_score;999]$db.get[_t_score]'));
  await test('$db.get default',    () => run('$db.get[_t_missing;fallback]'));
  await test('$db.has true',       () => run('$db.set[_t_exists;1]$db.has[_t_exists]'));
  await test('$db.has false',      () => run('$db.delete[_t_exists]$db.has[_t_exists]'));
  await test('$db.delete',         () => run('$db.set[_t_del;hi]$db.delete[_t_del]$db.get[_t_del;gone]'));
  await test('$db.set nested val', () => run('$db.set[_t_user;$upper[TestUser]]$db.get[_t_user]'));

  // ── Section 15: JSON ──────────────────────────────────────────────────────
  console.log('\n── Section 15: JSON ────────────────────────────────────────────');
  await test('$jsonStringify',     () => run('$jsonStringify[name;Alice;age;30]'));
  await test('$jsonParse root',    () => run('$jsonParse[{"x":1}]'));
  await test('$jsonParse key',     () => run('$jsonParse[{"name":"Bob"};name]'));
  await test('$jsonParse nested',  () => run('$jsonParse[{"a":{"b":"deep"}};a.b]'));
  await test('$jsonParse invalid', () => run('$jsonParse[not json]'));
  await test('json roundtrip',     () => run('$jsonParse[$jsonStringify[city;Paris];city]'));

  // ── Section 16: Block $if ─────────────────────────────────────────────────
  console.log('\n── Section 16: Block $if ───────────────────────────────────────');

  await test('block $if true branch',       () => run('$if[5>3]YES$else NO$endif'));
  await test('block $if false → else',      () => run('$if[1>3]YES$else NO$endif'));
  await test('block $if no else, true',     () => run('$if[5>3]HIT$endif'));
  await test('block $if no else, false',    () => run('$if[1>3]HIT$endifnone'));
  await test('block $elseif chain hit',     () => run('$if[1>3]A$elseif[5>3]B$else C$endif'));
  await test('block $elseif chain else',    () => run('$if[1>3]A$elseif[1>5]B$else C$endif'));
  await test('block $if text around',       () => run('before$if[5>3] yes $else no $endifafter'));
  await test('block $if nested',            () => run('$if[5>3]$if[1>3]inner F$else inner E$endif$else outer F$endif'));
  await test('block $if nested true/true',  () => run('$if[5>3]$if[5>3]both true$else inner F$endif$else outer F$endif'));
  await test('block $if in loop',           () => run('$loop[3;$if[$loopIndex>0]Y$else N$endif,]'));
  await test('block $if == condition',      () => run('$if[hi==hi]match$else no$endif'));
  await test('block $if dynamic cond',      () => run('$var[v;5]$if[$getVar[v]>3]big$else small$endif'));
  await test('inline $if still works',      () => run('$if[5>3;INLINE YES;INLINE NO]'));
  await test('block $if with $upper body',  () => run('$if[5>3]$upper[hello]$endif'));

  // ── Section 17: $onlyIf error message ────────────────────────────────────
  console.log('\n── Section 17: $onlyIf error message ──────────────────────────');

  await test('$onlyIf false → error msg only', async () => {
    const { text } = await runFull(
      '$onlyIf[1>3;Access denied!]Should not appear',
      { ...mockMessage, content: '!cmd' }
    );
    if (text !== 'Access denied!') throw new Error(`expected "Access denied!", got "${text}"`);
    return text;
  });

  await test('$onlyIf true → continues', async () => {
    const { text } = await runFull(
      '$onlyIf[5>3;Error]Passed!',
      { ...mockMessage, content: '!cmd' }
    );
    if (text !== 'Passed!') throw new Error(`expected "Passed!", got "${text}"`);
    return text;
  });

  await test('$onlyIf false no msg → empty', async () => {
    const { text } = await runFull(
      '$onlyIf[1>3]Should not appear',
      { ...mockMessage, content: '!cmd' }
    );
    if (text !== '') throw new Error(`expected "", got "${text}"`);
    return text;
  });

  await test('$onlyIf error discards prior text', async () => {
    const { text } = await runFull(
      'Prior text$onlyIf[1>3;Only this!]Not this',
      { ...mockMessage, content: '!cmd' }
    );
    if (text !== 'Only this!') throw new Error(`expected "Only this!", got "${text}"`);
    return text;
  });

  // ── Section 18: User info functions ──────────────────────────────────────
  console.log('\n── Section 18: User Info ───────────────────────────────────────');
  await test('$displayName (author)',  () => run('$displayName'));
  await test('$displayName (userID)', () => run('$displayName[123456789]'));
  await test('$userAvatar (author)',   () => run('$userAvatar'));
  await test('$userAvatar (userID)',   () => run('$userAvatar[123456789]'));
  await test('$userMention (author)',  () => run('$userMention'));
  await test('$userMention (userID)', () => run('$userMention[123456789]'));
  await test('$userCreated',          () => run('$userCreated'));
  await test('$userBanner empty',     () => run('$userBanner'));
  await test('$userJoined',           () => run('$userJoined'));
  await test('$userRoles comma sep',  () => run('$userRoles[123456789;,]'));
  await test('$isBot (human)',        () => run('$isBot[123456789]'));
  await test('$isBot (bot)',          () => run('$isBot[111111111]'));

  // ── Section 19: Server info functions ────────────────────────────────────
  console.log('\n── Section 19: Server Info ─────────────────────────────────────');
  await test('$serverName',              () => run('$serverName'));
  await test('$serverID',               () => run('$serverID'));
  await test('$serverOwnerID',          () => run('$serverOwnerID'));
  await test('$serverCreated',          () => run('$serverCreated'));
  await test('$serverBoostCount',       () => run('$serverBoostCount'));
  await test('$serverBoostLevel',       () => run('$serverBoostLevel'));
  await test('$serverVanity',           () => run('$serverVanity'));
  await test('$serverVerificationLevel',() => run('$serverVerificationLevel'));

  // ── Section 20: Role & channel management ────────────────────────────────
  console.log('\n── Section 20: Role & Channel Management ───────────────────────');
  await test('$hasRole true',         () => run('$hasRole[123456789;r2]'));
  await test('$hasRole false',        () => run('$hasRole[123456789;r999]'));
  await test('$addRole',              () => run('$addRole[123456789;r2]'));
  await test('$removeRole',           () => run('$removeRole[123456789;r2]'));
  await test('$createRole',           () => run('$createRole[TestRole;#ff0000]'));
  await test('$deleteRole',           () => run('$deleteRole[r1]'));
  await test('$createChannel text',   () => run('$createChannel[test-channel;text]'));
  await test('$deleteChannel',        () => run('$deleteChannel[111222333]'));
  await test('$setChannelName',       () => run('$setChannelName[111222333;new-name]'));
  await test('$slowmode',             () => run('$slowmode[111222333;5]'));

  // ── Section 21: Moderation ────────────────────────────────────────────────
  console.log('\n── Section 21: Moderation ──────────────────────────────────────');
  await test('$ban',      () => run('$ban[111111111;spam]'));
  await test('$kick',     () => run('$kick[111111111;spam]'));
  await test('$timeout',  () => run('$timeout[111111111;60s;test]'));
  await test('$untimeout',() => run('$untimeout[111111111]'));
  await test('$purge',    () => run('$purge[5]'));

  // ── Section 22: Components ────────────────────────────────────────────────
  console.log('\n── Section 22: Components ──────────────────────────────────────');

  await test('$button returns ""', () => run('$button[Click me!;click_btn;primary]'));

  await test('$button builds ActionRow', async () => {
    const { components } = await runFull(
      '$button[Yes;yes_btn;success]$button[No;no_btn;danger]',
      { ...mockMessage, content: '!cmd' }
    );
    if (!components.length)          throw new Error('expected components');
    if (!components[0].components?.length) throw new Error('expected buttons in row');
    return { rows: components.length, buttons: components[0].components.length };
  });

  await test('$selectMenu returns ""', () => run('$selectMenu[pick;Choose one;Red;red;Green;green]'));

  await test('$selectMenu builds row', async () => {
    const { components } = await runFull(
      '$selectMenu[pick;Pick a color;Red;red;Blue;blue]',
      { ...mockMessage, content: '!cmd' }
    );
    if (!components.length) throw new Error('expected components');
    return { rows: components.length };
  });

  await test('$modal returns info',   () => run('$modal[my_modal;My Modal]'));
  await test('$textInput returns ""', () => run('$textInput[input1;Name;short]'));

  // ── Section 23: Cooldowns ─────────────────────────────────────────────────
  console.log('\n── Section 23: Cooldowns ───────────────────────────────────────');

  await test('$cooldown first call → ""', async () => {
    // Use unique command name to avoid test pollution
    const msg  = { ...mockMessage, content: '!cooldowntest1 hello' };
    const result = await runtime.runForCommand('$cooldown[5m]ok', msg, '!');
    if (result !== 'ok') throw new Error(`expected "ok", got "${result}"`);
    return result;
  });

  await test('$cooldown second call → blocked', async () => {
    const msg    = { ...mockMessage, content: '!cooldowntest2 hello' };
    await runtime.runForCommand('$cooldown[5m]ok', msg, '!'); // arm it
    const result = await runtime.runForCommand('$cooldown[5m]should not see', msg, '!');
    if (!result.includes('cooldown')) throw new Error(`expected cooldown msg, got "${result}"`);
    return result;
  });

  await test('$globalCooldown first call → ""', async () => {
    const msg  = { ...mockMessage, content: '!gcd_test1 hello' };
    const result = await runtime.runForCommand('$globalCooldown[5m]ok', msg, '!');
    if (result !== 'ok') throw new Error(`expected "ok", got "${result}"`);
    return result;
  });

  // ── Section 24: Guards ────────────────────────────────────────────────────
  console.log('\n── Section 24: Guards ──────────────────────────────────────────');

  await test('$onlyChannels match → continues', async () => {
    const { text } = await runFull(
      '$onlyChannels[111222333;Wrong channel]OK',
      { ...mockMessage, content: '!cmd' }
    );
    if (text !== 'OK') throw new Error(`expected "OK", got "${text}"`);
    return text;
  });

  await test('$onlyChannels mismatch → stops', async () => {
    const { text } = await runFull(
      '$onlyChannels[999999;Wrong channel!]Should not see',
      { ...mockMessage, content: '!cmd' }
    );
    if (text !== 'Wrong channel!') throw new Error(`expected error msg, got "${text}"`);
    return text;
  });

  await test('$onlyUsers match → continues', async () => {
    const { text } = await runFull(
      '$onlyUsers[123456789;Wrong user!]OK',
      { ...mockMessage, content: '!cmd' }
    );
    if (text !== 'OK') throw new Error(`expected "OK", got "${text}"`);
    return text;
  });

  await test('$onlyUsers mismatch → stops', async () => {
    const { text } = await runFull(
      '$onlyUsers[999999;Forbidden!]Should not see',
      { ...mockMessage, content: '!cmd' }
    );
    if (text !== 'Forbidden!') throw new Error(`expected error msg, got "${text}"`);
    return text;
  });

  await test('$onlyRoles has role → continues', async () => {
    const { text } = await runFull(
      '$onlyRoles[r2;Missing role!]OK',
      { ...mockMessage, content: '!cmd' }
    );
    if (text !== 'OK') throw new Error(`expected "OK", got "${text}"`);
    return text;
  });

  await test('$onlyRoles missing role → stops', async () => {
    const { text } = await runFull(
      '$onlyRoles[r999;You need a role!]Should not see',
      { ...mockMessage, content: '!cmd' }
    );
    if (text !== 'You need a role!') throw new Error(`expected error msg, got "${text}"`);
    return text;
  });

  await test('$onlyPerms has perm → continues', async () => {
    // mockMessage.member.permissions.has() returns true
    const { text } = await runFull(
      '$onlyPerms[ManageMessages;No perm!]OK',
      { ...mockMessage, content: '!cmd' }
    );
    if (text !== 'OK') throw new Error(`expected "OK", got "${text}"`);
    return text;
  });

  await test('$onlyPerms missing perm → stops', async () => {
    // Use mock with permissions.has = () => false
    const noPermMsg = {
      ...mockMessage,
      content: '!cmd',
      member: { ...mockMessage.member, permissions: { has: () => false } },
    };
    const { text } = await runFull('$onlyPerms[Administrator;No admin!]Should not see', noPermMsg, '!');
    if (text !== 'No admin!') throw new Error(`expected "No admin!", got "${text}"`);
    return text;
  });

  // ── Section 25: Stray block keywords ─────────────────────────────────────
  console.log('\n── Section 25: Stray block keywords ───────────────────────────');
  await test('stray $elseif → error', async () => {
    const r = await run('$elseif[5>3]');
    if (!r.includes('error')) throw new Error(`expected error, got "${r}"`);
    return r;
  });
  await test('stray $else → error', async () => {
    const r = await run('$else');
    if (!r.includes('error')) throw new Error(`expected error, got "${r}"`);
    return r;
  });
  await test('stray $endif → ""', async () => {
    const r = await run('$endif');
    if (r !== '') throw new Error(`expected "", got "${r}"`);
    return r;
  });

  // ── Results ────────────────────────────────────────────────────────────────
  console.log('');
  console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
