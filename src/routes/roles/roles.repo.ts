import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateRoleBodyType, GetRoleResType, UpdateRoleBodyType } from 'src/routes/roles/entities/role.entity'
import { RoleType } from 'src/shared/models/shared-role.model'

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({ page, limit }: { page: number; limit: number }): Promise<GetRoleResType> {
    const skip = page ? (page - 1) * limit : 0
    const take = limit || 10

    const [total, roles] = await Promise.all([
      this.prismaService.role.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.role.findMany({
        where: {
          deletedAt: null
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc'
        }
      })
    ])

    return {
      total,
      roles,
      page: Math.ceil(total / take),
      limit: page || 1,
      totalPages: Math.ceil(total / take)
    }
  }

  findOne(id: number): Promise<RoleType | null> {
    return this.prismaService.role.findUnique({
      where: {
        id,
        deletedAt: null
      },
      include: {
        permissions: {
          where: {
            deletedAt: null
          }
        }
      }
    })
  }

  create(
    data: CreateRoleBodyType & {
      createdById: number
    }
  ): Promise<RoleType> {
    return this.prismaService.role.create({
      data
    })
  }

  async update(
    id: number,
    data: UpdateRoleBodyType & {
      updatedById: number
    }
  ): Promise<RoleType> {
    if (data.permissionIds.length > 0) {
      const permissions = await this.prismaService.permission.findMany({
        where: {
          id: {
            in: data.permissionIds
          }
        }
      })

      const deletedPermissions = permissions.filter((permission) => permission.deletedAt)

      if (deletedPermissions.length > 0) {
        const deletedIds = deletedPermissions.map((permission) => permission.id).join('. ')

        throw new BadRequestException([
          {
            message: `Permission with ids ha been deleted: ${deletedIds}`,
            path: 'permissionIds'
          }
        ])
      }
    }

    return this.prismaService.role.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        permissions: {
          set: data.permissionIds.map((id) => ({ id }))
        },
        updatedById: data.updatedById
      },
      include: {
        permissions: {
          where: {
            deletedAt: null
          }
        }
      }
    })
  }

  remove(id: number, userId: number, isHard: boolean = false) {
    return isHard
      ? this.prismaService.role.delete({
          where: {
            id
          }
        })
      : this.prismaService.role.update({
          where: {
            id,
            deletedAt: null
          },
          data: {
            deletedById: userId,
            deletedAt: new Date()
          }
        })
  }
}
