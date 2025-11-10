import { z } from 'zod';

const trimOrUndefined = (value: string | undefined | null) => {
  if (value === undefined || value === null) return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

export const clientStatusValues = ['lead', 'active', 'inactive', 'archived'] as const;
export const taskStatusValues = ['todo', 'in_progress', 'done'] as const;

export const contactSchema = z
  .object({
    name: z.string().min(1),
    email: z
      .string()
      .email()
      .optional()
      .transform(trimOrUndefined),
    phone: z
      .string()
      .optional()
      .transform(trimOrUndefined),
    title: z
      .string()
      .optional()
      .transform(trimOrUndefined),
  })
  .transform((value) => {
    return Object.fromEntries(
      Object.entries(value).filter(([, val]) => val !== undefined && val !== null && val !== ''),
    );
  });

export const createClientSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(clientStatusValues).default('lead'),
  contacts: z.array(contactSchema).optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});

export const updateClientStatusSchema = z.object({
  clientId: z.string().uuid(),
  status: z.enum(clientStatusValues),
});

export const addNoteSchema = z.object({
  clientId: z.string().uuid(),
  content: z.string().min(1),
});

export const addTaskSchema = z.object({
  clientId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z
    .string()
    .datetime()
    .optional(),
  assigneeProfileId: z.string().uuid().optional(),
});

export const updateTaskStatusSchema = z.object({
  taskId: z.string().uuid(),
  status: z.enum(taskStatusValues),
});

export const importClientRowSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  tags: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value.filter(Boolean).map((tag) => tag.trim()).filter(Boolean);
      return value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }),
  status: z.enum(clientStatusValues).optional(),
});

export const importClientsSchema = z.array(importClientRowSchema);

export type ClientStatus = (typeof clientStatusValues)[number];
export type TaskStatus = (typeof taskStatusValues)[number];

