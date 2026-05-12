'use strict';
const os = require('os');
// $cpu  — returns current CPU usage percentage (approximation over 100ms)
module.exports = async () => {
  const cpus1 = os.cpus();
  await new Promise(r => setTimeout(r, 100));
  const cpus2 = os.cpus();
  let idle = 0, total = 0;
  for (let i = 0; i < cpus1.length; i++) {
    const d1 = cpus1[i].times, d2 = cpus2[i].times;
    idle  += d2.idle  - d1.idle;
    total += Object.values(d2).reduce((a,b)=>a+b,0) - Object.values(d1).reduce((a,b)=>a+b,0);
  }
  return String(parseFloat((100 - (idle/total)*100).toFixed(2)));
};
