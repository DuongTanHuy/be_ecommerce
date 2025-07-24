import { PartialType } from '@nestjs/mapped-types'
import { RegisterBodyDto } from './create-auth.dto'

export class UpdateAuthDto extends PartialType(RegisterBodyDto) {}
