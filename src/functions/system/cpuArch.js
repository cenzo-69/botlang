'use strict';
const os = require('os');
// $cpuArch  — returns CPU architecture (x64, arm, arm64, etc.)
module.exports = async () => os.arch();
