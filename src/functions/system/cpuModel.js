'use strict';
const os = require('os');
// $cpuModel  — returns the CPU model string
module.exports = async () => (os.cpus()[0]?.model ?? 'Unknown');
