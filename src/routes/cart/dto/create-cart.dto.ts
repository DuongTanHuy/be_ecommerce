import { createZodDto } from 'nestjs-zod'
import {
  AddToCartBodySchema,
  CartItemSchema,
  DeleteCartBodySchema,
  GetCartItemParamsSchema,
  GetCartResSchema,
  UpdateCartItemBodySchema
} from 'src/routes/cart/entities/cart.entity'

class CartItemDto extends createZodDto(CartItemSchema) {}

class GetCartResDto extends createZodDto(GetCartResSchema) {}

class GetCartItemParamsDto extends createZodDto(GetCartItemParamsSchema) {}

class AddToCartBodyDto extends createZodDto(AddToCartBodySchema) {}

class UpdateCartItemBodyDto extends createZodDto(UpdateCartItemBodySchema) {}

class DeleteCartBodyDto extends createZodDto(DeleteCartBodySchema) {}

export { CartItemDto, GetCartResDto, GetCartItemParamsDto, AddToCartBodyDto, UpdateCartItemBodyDto, DeleteCartBodyDto }
