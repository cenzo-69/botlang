'use strict';

// $tts
// Marks the current response to be sent as a Text-to-Speech (TTS) message.
// Sets the __tts__ flag in context — your reply handler should pass { tts: true }.
module.exports = async (context, _args) => {
  context.variables.set('__tts__', true);
  return '';
};
