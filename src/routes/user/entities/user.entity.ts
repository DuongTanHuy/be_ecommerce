import { RoleSchema } from 'src/shared/models/shared-role.model'
import { UserSchema } from 'src/shared/models/shared-user.model'
import z from 'zod'

const GetUserQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10)
  })
  .strict()

const GetUserParamsSchema = z.object({
  userId: z.string()
})

const GetUsersResSchema = z.object({
  users: z.array(
    UserSchema.omit({
      password: true,
      totpSecret: true
    }).extend({
      role: RoleSchema.pick({
        id: true,
        name: true
      })
    })
  ),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

const CreateUserBodySchema = UserSchema.pick({
  email: true,
  name: true,
  phoneNumber: true,
  avatar: true,
  password: true,
  roleId: true,
  status: true
}).strict()

const UpdateUserBodySchema = CreateUserBodySchema.partial().strict()

type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>
type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>
type GetUserQueryType = z.infer<typeof GetUserQuerySchema>
type GetUserParamsType = z.infer<typeof GetUserParamsSchema>
type GetUsersResType = z.infer<typeof GetUsersResSchema>

export {
  CreateUserBodySchema,
  UpdateUserBodySchema,
  GetUserQuerySchema,
  GetUserParamsSchema,
  GetUsersResSchema,
  CreateUserBodyType,
  UpdateUserBodyType,
  GetUserQueryType,
  GetUserParamsType,
  GetUsersResType
}
