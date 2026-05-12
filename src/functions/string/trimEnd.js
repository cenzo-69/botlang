'use strict';
// $trimEnd[text]  — trims whitespace from the end of text
module.exports = async (context, args) => String(args[0] !== undefined ? args[0] : '').trimEnd();
