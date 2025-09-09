import z from 'zod'

const VariantSchema = z.object({
  value: z.string().trim(),
  options: z.array(z.string().trim())
})

const VariantsSchema = z.array(VariantSchema).superRefine((variants, ctx) => {
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i]

    const isExistingVariant = variants.findIndex((v) => v.value.toLowerCase() === variant.value.toLowerCase()) !== i

    if (isExistingVariant) {
      return ctx.addIssue({
        code: 'custom',
        message: `Value ${variant.value} is already exist in variants list.`,
        path: ['variants']
      })
    }

    const isDifferentOption = variant.options.some((option, index) => {
      const isExistingOption = variant.options.findIndex((o) => o.toLowerCase() === option.toLowerCase()) !== index
      return isExistingOption
    })

    if (isDifferentOption) {
      return ctx.addIssue({
        code: 'custom',
        message: `Variant ${variant.value} has a same option name.`,
        path: ['variants']
      })
    }
  }
})

const ProductSchema = z.object({
  id: z.number(),
  publishedAt: z.coerce.date().nullable(),
  name: z.string().trim().max(500),
  basePrice: z.number().min(0),
  virtualPrice: z.number().min(0),
  brandId: z.number().positive(),
  images: z.array(z.string()),
  variants: VariantsSchema,
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
})

type VariantType = z.infer<typeof VariantSchema>

type VariantsType = z.infer<typeof VariantsSchema>

type ProductType = z.infer<typeof ProductSchema>

export { ProductSchema, VariantSchema, VariantsSchema, ProductType, VariantType, VariantsType }
