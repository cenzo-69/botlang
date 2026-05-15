'use strict';

module.exports = {
  name: 'onThreadCreate',

  code: [
    '$title[🧵 Thread Created]',
    '$color[3498DB]',
    '$description[A new thread was created in **$getVar[guildName]**.]',
    '$addField[🧵 Thread;<#$getVar[threadID]>;true]',
    '$addField[📌 Parent;<#$getVar[parentChannelID]>;true]',
    '$addField[👥 Member Count;$getVar[memberCount];true]',
    '$addField[🆔 Thread ID;`$getVar[threadID]`;false]',
    '$footer[Thread created · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
