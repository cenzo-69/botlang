'use strict';

const fnError = require('../../core/fnError');

// $reply[content]  — replies to the triggering message (or responds to interaction)
module.exports = async (context, args) => {
  const content = String(args[0] !== undefined ? args[0] : '').trim();

  if (!content) {
    return fnError('reply', 'reply content is required', {
      expected: 'a non-empty string',
      example:  '$reply[Hello there!]',
    });
  }

  try {
    if (context.interaction && !context.interaction.replied && !context.interaction.deferred) {
      await context.interaction.reply({ content, ephemeral: false });
    } else if (context.message) {
      await context.message.reply(content);
    }
  } catch (err) {
    return fnError('reply', err.message, { tip: 'Check bot permissions and interaction state' });
  }

  return '';
};
