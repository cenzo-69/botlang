'use strict';
// $toUpperCase[text]  — converts text to UPPERCASE
module.exports = async (context, args) => String(args[0] !== undefined ? args[0] : '').toUpperCase();
