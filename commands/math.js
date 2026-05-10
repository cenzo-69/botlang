module.exports = {
  name: 'math',
  description: 'Evaluate a math expression: !math 2+2*10',
  // $eval will receive the expression as-typed (args are parsed from the message externally)
  code: 'Result: $math[2^10 + (3*4) - 5]',
};
