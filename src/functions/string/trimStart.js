'use strict';
// $trimStart[text]  — trims whitespace from the start of text
module.exports = async (context, args) => String(args[0] !== undefined ? args[0] : '').trimStart();
