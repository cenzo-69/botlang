'use strict';
// $customID  — returns the custom_id of the current interaction component
module.exports = async (context) => {
  return context.interaction?.customId ?? context.message?.interaction?.id ?? '';
};
