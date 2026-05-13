function add(a, b) {
  return a + b;
}

function divide(a, b) {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
}

function filterUnique(arr) {
  return [...new Set(arr)];
}

function parseNumber(str) {
  const num = Number(str);
  if (isNaN(num)) throw new Error('Invalid number');
  return num;
}

module.exports = { add, divide, filterUnique, parseNumber };
