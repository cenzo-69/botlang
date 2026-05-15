module.exports = {
  name:        'calc',
  description: 'Math calculator showcase using $math',
  code: `
🧮 **Calculator Demo**
\`\`\`
2 + 2         = $math[2+2]
2 ^ 10        = $math[2^10]
(3 + 4) * 2   = $math[(3+4)*2]
100 / 3       = $math[100/3]
17 % 5        = $math[17%5]
√144 (eval)   = $eval[Math.sqrt(144)]
π (eval)      = $eval[Math.PI.toFixed(6)]
\`\`\`
  `.trim(),
};
