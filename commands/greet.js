'use strict';

module.exports = {
  name:        'greet',
  description: 'Time-based greeting using $time + $if',
  code: `
$if[$time[HH]<12; 🌅 Good morning, **$username**!;
$if[$time[HH]<18; ☀️ Good afternoon, **$username**!;
$if[$time[HH]<22; 🌆 Good evening, **$username**!;
🌙 Good night, **$username**!]]]
_It's $time[HH:mm] on $time[YYYY-MM-DD]_
You are in **#$channelName** on **$guildName**
  `.trim(),
};
