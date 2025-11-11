import { describe, it, expect } from 'vitest';
import {
  firstOrError,
  firstOrNull,
  normalizeArray,
  normalizeString,
  normalizeNumber,
  normalizeBoolean,
  isDefined,
} from './guards';

describe('guards', () => {
  describe('firstOrError', () => {
    it('should return first element when array has items', () => {
      const result = firstOrError([1, 2, 3]);
      expect(result).toBe(1);
    });

    it('should return first element for single item array', () => {
      const result = firstOrError(['test']);
      expect(result).toBe('test');
    });

    it('should throw when array is empty', () => {
      expect(() => firstOrError([])).toThrow('Expected at least one row');
    });

    it('should throw when array is undefined', () => {
      expect(() => firstOrError(undefined)).toThrow('Expected at least one row');
    });

    it('should throw when array is null', () => {
      expect(() => firstOrError(null as unknown as undefined)).toThrow('Expected at least one row');
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

    it('should return null when array is null', () => {
      const result = firstOrNull(null as unknown as undefined);
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
      const result = normalizeArray(null as unknown as undefined);
      expect(result).toEqual([]);
    });

    it('should handle empty arrays', () => {
      const result = normalizeArray([]);
      expect(result).toEqual([]);
    });
  });

  describe('normalizeString', () => {
    it('should return string when valid', () => {
      const result = normalizeString('test');
      expect(result).toBe('test');
    });

    it('should return empty string when not a string', () => {
      expect(normalizeString(123)).toBe('');
      expect(normalizeString(null)).toBe('');
      expect(normalizeString(undefined)).toBe('');
      expect(normalizeString({})).toBe('');
    });
  });

  describe('normalizeNumber', () => {
    it('should return number when valid', () => {
      expect(normalizeNumber(123)).toBe(123);
      expect(normalizeNumber(0)).toBe(0);
      expect(normalizeNumber(-5)).toBe(-5);
    });

    it('should return 0 when NaN', () => {
      expect(normalizeNumber(NaN)).toBe(0);
    });

    it('should return 0 when not a number', () => {
      expect(normalizeNumber('123')).toBe(0);
      expect(normalizeNumber(null)).toBe(0);
      expect(normalizeNumber(undefined)).toBe(0);
    });
  });

  describe('normalizeBoolean', () => {
    it('should return boolean when valid', () => {
      expect(normalizeBoolean(true)).toBe(true);
      expect(normalizeBoolean(false)).toBe(false);
    });

    it('should return false when not a boolean', () => {
      expect(normalizeBoolean('true')).toBe(false);
      expect(normalizeBoolean(1)).toBe(false);
      expect(normalizeBoolean(null)).toBe(false);
      expect(normalizeBoolean(undefined)).toBe(false);
    });
  });

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined([])).toBe(true);
      expect(isDefined({})).toBe(true);
    });

    it('should return false for null/undefined', () => {
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });
});
