import {
  firstOrError,
  firstOrNull,
  normalizeArray,
  normalizeString,
  normalizeNumber,
  isDefined,
} from './guards';

describe('guards', () => {
  describe('firstOrError', () => {
    it('should return first element when array has items', () => {
      const result = firstOrError([1, 2, 3]);
      expect(result).toBe(1);
    });

    it('should throw when array is empty', () => {
      expect(() => firstOrError([])).toThrow('Expected at least one row');
    });

    it('should throw when array is undefined', () => {
      expect(() => firstOrError(undefined)).toThrow('Expected at least one row');
    });
  });

  describe('firstOrNull', () => {
    it('should return first element when array has items', () => {
      const result = firstOrNull([1, 2, 3]);
      expect(result).toBe(1);
    });

    it('should return null when array is empty', () => {
      const result = firstOrNull([]);
      expect(result).toBeNull();
    });

    it('should return null when array is undefined', () => {
      const result = firstOrNull(undefined);
      expect(result).toBeNull();
    });
  });

  describe('normalizeArray', () => {
    it('should return array when valid', () => {
      const result = normalizeArray([1, 2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return empty array when undefined', () => {
      const result = normalizeArray(undefined);
      expect(result).toEqual([]);
    });

    it('should return empty array when null', () => {
      const result = normalizeArray(null);
      expect(result).toEqual([]);
    });
  });

  describe('normalizeString', () => {
    it('should return string when valid', () => {
      const result = normalizeString('test');
      expect(result).toBe('test');
    });

    it('should return empty string when not a string', () => {
      const result = normalizeString(123);
      expect(result).toBe('');
    });
  });

  describe('normalizeNumber', () => {
    it('should return number when valid', () => {
      const result = normalizeNumber(123);
      expect(result).toBe(123);
    });

    it('should return 0 when NaN', () => {
      const result = normalizeNumber(NaN);
      expect(result).toBe(0);
    });
  });

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
    });

    it('should return false for null/undefined', () => {
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });
});
