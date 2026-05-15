'use strict';

module.exports = {
  name:      'testmodalsubmit',
  type:      'modal',
  customID:  'testmodalsubmit',
  ephemeral: true,

  code: `
$title[📝 Modal Submitted!]
$color[5865F2]
$description[Your modal submission was received successfully.]
$addField[Submitted by; <@$authorID>;                            true]
$addField[Username;     $username;                               true]
$addField[You typed;    $input[testinput];                       false]
$addField[Input length; $length[$input[testinput]] characters;   true]
$addField[Channel;      <#$channelID>;                           true]
$footer[Modal interactions are working correctly ✓]
$timestamp
  `,
};
