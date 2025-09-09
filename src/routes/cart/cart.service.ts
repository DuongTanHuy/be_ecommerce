import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import CartRepository from 'src/routes/cart/cart.repo'
import { AddToCartBodyType, DeleteCartBodyType, UpdateCartItemBodyType } from 'src/routes/cart/entities/cart.entity'
import { PaginationQueryType } from 'src/shared/models/request.model'

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  create(userId: number, createCartDto: AddToCartBodyType) {
    return this.cartRepository.create({
      ...createCartDto,
      userId
    })
  }

  findAll(query: PaginationQueryType, userId: number) {
    return this.cartRepository.findAllV2(query, userId, I18nContext.current()?.lang as string)
  }

  update(id: number, updateCartDto: UpdateCartItemBodyType) {
    return this.cartRepository.update(id, updateCartDto)
  }

  async remove(userId: number, body: DeleteCartBodyType) {
    const { count } = await this.cartRepository.delete(userId, body)

    return {
      message: `${count} item(s) removed from cart`
    }
  }
}
