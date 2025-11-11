export function firstOrError<T>(rows?: T[]): T {
  if (!rows?.[0]) {
    throw new Error('Expected at least one row');
  }
  return rows[0];
}
