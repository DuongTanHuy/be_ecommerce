import { OrderBy, SortBy } from 'src/shared/constants/other.constant'
import { BrandIncludeTranslationSchema } from 'src/shared/models/shared-brand.model'
import { CategoryIncludeTranslationSchema } from 'src/shared/models/shared-category.model'
import { ProductTranslationSchema } from 'src/shared/models/shared-product-translation.model'
import { ProductSchema, VariantsType } from 'src/shared/models/shared-product.model'
import { SKUSchema, UpsertSKUBodySchema } from 'src/shared/models/shared-sku.model'
import z from 'zod'

function generateSKUs(variants: VariantsType) {
  // Hàm hỗ trợ để tạo tất cả tổ hợp
  function getCombinations(arrays: string[][]): string[] {
    return arrays.reduce((acc, curr) => acc.flatMap((x) => curr.map((y) => `${x}${x ? '-' : ''}${y}`)), [''])
  }

  // Lấy mảng các options từ variants
  const options = variants.map((variant) => variant.options)

  // Tạo tất cả tổ hợp
  const combinations = getCombinations(options)

  // Chuyển tổ hợp thành SKU objects
  return combinations.map((value) => ({
    value,
    price: 0,
    stock: 100,
    image: ''
  }))
}

// Danh cho client va guest
const GetProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  name: z.string().optional(),
  brandIds: z.preprocess((value) => {
    if (typeof value === 'string') {
      return [Number(value)]
    }

    return value
  }, z.array(z.coerce.number().int().positive()).optional()),
  categories: z.preprocess((value) => {
    if (typeof value === 'string') {
      return [Number(value)]
    }

    return value
  }, z.array(z.coerce.number().int().positive()).optional()),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  createdById: z.coerce.number().int().positive().optional(),
  orderBy: z.nativeEnum(OrderBy).default(OrderBy.Desc),
  sortBy: z.nativeEnum(SortBy).default(SortBy.CreatedAt)
})

// Danh cho admin va seller
const GetManageProductsQuerySchema = GetProductsQuerySchema.extend({
  isPublic: z.preprocess((value) => value === 'true', z.boolean()).optional(),
  createdById: z.coerce.number().int().positive()
})

const GetProductsResSchema = z.object({
  products: z.array(ProductSchema.extend({ productTranslations: z.array(ProductTranslationSchema) })),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPage: z.number()
})

const GetProductParamsSchema = z
  .object({
    productId: z.coerce.number().int().positive()
  })
  .strict()

const GetProductDetailResSchema = ProductSchema.extend({
  productTranslations: z.array(ProductTranslationSchema),
  skus: z.array(SKUSchema),
  categories: z.array(CategoryIncludeTranslationSchema),
  brand: BrandIncludeTranslationSchema
})

const CreateProductBodySchema = ProductSchema.pick({
  publishedAt: true,
  name: true,
  basePrice: true,
  virtualPrice: true,
  brandId: true,
  images: true,
  variants: true
})
  .extend({
    categories: z.array(z.coerce.number().int().positive()),
    skus: z.array(UpsertSKUBodySchema)
  })
  .strict()
  .superRefine(({ variants, skus }, ctx) => {
    const skuValueArray = generateSKUs(variants)

    if (skus.length !== skuValueArray.length) {
      return ctx.addIssue({
        code: 'custom',
        message: `Number of SKU should is ${skuValueArray.length}`,
        path: ['skus']
      })
    }

    let wrongSKUIndex = -1

    const isValidSKUs = skus.every((sku, index) => {
      const isValid = sku.value === skuValueArray[index].value
      if (!isValid) {
        wrongSKUIndex = index
      }

      return isValid
    })

    if (!isValidSKUs) {
      return ctx.addIssue({
        code: 'custom',
        message: `SKU index value ${wrongSKUIndex} is invalid.`,
        path: ['skus']
      })
    }
  })

const UpdateProductBodySchema = CreateProductBodySchema

type GetProductsQueryType = z.infer<typeof GetProductsQuerySchema>

type GetManageProductsQueryType = z.infer<typeof GetManageProductsQuerySchema>

type GetProductsResType = z.infer<typeof GetProductsResSchema>

type GetProductParamsType = z.infer<typeof GetProductParamsSchema>

type GetProductDetailResType = z.infer<typeof GetProductDetailResSchema>

type CreateProductBodyType = z.infer<typeof CreateProductBodySchema>

type UpdateProductBodyType = z.infer<typeof UpdateProductBodySchema>

export {
  GetProductsQuerySchema,
  GetManageProductsQuerySchema,
  GetProductsResSchema,
  GetProductParamsSchema,
  GetProductDetailResSchema,
  CreateProductBodySchema,
  UpdateProductBodySchema,
  GetProductsQueryType,
  GetManageProductsQueryType,
  GetProductsResType,
  GetProductParamsType,
  GetProductDetailResType,
  CreateProductBodyType,
  UpdateProductBodyType
}
