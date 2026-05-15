module.exports = {
  name:        'choose',
  description: 'Randomly pick one item from a fixed list',
  code: `
$var[list; pizza,sushi,burger,tacos,ramen]
$var[count; 5]
$var[pick; $random[1;$getVar[count]]]
$var[choice; $split[$getVar[list];,;$getVar[pick]]]
🎲 **$username** — the wheel has spoken:
> **$getVar[choice]**
_Picked option $getVar[pick] out of $getVar[count]_
  `.trim(),
};
