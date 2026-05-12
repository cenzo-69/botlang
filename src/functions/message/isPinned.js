'use strict';
// $isPinned  — returns "true" if the current message is pinned
module.exports = async (context) => String(context.message?.pinned ?? false);
