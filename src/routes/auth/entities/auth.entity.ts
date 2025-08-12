import { VerificationCode } from 'src/shared/constants/auth.constant'
import { RoleSchema } from 'src/shared/models/shared-role.model'
import { UserSchema } from 'src/shared/models/shared-user.model'
import z from 'zod'

const RegisterBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  phoneNumber: true
})
  .extend({
    confirmPassword: z.string().min(6).max(100),
    code: z.string().length(6)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password and confirm password must match',
        path: ['confirmPassword']
      })
    }
  })

const RegisterResSchema = UserSchema.omit({
  password: true,
  totpSecret: true
})

const VerificationCodeSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  code: z.string().length(6),
  type: z.nativeEnum(VerificationCode),
  expiresAt: z.date(),
  createdAt: z.date()
})

const SendOtpBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true
}).strict()

const SendOtpResSchema = VerificationCodeSchema

const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true
})
  .extend({
    totpCode: z.string().length(6).optional(),
    code: z.string().length(6).optional()
  })
  .strict()
  .superRefine(({ totpCode, code }, ctx) => {
    const message = 'Only one of totpCode or code should be provided'
    if (totpCode !== undefined && code != undefined) {
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['totpCode']
      })
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['code']
      })
    }
  })

const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
})

const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  deviceId: z.number(),
  expiresAt: z.date(),
  createdAt: z.date()
})

const RefreshTokenBodySchema = RefreshTokenSchema.pick({
  token: true
}).strict()

const RefreshTokenResSchema = LoginResSchema

const LogoutBodySchema = RefreshTokenBodySchema

const DeviceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userAgent: z.string(),
  ip: z.string(),
  lastActive: z.date(),
  createdAt: z.date(),
  isActive: z.boolean()
})

const DeviceBodySchema = DeviceSchema.pick({
  userId: true,
  userAgent: true,
  ip: true,
  lastActive: true,
  isActive: true
}).strict()

const RoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
  createdById: true,
  updatedById: true
}).strict()

const GoogleAuthStateSchema = DeviceSchema.pick({
  userAgent: true,
  ip: true
})

const GetAuthorizationUrlResSchema = z.object({
  url: z.string().url()
})

const ForgotPasswordBodySchema = z
  .object({
    email: z.string().email(),
    code: z.string().length(6),
    newPassword: z.string().min(6).max(100),
    confirmNewPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmNewPassword, newPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password and confirm password must match',
        path: ['confirmNewPassword']
      })
    }
  })

const DisableTwoFactorBodySchema = z
  .object({
    totpCode: z.string().length(6).optional(),
    code: z.string().length(6).optional()
  })
  .strict()
  .superRefine(({ totpCode, code }, ctx) => {
    if ((totpCode !== undefined) === (code !== undefined)) {
      const message = 'Only one of totpCode or code should be provided'
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['totpCode']
      })
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['code']
      })
    }
  })

const TwoFactorSetupResSchema = z.object({
  secret: z.string(),
  uri: z.string()
})

// type
type RegisterBodyType = z.infer<typeof RegisterBodySchema>
type RegisterResType = z.infer<typeof RegisterResSchema>
type VerificationCodeType = z.infer<typeof VerificationCodeSchema>
type SendOtpBodyType = z.infer<typeof SendOtpBodySchema>
type SendOtpResType = z.infer<typeof SendOtpResSchema>
type LoginBodyType = z.infer<typeof LoginBodySchema>
type LoginResType = z.infer<typeof LoginResSchema>
type RefreshTokenType = z.infer<typeof RefreshTokenSchema>
type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>
type RefreshTokenResType = z.infer<typeof RefreshTokenResSchema>
type LogoutBodyType = z.infer<typeof LogoutBodySchema>
type DeviceType = z.infer<typeof DeviceSchema>
type GoogleAuthStateType = z.infer<typeof GoogleAuthStateSchema>
type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBodySchema>
type DisableTwoFactorBodyType = z.infer<typeof DisableTwoFactorBodySchema>
type TwoFactorSetupResType = z.infer<typeof TwoFactorSetupResSchema>

export {
  VerificationCodeSchema,
  RegisterBodySchema,
  RegisterResSchema,
  SendOtpBodySchema,
  SendOtpResSchema,
  LoginBodySchema,
  LoginResSchema,
  RefreshTokenBodySchema,
  RefreshTokenResSchema,
  LogoutBodySchema,
  DeviceBodySchema,
  RoleBodySchema,
  GoogleAuthStateSchema,
  GetAuthorizationUrlResSchema,
  ForgotPasswordBodySchema,
  DisableTwoFactorBodySchema,
  TwoFactorSetupResSchema,
  RegisterBodyType,
  RegisterResType,
  VerificationCodeType,
  SendOtpBodyType,
  SendOtpResType,
  LoginBodyType,
  LoginResType,
  RefreshTokenType,
  RefreshTokenBodyType,
  RefreshTokenResType,
  LogoutBodyType,
  DeviceType,
  GoogleAuthStateType,
  ForgotPasswordBodyType,
  DisableTwoFactorBodyType,
  TwoFactorSetupResType
}
