# Database Setup and Migration Guide

## Prerequisites

1. Install required packages:
```bash
npm install drizzle-orm postgres-js
npm install -D drizzle-kit dotenv
```

2. Set up environment variables:
Create a `.env.local` file in the `package` directory:
```env
SUPABASE_DB_URL=postgresql://user:password@host:port/database
```

## Running Migrations

### Option 1: Push schema directly (Recommended for development)
```bash
npm run db:push
```

This will sync your schema.ts file directly to the database without creating migration files.

### Option 2: Generate and run migrations (Recommended for production)
```bash
# Generate migration files from schema changes
npm run db:generate

# Then apply migrations manually or use your migration tool
```

### Option 3: Run SQL migration file directly
If you have the migration file (`drizzle/migrations/0000_create_users_table.sql`), you can run it directly:

```bash
# Using psql
psql $SUPABASE_DB_URL -f drizzle/migrations/0000_create_users_table.sql

# Or using your database client
```

## Verifying Database Setup

### Check database status:
```bash
# If you have tsx installed
npx tsx scripts/check-db.ts
```

### Manual verification:
1. Connect to your database
2. Check if crm_users table exists:
```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'crm_users';
```

3. Verify table structure:
```sql
\d public.crm_users
```

## Troubleshooting

### Error: "relation 'crm_users' does not exist"
**Solution:** Run migrations using `npm run db:push` or execute the SQL migration file manually.

**Note:** The table was renamed from `users` to `crm_users` to avoid conflicts with Supabase's `auth.users`. If you have an existing `users` table, run the migration `0001_rename_users_to_crm_users.sql` to rename it.

### Error: "SUPABASE_DB_URL environment variable is not set"
**Solution:** Create `.env.local` file with your database connection string.

### Error: "Database packages not installed"
**Solution:** Run `npm install drizzle-orm postgres-js`

### Error: "auth.users table not found"
**Note:** This is expected if you're not using Supabase Auth. The migration will skip the foreign key constraint.

## Schema Changes

When you modify `src/lib/db/schema.ts`:

1. **Development:** Run `npm run db:push` to sync changes
2. **Production:** 
   - Run `npm run db:generate` to create migration files
   - Review the generated migration files
   - Apply migrations using your deployment process

## Database Connection

The database connection is configured in `src/lib/db/index.ts`. It uses lazy initialization to handle missing packages gracefully.

To use the database in your code:
```typescript
import { getDb, crmUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';

const db = await getDb();
const allUsers = await db.select().from(crmUsers);
```

**Note:** The table is named `crm_users` (constant: `crmUsers`) to avoid conflicts with Supabase's `auth.users` table.
