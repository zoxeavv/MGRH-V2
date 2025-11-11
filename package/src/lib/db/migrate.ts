/**
 * Database Migration Utility
 * 
 * This file provides utilities to check migration status and run migrations.
 * Run migrations using: npm run db:push
 */

import { checkDatabaseConnection, checkUsersTableExists } from './index';

export async function verifyDatabaseSetup(): Promise<{
  connected: boolean;
  usersTableExists: boolean;
  ready: boolean;
}> {
  const connected = await checkDatabaseConnection();
  const usersTableExists = await checkUsersTableExists();
  
  return {
    connected,
    usersTableExists,
    ready: connected && usersTableExists,
  };
}

export async function logDatabaseStatus(): Promise<void> {
  const status = await verifyDatabaseSetup();
  
  console.log('Database Status:');
  console.log(`  Connected: ${status.connected ? '✅' : '❌'}`);
  console.log(`  Users table exists: ${status.usersTableExists ? '✅' : '❌'}`);
  console.log(`  Ready: ${status.ready ? '✅' : '❌'}`);
  
  if (!status.ready) {
    console.log('\n⚠️  Database not ready. Please run: npm run db:push');
  }
}
