'use server';

import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { eq, and, or, ilike } from 'drizzle-orm';
import { firstOrError, normalizeArray, normalizeString } from '@/lib/guards';
import { withServerActionLogging } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const csvRowSchema = z.object({
  name: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  tags: z.string().optional(),
}).refine(
  (data) => data.name || data.company,
  { message: 'Either name or company is required' }
);

export interface CSVParseResult {
  validRows: Array<{
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    tags: string[];
  }>;
  invalidRows: Array<{
    row: number;
    data: Record<string, string>;
    errors: string[];
  }>;
}

export const parseCSV = withServerActionLogging(
  'parseCSV',
  async (fileContent: string, filename: string): Promise<CSVParseResult> => {
    // Validate file size
    if (fileContent.length > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    const lines = fileContent.split(/\r?\n/).filter((line) => line.trim());
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    // Detect delimiter
    const firstLine = lines[0];
    if (!firstLine) {
      throw new Error('CSV header is missing');
    }
    
    let delimiter = ',';
    if (firstLine.includes(';')) delimiter = ';';
    else if (firstLine.includes('\t')) delimiter = '\t';

    // Parse header
    const headers = firstLine.split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ''));
    
    if (headers.length === 0) {
      throw new Error('CSV header is required');
    }

    const validRows: CSVParseResult['validRows'] = [];
    const invalidRows: CSVParseResult['invalidRows'] = [];

    // Parse rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line || !line.trim()) continue;

      const values = line.split(delimiter).map((v) => {
        let trimmed = v.trim().replace(/^"|"$/g, '');
        return trimmed;
      });

      const rowData: Record<string, string> = {};
      headers.forEach((header, idx) => {
        const value = values[idx];
        if (value !== undefined && value !== '') {
          rowData[header.toLowerCase()] = value;
        }
      });

      // Validate row
      const validation = csvRowSchema.safeParse(rowData);
      
      if (!validation.success) {
        invalidRows.push({
          row: i + 1,
          data: rowData,
          errors: validation.error.errors.map((e) => e.message),
        });
        continue;
      }

      // Normalize tags
      const tagsStr = rowData.tags || '';
      const tags = tagsStr
        .split('|')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      // Omit undefined keys
      const validRow: CSVParseResult['validRows'][0] = {
        name: normalizeString(validation.data.name || ''),
        tags: normalizeArray(tags),
      };

      if (validation.data.company) {
        validRow.company = normalizeString(validation.data.company);
      }
      if (validation.data.email) {
        validRow.email = normalizeString(validation.data.email);
      }
      if (validation.data.phone) {
        validRow.phone = normalizeString(validation.data.phone);
      }

      validRows.push(validRow);
    }

    return { validRows, invalidRows };
  }
);

interface ImportClientsInput {
  organizationId: string;
  rows: CSVParseResult['validRows'];
  ownerId?: string | undefined;
}

export const importClients = withServerActionLogging(
  'importClients',
  async (input: ImportClientsInput) => {
    if (!Array.isArray(input.rows) || input.rows.length === 0) {
      throw new Error('No valid rows to import');
    }

    // Check for duplicates (name + email combination)
    const existingClients = await db
      .select()
      .from(clients)
      .where(eq(clients.organizationId, input.organizationId));

    const normalizedExisting = normalizeArray(existingClients);
    const duplicates: string[] = [];

    const clientsToInsert = input.rows
      .filter((row) => {
        const isDuplicate = normalizedExisting.some((existing) => {
          const nameMatch = existing.name.toLowerCase() === row.name.toLowerCase();
          const emailMatch = row.email && existing.email && existing.email.toLowerCase() === row.email.toLowerCase();
          return nameMatch && (emailMatch || (!row.email && !existing.email));
        });

        if (isDuplicate) {
          duplicates.push(row.name);
          return false;
        }
        return true;
      })
      .map((row) => ({
        organizationId: input.organizationId,
        name: normalizeString(row.name),
        company: row.company ? normalizeString(row.company) : null,
        email: row.email ? normalizeString(row.email) : null,
        phone: row.phone ? normalizeString(row.phone) : null,
        status: 'active' as const,
        tags: normalizeArray(row.tags),
        notes: [],
        files: [],
        ownerId: input.ownerId || null,
      }));

    if (clientsToInsert.length === 0) {
      throw new Error('All rows are duplicates or invalid');
    }

    const result = await db
      .insert(clients)
      .values(clientsToInsert)
      .returning();

    const inserted = normalizeArray(result);
    
    revalidatePath('/clients');
    
    return {
      imported: inserted.length,
      duplicates: duplicates.length,
      total: input.rows.length,
    };
  }
);
