import { createZodDto } from 'nestjs-zod'
import { EmptyBodySchema, PaginationQuerySchema } from 'src/shared/models/request.model'

export class EmptyBodyDto extends createZodDto(EmptyBodySchema) {}

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}
