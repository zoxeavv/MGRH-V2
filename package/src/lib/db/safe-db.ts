// Safe database utilities with error handling
// Use these functions instead of direct getDb() calls

import { getDb } from './index';
import { crmUsers } from './schema';
import { eq } from 'drizzle-orm';

/**
 * Safely execute a database operation
 * Returns null if database is not available or operation fails
 */
export async function safeDbOperation<T>(
  operation: (db: any) => Promise<T>
): Promise<T | null> {
  try {
    const db = await getDb();
    
    if (!db) {
      console.warn('Database not available for operation');
      return null;
    }

    return await operation(db);
  } catch (error) {
    console.error('Database operation failed:', error);
    return null;
  }
}

/**
 * Safely get a user by ID
 */
export async function safeGetUserById(userId: string) {
  return safeDbOperation(async (db) => {
    const users = await db
      .select()
      .from(crmUsers)
      .where(eq(crmUsers.id, userId))
      .limit(1);
    
    return users[0] || null;
  });
}

/**
 * Safely get a user by email
 */
export async function safeGetUserByEmail(email: string) {
  return safeDbOperation(async (db) => {
    const users = await db
      .select()
      .from(crmUsers)
      .where(eq(crmUsers.email, email))
      .limit(1);
    
    return users[0] || null;
  });
}
