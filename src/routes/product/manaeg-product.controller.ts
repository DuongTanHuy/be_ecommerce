import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import {
  CreateProductBodyDto,
  GetManageProductsQueryDto,
  GetProductDetailResDto,
  GetProductParamsDto,
  GetProductsResDto,
  UpdateProductBodyDto
} from 'src/routes/product/dto/create-product.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { ManageProductService } from 'src/routes/product/manage-product.service'
import { AccessTokenPayload } from 'src/shared/types/jwt.type'

@Controller('manage-product/product')
export class ManageProductController {
  constructor(private readonly manageProductService: ManageProductService) {}

  @Post()
  @ZodSerializerDto(GetProductDetailResDto)
  create(@Body() createProductDto: CreateProductBodyDto, @ActiveUser('userId') userId: number) {
    return this.manageProductService.create(userId, createProductDto)
  }

  @Get()
  @ZodSerializerDto(GetProductsResDto)
  findAll(@Query() query: GetManageProductsQueryDto, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.findAll(query, user.userId, user.roleName)
  }

  @Get(':productId')
  @ZodSerializerDto(GetProductDetailResDto)
  findOne(@Param() params: GetProductParamsDto, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.getDetail(params.productId, user.userId, user.roleName)
  }

  @Patch(':productId')
  @ZodSerializerDto(GetProductDetailResDto)
  update(
    @Param() params: GetProductParamsDto,
    @Body() updateProductDto: UpdateProductBodyDto,
    @ActiveUser() user: AccessTokenPayload
  ) {
    return this.manageProductService.update(params.productId, user.userId, user.roleName, updateProductDto)
  }

  @Delete(':productId')
  remove(@Param() params: GetProductParamsDto, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.remove(params.productId, user.userId, user.roleName)
  }
}
