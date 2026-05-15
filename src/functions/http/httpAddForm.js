'use strict';

const { argError } = require('../../core/fnError');
// $httpAddForm[name;value]  — adds a form field to the HTTP request body (stored in context)
module.exports = async (context, args) => {
  const name  = String(args[0] !== undefined ? args[0] : '').trim();
  const value = String(args[1] !== undefined ? args[1] : '');
  if (!name) return argError(context, 'name', 'string', name);
  const existing = context.variables.get('__http_form__') ?? '{}';
  try {
    const form = JSON.parse(existing);
    form[name] = value;
    context.variables.set('__http_form__', JSON.stringify(form));
    context.variables.set('__http_content_type__', 'application/x-www-form-urlencoded');
    return '';
  } catch { return '[error: Form data corrupted!]'; }
};
