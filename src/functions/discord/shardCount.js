'use strict';
// $shardCount  — returns the current shard count (or 1 if not sharded)
module.exports = async (context) => String(context.client?.shard?.count ?? 1);
