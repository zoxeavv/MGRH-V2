import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseCSV } from './import-actions';

// Mock the logger
vi.mock('@/lib/logger', () => ({
  withServerActionLogging: <T extends unknown[], R>(
    _name: string,
    fn: (...args: T) => Promise<R>
  ) => fn,
}));

describe('CSV import', () => {
  describe('parser', () => {
    it('should handle comma-delimited CSV', async () => {
      const csv = `name,email,company
John Doe,john@example.com,Acme Inc
Jane Smith,jane@example.com,Tech Corp`;

      const result = await parseCSV(csv, 'test.csv');
      expect(result.validRows).toHaveLength(2);
      expect(result.validRows[0]?.name).toBe('John Doe');
      expect(result.validRows[0]?.email).toBe('john@example.com');
    });

    it('should handle semicolon-delimited CSV', async () => {
      const csv = `name;email;company
John Doe;john@example.com;Acme Inc`;

      const result = await parseCSV(csv, 'test.csv');
      expect(result.validRows).toHaveLength(1);
      expect(result.validRows[0]?.name).toBe('John Doe');
    });

    it('should handle tab-delimited CSV', async () => {
      const csv = `name\temail\tcompany
John Doe\tjohn@example.com\tAcme Inc`;

      const result = await parseCSV(csv, 'test.csv');
      expect(result.validRows).toHaveLength(1);
    });

    it('should trim fields', async () => {
      const csv = `name,email
  John Doe  ,  john@example.com  `;

      const result = await parseCSV(csv, 'test.csv');
      expect(result.validRows[0]?.name).toBe('John Doe');
      expect(result.validRows[0]?.email).toBe('john@example.com');
    });

    it('should handle quoted fields', async () => {
      const csv = `name,email
"John Doe","john@example.com"`;

      const result = await parseCSV(csv, 'test.csv');
      expect(result.validRows[0]?.name).toBe('John Doe');
    });
  });

  describe('policy validation', () => {
    it('should reject oversize files', async () => {
      const largeContent = 'x'.repeat(6 * 1024 * 1024); // 6MB
      await expect(parseCSV(largeContent, 'test.csv')).rejects.toThrow('5MB');
    });

    it('should reject missing header', async () => {
      await expect(parseCSV('', 'test.csv')).rejects.toThrow('empty');
    });

    it('should reject rows without name or company', async () => {
      const csv = `name,email
,john@example.com`;

      const result = await parseCSV(csv, 'test.csv');
      expect(result.validRows).toHaveLength(0);
      expect(result.invalidRows).toHaveLength(1);
      expect(result.invalidRows[0]?.errors[0]).toContain('name or company');
    });

    it('should accept row with only name', async () => {
      const csv = `name,email
John Doe,`;

      const result = await parseCSV(csv, 'test.csv');
      expect(result.validRows).toHaveLength(1);
      expect(result.validRows[0]?.name).toBe('John Doe');
    });

    it('should accept row with only company', async () => {
      const csv = `name,company
,Acme Inc`;

      const result = await parseCSV(csv, 'test.csv');
      expect(result.validRows).toHaveLength(1);
      expect(result.validRows[0]?.company).toBe('Acme Inc');
    });
  });

  describe('normalization', () => {
    it('should parse tags pipe-separated', async () => {
      const csv = `name,tags
John Doe,"tag1|tag2|tag3"`;

      const result = await parseCSV(csv, 'test.csv');
      expect(result.validRows[0]?.tags).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should handle empty tags', async () => {
      const csv = `name,tags
John Doe,`;

      const result = await parseCSV(csv, 'test.csv');
      expect(result.validRows[0]?.tags).toEqual([]);
    });

    it('should omit undefined keys', async () => {
      const csv = `name,email
John Doe,john@example.com`;

      const result = await parseCSV(csv, 'test.csv');
      const row = result.validRows[0];
      expect(row).not.toHaveProperty('phone');
      expect(row).not.toHaveProperty('company');
    });
  });
});
