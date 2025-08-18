import { createZodDto } from 'nestjs-zod'
import {
  CreateUserBodySchema,
  GetUserParamsSchema,
  GetUserQuerySchema,
  GetUsersResSchema,
  UpdateUserBodySchema
} from 'src/routes/user/entities/user.entity'
import { ProfileUpdateResDto } from 'src/shared/dtos/shared-user.dto'

class GetUserQueryDto extends createZodDto(GetUserQuerySchema) {}

class GetUserParamDto extends createZodDto(GetUserParamsSchema) {}

class GetUserResDto extends createZodDto(GetUsersResSchema) {}

class CreateUserBodyDto extends createZodDto(CreateUserBodySchema) {}

class CreateUserResDto extends ProfileUpdateResDto {}

class UpdateUserBodyDto extends createZodDto(UpdateUserBodySchema) {}

export { GetUserQueryDto, GetUserParamDto, GetUserResDto, CreateUserBodyDto, CreateUserResDto, UpdateUserBodyDto }
