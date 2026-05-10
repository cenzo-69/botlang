module.exports = {
  name: 'flip',
  description: 'Flip a coin',
  code: [
    '$var[result;$random[1;2]]',
    '🪙 **Coin Flip**',
    '$if[$getVar[result]==1;> **Heads!** 🎉;> **Tails!** 😔]',
  ].join('\n'),
};
