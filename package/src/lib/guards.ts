/**
 * Type-safe guard utilities for database operations
 */

/**
 * Ensures at least one row exists, throws if empty
 */
export function firstOrError<T>(rows?: T[]): T {
  if (!rows?.[0]) {
    throw new Error("Expected at least one row");
  }
  return rows[0];
}

/**
 * Type guard for non-null values
 */
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Normalizes an array, ensuring it's never undefined
 */
export function normalizeArray<T>(arr: T[] | undefined | null): T[] {
  return Array.isArray(arr) ? arr : [];
}

/**
 * Normalizes a string, ensuring it's never undefined
 */
export function normalizeString(str: string | undefined | null): string {
  return str ?? "";
}

/**
 * Type guard for array with at least one element
 */
export function hasItems<T>(arr: T[] | undefined | null): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}
