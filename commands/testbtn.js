/**
 * Button handler for the "testbtn" customID.
 * Triggered when a user clicks the "✅ Test Button" in testinteraction.
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
    '$field[Clicked by;<@$authorID>;true]',
    '$field[At;<t:$math[$timestamp/1000]:R>;true]',
    '$footer[Button interactions are working correctly ✓]',
  ].join('\n'),
};
