'use strict';
// $snowflake  — generates a unique Discord-style snowflake ID
const EPOCH = 1420070400000n;
let inc = 0n;
module.exports = async () => {
  const ts = BigInt(Date.now()) - EPOCH;
  const id = (ts << 22n) | (0n << 17n) | (0n << 12n) | (inc++ & 0xFFFn);
  return id.toString();
};
