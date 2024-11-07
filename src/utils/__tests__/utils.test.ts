import { compareDates, compareStrings } from '../helperFunctions';


describe('compareDates', () => {
  it('should return 0 when both dates are undefined', () => {
    expect(compareDates(undefined, undefined, 'asc')).toBe(0);
    expect(compareDates(undefined, undefined, 'desc')).toBe(0);
  });

  it('should return 1 when dateA is undefined and dateB is defined', () => {
    expect(compareDates(undefined, new Date(), 'asc')).toBe(1);
    expect(compareDates(undefined, new Date(), 'desc')).toBe(1);
  });

  it('should return -1 when dateA is defined and dateB is undefined', () => {
    expect(compareDates(new Date(), undefined, 'asc')).toBe(-1);
    expect(compareDates(new Date(), undefined, 'desc')).toBe(-1);
  });

  it('should correctly compare two dates in ascending order', () => {
    const dateA = new Date('2023-01-01');
    const dateB = new Date('2024-01-01');
    expect(compareDates(dateA, dateB, 'asc')).toBeLessThan(0);
    expect(compareDates(dateB, dateA, 'asc')).toBeGreaterThan(0);
  });

  it('should correctly compare two dates in descending order', () => {
    const dateA = new Date('2023-01-01');
    const dateB = new Date('2024-01-01');
    expect(compareDates(dateA, dateB, 'desc')).toBeGreaterThan(0);
    expect(compareDates(dateB, dateA, 'desc')).toBeLessThan(0);
  });
});

describe('compareStrings', () => {
  it('should correctly compare two strings in ascending order', () => {
    expect(compareStrings('apple', 'banana', 'asc')).toBeLessThan(0);
    expect(compareStrings('banana', 'apple', 'asc')).toBeGreaterThan(0);
  });

  it('should correctly compare two strings in descending order', () => {
    expect(compareStrings('apple', 'banana', 'desc')).toBeGreaterThan(0);
    expect(compareStrings('banana', 'apple', 'desc')).toBeLessThan(0);
  });
});
