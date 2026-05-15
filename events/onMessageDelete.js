'use strict';

module.exports = {
  name: 'onMessageDelete',

  code: [
    '$title[🗑️ Message Deleted]',
    '$color[ED4245]',
    '$description[A message by <@$getVar[deletedAuthorID]> was deleted in <#$getVar[deletedChannelID]>.]',
    '$addField[👤 Author;`$getVar[deletedAuthorID]`;true]',
    '$addField[📌 Channel;<#$getVar[deletedChannelID]>;true]',
    '$addField[🆔 Message ID;`$getVar[deletedMessageID]`;true]',
    '$addField[💬 Content;$if[$getVar[deletedContent]==;*(message not cached)*;$getVar[deletedContent]);false]',
    '$footer[Message deleted · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
