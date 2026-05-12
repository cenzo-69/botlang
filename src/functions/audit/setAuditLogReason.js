'use strict';
// $setAuditLogReason[reason]  — stores the audit log reason in context for upcoming actions
module.exports = async (context, args) => {
  const reason = String(args[0] !== undefined ? args[0] : '').trim();
  context.variables.set('__audit_reason__', reason);
  return '';
};
