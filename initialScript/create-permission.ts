import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import envConfig from 'src/shared/config'
import { HTTPMethod, RoleName } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

const SellerModule = ['AUTH', 'MEDIA', 'MANAGE-PRODUCT', 'PRODUCT-TRANSLATION', 'PROFILE']

const prismaService = new PrismaService()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(envConfig.POST ?? 3000)
  const server = app.getHttpAdapter().getInstance()
  const router = server.router

  const permissionInDb = await prismaService.permission.findMany({
    where: {
      deletedAt: null
    }
  })

  const availableRoutes: { path: string; method: keyof typeof HTTPMethod; name: string; module: string }[] =
    router.stack
      .map((layer) => {
        if (layer.route) {
          const path = layer.route?.path
          const method = String(layer.route?.stack[0].method).toLocaleUpperCase() as keyof typeof HTTPMethod
          const module = String(path.split('/')[1] ?? path.split('/')[0]).toUpperCase()

          return {
            name: method + ' ' + path,
            path,
            method,
            module
          }
        }
      })
      .filter((item) => item !== undefined)

  const permissionInDbMap: {
    [key: string]: { id: number; path: string; method: keyof typeof HTTPMethod; name: string }
  } = permissionInDb.reduce((acc, item) => {
    acc[item.method + '-' + item.path] = item
    return acc
  }, {})

  const availableRoutesMap: Record<string, (typeof availableRoutes)[0]> = availableRoutes.reduce((acc, item) => {
    acc[item.method + '-' + item.path] = item
    return acc
  }, {})

  const permissionToDelete = permissionInDb.filter((item) => !availableRoutesMap[item.method + '-' + item.path])

  if (permissionToDelete.length > 0) {
    const deleteResult = await prismaService.permission.deleteMany({
      where: {
        id: {
          in: permissionToDelete.map((item) => item.id)
        }
      }
    })

    console.log('Deleted permissions:', deleteResult.count)
  } else {
    console.log('No permissions to delete')
  }

  const routesToAdd = availableRoutes.filter((item) => !permissionInDbMap[item.method + '-' + item.path])

  if (routesToAdd.length > 0) {
    const createResult = await prismaService.permission.createMany({
      data: routesToAdd,
      skipDuplicates: true
    })

    console.log('Created permissions:', createResult.count)
  } else {
    console.log('No new permissions to create')
  }

  const updatedPermissionsInDb = await prismaService.permission.findMany({
    where: {
      deletedAt: null
    }
  })

  const adminPermissionIds = updatedPermissionsInDb.map((permission) => ({ id: permission.id }))
  const sellerPermissionIds = updatedPermissionsInDb
    .filter((permission) => SellerModule.includes(permission.module))
    .map((permission) => ({ id: permission.id }))

  await Promise.all([updateRole(adminPermissionIds, RoleName.Admin), updateRole(sellerPermissionIds, RoleName.Seller)])

  process.exit(0)
}

const updateRole = async (
  permissionIds: {
    id: number
  }[],
  roleName: (typeof RoleName)[keyof typeof RoleName]
) => {
  const role = await prismaService.role.findFirstOrThrow({
    where: {
      name: roleName,
      deletedAt: null
    }
  })

  await prismaService.role.update({
    where: {
      id: role.id
    },
    data: {
      permissions: {
        set: permissionIds
      }
    }
  })
}

bootstrap()
