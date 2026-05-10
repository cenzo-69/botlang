module.exports = {
  name: 'evaltest',
  description: 'Showcase $eval (sandboxed JS expression evaluator)',
  code: [
    '🧪 **$eval Sandbox Demo**',
    '```',
    '1 + 1                 = $eval[1 + 1]',
    'Math.sqrt(144)        = $eval[Math.sqrt(144)]',
    'Math.PI (6dp)         = $eval[Math.PI.toFixed(6)]',
    '"hello".toUpperCase() = $eval["hello".toUpperCase()]',
    '[1,2,3].join("-")     = $eval[[1,2,3].join("-")]',
    'Array(5).fill(0)      = $eval[Array(5).fill(0).join(",")]',
    'Date.now()            = $eval[Date.now()]',
    '```',
  ].join('\n'),
};
