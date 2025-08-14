import { createZodDto } from 'nestjs-zod'
import { ChangePasswordBodySchema, ProfileUpdateBodySchema } from 'src/routes/profile/entities/profile.entity'

class ProfileUpdateBodyDto extends createZodDto(ProfileUpdateBodySchema) {}

class ChangePasswordBodyDto extends createZodDto(ChangePasswordBodySchema) {}

export { ProfileUpdateBodyDto, ChangePasswordBodyDto }
