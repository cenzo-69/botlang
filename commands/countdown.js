module.exports = {
  name: 'countdown',
  description: 'Countdown using $loop + $math',
  code: [
    '$var[from;5]',
    '⏳ **Countdown from $getVar[from]**',
    '$loop[$getVar[from];$var[n;$math[$getVar[from] - $loopIndex]]$if[$getVar[n]>1;$getVar[n]...;🚀 **Blast off!**]$newline]',
  ].join('\n'),
};
