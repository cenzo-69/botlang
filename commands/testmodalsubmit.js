/**
 * Modal submit handler for "testmodalsubmit".
 * Fires when the user submits the modal opened by testmodalopen.
 */
module.exports = {
  name:      'testmodalsubmit',
  type:      'modal',
  customID:  'testmodalsubmit',
  ephemeral: true,

  code: [
    '$title[📝 Modal Submitted!]',
    '$color[5865F2]',
    '$description[Your modal submission was received successfully.]',
    '$field[Submitted by;<@$authorID>;true]',
    '$field[You typed;$input[testinput];false]',
    '$footer[Modal interactions are working correctly ✓]',
  ].join('\n'),
};
