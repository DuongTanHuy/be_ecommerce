import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { CartController } from './cart.controller'
import CartRepository from 'src/routes/cart/cart.repo'

@Module({
  controllers: [CartController],
  providers: [CartService, CartRepository]
})
export class CartModule {}
