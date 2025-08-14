import { UserStatus } from 'src/shared/constants/auth.constant'
import { PermissionSchema } from 'src/shared/models/shared-permission.model'
import { RoleSchema } from 'src/shared/models/shared-role.model'
import z from 'zod'

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(6).max(100),
  phoneNumber: z.string().min(9).max(15),
  avatar: z.string().nullable(),
  totpSecret: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
  roleId: z.number().positive(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

const ProfileSchema = UserSchema.omit({
  password: true,
  totpSecret: true
}).extend({
  role: RoleSchema.pick({
    id: true,
    name: true
  }).extend({
    permissions: z.array(
      PermissionSchema.pick({
        id: true,
        name: true,
        module: true,
        path: true,
        method: true
      })
    )
  })
})

const ProfileUpdateResSchema = UserSchema.omit({
  password: true,
  totpSecret: true
})

type ProfileUpdateResType = z.infer<typeof ProfileUpdateResSchema>

type UserType = z.infer<typeof UserSchema>
type ProfileType = z.infer<typeof ProfileSchema>

export { UserSchema, ProfileSchema, ProfileUpdateResSchema, UserType, ProfileType, ProfileUpdateResType }
