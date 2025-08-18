import ms, { StringValue } from 'ms'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { SharedService } from 'src/shared/services/shared.service'
import {
  DisableTwoFactorBodyType,
  ForgotPasswordBodyType,
  LoginBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  SendOtpBodyType
} from 'src/routes/auth/entities/auth.entity'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { generateOtp } from 'src/shared/helpers'
import { addMilliseconds } from 'date-fns'
import envConfig from 'src/shared/config'
import { TypeOfVerificationCode, VerificationCode } from 'src/shared/constants/auth.constant'
import { EmailService } from 'src/shared/services/email.service'
import { TokenService } from 'src/shared/services/token.service'
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type'
import {
  InvalidOTPException,
  InvalidTOTPAndCodeException,
  InvalidTOTPException,
  OptCodeInvalid,
  RefreshTokenInvalid,
  SendOtpFailed,
  TOTPAlreadyEnabledException,
  TOTPNotEnabledException,
  UserIsExist,
  UserNotFound
} from 'src/routes/auth/auth.error'
import { TwoFactorService } from 'src/shared/services/2fa.service'
import { InvalidPasswordException } from 'src/shared/error'
import SharedRoleRepository from 'src/shared/repositories/shared-role.repo'

@Injectable()
export class AuthService {
  constructor(
    private readonly sharedService: SharedService,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly twoFactorService: TwoFactorService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly sharedRoleRepository: SharedRoleRepository
  ) {}

  async validateVerificationCode({ email, code, type }: { email: string; code: string; type: TypeOfVerificationCode }) {
    const verificationCode = await this.authRepository.findUniqueVerificationCode({
      email_code_type: {
        email,
        code,
        type
      }
    })

    if (!verificationCode) {
      throw OptCodeInvalid
    }

    if (verificationCode.expiresAt < new Date()) {
      throw InvalidOTPException
    }

    return verificationCode
  }

  async generateToken({ userId, deviceId, roleId, roleName }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        deviceId,
        roleId,
        roleName
      }),
      this.tokenService.signRefreshToken({
        userId
      })
    ])

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)

    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId,
      deviceId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000)
    })

    return {
      accessToken,
      refreshToken
    }
  }

  async login(
    loginBodyDto: LoginBodyType & {
      userAgent: string
      ip: string
    }
  ) {
    const user = await this.authRepository.findUniqueUserIncludeRole({ email: loginBodyDto.email })

    if (!user) {
      throw UserNotFound
    }

    const isPasswordMath = await this.sharedService.compare(loginBodyDto.password, user.password)

    if (!isPasswordMath) {
      throw InvalidPasswordException
    }

    if (user.totpSecret) {
      if (!loginBodyDto.code && !loginBodyDto.totpCode) {
        throw InvalidTOTPAndCodeException
      }

      if (loginBodyDto.totpCode) {
        const isValid = this.twoFactorService.verifyTOTP({
          email: loginBodyDto.email,
          secret: user.totpSecret,
          token: loginBodyDto.totpCode
        })

        if (!isValid) {
          throw InvalidTOTPException
        }
      } else if (loginBodyDto.code) {
        await this.validateVerificationCode({
          email: user.email,
          code: loginBodyDto.code,
          type: VerificationCode.LOGIN
        })
      }
    }

    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: loginBodyDto.userAgent,
      ip: loginBodyDto.ip
    })

    const tokens = await this.generateToken({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name
    })

    return tokens
  }

  async register(createAuthDto: RegisterBodyType) {
    const { email, password, name, phoneNumber, code } = createAuthDto

    await this.validateVerificationCode({ email, code, type: VerificationCode.REGISTER })

    const $getClientRole = this.sharedRoleRepository.getClientRoleId()
    const $hashedPassword = this.sharedService.hash(password)

    const [roleId, hashedPassword] = await Promise.all([$getClientRole, $hashedPassword])

    const $createUser = this.authRepository.createUser({
      email,
      name,
      password: hashedPassword,
      phoneNumber,
      roleId
    })

    const $deleteVerificationCode = this.authRepository.deleteVerificationCode({
      email_code_type: {
        email,
        code,
        type: VerificationCode.REGISTER
      }
    })

    const [newUser] = await Promise.all([$createUser, $deleteVerificationCode])

    return newUser
  }

  async sendOtp(sendOtpBodyDto: SendOtpBodyType) {
    const { email, type } = sendOtpBodyDto
    const isUserExist = await this.sharedUserRepository.findUnique({ email })

    if (type === VerificationCode.REGISTER && isUserExist) {
      throw UserIsExist
    }

    if (type === VerificationCode.FORGOT_PASSWORD && !isUserExist) {
      throw UserNotFound
    }

    const code = generateOtp()
    await this.authRepository.createVerificationCode({
      email,
      code,
      type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as StringValue))
    })

    const { error } = await this.emailService.sendOtp({
      email,
      code
    })

    if (error) {
      throw SendOtpFailed
    }

    return {
      message: 'Send OTP code successful'
    }
  }

  async refreshToken({
    token,
    userAgent,
    ip
  }: RefreshTokenBodyType & {
    userAgent: string
    ip: string
  }) {
    const { userId } = await this.tokenService.verifyRefreshToken(token)

    if (!userId) {
      throw RefreshTokenInvalid
    }

    const refreshTokenData = await this.authRepository.findUniqueRefreshTokenIncludeUserRole({ token })

    if (!refreshTokenData) {
      throw new UnauthorizedException('Refresh token is lost')
    }

    const {
      deviceId,
      user: {
        roleId,
        role: { name: roleName }
      }
    } = refreshTokenData

    const $updateDevice = this.authRepository.updateDevice(deviceId, {
      userAgent,
      ip
    })

    const $deleteOldToken = this.authRepository.deleteRefreshToken({ token })

    const $generateTokens = this.generateToken({
      userId,
      deviceId,
      roleId,
      roleName
    })
    const [, , tokens] = await Promise.all([$updateDevice, $deleteOldToken, $generateTokens])

    return tokens
  }

  async logout(token: string) {
    const { userId } = await this.tokenService.verifyRefreshToken(token)

    if (!userId) {
      throw RefreshTokenInvalid
    }

    const { deviceId } = await this.authRepository.deleteRefreshToken({ token })

    await this.authRepository.updateDevice(deviceId, {
      isActive: false
    })

    return {
      message: 'Logout successful'
    }
  }

  async forgotPassword(forgotPasswordBodyDto: ForgotPasswordBodyType) {
    const { email, code, newPassword } = forgotPasswordBodyDto

    const isUserExist = await this.sharedUserRepository.findUnique({ email })

    if (!isUserExist) {
      throw UserNotFound
    }

    const $validateVerificationCode = this.validateVerificationCode({
      email,
      code,
      type: VerificationCode.FORGOT_PASSWORD
    })

    const $hashedPassword = this.sharedService.hash(newPassword)

    const [hashedPassword] = await Promise.all([$hashedPassword, $validateVerificationCode])

    const $updateUser = this.sharedUserRepository.update(
      { id: isUserExist.id },
      {
        password: hashedPassword,
        updatedById: isUserExist.id
      }
    )
    const $deleteVerificationCode = this.authRepository.deleteVerificationCode({
      email_code_type: {
        email,
        code,
        type: VerificationCode.FORGOT_PASSWORD
      }
    })

    await Promise.all([$updateUser, $deleteVerificationCode])

    return {
      message: 'Change password successful'
    }
  }

  async setupTwoFactorAuth(userId: number) {
    const user = await this.sharedUserRepository.findUnique({ id: userId })

    if (!user) {
      throw UserNotFound
    }

    if (user.totpSecret) {
      throw TOTPAlreadyEnabledException
    }

    const { secret, uri } = this.twoFactorService.generateTOTPSecret(user.email)

    await this.sharedUserRepository.update({ id: userId }, { totpSecret: secret, updatedById: userId })

    return {
      secret,
      uri
    }
  }

  async disableTwoFactorAuth(data: DisableTwoFactorBodyType & { userId: number }) {
    const { userId, totpCode, code } = data
    const user = await this.sharedUserRepository.findUnique({
      id: userId
    })

    if (!user) {
      throw UserNotFound
    }

    if (!user.totpSecret) {
      throw TOTPNotEnabledException
    }

    if (totpCode) {
      const isValid = this.twoFactorService.verifyTOTP({
        email: user.email,
        token: totpCode,
        secret: user.totpSecret
      })

      if (!isValid) {
        throw InvalidTOTPException
      }
    } else if (code) {
      await this.validateVerificationCode({ email: user.email, code, type: VerificationCode.DISABLE_2FA })
    }

    await this.sharedUserRepository.update(
      { id: userId },
      {
        totpSecret: null,
        updatedById: userId
      }
    )

    return {
      message: 'Totp secret is disabled'
    }
  }
}
