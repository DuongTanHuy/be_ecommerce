import { ProductTranslationSchema } from 'src/shared/models/shared-product-translation.model'
import { ProductSchema } from 'src/shared/models/shared-product.model'
import { SKUSchema } from 'src/shared/models/shared-sku.model'
import { UserSchema } from 'src/shared/models/shared-user.model'
import z from 'zod'

const CartItemSchema = z.object({
  id: z.number(),
  quantity: z.number().int().positive(),
  skuId: z.number(),
  userId: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

const GetCartItemParamsSchema = z.object({
  cartItemId: z.coerce.number().int().positive()
})

const CartItemDetailResSchema = z.object({
  shop: UserSchema.pick({
    id: true,
    name: true,
    avatar: true
  }),
  cartItems: z.array(
    CartItemSchema.extend({
      sku: SKUSchema.extend({
        product: ProductSchema.extend({
          productTranslations: z.array(
            ProductTranslationSchema.omit({
              createdById: true,
              updatedById: true,
              deletedById: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true
            })
          )
        }).omit({
          createdById: true,
          updatedById: true,
          deletedById: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true
        })
      }).omit({
        createdById: true,
        updatedById: true,
        deletedById: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
      })
    })
  )
})

const GetCartResSchema = z.object({
  data: z.array(CartItemDetailResSchema),
  totalItem: z.number(),
  page: z.number(),
  limit: z.number(),
  pageTotal: z.number()
})

const AddToCartBodySchema = CartItemSchema.pick({
  skuId: true,
  quantity: true
}).strict()

const UpdateCartItemBodySchema = AddToCartBodySchema

const DeleteCartBodySchema = z
  .object({
    cartItemIds: z.array(z.number().int().positive())
  })
  .strict()

type CartItemType = z.infer<typeof CartItemSchema>

type GetCartItemParamsType = z.infer<typeof GetCartItemParamsSchema>

type CartItemDetailResType = z.infer<typeof CartItemDetailResSchema>

type GetCartResType = z.infer<typeof GetCartResSchema>

type AddToCartBodyType = z.infer<typeof AddToCartBodySchema>

type UpdateCartItemBodyType = z.infer<typeof UpdateCartItemBodySchema>

type DeleteCartBodyType = z.infer<typeof DeleteCartBodySchema>

export {
  CartItemSchema,
  GetCartItemParamsSchema,
  CartItemDetailResSchema,
  GetCartResSchema,
  AddToCartBodySchema,
  UpdateCartItemBodySchema,
  DeleteCartBodySchema,
  CartItemType,
  GetCartItemParamsType,
  CartItemDetailResType,
  GetCartResType,
  AddToCartBodyType,
  UpdateCartItemBodyType,
  DeleteCartBodyType
}
