#!/usr/bin/env tsx
/**
 * Database Health Check Script
 * 
 * Usage: npx tsx scripts/check-db.ts
 * 
 * Checks database connection and table existence
 */

import { verifyDatabaseSetup } from '../src/lib/db/migrate';

async function main() {
  console.log('Checking database status...\n');
  
  const status = await verifyDatabaseSetup();
  
  console.log('Database Status:');
  console.log(`  Connected: ${status.connected ? '✅' : '❌'}`);
  console.log(`  CRM Users table exists: ${status.crmUsersTableExists ? '✅' : '❌'}`);
  console.log(`  Ready: ${status.ready ? '✅' : '❌'}`);
  
  if (!status.connected) {
    console.error('\n❌ Database connection failed. Check SUPABASE_DB_URL environment variable.');
    process.exit(1);
  }
  
  if (!status.crmUsersTableExists) {
    console.error('\n❌ CRM Users table does not exist. Run: npm run db:push');
    process.exit(1);
  }
  
  console.log('\n✅ Database is ready!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Error checking database:', error);
  process.exit(1);
});
