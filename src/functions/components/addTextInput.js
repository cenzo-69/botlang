'use strict';

// $addTextInput[inputID;placeholder;style?;label?;required?]
//
// Adds a second (or further) text input to a modal already defined by $showModal.
// Must be called AFTER $showModal in the same code block.
// Discord allows a maximum of 5 inputs per modal.
//
// inputID     — unique custom ID, used with $input[id] in the modal submit handler
// placeholder — hint text shown inside the input box (max 100 chars)
// style       — "short" (single line, default) or "paragraph" (multi-line)
// label       — visible label above the input (defaults to placeholder)
// required    — "false" to make optional (default: true)

module.exports = async (context, args) => {
  const inputId     = String(args[0] ?? '').trim();
  const placeholder = String(args[1] ?? '').trim();
  const style       = String(args[2] ?? 'short').toLowerCase();
  const label       = String(args[3] ?? '').trim() || placeholder || 'Enter text';
  const required    = String(args[4] ?? 'true').toLowerCase() !== 'false';

  if (!inputId) return '[addTextInput: inputID is required as the first argument]';
  if (!context._modalDef) return '[addTextInput: call $showModal first to define the modal]';
  if (context._modalDef.inputs.length >= 5) return '[addTextInput: Discord modals support a maximum of 5 inputs]';

  context._modalDef.inputs.push({
    inputId,
    label:       label.slice(0, 45),
    placeholder: placeholder.slice(0, 100),
    style:       style === 'paragraph' ? 'paragraph' : 'short',
    required,
  });

  return '';
};
