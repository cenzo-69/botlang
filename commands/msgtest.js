module.exports = {
  name: 'msgtest',
  description: 'Debug message parsing. Usage: !msgtest hello world',
  code: [
    '📨 **Message Parsing Debug**',
    '```',
    'Command        : $commandName',
    'Full input     : "$message"',
    'Word 1         : "$message[1]"',
    'Word 2         : "$message[2]"',
    'No-mention     : "$noMentionMessage"',
    'Arg count      : $argsCount',
    'Author ID      : $authorID',
    'Author name    : $username',
    'Channel        : #$channelName',
    '```',
  ].join('\n'),
};
