'use strict';
const os = require('os');
// $os  — returns operating system name (linux, darwin, win32, etc.)
module.exports = async () => os.platform();
