// Database connection utility
// Note: Requires drizzle-orm and postgres-js packages to be installed
// Install with: npm install drizzle-orm postgres-js

let db: any = null;
let client: any = null;

export async function getDb() {
  if (db) {
    return db;
  }

  try {
    // Dynamic import to handle missing packages gracefully
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const postgres = (await import('postgres')).default;
    const schema = await import('./schema');

    if (!process.env.SUPABASE_DB_URL) {
      console.warn('SUPABASE_DB_URL environment variable is not set. Database operations will fail.');
      return null;
    }

    const connectionString = process.env.SUPABASE_DB_URL;
    client = postgres(connectionString, { prepare: false });
    db = drizzle(client, { schema });

    return db;
  } catch (error: any) {
    console.error('Error initializing database:', error);
    
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('Database packages not installed. Please run: npm install drizzle-orm postgres-js');
      return null;
    }
    
    // Return null instead of throwing to allow graceful degradation
    return null;
  }
}

// Helper function to check database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const dbInstance = await getDb();
    if (!client) {
      return false;
    }
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Helper function to check if crm_users table exists
export async function checkCrmUsersTableExists(): Promise<boolean> {
  try {
    const dbInstance = await getDb();
    if (!client) {
      return false;
    }
    const result = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'crm_users'
      );
    `;
    return result[0]?.exists ?? false;
  } catch (error) {
    console.error('Error checking crm_users table:', error);
    return false;
  }
}

// Legacy function name for backward compatibility (deprecated)
export async function checkUsersTableExists(): Promise<boolean> {
  return checkCrmUsersTableExists();
}

// Export schema for use in other files
export * from './schema';
