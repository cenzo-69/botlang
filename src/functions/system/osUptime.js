'use strict';
const os = require('os');
// $osUptime  — returns OS uptime in seconds
module.exports = async () => String(Math.floor(os.uptime()));
