module.exports = {
  name:        'texttools',
  description: 'Showcase string manipulation functions',
  code: `
$var[sample;  Hello, World!  ]
$var[trimmed; $trim[$getVar[sample]]]
🔤 **Text Tools Demo**
\`\`\`
Original  : "$getVar[sample]"
Trimmed   : "$getVar[trimmed]"
Uppercase : $upper[$getVar[trimmed]]
Lowercase : $lower[$getVar[trimmed]]
Length    : $length[$getVar[trimmed]] chars
Replaced  : $replace[$getVar[trimmed];World;$username]
Sliced    : $slice[$getVar[trimmed];7;12]
Includes? : $includes[$getVar[trimmed];World]
Repeated  : $repeat[ab;4;-]
Split[2]  : $split[$getVar[trimmed];,;2]
\`\`\`
  `.trim(),
};
