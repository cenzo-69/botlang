/**
 * Example: Button interaction handler
 *
 * When a button with customID "confirm" (or "confirm:*") is clicked,
 * this command runs.
 *
 * To send a button that triggers this handler:
 *   $addButton[confirm;✅ Confirm;success]
 *
 * The button's customId can carry extra data after a colon:
 *   "confirm:userId:amount" — the parts after ':' become commandArgs[0], commandArgs[1], etc.
 */
module.exports = {
  name:      'confirmButton',
  type:      'button',          // ← marks as button handler
  customID:  'confirm',         // ← matches customId prefix
  ephemeral: true,              // ← reply only visible to clicker

  code: `
✅ Confirmed by <@$authorID>!
  `.trim(),
};
