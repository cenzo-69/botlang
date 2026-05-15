'use strict';

// $showModal[modalCustomID;title;inputID;placeholder;style?;label?]
//
// Shows a Discord modal in response to a button or slash command interaction.
// Can be called multiple times to add up to 5 text inputs.
//
// modalCustomID — matches the customID of the modal submit handler command
// title         — the modal window title (max 45 chars)
// inputID       — custom ID for the text input (used with $input[id] in the handler)
// placeholder   — placeholder text shown inside the input box
// style         — "short" (single line, default) or "paragraph" (multi-line)
// label         — visible label above the input (defaults to placeholder)

module.exports = async (context, args) => {
  const customId    = String(args[0] ?? '').trim();
  const title       = String(args[1] ?? 'Modal').trim();
  const inputId     = String(args[2] ?? 'input').trim();
  const placeholder = String(args[3] ?? '').trim();
  const style       = String(args[4] ?? 'short').toLowerCase();
  const label       = String(args[5] ?? '').trim() || placeholder || 'Enter text';

  if (!customId) return '[showModal: modalCustomID is required as the first argument]';

  if (!context._modalDef) {
    context._modalDef = { customId, title, inputs: [] };
  }

  if (inputId) {
    context._modalDef.inputs.push({
      inputId,
      label:       label.slice(0, 45),
      placeholder: placeholder.slice(0, 100),
      style:       style === 'paragraph' ? 'paragraph' : 'short',
      required:    true,
    });
  }

  return '';
};
