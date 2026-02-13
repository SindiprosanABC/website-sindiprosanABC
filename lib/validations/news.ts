import { z } from 'zod';

// News tag schema - now dynamic, fetched from database
export const newsTagSchema = z.string().min(1, 'Tag é obrigatória');

// Schema for creating a news article
export const createNewsSchema = z.object({
  title: z
    .string()
    .min(10, 'O título deve ter no mínimo 10 caracteres')
    .max(200, 'O título deve ter no máximo 200 caracteres'),
  description: z
    .string()
    .min(20, 'A descrição deve ter no mínimo 20 caracteres')
    .max(500, 'A descrição deve ter no máximo 500 caracteres'),
  content: z
    .string()
    .min(50, 'O conteúdo deve ter no mínimo 50 caracteres'),
  tag: newsTagSchema,
  category: z.string().default('medicina'),
  imageSrc: z.string().min(1, 'A imagem é obrigatória'),
  publishedAt: z.coerce.date(),
  isActive: z.boolean().default(true),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;

// Schema for updating a news article
export const updateNewsSchema = z.object({
  _id: z.string().min(1, 'ID da notícia é obrigatório'),
  title: z
    .string()
    .min(10, 'O título deve ter no mínimo 10 caracteres')
    .max(200, 'O título deve ter no máximo 200 caracteres')
    .optional(),
  description: z
    .string()
    .min(20, 'A descrição deve ter no mínimo 20 caracteres')
    .max(500, 'A descrição deve ter no máximo 500 caracteres')
    .optional(),
  content: z
    .string()
    .min(50, 'O conteúdo deve ter no mínimo 50 caracteres')
    .optional(),
  tag: newsTagSchema.optional(),
  category: z.string().optional(),
  imageSrc: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;

// Schema for deleting a news article
export const deleteNewsSchema = z.object({
  _id: z.string().min(1, 'ID da notícia é obrigatório'),
});

export type DeleteNewsInput = z.infer<typeof deleteNewsSchema>;
