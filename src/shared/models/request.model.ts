import z from 'zod'

export const EmptyBodySchema = z.object({}).strict()

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10)
})

export type EmptyBodyType = z.infer<typeof EmptyBodySchema>

export type PaginationQueryType = z.infer<typeof PaginationQuerySchema>
