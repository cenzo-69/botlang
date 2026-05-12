'use strict';

const db = require('../../core/db');

// $closeTicket[errorMessage?]
// Closes (deletes) the current ticket channel. Must be used inside a ticket channel.
module.exports = async (context, args) => {
  const errorMsg = String(args[0] !== undefined ? args[0] : '').trim();

  const channel = context.message?.channel;
  if (!channel) return errorMsg || '[error: $closeTicket — no channel context]';

  const ticketData = db.get(`__ticket_${channel.id}`, null);
  if (!ticketData) return errorMsg || '[error: $closeTicket — this is not a ticket channel]';

  try {
    db.delete(`__ticket_${channel.id}`);
    await channel.delete('Ticket closed');
    return '';
  } catch (err) {
    return errorMsg || `[error: $closeTicket — ${err.message}]`;
  }
};
