`use strict`; 

module.exports = {
  name: "onMessageEdit", 

  code: `
    $if[$getVar[oldContent]==$getVar[newContent]]
    $stop
    $endif
    $title[✏️ Message Edited]
    $color[FEE75C]
    $description[<@$getVar[editedAuthorID]> edited a message in <#$getVar[editedChannelID]>.]
    $addField[📝 Before;$if[$getVar[oldContent]==;*(not cached)*;$getVar[oldContent];false]]
    $addField[📝 After;$getVar[newContent];false]
    $addField[🆔 Message ID;$getVar[editedMessageID];false]
    $footer[Message edited · CenzoJS]
    $timestamp
  `
};