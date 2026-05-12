'use strict';
// $toLowerCase[text]  — converts text to lowercase
module.exports = async (context, args) => String(args[0] !== undefined ? args[0] : '').toLowerCase();
