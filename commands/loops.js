module.exports = {
  name: 'loops',
  description: 'Advanced loop demo with $loopIndex, $loopNumber and nested vars',
  code: [
    '🔁 **Loop Demo**',
    '',
    '**Basic loop (5 items):**',
    '$loop[5;• Item $loopNumber of 5$newline]',
    '',
    '**Multiplication table for 3:**',
    '```',
    '$loop[10;3 × $loopNumber = $math[3 * $loopNumber]$newline]',
    '```',
    '',
    '**FizzBuzz (1–15):**',
    '$loop[15;$var[n;$loopNumber]$if[$math[$getVar[n]%15]==0;FizzBuzz;$if[$math[$getVar[n]%3]==0;Fizz;$if[$math[$getVar[n]%5]==0;Buzz;$getVar[n]]]] ]',
  ].join('\n'),
};
