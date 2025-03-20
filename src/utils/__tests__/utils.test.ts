import {
  addCacheBuster,
  compareDates,
  compareStrings,
  startWithProductInterop
} from '../helperFunctions';

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

  test('startWithProductInterop function', () => {
    expect(startWithProductInterop('prod-interop')).toBe(true);
    expect(startWithProductInterop('OTHER12345')).toBe(false);
    expect(startWithProductInterop(undefined)).toBe(undefined);
    expect(startWithProductInterop('')).toBe(false);
  });

  it('should return undefined if no URL is provided', () => {
    expect(addCacheBuster()).toBeUndefined();
  });

  it('should add a cache-busting parameter to a URL without query parameters', () => {
    const url = 'https://example.com/logo';
    const result = addCacheBuster(url);
    expect(result).toMatch(/https:\/\/example\.com\/logo\?t=\d+/);
  });

  it('should add a cache-busting parameter to a URL with existing query parameters', () => {
    const url = 'https://example.com/logo?param1=value1';
    const result = addCacheBuster(url);
    expect(result).toMatch(/https:\/\/example\.com\/logo\?param1=value1&t=\d+/);
  });

  it('should replace an existing cache-busting parameter', () => {
    const url = 'https://example.com/logo?param1=value1&t=123456';
    const result = addCacheBuster(url);
    expect(result).toMatch(/https:\/\/example\.com\/logo\?param1=value1&t=\d+/);
  });

  it('should handle URLs with multiple query parameters correctly', () => {
    const url = 'https://example.com/logo?param1=value1&param2=value2&t=123456';
    const result = addCacheBuster(url);
    expect(result).toMatch(/https:\/\/example\.com\/logo\?param1=value1&param2=value2&t=\d+/);
  });

  it('should handle URLs with the t parameter not being the last one', () => {
    const url = 'https://example.com/logo?t=value1&scope=123456&param2=value2';
    const result = addCacheBuster(url);
    expect(result).toMatch(/https:\/\/example\.com\/logo\?scope=123456&param2=value2&t=\d+/);
  });
});
