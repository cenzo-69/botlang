module.exports = {
  name: 'find',
  description: [
    'Search CenzoJS function docs.',
    'Usage:',
    '  !find              — full category list',
    '  !find <name>       — look up a specific function',
    '  !find <category>   — list all functions in a category',
    '                       (discord, message, variables, control,',
    '                        logic, math, strings, misc)',
    '  !find <keyword>    — search by keyword in name or description',
  ].join('\n'),
  code: '$find[$noMentionMessage]',
};
