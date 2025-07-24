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
    confirmPassword: z.string().min(6).max(100)
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

// type
type RegisterBodyType = z.infer<typeof RegisterBodySchema>
type RegisterResType = z.infer<typeof RegisterResSchema>
type VerificationCodeType = z.infer<typeof VerificationCodeSchema>
type SendOptBodyType = z.infer<typeof SendOtpBodySchema>

export {
  VerificationCodeSchema,
  RegisterBodySchema,
  RegisterResSchema,
  SendOtpBodySchema,
  RegisterBodyType,
  RegisterResType,
  VerificationCodeType,
  SendOptBodyType
}
