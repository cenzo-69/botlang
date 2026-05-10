module.exports = {
  name: 'say',
  description: 'Repeat your message without mentions. Usage: !say <text>',
  code: [
    '$onlyIf[$argsCount>=1]',
    '$noMentionMessage',
  ].join('\n'),
};
