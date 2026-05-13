const { add, divide, filterUnique, parseNumber } = require('./functions');

describe('add', () => {
  it('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
  it('adds negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
  });
  it('adds zero', () => {
    expect(add(5, 0)).toBe(5);
  });
});

describe('divide', () => {
  it('divides two numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });
  it('throws on division by zero', () => {
    expect(() => divide(1, 0)).toThrow('Cannot divide by zero');
  });
  it('returns float result', () => {
    expect(divide(1, 3)).toBeCloseTo(0.333, 2);
  });
});

describe('filterUnique', () => {
  it('removes duplicates', () => {
    expect(filterUnique([1, 2, 2, 3])).toEqual([1, 2, 3]);
  });
  it('returns empty array for empty input', () => {
    expect(filterUnique([])).toEqual([]);
  });
  it('handles strings', () => {
    expect(filterUnique(['a', 'b', 'a'])).toEqual(['a', 'b']);
  });
});

describe('parseNumber', () => {
  it('parses valid string', () => {
    expect(parseNumber('42')).toBe(42);
  });
  it('throws on invalid string', () => {
    expect(() => parseNumber('abc')).toThrow('Invalid number');
  });
  it('parses decimal string', () => {
    expect(parseNumber('3.14')).toBeCloseTo(3.14);
  });
});
