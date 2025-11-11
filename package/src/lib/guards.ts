/**
 * Type-safe guards and utilities for database operations
 */

export function firstOrError<T>(rows?: T[]): T {
  if (!rows?.[0]) {
    throw new Error('Expected at least one row');
  }
  return rows[0];
}

export function firstOrNull<T>(rows?: T[]): T | null {
  return rows?.[0] ?? null;
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function normalizeArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

export function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function normalizeNumber(value: unknown): number {
  return typeof value === 'number' && !isNaN(value) ? value : 0;
}

export function normalizeBoolean(value: unknown): boolean {
  return typeof value === 'boolean' ? value : false;
}

/**
 * Type guard for checking if a value is not null/undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
