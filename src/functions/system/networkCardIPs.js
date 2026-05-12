'use strict';
const os = require('os');
// $networkCardIPs[separator]  — returns network interface IP addresses
module.exports = async (context, args) => {
  const sep = String(args[0] !== undefined ? args[0] : ', ');
  const ifaces = os.networkInterfaces();
  const ips = [];
  for (const iface of Object.values(ifaces)) {
    for (const addr of (iface || [])) {
      if (!addr.internal) ips.push(addr.address);
    }
  }
  return ips.join(sep) || 'none';
};
