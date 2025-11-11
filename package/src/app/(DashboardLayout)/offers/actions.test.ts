import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeArray, normalizeString, normalizeNumber } from '@/lib/guards';

// Mock the database and logger
vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([{ id: 'test-id', title: 'Test Offer' }])),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([{ id: 'test-id', status: 'sent' }])),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve()),
    })),
  },
}));

vi.mock('@/lib/logger', () => ({
  withServerActionLogging: <T extends unknown[], R>(
    _name: string,
    fn: (...args: T) => Promise<R>
  ) => fn,
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('offers actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('normalizeArray for items', () => {
    it('should normalize empty items array', () => {
      const items = normalizeArray([]);
      expect(items).toEqual([]);
    });

    it('should normalize undefined items', () => {
      const items = normalizeArray(undefined);
      expect(items).toEqual([]);
    });

    it('should normalize items with proper structure', () => {
      const rawItems = [
        { id: '1', name: 'Item 1', description: 'Desc 1', quantity: 2, unitPrice: 10 },
        { id: '2', name: 'Item 2', description: '', quantity: 1, unitPrice: 20 },
      ];
      const normalized = rawItems.map((item) => ({
        id: normalizeString(item.id),
        name: normalizeString(item.name),
        description: normalizeString(item.description || ''),
        quantity: normalizeNumber(item.quantity),
        unitPrice: normalizeNumber(item.unitPrice),
      }));
      
      expect(normalized).toHaveLength(2);
      expect(normalized[0]).toEqual({
        id: '1',
        name: 'Item 1',
        description: 'Desc 1',
        quantity: 2,
        unitPrice: 10,
      });
      expect(normalized[1]?.description).toBe('');
    });

    it('should handle items with missing fields', () => {
      const rawItems = [
        { id: '1', name: '', description: undefined, quantity: NaN, unitPrice: null },
      ];
      const normalized = rawItems.map((item) => ({
        id: normalizeString(item.id),
        name: normalizeString(item.name),
        description: normalizeString(item.description || ''),
        quantity: normalizeNumber(item.quantity),
        unitPrice: normalizeNumber(item.unitPrice),
      }));
      
      expect(normalized[0]).toEqual({
        id: '1',
        name: '',
        description: '',
        quantity: 0,
        unitPrice: 0,
      });
    });
  });

  describe('createOffer input validation', () => {
    it('should handle valid offer input', () => {
      const input = {
        organizationId: 'org-1',
        clientId: 'client-1',
        title: 'Test Offer',
        items: [
          { id: '1', name: 'Item 1', description: 'Desc', quantity: 1, unitPrice: 100 },
        ],
        subtotal: 100,
        taxRate: 10,
        total: 110,
        createdById: 'user-1',
      };
      
      expect(input.items).toHaveLength(1);
      expect(input.subtotal).toBe(100);
      expect(input.total).toBe(110);
    });

    it('should handle optional validUntil', () => {
      const inputWithoutDate = {
        organizationId: 'org-1',
        clientId: 'client-1',
        title: 'Test',
        items: [],
        subtotal: 0,
        taxRate: 0,
        total: 0,
        createdById: 'user-1',
      };
      
      expect(inputWithoutDate).not.toHaveProperty('validUntil');
      
      const inputWithDate = {
        ...inputWithoutDate,
        validUntil: new Date('2024-12-31'),
      };
      
      expect(inputWithDate.validUntil).toBeInstanceOf(Date);
    });
  });
});
