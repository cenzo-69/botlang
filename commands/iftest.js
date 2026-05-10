module.exports = {
  name: 'iftest',
  description: 'Demo $if and $random',
  code: [
    '$var[roll;$random[1;6]]',
    'You rolled: $getVar[roll]',
    '$if[$getVar[roll]>=4;🎉 High roll!;😢 Low roll...]',
  ].join('\n'),
};
