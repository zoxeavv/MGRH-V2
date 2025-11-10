import { z } from 'zod';

const offerItemInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
});

export const createOfferFromTemplateSchema = z.object({
  clientId: z.string().uuid(),
  templateId: z.string().uuid(),
  values: z.object({
    title: z.string().min(1),
    summary: z.string().optional(),
    items: z.array(offerItemInputSchema).min(1),
  }),
});

export const duplicateVersionSchema = z.object({
  offerId: z.string().uuid(),
});

export const updateItemSchema = z.object({
  offerId: z.string().uuid(),
  itemId: z.string().uuid(),
  quantity: z.number().min(0).optional(),
  unitPrice: z.number().min(0).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const publishOfferSchema = z.object({
  offerId: z.string().uuid(),
  isPublished: z.boolean(),
});

export type OfferItemInput = z.infer<typeof offerItemInputSchema>;

