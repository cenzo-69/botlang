module.exports = {
  name: 'eval',
  description: 'Evaluate framework syntax. Usage: !eval <code>',
  code: [
    '$onlyIf[$argsCount>=1]',
    '$eval[$message[0]]',
  ].join('\n'),
};
