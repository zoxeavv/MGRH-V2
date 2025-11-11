# Global Debug Strategy: PostgresError and Client Component Issues

## Problem Analysis

### Issue 1: PostgresError - "relation 'users' does not exist"
**Error Location:** RootLayout, DashboardLayout, DashboardPage  
**Root Cause:** The database migration for the `users` table exists but hasn't been executed, OR the table was never created in the database.

**Evidence:**
- Migration file exists: `package/drizzle/migrations/0000_create_users_table.sql`
- Schema file (`package/src/lib/db/schema.ts`) only contains `organizations` table, not `users`
- No database connection/query code found in the codebase (suggests queries might be happening elsewhere or via middleware)

### Issue 2: Client Component Error - useState in Server Component
**Error Location:** `useToast` hook, `Toaster` component, `Providers` component  
**Root Cause:** Components using React hooks (`useState`) are missing the `"use client"` directive, OR these components don't exist and are being imported from missing files.

**Evidence:**
- Error mentions: `./src/hooks/use-toast.ts`, `./src/components/ui/toaster.tsx`, `./src/components/providers.tsx`
- These files don't exist in the codebase
- RootLayout (`package/src/app/layout.tsx`) already has `"use client"` but might be importing server components

## Debug Strategy

### Phase 1: Database Migration Issues

#### Step 1.1: Verify Database Connection
- [ ] Check if `SUPABASE_DB_URL` environment variable is set
- [ ] Verify database connection is working
- [ ] Confirm which database schema is being used

#### Step 1.2: Check Migration Status
- [ ] Verify if migrations have been run: Check migration history in database
- [ ] Run pending migrations if needed: `npm run db:push` or manual migration execution
- [ ] Verify `users` table exists: Query `SELECT * FROM information_schema.tables WHERE table_name = 'users';`

#### Step 1.3: Schema Synchronization
- [ ] Update `schema.ts` to include `users` table definition (currently missing)
- [ ] Ensure schema matches migration file
- [ ] Regenerate migrations if schema changed: `npm run db:generate`

#### Step 1.4: Find Database Query Locations
- [ ] Search for any middleware or API routes that might query `users` table
- [ ] Check for server actions or API handlers
- [ ] Look for authentication/user fetching logic

### Phase 2: Client Component Issues

#### Step 2.1: Identify Missing Components
- [ ] Create missing `src/hooks/use-toast.ts` hook (if needed)
- [ ] Create missing `src/components/ui/toaster.tsx` component (if needed)
- [ ] Create missing `src/components/providers.tsx` component (if needed)
- [ ] OR remove imports if these components aren't needed

#### Step 2.2: Fix Client Component Directives
- [ ] Ensure all components using hooks have `"use client"` at the top
- [ ] Check `Profile.tsx` - already has hooks, verify it's used in client components only
- [ ] Verify `RootLayout` and `DashboardLayout` are properly marked

#### Step 2.3: Component Architecture Review
- [ ] Separate server and client components properly
- [ ] Move client-side logic to dedicated client components
- [ ] Use server components for data fetching where possible

### Phase 3: Implementation Plan

#### Immediate Actions (Priority 1)
1. **Create/Update Database Schema**
   - Add `users` table to `schema.ts` to match migration
   - Ensure schema is complete and matches database expectations

2. **Run Database Migrations**
   - Execute migration to create `users` table
   - Verify table creation success

3. **Fix Missing Component Imports**
   - Either create missing components or remove unused imports
   - Ensure all imported components exist

#### Short-term Actions (Priority 2)
4. **Add Error Boundaries**
   - Create error boundary components for better error handling
   - Add fallback UI for database errors

5. **Add Database Connection Utility**
   - Create a centralized database connection file
   - Add connection pooling and error handling
   - Add environment variable validation

6. **Add Migration Scripts**
   - Create script to check migration status
   - Add script to run migrations automatically
   - Add database health check endpoint

#### Long-term Actions (Priority 3)
7. **Add Type Safety**
   - Ensure all database queries are typed
   - Add runtime validation for database responses

8. **Add Logging and Monitoring**
   - Add structured logging for database errors
   - Add monitoring for database connection issues
   - Track migration execution

9. **Documentation**
   - Document database setup process
   - Document migration workflow
   - Add troubleshooting guide

## Implementation Checklist

### Database Fixes
- [ ] Add `users` table to `schema.ts`
- [ ] Create database connection utility (`src/lib/db/index.ts`)
- [ ] Add environment variable validation
- [ ] Run migrations: `npm run db:push`
- [ ] Verify `users` table exists in database
- [ ] Add error handling for database queries

### Component Fixes
- [ ] Create missing `use-toast` hook (or remove import)
- [ ] Create missing `Toaster` component (or remove import)
- [ ] Create missing `Providers` component (or remove import)
- [ ] Verify all client components have `"use client"` directive
- [ ] Test component rendering

### Testing
- [ ] Test database connection
- [ ] Test migration execution
- [ ] Test component rendering
- [ ] Test error scenarios
- [ ] Verify no console errors

## Error Prevention

1. **Pre-commit Hooks**
   - Add check to ensure migrations are up to date
   - Verify schema matches migrations

2. **CI/CD Checks**
   - Run migrations in CI before tests
   - Verify database schema matches code

3. **Development Guidelines**
   - Always run migrations after schema changes
   - Always add `"use client"` to components using hooks
   - Verify imports before committing

## Quick Fix Commands

```bash
# Check database connection
# (Add script to verify SUPABASE_DB_URL is set and connection works)

# Run migrations
npm run db:push

# Generate new migrations if schema changed
npm run db:generate

# Check for missing files
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "use-toast\|toaster\|providers" | grep -v node_modules
```

## Implementation Status

### ✅ Completed
1. **Schema Updated**: Added `users` table to `src/lib/db/schema.ts`
2. **Database Connection Utility**: Created `src/lib/db/index.ts` with:
   - Lazy initialization to handle missing packages
   - Connection checking functions
   - Table existence verification
3. **Migration File**: Created `drizzle/migrations/0000_create_users_table.sql`
4. **Error Boundary**: Created `src/app/components/ErrorBoundary.tsx` for graceful error handling
5. **Client Component Fix**: Added `"use client"` directive to `Profile.tsx`
6. **Migration Utilities**: Created `src/lib/db/migrate.ts` and `scripts/check-db.ts`
7. **Documentation**: Created `DATABASE_SETUP.md` with setup instructions

### 🔄 Next Steps (Action Required)

1. **Install Database Packages**:
   ```bash
   cd package
   npm install drizzle-orm postgres-js
   npm install -D drizzle-kit dotenv
   ```

2. **Set Environment Variable**:
   Create `package/.env.local`:
   ```env
   SUPABASE_DB_URL=postgresql://user:password@host:port/database
   ```

3. **Run Migrations**:
   ```bash
   npm run db:push
   ```

4. **Verify Setup**:
   ```bash
   npx tsx scripts/check-db.ts
   ```

5. **Wrap Root Layout with Error Boundary** (Optional but recommended):
   Update `src/app/layout.tsx` to include ErrorBoundary for better error handling

### 🔍 Still Investigating

The error mentions missing components (`use-toast`, `Toaster`, `Providers`) that don't exist in the codebase. These might be:
- From a missing dependency
- Referenced in build cache (try clearing `.next` folder)
- From a different branch/version

**To investigate further:**
```bash
# Clear Next.js cache
rm -rf .next

# Check for missing dependencies
npm install

# Restart dev server
npm run dev
```

## Quick Fix Summary

**For PostgresError:**
1. Install packages: `npm install drizzle-orm postgres-js drizzle-kit dotenv`
2. Set `SUPABASE_DB_URL` in `.env.local`
3. Run migrations: `npm run db:push`

**For Client Component Error:**
- ✅ Fixed: Added `"use client"` to Profile.tsx
- If errors persist, check for other components using hooks without the directive
- Clear `.next` cache and restart dev server
