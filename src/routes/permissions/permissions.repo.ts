import { Injectable } from '@nestjs/common'
import {
  CreatePermissionBodyType,
  GetPermissionQueryType,
  GetPermissionResType,
  UpdatePermissionBodyType
} from 'src/routes/permissions/entities/permission.entity'
import { PermissionType } from 'src/shared/models/shared-permission.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(params: GetPermissionQueryType): Promise<GetPermissionResType> {
    const skip = params.page ? (params.page - 1) * params.limit : 0
    const take = params.limit || 10

    const [totalItems, data] = await Promise.all([
      this.prismaService.permission.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.permission.findMany({
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
      total: totalItems,
      permissions: data,
      page: Math.ceil(totalItems / take),
      limit: params.page || 1,
      totalPages: Math.ceil(totalItems / take)
    }
  }

  findById(id: number): Promise<PermissionType | null> {
    return this.prismaService.permission.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }

  create(
    data: CreatePermissionBodyType & {
      createdById: number
    }
  ): Promise<PermissionType> {
    return this.prismaService.permission.create({
      data
    })
  }

  update(permissionId: number, data: UpdatePermissionBodyType & { updatedById: number }): Promise<PermissionType> {
    return this.prismaService.permission.update({
      where: {
        id: permissionId,
        deletedAt: null
      },
      data
    })
  }

  delete(id: number, userId: number, isHard: boolean = false) {
    return isHard
      ? this.prismaService.permission.delete({
          where: {
            id
          }
        })
      : this.prismaService.permission.update({
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
