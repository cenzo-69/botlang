'use strict';
const os = require('os');
// $cpuSpeed  — returns CPU speed in MHz
module.exports = async () => String(os.cpus()[0]?.speed ?? 0);
