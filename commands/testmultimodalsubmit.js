'use strict';

/**
 * Modal submit handler for "testmultimodalsubmit".
 * Receives 3 inputs: name (short), subject (short), details (paragraph).
 * Shows all three values with $input[customID].
 */
module.exports = {
  name:      'testmultimodalsubmit',
  type:      'modal',
  customID:  'testmultimodalsubmit',
  ephemeral: true,

  code: [
    '$title[📋 Multi-Field Form Received!]',
    '$color[5865F2]',
    '$description[Your 3-field modal was submitted successfully. All inputs captured:]',

    '$addField[👤 Submitted by;<@$authorID> · $username;true]',
    '$addField[⏰ At;$time[YYYY-MM-DD HH:mm:ss];true]',

    '$addField[🔠 Name;$input[name];false]',
    '$addField[📌 Subject;$input[subject];false]',
    '$addField[📝 Details;$input[details];false]',

    '$footer[Multi-input modals working ✓ — CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
