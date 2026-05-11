'use strict';

// $ping  — WebSocket heartbeat latency in ms
module.exports = async (context, args) => {
  if (!context.client?.ws) return '[error: no client]';
  return String(Math.round(context.client.ws.ping));
};
