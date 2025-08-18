import { Injectable } from '@nestjs/common'
import { CreateUserBodyType } from 'src/routes/user/entities/user.entity'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export default class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createUser(
    data: CreateUserBodyType & {
      createdById: number
    }
  ) {
    return this.prismaService.user.create({
      data
    })
  }

  async findAll({ limit, page }: { limit: number; page: number }) {
    const skip = page ? (page - 1) * limit : 0
    const take = limit || 10

    const [total, users] = await Promise.all([
      this.prismaService.user.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.user.findMany({
        where: {
          deletedAt: null
        },
        skip,
        take,
        include: {
          role: true
        }
      })
    ])

    return {
      users,
      total,
      page: Math.ceil(total / take),
      limit: page || 1,
      totalPages: Math.ceil(total / take)
    }
  }

  delete(id: number, userId: number, isHard: boolean = false) {
    return isHard
      ? this.prismaService.user.delete({
          where: {
            id
          }
        })
      : this.prismaService.user.update({
          where: {
            id,
            deletedAt: null
          },
          data: {
            deletedAt: new Date(),
            deletedById: userId
          }
        })
  }
}
