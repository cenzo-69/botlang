module.exports = {
  name: 'greet',
  description: 'Time-based greeting using $time + $if',
  code: [
    '$var[hour;$eval[Number("$time[HH]")]]',
    '$var[greeting;$if[$getVar[hour]<12;🌅 Good morning;$if[$getVar[hour]<18;☀️ Good afternoon;$if[$getVar[hour]<22;🌆 Good evening;🌙 Good night]]]]',
    '$getVar[greeting], **$username**!',
    '_It\'s $time[HH:mm] on $time[YYYY-MM-DD]_',
    'You are in **#$channelName** on **$guildName**',
  ].join('\n'),
};
