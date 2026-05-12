'use strict';
// $deferUpdate  — defers the component interaction update (prevents "interaction failed")
module.exports = async (context) => {
  const i = context.interaction;
  if (!i) return '[error: $deferUpdate — no interaction context]';
  try {
    if (!i.deferred && !i.replied) {
      if (i.deferUpdate) await i.deferUpdate();
      else if (i.deferReply) await i.deferReply({ ephemeral: false });
    }
    return '';
  } catch (err) { return `[error: $deferUpdate — ${err.message}]`; }
};
