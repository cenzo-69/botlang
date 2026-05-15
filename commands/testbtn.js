'use strict';

/**
 * Button handler for the "testbtn" customID.
 * Triggered when a user clicks the "✅ Test Button" in /testinteraction.
 * Uses $addField (not $field) and $time for the Unix timestamp.
 */
module.exports = {
  name:      'testbtn',
  type:      'button',
  customID:  'testbtn',
  ephemeral: true,

  code: [
    '$title[✅ Button Works!]',
    '$color[57F287]',
    '$description[You clicked the test button successfully!]',
    '$addField[Clicked by;<@$authorID>;true]',
    '$addField[Username;$username;true]',
    '$addField[At;<t:$time:R>;true]',
    '$addField[Channel;<#$channelID>;true]',
    '$footer[Button interactions are working correctly ✓]',
    '$timestamp',
  ].join('\n'),
};
