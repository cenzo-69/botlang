'use strict';
// $locale  — returns the locale string of the current interaction (e.g. en-US)
module.exports = async (context) => context.interaction?.locale ?? '';
