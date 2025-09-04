import z from 'zod'

const SKUSchema = z.object({
  id: z.number(),
  value: z.string().trim(),
  price: z.number().min(0),
  stock: z.number().min(0),
  image: z.string(),
  productId: z.number(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
})

const UpsertSKUBodySchema = SKUSchema.pick({
  value: true,
  price: true,
  stock: true,
  image: true
})

type SKUSchemaType = z.infer<typeof SKUSchema>

type UpsertSKUBodyType = z.infer<typeof UpsertSKUBodySchema>

export { SKUSchema, UpsertSKUBodySchema, SKUSchemaType, UpsertSKUBodyType }
