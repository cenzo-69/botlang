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

  // ── Mock interaction (sections 38) ───────────────────────────────────────
  const mockInteraction = {
    user:      mockMessage.author,
    member:    mockMessage.member,
    guild:     mockMessage.guild,
    channel:   mockMessage.channel,
    guildId:   '987654321',
    channelId: '111222333',
    client:    mockMessage.client,
    id:        'inter123456',
    customId:  'my_button:extra',
    deferred:  false,
    replied:   false,
    locale:    'en-US',
    isButton:            () => true,
    isModalSubmit:       () => false,
    isChatInputCommand:  () => false,
    isAutocomplete:      () => false,
    isAnySelectMenu:     () => false,
    options: {
      _data: [{ name: 'text', value: 'hello world', type: 3 }],
      get:         (n) => [{ name: 'text', value: 'hello world', type: 3 }].find(o => o.name === n) ?? null,
      getString:   () => 'option-value',
      getInteger:  () => null,
      getNumber:   () => null,
      getBoolean:  () => null,
      getUser:     () => null,
      getMember:   () => null,
      getRole:     () => null,
      getChannel:  () => null,
      getSubcommand: () => null,
    },
    fields: { getTextInputValue: (id) => id === 'testinput' ? 'my submitted text' : '' },
    values: ['option1', 'option2'],
    deferUpdate:  async () => {},
    deferReply:   async () => {},
    reply:        async (m) => m,
    editReply:    async (m) => m,
    followUp:     async (m) => m,
    showModal:    async () => {},
    _isInteraction: true,
  };

  // Run code in interaction context
  const runInter = async (code, inter = mockInteraction) => {
    const Context = require('./src/core/Context');
    const ctx = new Context({
      message:        null,
      interaction:    inter,
      client:         mockMessage.client,
      variables:      new Map(),
      depth:          0,
      runtime,
      commandName:    'test',
      commandInput:   'hello world',
      commandArgs:    ['hello', 'world'],
      noMentionInput: 'hello world',
    });
    const ast = runtime.parse(code);
    return runtime.executeAST(ast, ctx);
  };

  // ── Section 26: Strings Extended ─────────────────────────────────────────
  console.log('\n── Section 26: Strings Extended ────────────────────────────────');
  await test('$base64Encode',        () => run('$base64Encode[hello world]'));
  await test('$base64Decode',        () => run('$base64Decode[$base64Encode[hello]]'));
  await test('$byteCount',           () => run('$byteCount[hello]'));
  await test('$charCount',           () => run('$charCount[hello]'));
  await test('$charCodeAt',          () => run('$charCodeAt[A;0]'));
  await test('$fromCharCode',        () => run('$fromCharCode[65]'));
  await test('$checkContains true',  () => run('$checkContains[hello world;world]'));
  await test('$checkContains false', () => run('$checkContains[hello world;xyz]'));
  await test('$endsWith true',       () => run('$endsWith[hello;llo]'));
  await test('$endsWith false',      () => run('$endsWith[hello;xyz]'));
  await test('$startsWith true',     () => run('$startsWith[hello;hel]'));
  await test('$startsWith false',    () => run('$startsWith[hello;xyz]'));
  await test('$indexOf found',       () => run('$indexOf[hello world;world]'));
  await test('$indexOf not found',   () => run('$indexOf[hello world;xyz]'));
  await test('$reverseText',         () => run('$reverseText[hello]'));
  await test('$sliceText',           () => run('$sliceText[hello world;6;11]'));
  await test('$cropText',            () => run('$cropText[hello world;5;...]'));
  await test('$padEnd',              () => run('$padEnd[hi;5;.]'));
  await test('$padStart',            () => run('$padStart[hi;5;.]'));
  await test('$trimEnd',             () => run('$trimEnd[hello   ]'));
  await test('$trimStart',           () => run('$trimStart[   hello]'));
  await test('$trimLines',           () => run('$trimLines[  hello  ]'));
  await test('$linesCount',          () => run('$linesCount[a\nb\nc]'));
  await test('$localeCompare a<b',   () => run('$localeCompare[a;b]'));
  await test('$isURL true',          () => run('$isURL[https://discord.com]'));
  await test('$isURL false',         () => run('$isURL[not a url]'));
  await test('$encodeURI',           () => run('$encodeURI[hello world]'));
  await test('$decodeURI',           () => run('$decodeURI[hello%20world]'));
  await test('$toCamelCase',         () => run('$toCamelCase[hello world]'));
  await test('$toKebabCase',         () => run('$toKebabCase[hello world]'));
  await test('$toSnakeCase',         () => run('$toSnakeCase[hello world]'));
  await test('$toTitleCase',         () => run('$toTitleCase[hello world]'));
  await test('$toLowerCase',         () => run('$toLowerCase[HELLO]'));
  await test('$toUpperCase',         () => run('$toUpperCase[hello]'));
  await test('$regexMatch',          () => run('$regexMatch[abc123;[0-9]+]'));
  await test('$regexReplace',        () => run('$regexReplace[abc123;[0-9]+;NUM]'));
  await test('$replaceRegex',        () => run('$replaceRegex[hello123;[0-9]+;###]'));
  await test('$advancedReplace',     () => run('$advancedReplace[hello world;o;0]'));
  await test('$removeLinks',         () => run('$removeLinks[see https://discord.com here]'));
  await test('$removeContains',      () => run('$removeContains[hello world foo;world ]'));
  await test('$uuid',                () => run('$uuid'));
  await test('$randomUUID',          () => run('$randomUUID'));
  await test('$textSplit + $getTextSplitIndex', () => run('$textSplit[a-b-c;-]$getTextSplitIndex[2]'));
  await test('$joinSplitText',       () => run('$textSplit[a-b-c;-]$joinSplitText[ ]'));

  // ── Section 27: Math Extended ────────────────────────────────────────────
  console.log('\n── Section 27: Math Extended ───────────────────────────────────');
  await test('$abs negative',       () => run('$abs[-42]'));
  await test('$abs positive',       () => run('$abs[42]'));
  await test('$add',                () => run('$add[3;4]'));
  await test('$sub',                () => run('$sub[10;3]'));
  await test('$multi',              () => run('$multi[3;4]'));
  await test('$divide',             () => run('$divide[12;4]'));
  await test('$mod',                () => run('$mod[10;3]'));
  await test('$modulo',             () => run('$modulo[10;3]'));
  await test('$ceil',               () => run('$ceil[3.2]'));
  await test('$floor',              () => run('$floor[3.9]'));
  await test('$round',              () => run('$round[3.5]'));
  await test('$sqrt',               () => run('$sqrt[16]'));
  await test('$pow',                () => run('$pow[2;10]'));
  await test('$max',                () => run('$max[1;5;3;2;4]'));
  await test('$min',                () => run('$min[5;1;3;2;4]'));
  await test('$sum',                () => run('$sum[1;2;3;4;5]'));
  await test('$average',            () => run('$average[1;2;3;4;5]'));
  await test('$clamp in range',     () => run('$clamp[5;1;10]'));
  await test('$clamp below min',    () => run('$clamp[-5;1;10]'));
  await test('$clamp above max',    () => run('$clamp[15;1;10]'));
  await test('$inRange true',       () => run('$inRange[5;1;10]'));
  await test('$inRange false',      () => run('$inRange[15;1;10]'));
  await test('$isFloat true',       () => run('$isFloat[3.14]'));
  await test('$isFloat false',      () => run('$isFloat[42]'));
  await test('$sign pos',           () => run('$sign[5]'));
  await test('$sign neg',           () => run('$sign[-5]'));
  await test('$sign zero',          () => run('$sign[0]'));
  await test('$trunc',              () => run('$trunc[3.9]'));
  await test('$toFixed',            () => run('$toFixed[3.14159;2]'));
  await test('$percentage',         () => run('$percentage[25;100]'));
  await test('$pi',                 () => run('$pi'));
  await test('$logn',               () => run('$logn[100;10]'));
  await test('$hexToInt',           () => run('$hexToInt[FF]'));
  await test('$intToHex',           () => run('$intToHex[255]'));
  await test('$ordinal 1st',        () => run('$ordinal[1]'));
  await test('$ordinal 11th',       () => run('$ordinal[11]'));
  await test('$abbreviateNumber',   () => run('$abbreviateNumber[1500]'));
  await test('$numberSeparator',    () => run('$numberSeparator[1000000]'));
  await test('$separateNumber',     () => run('$separateNumber[1000000;,]'));
  await test('$maxSafeInteger',     () => run('$maxSafeInteger'));
  await test('$minSafeInteger',     () => run('$minSafeInteger'));
  await test('$randomNumber',       () => run('$randomNumber[1;100]'));
  await test('$calculate',          () => run('$calculate[2+2*2]'));
  await test('$base',               () => run('$base[255;10;16]'));
  await test('$bigintSum',          () => run('$bigintSum[99999999999;1]'));
  await test('$bigintSub',          () => run('$bigintSub[100000000000;1]'));
  await test('$bigintMulti',        () => run('$bigintMulti[999999;999999]'));
  await test('$bigintDivide',       () => run('$bigintDivide[1000000000000;2]'));

  // ── Section 28: Time Functions ───────────────────────────────────────────
  console.log('\n── Section 28: Time Functions ──────────────────────────────────');
  await test('$day',          () => run('$day'));
  await test('$month',        () => run('$month'));
  await test('$year',         () => run('$year'));
  await test('$hour',         () => run('$hour'));
  await test('$minute',       () => run('$minute'));
  await test('$second',       () => run('$second'));
  await test('$date',         () => run('$date'));
  await test('$week',         () => run('$week'));
  await test('$weekday',      () => run('$weekday'));
  await test('$calendarDay',  () => run('$calendarDay'));
  await test('$calendarWeek', () => run('$calendarWeek'));
  await test('$getTimestamp', () => run('$getTimestamp'));
  await test('$discordTimestamp', () => run('$discordTimestamp[$getTimestamp]'));
  await test('$parseMS 1000',    () => run('$parseMS[1000]'));
  await test('$parseMS 3600000', () => run('$parseMS[3600000]'));
  await test('$wait 1ms',        () => run('$wait[1]ok'));

  // ── Section 29: Arrays ───────────────────────────────────────────────────
  console.log('\n── Section 29: Arrays ──────────────────────────────────────────');
  await test('$arrayCreate + $arrayLength', () => run('$arrayCreate[arr]$arrayLength[arr]'));
  await test('$arrayPush + $arrayLength',   () => run('$arrayCreate[arr]$arrayPush[arr;a]$arrayPush[arr;b]$arrayLength[arr]'));
  await test('$arrayPop',                   () => run('$arrayCreate[arr]$arrayPush[arr;a]$arrayPush[arr;b]$arrayPop[arr]'));
  await test('$arrayJoin',                  () => run('$arrayCreate[arr]$arrayPush[arr;a]$arrayPush[arr;b]$arrayPush[arr;c]$arrayJoin[arr;-]'));
  await test('$arrayAt 0',                  () => run('$arrayCreate[arr]$arrayPush[arr;x]$arrayPush[arr;y]$arrayAt[arr;0]'));
  await test('$arrayIncludes true',         () => run('$arrayCreate[arr]$arrayPush[arr;hello]$arrayIncludes[arr;hello]'));
  await test('$arrayIncludes false',        () => run('$arrayCreate[arr]$arrayPush[arr;hello]$arrayIncludes[arr;world]'));
  await test('$arraySort asc',              () => run('$arrayCreate[arr]$arrayPush[arr;3]$arrayPush[arr;1]$arrayPush[arr;2]$arraySort[arr;asc]$arrayJoin[arr;,]'));
  await test('$arrayReverse',               () => run('$arrayCreate[arr]$arrayPush[arr;a]$arrayPush[arr;b]$arrayPush[arr;c]$arrayReverse[arr]$arrayJoin[arr;,]'));
  await test('$arrayIndexOf',               () => run('$arrayCreate[arr]$arrayPush[arr;a]$arrayPush[arr;b]$arrayIndexOf[arr;b]'));
  await test('$arrayLastIndexOf',           () => run('$arrayCreate[arr]$arrayPush[arr;a]$arrayPush[arr;b]$arrayPush[arr;a]$arrayLastIndexOf[arr;a]'));
  await test('$arrayConcat',                () => run('$arrayCreate[a1]$arrayPush[a1;x]$arrayCreate[a2]$arrayPush[a2;y]$arrayConcat[a1;a2]$arrayJoin[a1;,]'));
  await test('$arrayUnique',                () => run('$arrayCreate[arr]$arrayPush[arr;a]$arrayPush[arr;b]$arrayPush[arr;a]$arrayUnique[arr]$arrayLength[arr]'));
  await test('$arrayClear',                 () => run('$arrayCreate[arr]$arrayPush[arr;a]$arrayClear[arr]$arrayLength[arr]'));
  await test('$arrayShift',                 () => run('$arrayCreate[arr]$arrayPush[arr;first]$arrayPush[arr;second]$arrayShift[arr]'));
  await test('$arrayUnshift',               () => run('$arrayCreate[arr]$arrayPush[arr;b]$arrayUnshift[arr;a]$arrayAt[arr;0]'));
  await test('$arrayFill',                  () => run('$arrayCreate[arr]$arrayFill[arr;x;3]$arrayLength[arr]'));
  await test('$arraySplice del',            () => run('$arrayCreate[arr]$arrayPush[arr;a]$arrayPush[arr;b]$arrayPush[arr;c]$arraySplice[arr;1;1]$arrayJoin[arr;,]'));
  await test('$arrayFilter',                () => run('$arrayCreate[arr]$arrayPush[arr;yes]$arrayPush[arr;no]$arrayFilter[arr;v;$if[$getVar[v]==yes;true;false]]$arrayJoin[arr;,]'));
  await test('$arrayMap',                   () => run('$arrayCreate[arr]$arrayPush[arr;hi]$arrayMap[arr;v;$upper[$getVar[v]]]$arrayAt[arr;0]'));
  await test('$arraySome true',             () => run('$arrayCreate[arr]$arrayPush[arr;a]$arrayPush[arr;b]$arraySome[arr;v;$if[$getVar[v]==b;true;false]]'));
  await test('$arrayEvery true',            () => run('$arrayCreate[arr]$arrayPush[arr;a]$arrayPush[arr;a]$arrayEvery[arr;v;$if[$getVar[v]==a;true;false]]'));
  await test('$arrayFind',                  () => run('$arrayCreate[arr]$arrayPush[arr;1]$arrayPush[arr;5]$arrayFind[arr;v;$if[$getVar[v]>3;true;false]]'));
  await test('$arrayFindIndex',             () => run('$arrayCreate[arr]$arrayPush[arr;1]$arrayPush[arr;5]$arrayFindIndex[arr;v;$if[$getVar[v]>3;true;false]]'));
  await test('$arrayLoad + $arrayUnload',   () => run('$arrayCreate[arr]$arrayPush[arr;a]$arrayPush[arr;b]$var[s;$arrayUnload[arr]]$arrayCreate[arr2]$arrayLoad[arr2;$getVar[s]]$arrayJoin[arr2;,]'));

  // ── Section 30: JSON Advanced ────────────────────────────────────────────
  console.log('\n── Section 30: JSON Advanced ───────────────────────────────────');
  await test('$jsonLoad + $jsonGet',   () => run('$jsonLoad[data;{"name":"Alice"}]$jsonGet[data;name]'));
  await test('$jsonKeys',              () => run('$jsonLoad[data;{"a":1,"b":2}]$jsonKeys[data]'));
  await test('$jsonValues',            () => run('$jsonLoad[data;{"a":1,"b":2}]$jsonValues[data]'));
  await test('$jsonHas true',          () => run('$jsonLoad[data;{"x":1}]$jsonHas[data;x]'));
  await test('$jsonHas false',         () => run('$jsonLoad[data;{"x":1}]$jsonHas[data;y]'));
  await test('$jsonAssign',            () => run('$jsonLoad[data;{"a":1}]$jsonAssign[data;b;2]$jsonGet[data;b]'));
  await test('$jsonDelete',            () => run('$jsonLoad[data;{"a":1,"b":2}]$jsonDelete[data;a]$jsonHas[data;a]'));
  await test('$jsonEntries',           () => run('$jsonLoad[data;{"a":1}]$jsonEntries[data]'));
  await test('$jsonExists true',       () => run('$jsonLoad[d;{"k":"v"}]$jsonExists[d]'));
  await test('$jsonExists false',      () => run('$jsonExists[doesnotexist]'));
  await test('$jsonClear',             () => run('$jsonLoad[data;{"a":1}]$jsonClear[data]$jsonHas[data;a]'));
  await test('$jsonSetString',         () => run('$jsonLoad[data;{}]$jsonSetString[data;key;hello]$jsonGet[data;key]'));
  await test('$jsonUnset',             () => run('$jsonLoad[data;{"a":1,"b":2}]$jsonUnset[data;a]$jsonHas[data;a]'));
  await test('$jsonPretty',            () => run('$jsonLoad[data;{"a":1}]$jsonPretty[data]'));
  await test('$jsonArray + append',    () => run('$jsonArray[arr]$jsonArrayAppend[arr;hello]$jsonArrayCount[arr]'));
  await test('$jsonArrayPop',          () => run('$jsonArray[arr]$jsonArrayAppend[arr;a]$jsonArrayAppend[arr;b]$jsonArrayPop[arr]'));
  await test('$jsonArrayReverse',      () => run('$jsonArray[arr]$jsonArrayAppend[arr;a]$jsonArrayAppend[arr;b]$jsonArrayReverse[arr]$jsonArrayIndex[arr;0]'));
  await test('$jsonArraySort',         () => run('$jsonArray[arr]$jsonArrayAppend[arr;b]$jsonArrayAppend[arr;a]$jsonArraySort[arr]$jsonArrayIndex[arr;0]'));
  await test('$jsonJoinArray',         () => run('$jsonArray[arr]$jsonArrayAppend[arr;x]$jsonArrayAppend[arr;y]$jsonJoinArray[arr;,]'));
  await test('$jsonArrayShift',        () => run('$jsonArray[arr]$jsonArrayAppend[arr;first]$jsonArrayAppend[arr;second]$jsonArrayShift[arr]'));

  // ── Section 31: Control Flow Extended ────────────────────────────────────
  console.log('\n── Section 31: Control Flow Extended ──────────────────────────');
  await test('$while simple',     () => run('$while[1==0;x]done'));
  await test('$forEach items',    () => run('$forEach[apple,banana,cherry;,;$forEachNumber:$forEachValue ]'));
  await test('$forEachIndex',     () => run('$forEach[a,b,c;,;$forEachIndex ]'));
  await test('$forEachNumber',    () => run('$forEach[a,b,c;,;$forEachNumber ]'));
  await test('$forEachValue',     () => run('$forEach[X,Y;,;$forEachValue]'));
  await test('$break in $loop',   () => run('$var[c;0]$loop[10;$if[$loopNumber==3]$break$endif$var[c;$loopNumber]]$getVar[c]'));
  await test('$continue in loop', () => run('$forEach[1,2,3;,;$if[$forEachValue==2]$continue$endif$forEachValue]'));
  await test('$default empty',    () => run('$default[;fallback]'));
  await test('$default has val',  () => run('$default[hello;fallback]'));
  await test('$comment stripped', () => run('before$comment[hidden content]after'));
  await test('$argsCheck ok',     () => runCmd('$argsCheck[2]done'));
  await test('$returnfunc',       () => run('$returnfunc[hello world]ignored'));
  await test('$scope block',      () => run('$scope[hello world]'));
  await test('$suppress errors',  () => run('$suppressErrors[$throw[ignore me]]after'));

  // ── Section 32: Logging ──────────────────────────────────────────────────
  console.log('\n── Section 32: Logging ─────────────────────────────────────────');
  await test('$log (console only)',     () => run('$log[test log message]done'));
  await test('$logger (console only)',  () => run('$logger[INFO;test message]done'));
  await test('$chalkLog (console only)',() => run('$chalkLog[green;test chalk]done'));

  // ── Section 33: System Info ──────────────────────────────────────────────
  console.log('\n── Section 33: System Info ─────────────────────────────────────');
  await test('$os',          () => run('$os'));
  await test('$osUptime',    () => run('$osUptime'));
  await test('$nodeVersion', () => run('$nodeVersion'));
  await test('$cpu',         () => run('$cpu'));
  await test('$cpuArch',     () => run('$cpuArch'));
  await test('$cpuCores',    () => run('$cpuCores'));
  await test('$cpuModel',    () => run('$cpuModel'));
  await test('$cpuSpeed',    () => run('$cpuSpeed'));
  await test('$ram',         () => run('$ram'));
  await test('$ramTotal',    () => run('$ramTotal'));

  // ── Section 34: $commandargs & $message[option] ──────────────────────────
  console.log('\n── Section 34: $commandargs & $message Options ─────────────────');
  await test('$commandargs full',     () => runCmd('$commandargs'));
  await test('$commandargs sep -',    () => runCmd('$commandargs[-]'));
  await test('$commandargs sep ,',    () => runCmd('$commandargs[, ]'));
  await test('$commandargs empty', async () => {
    const m = { ...mockMessage, content: '!cmd' };
    return runtime.runForCommand('$commandargs', m, '!');
  });
  await test('$message[1]',           () => runCmd('$message[1]'));
  await test('$message[2]',           () => runCmd('$message[2]'));
  await test('$message[text] (slash option)', async () => {
    const Context = require('./src/core/Context');
    const ctx = new Context({
      message: null, interaction: mockInteraction, client: mockMessage.client,
      variables: new Map(), depth: 0, runtime,
      commandName: 'test', commandInput: 'hello world',
      commandArgs: ['hello', 'world'], noMentionInput: 'hello world',
    });
    return runtime.executeAST(runtime.parse('$message[text]'), ctx);
  });

  // ── Section 35: Member Functions Extended ────────────────────────────────
  console.log('\n── Section 35: Member Functions Extended ───────────────────────');
  await test('$hasAnyRole true',     () => run('$hasAnyRole[123456789;r999;r2]'));
  await test('$hasAnyRole false',    () => run('$hasAnyRole[123456789;r999;r998]'));
  await test('$hasRoles all',        () => run('$hasRoles[123456789;r1;r2]'));
  await test('$hasRoles missing',    () => run('$hasRoles[123456789;r1;r999]'));
  await test('$memberExists true',   () => run('$memberExists[123456789]'));
  await test('$memberExists false',  () => run('$memberExists[000000000]'));
  await test('$memberAvatar',        () => run('$memberAvatar[123456789]'));
  await test('$memberDisplayName',   () => run('$memberDisplayName[123456789]'));
  await test('$memberRoles',         () => run('$memberRoles[123456789;,]'));
  await test('$memberJoinedAt',      () => run('$memberJoinedAt[123456789]'));
  await test('$memberHighestRoleID', () => run('$memberHighestRoleID[123456789]'));
  await test('$isBoosting',          () => run('$isBoosting[123456789]'));
  await test('$isBooster',           () => run('$isBooster[123456789]'));
  await test('$isAdmin true',        () => run('$isAdmin[123456789]'));
  await test('$memberPerms',         () => run('$memberPerms[123456789]'));

  // ── Section 36: Role Functions Extended ──────────────────────────────────
  console.log('\n── Section 36: Role Functions Extended ─────────────────────────');
  await test('$roleExists true',    () => run('$roleExists[r1]'));
  await test('$roleExists false',   () => run('$roleExists[r999]'));
  await test('$roleName',           () => run('$roleName[r1]'));
  await test('$roleColor',          () => run('$roleColor[r1]'));
  await test('$roleIntColor',       () => run('$roleIntColor[r1]'));
  await test('$roleMentionable',    () => run('$roleMentionable[r1]'));
  await test('$roleHoisted',        () => run('$roleHoisted[r1]'));
  await test('$roleEditable',       () => run('$roleEditable[r1]'));
  await test('$roleMembers',        () => run('$roleMembers[r1]'));
  await test('$forEachRole',        () => run('$forEachRole[r1;r2;$getVar[role_id] ]'));

  // ── Section 37: DB User / Server / Channel Vars ──────────────────────────
  console.log('\n── Section 37: DB User / Server / Channel Vars ─────────────────');
  await test('$setUserVar + $getUserVar',      () => run('$setUserVar[score;500;123456789]$getUserVar[score;123456789]'));
  await test('$getUserVar default',            () => run('$getUserVar[missing_uv;123456789;0]'));
  await test('$resetUserVar',                  () => run('$setUserVar[pts;10;123456789]$resetUserVar[pts;123456789]$getUserVar[pts;123456789;gone]'));
  await test('$setServerVar + $getServerVar',  () => run('$setServerVar[xp;999;987654321]$getServerVar[xp;987654321]'));
  await test('$getServerVar default',          () => run('$getServerVar[missing_sv;987654321;0]'));
  await test('$resetServerVar',                () => run('$setServerVar[k;v;987654321]$resetServerVar[k;987654321]$getServerVar[k;987654321;gone]'));
  await test('$setChannelVar + $getChannelVar',() => run('$setChannelVar[pinned;true;111222333]$getChannelVar[pinned;111222333]'));
  await test('$getChannelVar default',         () => run('$getChannelVar[missing_cv;111222333;no]'));
  await test('$resetChannelVar',               () => run('$setChannelVar[k2;v;111222333]$resetChannelVar[k2;111222333]$getChannelVar[k2;111222333;gone]'));

  // ── Section 38: Interaction Functions ────────────────────────────────────
  console.log('\n── Section 38: Interaction Functions ──────────────────────────');
  await test('$isButton true',         () => runInter('$isButton'));
  await test('$isModal false',         () => runInter('$isModal'));
  await test('$isSlashCommand false',  () => runInter('$isSlashCommand'));
  await test('$isAutocomplete false',  () => runInter('$isAutocomplete'));
  await test('$customID',              () => runInter('$customID'));
  await test('$locale',                () => runInter('$locale'));
  await test('$selectMenuValues',      () => runInter('$selectMenuValues'));
  await test('$input[testinput]',      () => runInter('$input[testinput]'));
  await test('$deferUpdate returns ""',() => runInter('$deferUpdate'));
  await test('$option text (slash)',   () => {
    const inter = {
      ...mockInteraction,
      isChatInputCommand: () => true,
      options: {
        ...mockInteraction.options,
        get: (n) => n === 'text' ? { name: 'text', value: 'world', type: 3 } : null,
      },
    };
    return runInter('$option[text]', inter);
  });

  // ── Section 39: Discord Extended ─────────────────────────────────────────
  console.log('\n── Section 39: Discord Extended ────────────────────────────────');
  await test('$djsVersion',            () => run('$djsVersion'));
  await test('$executionTime',         () => run('$executionTime'));
  await test('$botInvite',             () => run('$botInvite'));
  await test('$botDescription',        () => run('$botDescription'));
  await test('$shardCount',            () => run('$shardCount'));
  await test('$typeof string',         () => run('$typeof[hello]'));
  await test('$typeof number',         () => run('$typeof[42]'));
  await test('$typeof bool',           () => run('$typeof[true]'));
  await test('$userExists true',       () => run('$userExists[123456789]'));
  await test('$userExists false',      () => run('$userExists[000000000]'));
  await test('$userDisplayName',       () => run('$userDisplayName[123456789]'));
  await test('$userGlobalName',        () => run('$userGlobalName'));
  await test('$userCount',             () => run('$userCount'));
  await test('$hasPerms true',         () => run('$hasPerms[123456789;Administrator]'));
  await test('$isTimedOut false',      () => run('$isTimedOut[123456789]'));
  await test('$messageID',             () => run('$messageID'));
  await test('$nomention',             () => run('$nomention'));
  await test('$snowflakeTime',         () => run('$snowflakeTime[$authorID]'));
  await test('$allMemberIDs',          () => run('$allMemberIDs[,]'));
  await test('$discordTimestamp ts',   () => run('$discordTimestamp[$getTimestamp]'));

  // ── Section 40: Formatting ────────────────────────────────────────────────
  console.log('\n── Section 40: Formatting ──────────────────────────────────────');
  await test('$bold',          () => run('$bold[hello]'));
  await test('$italic',        () => run('$italic[hello]'));
  await test('$underline',     () => run('$underline[hello]'));
  await test('$strikethrough', () => run('$strikethrough[hello]'));
  await test('$codeblock',     () => run('$codeblock[console.log("hi")]'));
  await test('$codeblock lang',() => run('$codeblock[console.log("hi");js]'));
  await test('$spoiler',       () => run('$spoiler[secret]'));
  await test('$hyperlink',     () => run('$hyperlink[click here;https://discord.com]'));
  await test('$subtext',       () => run('$subtext[small text]'));
  await test('$escape',        () => run('$escape[**bold** _italic_]'));
  await test('$raw',           () => run('$raw[hello world]'));

  // ── Section 41: Advanced Control Flow ────────────────────────────────────
  console.log('\n── Section 41: Advanced Control / Error Handling ───────────────');
  await test('$try success',          () => run('$try[$upper[hello]]$catch[e;ERROR]'));
  await test('$try catch',            () => run('$try[$throw[oops!]]$catch[msg;caught]'));
  await test('$suppressErrors throw', () => run('$suppressErrors[$throw[ignore me]]after'));
  await test('$throw silenced',       () => run('$suppressErrors[$throw[silent error]]done'));
  await test('$async/$endasync',      () => run('$async[$wait[1]a]$async[$wait[1]b]$endasync'));

  // ── Section 42: Guild Info Extended ──────────────────────────────────────
  console.log('\n── Section 42: Guild Info Extended ────────────────────────────');
  await test('$guildID',                () => run('$guildID'));
  await test('$guildName',              () => run('$guildName'));
  await test('$guildMemberCount',       () => run('$guildMemberCount'));
  await test('$guildOwnerID',           () => run('$guildOwnerID'));
  await test('$guildCreatedAt',         () => run('$guildCreatedAt'));
  await test('$guildBoostCount',        () => run('$guildBoostCount'));
  await test('$guildBoostLevel',        () => run('$guildBoostLevel'));
  await test('$guildRoleCount',         () => run('$guildRoleCount'));
  await test('$guildChannelCount',      () => run('$guildChannelCount'));
  await test('$guildEmojiCount',        () => run('$guildEmojiCount'));
  await test('$guildPreferredLocale',   () => run('$guildPreferredLocale'));
  await test('$guildVerificationLevel', () => run('$guildVerificationLevel'));
  await test('$guildVanityCode',        () => run('$guildVanityCode'));
  await test('$guildIcon',              () => run('$guildIcon'));
  await test('$guildBanner',            () => run('$guildBanner'));

  // ── Section 43: Channel Info Extended ────────────────────────────────────
  console.log('\n── Section 43: Channel Info Extended ───────────────────────────');
  await test('$channelExists true',  () => run('$channelExists[111222333]'));
  await test('$channelExists false', () => run('$channelExists[000000000]'));
  await test('$channelType',         () => run('$channelType'));
  await test('$channelNames',        () => run('$channelNames'));
  await test('$channelCount',        () => run('$channelCount'));
  await test('$isNSFW',              () => run('$isNSFW'));
  await test('$channelID',           () => run('$channelID'));

  // ── Section 44: Variable Utilities ───────────────────────────────────────
  console.log('\n── Section 44: Variable Utilities ─────────────────────────────');
  await test('$varExists true',   () => run('$var[k;hi]$varExists[k]'));
  await test('$varExists false',  () => run('$varExists[notset_xyz]'));
  await test('$listVar',          () => run('$var[a;1]$var[b;2]$listVar'));
  await test('$deleteVar clears', () => run('$var[z;99]$deleteVar[z]$varExists[z]'));

  // ── Section 45: Cooldown Utilities ───────────────────────────────────────
  console.log('\n── Section 45: Cooldown Utilities ─────────────────────────────');
  await test('$getCooldown (none)', async () => {
    return runtime.runForCommand('$getCooldown', mockMessage, '!');
  });
  await test('$deleteCooldown',    () => run('$deleteCooldown[cd_del_test;123456789]'));
  await test('$userCooldown 1st call ok', async () => {
    const m = { ...mockMessage, content: '!ucd_test_unique hello' };
    const r  = await runtime.runForCommand('$userCooldown[1h]ok', m, '!');
    if (r !== 'ok') throw new Error(`expected "ok", got "${r}"`);
    return r;
  });
  await test('$serverCooldown 1st call ok', async () => {
    const m = { ...mockMessage, content: '!scd_test_unique hello' };
    const r  = await runtime.runForCommand('$serverCooldown[1h]ok', m, '!');
    if (r !== 'ok') throw new Error(`expected "ok", got "${r}"`);
    return r;
  });
  await test('$guildCooldown 1st call ok', async () => {
    const m = { ...mockMessage, content: '!gcd_test_unique hello' };
    const r  = await runtime.runForCommand('$guildCooldown[1h]ok', m, '!');
    if (r !== 'ok') throw new Error(`expected "ok", got "${r}"`);
    return r;
  });
  await test('$memberCooldown 1st call ok', async () => {
    const m = { ...mockMessage, content: '!mcd_test_unique hello' };
    const r  = await runtime.runForCommand('$memberCooldown[1h]ok', m, '!');
    if (r !== 'ok') throw new Error(`expected "ok", got "${r}"`);
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
