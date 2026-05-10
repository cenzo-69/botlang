'use strict';

const { Runtime } = require('./src');

async function main() {
  const runtime = new Runtime();
  console.log('Loaded functions:', runtime.loader.list().sort().join(', '));
  console.log('');

  const mockMessage = {
    author: { id: '123456789', username: 'TestUser', discriminator: '0' },
    guild:  { id: '987654321', name: 'Test Guild', memberCount: 42 },
    channel: {
      id: '111222333',
      name: 'general',
      send: async (m) => console.log('   [channel.send]', m),
    },
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
    reply: async (m) => console.log('   [reply]', m),
  };

  const tests = [
    // Label                  Code
    ['Plain text',            'Hello World'],
    ['$username',             '$username'],
    ['$userID',               '$userID'],
    ['$userTag',              '$userTag'],
    ['$channelID',            '$channelID'],
    ['$channelName',          '$channelName'],
    ['$guildID',              '$guildID'],
    ['$guildName',            '$guildName'],
    ['$memberCount',          '$memberCount'],
    ['$math basic',           '$math[2+2]'],
    ['$math power',           '$math[2^10]'],
    ['$math parens',          '$math[(3+4)*2]'],
    ['$math float',           '$math[10/3]'],
    ['$random',               '$random[1;6]'],
    ['$lower',                '$lower[HELLO WORLD]'],
    ['$upper',                '$upper[hello world]'],
    ['$length',               '$length[hello]'],
    ['$trim',                 '$trim[  hello  ]'],
    ['$includes true',        '$includes[hello world;world]'],
    ['$includes false',       '$includes[hello world;xyz]'],
    ['$replace',              '$replace[hello world;world;everyone]'],
    ['$slice',                '$slice[hello world;6]'],
    ['$split count',          '$split[a,b,c;,]'],
    ['$split element',        '$split[a,b,c;,;2]'],
    ['$time format',          '$time[YYYY-MM-DD]'],
    ['$time unix',            '$time'],
    ['$eval simple',          '$eval[1+1]'],
    ['$eval complex',         '$eval[Math.pow(2,8)]'],
    ['$var+$getVar',          '$var[score;999]$getVar[score]'],
    ['$getVar default',       '$getVar[missing;fallback]'],
    ['$loop loopNumber',      '$loop[3;Item $loopNumber\n]'],
    ['$loop loopIndex',       '$loop[3;Idx $loopIndex\n]'],
    ['$if true',              '$if[5>3;YES;NO]'],
    ['$if false',             '$if[1>3;YES;NO]'],
    ['$if equal',             '$if[hello==hello;match;no match]'],
    ['$if >=',                '$if[5>=5;ok;fail]'],
    ['$equals same',          '$equals[a;a]'],
    ['$equals diff',          '$equals[a;b]'],
    ['$equals branch',        '$equals[x;x;MATCH;NO MATCH]'],
    ['$and true',             '$and[true;true]'],
    ['$and false',            '$and[true;false]'],
    ['$or true',              '$or[false;true]'],
    ['$or false',             '$or[false;false]'],
    ['$not true->false',      '$not[true]'],
    ['$not false->true',      '$not[false]'],
    ['$repeat',               '$repeat[ab;3;-]'],
    ['$newline',              'line1$newlineline2'],
    ['$space',                'a$space[3]b'],
    ['$nested',               '$upper[$username]'],
    ['$deep nested',          '$length[$upper[$username]]'],
    ['$avatar nested',        '$avatar[$userID]'],
    ['$unknown passthrough',  '$unknownFunc'],
    ['$stop',                 '$var[x;1]$stop$var[x;99]$getVar[x]'],
    ['multiline code',        'Line1\nLine2\n$upper[line3]'],
    ['escape backslash $',    'price: \\$100'],
    ['escape semicolon',      '$upper[a\\;b]'],
    ['complex nesting',       '$if[$includes[$username;Test];$upper[$username];$lower[$username]]'],
    ['loop with vars',        '$var[x;0]$loop[3;$var[x;$math[$getVar[x]+1]]]total:$getVar[x]'],
  ];

  let passed = 0;
  let failed = 0;

  for (const [label, code] of tests) {
    try {
      const result = await runtime.runForMessage(code, mockMessage);
      console.log(`✅  [${label}]`);
      console.log(`    => ${JSON.stringify(result)}`);
      passed++;
    } catch (err) {
      console.error(`❌  [${label}] ERROR: ${err.message}`);
      failed++;
    }
  }

  console.log('');
  console.log(`Results: ${passed} passed, ${failed} failed out of ${tests.length} tests`);
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
