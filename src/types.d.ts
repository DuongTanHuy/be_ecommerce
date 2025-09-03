import { VariantsType } from 'src/routes/product/entities/product.entity'

declare global {
  namespace PrismaJson {
    type Variants = VariantsType
  }
}
