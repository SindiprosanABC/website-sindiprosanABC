import { z } from 'zod';

export const createTagSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .refine((val) => val.trim().length > 0, 'Nome é obrigatório'),
  slug: z.string().optional(), // Auto-generated
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve ser hexadecimal (#RRGGBB)'),
  description: z.string().max(200).optional(),
  order: z.number().int().positive().optional(), // Auto if omitted
  isActive: z.boolean().default(true),
});

export const updateTagSchema = z.object({
  _id: z.string().min(1, 'ID da tag é obrigatório'),
  name: z.string().min(3).max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  description: z.string().max(200).optional(),
  order: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export const deleteTagSchema = z.object({
  _id: z.string().min(1, 'ID da tag é obrigatório'),
  force: z.boolean().optional(), // Force delete even if in use
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type DeleteTagInput = z.infer<typeof deleteTagSchema>;
