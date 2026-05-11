'use strict';

// $math[expression]
// Safely evaluates a math expression.  Supports: + - * / % ** ( )
// No require, no eval tricks — uses a custom safe evaluator.
module.exports = async (context, args) => {
  const expr = String(args[0] || '').trim();
  if (!expr) return '0';

  try {
    const result = safeMath(expr);
    // Return integer if whole number, else up to 10 decimal places
    return Number.isInteger(result)
      ? String(result)
      : String(parseFloat(result.toFixed(10)));
  } catch {
    return '[math error]';
  }
};

// Tokenize and parse the expression with proper precedence
function safeMath(expr) {
  const tokens = tokenize(expr);
  const pos = { i: 0 };
  const result = parseExpr(tokens, pos);
  if (pos.i !== tokens.length) throw new Error('Unexpected token');
  return result;
}

function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    if (/\s/.test(expr[i])) { i++; continue; }
    if (/\d/.test(expr[i]) || (expr[i] === '.' && /\d/.test(expr[i + 1] || ''))) {
      let num = '';
      while (i < expr.length && /[\d.]/.test(expr[i])) num += expr[i++];
      tokens.push({ type: 'num', value: parseFloat(num) });
    } else if ('+-*/%^()'.includes(expr[i])) {
      tokens.push({ type: 'op', value: expr[i++] });
    } else {
      throw new Error(`Unknown character: ${expr[i]}`);
    }
  }
  return tokens;
}

function parseExpr(tokens, pos) { return parseAddSub(tokens, pos); }

function parseAddSub(tokens, pos) {
  let left = parseMulDiv(tokens, pos);
  while (pos.i < tokens.length && '+-'.includes(tokens[pos.i].value)) {
    const op = tokens[pos.i++].value;
    const right = parseMulDiv(tokens, pos);
    left = op === '+' ? left + right : left - right;
  }
  return left;
}

function parseMulDiv(tokens, pos) {
  let left = parsePow(tokens, pos);
  while (pos.i < tokens.length && '*/%'.includes(tokens[pos.i].value)) {
    const op = tokens[pos.i++].value;
    const right = parsePow(tokens, pos);
    if (op === '*') left *= right;
    else if (op === '/') left /= right;
    else left %= right;
  }
  return left;
}

function parsePow(tokens, pos) {
  let base = parseUnary(tokens, pos);
  if (pos.i < tokens.length && tokens[pos.i].value === '^') {
    pos.i++;
    const exp = parsePow(tokens, pos); // right-associative
    base = Math.pow(base, exp);
  }
  return base;
}

function parseUnary(tokens, pos) {
  if (pos.i < tokens.length && tokens[pos.i].value === '-') {
    pos.i++;
    return -parsePrimary(tokens, pos);
  }
  if (pos.i < tokens.length && tokens[pos.i].value === '+') {
    pos.i++;
    return parsePrimary(tokens, pos);
  }
  return parsePrimary(tokens, pos);
}

function parsePrimary(tokens, pos) {
  const tok = tokens[pos.i];
  if (!tok) throw new Error('Unexpected end of expression');
  if (tok.type === 'num') { pos.i++; return tok.value; }
  if (tok.value === '(') {
    pos.i++;
    const val = parseExpr(tokens, pos);
    if (!tokens[pos.i] || tokens[pos.i].value !== ')') throw new Error("Missing ')'");
    pos.i++;
    return val;
  }
  throw new Error(`Unexpected token: ${tok.value}`);
}
