import { PartialType } from '@nestjs/mapped-types'
import { CreateLanguageBodyDto } from './create-language.dto'

export class UpdateLanguageDto extends PartialType(CreateLanguageBodyDto) {}
