import { z } from 'zod';

export const templateFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  category: z.string().optional(),
  content: z.string().min(1),
  tags: z.array(z.string().trim().min(1)).optional(),
  previewImageUrl: z.string().url().optional(),
  isDraft: z.boolean().optional(),
});

export const attachAssetSchema = z.object({
  templateId: z.string().uuid(),
  url: z.string().url(),
  type: z.string().min(1),
});

export const publishTemplateSchema = z.object({
  id: z.string().uuid(),
  isDraft: z.boolean(),
});

