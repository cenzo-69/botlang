module.exports = {
  name: 'evaltest',
  description: 'Showcase $eval — framework re-execution (no JS)',
  code: [
    '🧪 **$eval Demo — Framework Re-execution**',
    '```',
    'static text         = $eval[hello world]',
    'framework fn        = $eval[$upper[hello]]',
    'nested math         = $eval[$math[2^10]]',
    'current user        = $eval[$username]',
    'channel + guild     = $eval[$channelName / $guildName]',
    'var in eval         = $eval[$var[x;42]value is $getVar[x]]',
    '```',
    '_$eval re-runs framework syntax. No JavaScript is executed._',
  ].join('\n'),
};
