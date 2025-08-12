import { Injectable } from '@nestjs/common'
import {
  DeviceType,
  RefreshTokenType,
  RegisterBodyType,
  VerificationCodeType
} from 'src/routes/auth/entities/auth.entity'
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'
import { RoleName } from 'src/shared/constants/role.constant'
import { RoleType } from 'src/shared/models/shared-role.model'
import { UserType } from 'src/shared/models/shared-user.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // khong quy dinh kieu tra ve cung duoc vi prisma da quy dinh san roi, nhung sau nay neu co thay doi ORM thi van phai tra ve kieu da quy dinh (vi ORM moi co the tra ve kieu khac voi hien tai)
  createUser(
    user: Omit<RegisterBodyType, 'code' | 'confirmPassword'> &
      Pick<UserType, 'roleId'> &
      Partial<Pick<UserType, 'avatar'>>
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return this.prismaService.user.create({
      data: user,
      omit: {
        password: true,
        totpSecret: true
      }
    })
  }

  createUserIncludeRole(
    user: Omit<RegisterBodyType, 'code' | 'confirmPassword'> &
      Pick<UserType, 'roleId'> &
      Partial<Pick<UserType, 'avatar'>>
  ): Promise<UserType & { role: RoleType }> {
    return this.prismaService.user.create({
      data: user,
      include: {
        role: true
      }
    })
  }

  getClientRoleId() {
    return this.prismaService.role.findFirstOrThrow({
      where: {
        name: RoleName.Client,
        deletedAt: null
      },
      take: 1
    })
  }

  createVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'code' | 'type' | 'expiresAt'>
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.upsert({
      where: {
        email_code_type: {
          email: payload.email,
          code: payload.code,
          type: payload.type
        }
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt
      }
    })
  }

  findUniqueVerificationCode(
    uniqueObject:
      | { id: number }
      | {
          email_code_type: {
            email: string
            type: TypeOfVerificationCode
            code: string
          }
        }
  ): Promise<VerificationCodeType | null> {
    return this.prismaService.verificationCode.findUnique({
      where: uniqueObject
    })
  }

  createRefreshToken(data: { token: string; userId: number; deviceId: number; expiresAt: Date }) {
    return this.prismaService.refreshToken.create({
      data
    })
  }

  createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>
  ) {
    return this.prismaService.device.create({
      data
    })
  }

  findUniqueUserIncludeRole(
    uniqueObject: { email: string } | { id: number }
  ): Promise<(UserType & { role: RoleType }) | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
      include: {
        role: true
      }
    })
  }

  findUniqueRefreshTokenIncludeUserRole(uniqueObject: {
    token: string
  }): Promise<(RefreshTokenType & { user: UserType & { role: RoleType } }) | null> {
    return this.prismaService.refreshToken.findUnique({
      where: uniqueObject,
      include: {
        user: {
          include: {
            role: true
          }
        }
      }
    })
  }

  updateDevice(deviceId: number, data: Partial<DeviceType>): Promise<DeviceType> {
    return this.prismaService.device.update({
      where: {
        id: deviceId
      },
      data
    })
  }

  deleteRefreshToken(uniqueObject: { token: string }): Promise<RefreshTokenType> {
    return this.prismaService.refreshToken.delete({
      where: uniqueObject
    })
  }

  updateUser(uniqueObject: { id: number } | { email: string }, data: Partial<Omit<UserType, 'id'>>): Promise<UserType> {
    return this.prismaService.user.update({
      where: uniqueObject,
      data
    })
  }

  deleteVerificationCode(
    uniqueObject: { id: number } | { email_code_type: { email: string; type: TypeOfVerificationCode; code: string } }
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.delete({
      where: uniqueObject
    })
  }
}
