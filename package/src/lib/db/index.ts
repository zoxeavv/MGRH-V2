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
      throw new Error('SUPABASE_DB_URL environment variable is not set');
    }

    const connectionString = process.env.SUPABASE_DB_URL;
    client = postgres(connectionString, { prepare: false });
    db = drizzle(client, { schema });

    return db;
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        'Database packages not installed. Please run: npm install drizzle-orm postgres-js'
      );
    }
    throw error;
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

// Helper function to check if users table exists
export async function checkUsersTableExists(): Promise<boolean> {
  try {
    const dbInstance = await getDb();
    if (!client) {
      return false;
    }
    const result = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    return result[0]?.exists ?? false;
  } catch (error) {
    console.error('Error checking users table:', error);
    return false;
  }
}

// Export schema for use in other files
export * from './schema';
