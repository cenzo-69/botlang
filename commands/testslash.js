/**
 * testslash — Tests slash command options (string, user, integer).
 * Run with: /testslash  or  !testslash
 */
module.exports = {
  name:        'testslash',
  description: 'Tests slash command options and context functions',
  slash:       true,
  ephemeral:   false,

  options: [
    {
      name:        'text',
      description: 'A string to echo back',
      type:        'string',
      required:    false,
    },
    {
      name:        'number',
      description: 'A number to display',
      type:        'integer',
      required:    false,
    },
    {
      name:        'user',
      description: 'A user to mention',
      type:        'user',
      required:    false,
    },
  ],

  code: [
    '$title[✅ Slash Command Working!]',
    '$color[57F287]',
    '$field[Your ID;$authorID;true]',
    '$field[Username;$username;true]',
    '$field[Channel;<#$channelID>;true]',
    '$field[Server;$serverName;true]',
    '$field[Bot Latency;$ping ms;true]',
    '$field[Slash Options Received;text: $commandArgs[0]\nnumber: $commandArgs[1]\nuser: $commandArgs[2];false]',
    '$footer[Slash commands are fully operational ✓]',
  ].join('\n'),
};
