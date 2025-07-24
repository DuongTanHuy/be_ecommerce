import { Injectable } from '@nestjs/common'
import { RegisterBodyType, VerificationCodeType } from 'src/routes/auth/entities/auth.entity'
import { RoleName } from 'src/shared/constants/role.constant'
import { UserType } from 'src/shared/models/shared-user.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // khong quy dinh kieu tra ve cung duoc vi prisma da quy dinh san roi, nhung sau nay neu co thay doi ORM thi van phai tra ve kieu da quy dinh (vi ORM moi co the tra ve kieu khac voi hien tai)
  createUser(
    user: Omit<RegisterBodyType, 'confirmPassword'> & Pick<UserType, 'roleId'>
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return this.prismaService.user.create({
      data: user,
      omit: {
        password: true,
        totpSecret: true
      }
    })
  }

  getClientRoleId() {
    return this.prismaService.role.findFirstOrThrow({
      where: {
        name: RoleName.Client
      }
    })
  }

  createVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'code' | 'type' | 'expiresAt'>
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.upsert({
      where: {
        email: payload.email
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt
      }
    })
  }
}
