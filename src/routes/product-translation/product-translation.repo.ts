import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export default class ProductTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
