import { createZodDto } from 'nestjs-zod'
import {
  CreateProductBodySchema,
  GetManageProductsQuerySchema,
  GetProductDetailResSchema,
  GetProductParamsSchema,
  GetProductsQuerySchema,
  GetProductsResSchema,
  UpdateProductBodySchema
} from 'src/routes/product/entities/product.entity'

class GetProductsQueryDto extends createZodDto(GetProductsQuerySchema) {}

class GetManageProductsQueryDto extends createZodDto(GetManageProductsQuerySchema) {}

class GetProductsResDto extends createZodDto(GetProductsResSchema) {}

class GetProductParamsDto extends createZodDto(GetProductParamsSchema) {}

class GetProductDetailResDto extends createZodDto(GetProductDetailResSchema) {}

class CreateProductBodyDto extends createZodDto(CreateProductBodySchema) {}

class UpdateProductBodyDto extends createZodDto(UpdateProductBodySchema) {}

export {
  GetProductsQueryDto,
  GetManageProductsQueryDto,
  GetProductsResDto,
  GetProductParamsDto,
  GetProductDetailResDto,
  CreateProductBodyDto,
  UpdateProductBodyDto
}
