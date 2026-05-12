'use strict';
// $botDescription  — returns the bot application's description
module.exports = async (context) => {
  try {
    const app = await context.client?.application?.fetch();
    return app?.description ?? '';
  } catch (err) { return `[error: $botDescription — ${err.message}]`; }
};
