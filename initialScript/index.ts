import envConfig from 'src/shared/config'
import { RoleName } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'
import { SharedService } from 'src/shared/services/shared.service'

const prismaService = new PrismaService()
const sharedService = new SharedService()

const main = async () => {
  const roleCount = await prismaService.role.count()

  if (roleCount > 0) {
    throw new Error('Role already exist')
  }

  const roles = await prismaService.role.createMany({
    data: [
      {
        name: RoleName.Admin,
        description: 'Admin role'
      },
      {
        name: RoleName.Client,
        description: 'Client role'
      },
      {
        name: RoleName.Seller,
        description: 'Seller role'
      }
    ]
  })

  const adminRole = await prismaService.role.findFirstOrThrow({
    where: {
      name: RoleName.Admin
    }
  })

  const hashPassword = await sharedService.hash(envConfig.ADMIN_PASSWORD)

  const adminUser = await prismaService.user.create({
    data: {
      name: envConfig.ADMIN_NAME,
      email: envConfig.ADMIN_EMAIL,
      password: hashPassword,
      phoneNumber: envConfig.ADMIN_PHONE_NUMBER,
      roleId: adminRole.id
    }
  })

  return {
    createdRoleCount: roles.count,
    adminUser
  }
}

main()
  .then(({ adminUser, createdRoleCount }) => {
    console.log(`Created ${createdRoleCount} roles`)
    console.log(`Created admin user: ${adminUser.email}`)
  })
  .catch(console.error)
