/**
 * Database Migration Utility
 * 
 * This file provides utilities to check migration status and run migrations.
 * Run migrations using: npm run db:push
 */

import { checkDatabaseConnection, checkCrmUsersTableExists } from './index';

export async function verifyDatabaseSetup(): Promise<{
  connected: boolean;
  crmUsersTableExists: boolean;
  ready: boolean;
}> {
  const connected = await checkDatabaseConnection();
  const crmUsersTableExists = await checkCrmUsersTableExists();
  
  return {
    connected,
    crmUsersTableExists,
    ready: connected && crmUsersTableExists,
  };
}

export async function logDatabaseStatus(): Promise<void> {
  const status = await verifyDatabaseSetup();
  
  console.log('Database Status:');
  console.log(`  Connected: ${status.connected ? '✅' : '❌'}`);
  console.log(`  CRM Users table exists: ${status.crmUsersTableExists ? '✅' : '❌'}`);
  console.log(`  Ready: ${status.ready ? '✅' : '❌'}`);
  
  if (!status.ready) {
    console.log('\n⚠️  Database not ready. Please run: npm run db:push');
  }
}
