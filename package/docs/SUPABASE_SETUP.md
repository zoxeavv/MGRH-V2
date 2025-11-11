# Supabase Setup Checklist

1. **Environment variables**
   - Copy `.env.example` to `.env.local`.
   - Populate `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_DB_URL`.
   - Mirror the same values in Vercel Project Settings → Environment Variables so preview/production builds can reach Supabase.

2. **Database**
   - Run `pnpm db:push` to create tables and enums in your Supabase Postgres instance.
   - Apply the seed migration (`drizzle/migrations/0001_seed_initial_clients.sql`) to load demo organizations, users, and clients:  
     `psql "$SUPABASE_DB_URL" -f drizzle/migrations/0001_seed_initial_clients.sql`

3. **Storage & auth policies**
   - Enable email/password auth in Supabase.
   - Configure Row-Level Security policies to scope queries by `organization_id`.

4. **Local verification**
   - Start the app with `pnpm dev` and confirm you can register/login, see seeded clients, and perform bulk actions.
