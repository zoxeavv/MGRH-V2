'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import Papa from 'papaparse';
import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { getActiveOrganization, requireSession } from '@/lib/auth/session';
import { and, eq, inArray } from 'drizzle-orm';

export const CLIENT_STATUS_VALUES = ['prospect', 'active', 'inactive', 'archived'] as const;
export type ClientStatus = (typeof CLIENT_STATUS_VALUES)[number];

export type ClientActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

const baseClientSchema = z.object({
  name: z.string().min(1, 'Client name is required.'),
  company: z.string().transform((value) => value.trim()).optional(),
  email: z
    .string()
    .email('Invalid email address.')
    .transform((value) => value.trim())
    .optional(),
  phone: z.string().transform((value) => value.trim()).optional(),
  status: z.enum(CLIENT_STATUS_VALUES).default('prospect'),
  ownerId: z
    .string()
    .uuid()
    .or(z.literal(''))
    .transform((value) => (value ? value : undefined))
    .optional(),
  tags: z.array(z.string().min(1)).optional(),
  notes: z.string().optional(),
});

const formClientSchema = baseClientSchema.extend({
  tags: z
    .string()
    .optional()
    .transform((value) =>
      value
        ? value
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : []
    ),
});

function normalizeTags(tags?: string[]) {
  if (!tags || tags.length === 0) {
    return [];
  }
  return tags;
}

export async function createClientAction(
  _prevState: ClientActionState,
  formData: FormData
): Promise<ClientActionState> {
  await requireSession();
  const organization = await getActiveOrganization();
  if (!organization) {
    return {
      status: 'error',
      message: 'No active organization found.',
    };
  }

  const parsed = formClientSchema.safeParse({
    name: formData.get('name'),
    company: formData.get('company'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    status: formData.get('status') ?? 'prospect',
    ownerId: formData.get('ownerId'),
    tags: formData.get('tags'),
    notes: formData.get('notes'),
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Invalid client payload.';
    return {
      status: 'error',
      message,
    };
  }

  const payload = parsed.data;
  await db.insert(clients).values({
    organizationId: organization.id,
    ownerId: payload.ownerId ?? null,
    name: payload.name,
    company: payload.company && payload.company.length > 0 ? payload.company : null,
    email: payload.email && payload.email.length > 0 ? payload.email : null,
    phone: payload.phone && payload.phone.length > 0 ? payload.phone : null,
    status: payload.status,
    tags: normalizeTags(payload.tags),
    notes: payload.notes && payload.notes.length > 0 ? payload.notes : null,
  });

  revalidatePath('/clients');

  return {
    status: 'success',
    message: 'Client created.',
  };
}

const importRowSchema = baseClientSchema.extend({
  email: baseClientSchema.shape.email.or(z.literal('').transform(() => undefined)),
  phone: baseClientSchema.shape.phone.or(z.literal('').transform(() => undefined)),
  tags: z.array(z.string().min(1)).optional(),
  notes: baseClientSchema.shape.notes.or(z.literal('').transform(() => undefined)),
});

type CsvRow = Record<string, string>;

function normalizeCsvRow(row: CsvRow) {
  const normalizedEntries = Object.entries(row).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      const normalizedKey = key.trim().toLowerCase();
      acc[normalizedKey] = value?.trim?.() ?? '';
      return acc;
    },
    {}
  );

  const tagsRaw = normalizedEntries.tags ?? normalizedEntries.tag ?? '';
  const tags = tagsRaw
    ? tagsRaw
        .split(/[,;]+/)
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const statusLower = normalizedEntries.status?.toLowerCase() ?? '';
  const status = CLIENT_STATUS_VALUES.includes(statusLower as ClientStatus)
    ? (statusLower as ClientStatus)
    : 'prospect';

  return {
    name: normalizedEntries.name,
    company: normalizedEntries.company || undefined,
    email: normalizedEntries.email || undefined,
    phone: normalizedEntries.phone || undefined,
    status,
    tags,
    notes: normalizedEntries.notes || undefined,
  };
}

export async function importClientsAction(
  _prevState: ClientActionState,
  formData: FormData
): Promise<ClientActionState> {
  await requireSession();
  const organization = await getActiveOrganization();
  if (!organization) {
    return {
      status: 'error',
      message: 'No active organization found.',
    };
  }

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return {
      status: 'error',
      message: 'Please upload a non-empty CSV file.',
    };
  }

  const buffer = await file.arrayBuffer();
  const text = new TextDecoder().decode(buffer);
  const parsed = Papa.parse<CsvRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim().toLowerCase(),
  });

  if (parsed.errors.length > 0) {
    return {
      status: 'error',
      message: parsed.errors[0]?.message ?? 'Failed to parse CSV file.',
    };
  }

  const validRecords = [];
  let skipped = 0;
  for (const row of parsed.data) {
    const normalized = normalizeCsvRow(row);
    const validation = importRowSchema.safeParse(normalized);
    if (validation.success) {
      const payload = validation.data;
      validRecords.push({
        organizationId: organization.id,
        ownerId: payload.ownerId ?? null,
        name: payload.name,
        company: payload.company && payload.company.length > 0 ? payload.company : null,
        email: payload.email && payload.email.length > 0 ? payload.email : null,
        phone: payload.phone && payload.phone.length > 0 ? payload.phone : null,
        status: CLIENT_STATUS_VALUES.includes(payload.status) ? payload.status : 'prospect',
        tags: normalizeTags(payload.tags),
        notes: payload.notes && payload.notes.length > 0 ? payload.notes : null,
      });
    } else {
      skipped += 1;
    }
  }

  if (validRecords.length === 0) {
    return {
      status: 'error',
      message: 'No valid client records found in the CSV.',
    };
  }

  await db.insert(clients).values(validRecords);
  revalidatePath('/clients');

  const importedCount = validRecords.length;
  const summary =
    skipped > 0
      ? `Imported ${importedCount} client${importedCount === 1 ? '' : 's'} (skipped ${skipped}).`
      : `Imported ${importedCount} client${importedCount === 1 ? '' : 's'}.`;

  return {
    status: 'success',
    message: summary,
  };
}

export async function bulkUpdateClientStatus(
  clientIds: string[],
  status: ClientStatus
): Promise<ClientActionState> {
  if (clientIds.length === 0) {
    return {
      status: 'error',
      message: 'Select at least one client to update.',
    };
  }

  await requireSession();
  const organization = await getActiveOrganization();
  if (!organization) {
    return {
      status: 'error',
      message: 'No active organization found.',
    };
  }

  await db
    .update(clients)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(clients.organizationId, organization.id),
        inArray(clients.id, clientIds)
      )
    );

  revalidatePath('/clients');

  return {
    status: 'success',
    message: `Updated ${clientIds.length} client${clientIds.length === 1 ? '' : 's'} to ${status}.`,
  };
}
