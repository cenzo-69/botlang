/**
 * Example: Modal submit handler
 *
 * When a modal with customID "feedback" is submitted, this runs.
 *
 * To show a modal, use $showModal in another command's code:
 *   $showModal[feedback;📝 Feedback;text_field_custom_id;What's your feedback?]
 *
 * Then use $input[field_custom_id] inside this handler to read the submitted value.
 */
module.exports = {
  name:      'feedbackModal',
  type:      'modal',           // ← marks as modal handler
  customID:  'feedback',        // ← matches modal customId
  ephemeral: true,

  code: `
Thanks for your feedback, <@$authorID>!
You said: $input[text_field_custom_id]
  `.trim(),
};
