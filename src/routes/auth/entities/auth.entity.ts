import { VerificationCode } from 'src/shared/constants/auth.constant'
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
}).strict()

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

const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  updatedAt: z.date()
})

const RoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
  createdById: true,
  updatedById: true
}).strict()

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
type RoleType = z.infer<typeof RoleSchema>

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
  RoleType
}
