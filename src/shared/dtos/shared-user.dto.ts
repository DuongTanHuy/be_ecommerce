import { createZodDto } from 'nestjs-zod'
import { ProfileSchema, ProfileUpdateResSchema } from 'src/shared/models/shared-user.model'

class ProfileDetailResDto extends createZodDto(ProfileSchema) {}

class ProfileUpdateResDto extends createZodDto(ProfileUpdateResSchema) {}

export { ProfileDetailResDto, ProfileUpdateResDto }
