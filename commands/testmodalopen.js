/**
 * Button handler for "testmodalopen" — opens a modal when clicked.
 * Triggered when a user clicks "📝 Open Modal" in testinteraction.
 */
module.exports = {
  name:     'testmodalopen',
  type:     'button',
  customID: 'testmodalopen',

  code: '$showModal[testmodalsubmit;📝 Test Modal;testinput;Type anything here...]',
};
