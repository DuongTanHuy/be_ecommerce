import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common'
import { CartService } from './cart.service'
import {
  AddToCartBodyDto,
  CartItemDto,
  DeleteCartBodyDto,
  GetCartItemParamsDto,
  GetCartResDto,
  UpdateCartItemBodyDto
} from 'src/routes/cart/dto/create-cart.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { PaginationQueryDto } from 'src/shared/dtos/request.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ZodSerializerDto(CartItemDto)
  create(@Body() createCartDto: AddToCartBodyDto, @ActiveUser('userId') userId: number) {
    return this.cartService.create(userId, createCartDto)
  }

  @Get()
  @ZodSerializerDto(GetCartResDto)
  getCart(@Query() query: PaginationQueryDto, @ActiveUser('userId') userId: number) {
    return this.cartService.findAll(query, userId)
  }

  @Patch(':cartItemId')
  @ZodSerializerDto(CartItemDto)
  update(@Param() params: GetCartItemParamsDto, @Body() updateCartDto: UpdateCartItemBodyDto) {
    return this.cartService.update(params.cartItemId, updateCartDto)
  }

  @Post('delete')
  @ZodSerializerDto(MessageResDto)
  remove(@Body() body: DeleteCartBodyDto, @ActiveUser('userId') userId: number) {
    return this.cartService.remove(userId, body)
  }
}
