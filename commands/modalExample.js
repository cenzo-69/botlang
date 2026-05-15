module.exports = {
  name:      'feedbackModal',
  type:      'modal',
  customID:  'feedback',
  ephemeral: true,

  code: `
Thanks for your feedback, <@$authorID>!
You said: $input[text_field_custom_id]
  `.trim(),
};
