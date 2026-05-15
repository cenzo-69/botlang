'use strict';

/**
 * Button handler — opens a 3-field modal using $showModal + $addTextInput.
 * customID: testmultimodalopen
 * Triggered by the "📋 Multi Modal" button in /testinteraction.
 */
module.exports = {
  name:     'testmultimodalopen',
  type:     'button',
  customID: 'testmultimodalopen',

  code: [
    '$showModal[testmultimodalsubmit;📋 Multi-Field Form;name;Your name here...;short;Your Name]',
    '$addTextInput[subject;What is this about?;short;Subject]',
    '$addTextInput[details;Describe in detail — use as many lines as you like.;paragraph;Details]',
  ].join('\n'),
};
