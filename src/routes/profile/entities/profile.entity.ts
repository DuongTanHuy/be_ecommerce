import { UserSchema } from 'src/shared/models/shared-user.model'
import z from 'zod'

const ProfileUpdateBodySchema = UserSchema.pick({
  name: true,
  phoneNumber: true,
  avatar: true
}).strict()

const ChangePasswordBodySchema = UserSchema.pick({
  password: true
})
  .extend({
    newPassword: z.string().min(6).max(100),
    confirmNewPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmNewPassword, newPassword, password }, ctx) => {
    if (password === newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'The new password cannot be the same as the old password.',
        path: ['newPassword']
      })
    }

    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'New password and confirm password must match',
        path: ['confirmNewPassword']
      })
    }
  })

type ProfileUpdateBodyType = z.infer<typeof ProfileUpdateBodySchema>
type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>

export { ProfileUpdateBodySchema, ChangePasswordBodySchema, ProfileUpdateBodyType, ChangePasswordBodyType }
