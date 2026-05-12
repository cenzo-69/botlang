'use strict';
const os = require('os');
// $cpuCores  — returns the number of logical CPU cores
module.exports = async () => String(os.cpus().length);
