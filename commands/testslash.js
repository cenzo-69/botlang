'use strict';

/**
 * /testslash — Comprehensive slash command option showcase.
 * Tests every option type: string, integer, user, and string with choices.
 *
 * Run with: /testslash  or  !testslash
 */
module.exports = {
  name:        'testslash',
  description: 'Showcase slash command options — string, integer, user, choice',
  slash:       true,
  ephemeral:   false,

  options: [
    {
      name:        'message',
      description: 'A text message to echo back',
      type:        'string',
      required:    false,
    },
    {
      name:        'number',
      description: 'An integer to display',
      type:        'integer',
      required:    false,
    },
    {
      name:        'user',
      description: 'Mention a user',
      type:        'user',
      required:    false,
    },
    {
      name:        'choice',
      description: 'Pick a preset value',
      type:        'string',
      required:    false,
      choices: [
        { name: 'Alpha', value: 'alpha' },
        { name: 'Beta',  value: 'beta'  },
        { name: 'Gamma', value: 'gamma' },
      ],
    },
  ],

  code: [
    '$title[⚡ Slash Command Test]',
    '$color[57F287]',
    '$thumbnail[$userAvatar]',
    '$description[All slash command options received successfully. Full context snapshot below:]',

    '$addField[👤 Triggered by;<@$authorID> (`$authorID`);true]',
    '$addField[📛 Tag;$userTag;true]',
    '$addField[📢 Channel;<#$channelID>;true]',
    '$addField[🏠 Server;$serverName (`$guildID`);true]',
    '$addField[🤖 Bot Latency;$ping ms;true]',
    '$addField[👥 Members;$memberCount;true]',
    '$addField[⏰ Date & Time;$time[YYYY-MM-DD HH:mm:ss];true]',

    '$addField[📝 Option · message;$commandArgs[0];false]',
    '$addField[🔢 Option · number;`$commandArgs[1]`;true]',
    '$addField[👤 Option · user;$commandArgs[2];true]',
    '$addField[🎯 Option · choice;`$commandArgs[3]`;true]',

    '$addField[💡 Next Step;Run `/testinteraction` to test buttons, modals and select menus.$newlineRun `/help` to browse all **718 functions** by category!;false]',

    '$footer[Slash commands ✓ — CenzoJS v2.0]',
    '$timestamp',
  ].join('\n'),
};
