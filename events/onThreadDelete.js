'use strict';

module.exports = {
  name: 'onThreadDelete',

  code: [
    '$title[🗑️ Thread Deleted]',
    '$color[ED4245]',
    '$description[Thread **$getVar[threadName]** was deleted in **$getVar[guildName]**.]',
    '$addField[🧵 Thread Name;$getVar[threadName];true]',
    '$addField[📌 Parent;<#$getVar[parentChannelID]>;true]',
    '$addField[🆔 Thread ID;`$getVar[threadID]`;false]',
    '$footer[Thread deleted · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
