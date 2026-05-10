module.exports = {
  name: 'dice',
  description: 'Roll 5 dice and sum the results using $loop + $var',
  code: [
    '$var[total;0]',
    '$var[rolls;]',
    '$loop[5;$var[roll;$random[1;6]]$var[total;$math[$getVar[total]+$getVar[roll]]]$var[rolls;$getVar[rolls] [$getVar[roll]]]]',
    '🎲 **Dice Roller** — 5d6',
    'Rolls :$getVar[rolls]',
    'Total : **$getVar[total]**',
    'Avg   : $eval[$math[$getVar[total]/5]]',
    '$if[$getVar[total]>=25;🔥 Incredible roll!;$if[$getVar[total]>=15;👍 Good roll!;😬 Better luck next time]]',
  ].join('\n'),
};
