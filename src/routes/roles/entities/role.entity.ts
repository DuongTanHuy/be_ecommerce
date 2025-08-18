import { PermissionSchema } from 'src/shared/models/shared-permission.model'
import { RoleSchema } from 'src/shared/models/shared-role.model'
import z from 'zod'

const RoleWithPermissionsSchema = RoleSchema.extend({
  permissions: z.array(PermissionSchema)
})

const GetRoleQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10)
  })
  .strict()

const GetRoleResSchema = z.object({
  roles: z.array(RoleSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

const GetRoleDetailParamsSchema = z.object({
  roleId: z.string()
})

const GetRoleDetailResSchema = RoleWithPermissionsSchema

const CreateRoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true
}).strict()

const CreateRoleResSchema = RoleSchema

const UpdateRoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true
})
  .extend({
    permissionIds: z.array(z.number())
  })
  .strict()

type GetRoleQueryType = z.infer<typeof GetRoleQuerySchema>
type GetRoleResType = z.infer<typeof GetRoleResSchema>
type GetRoleDetailParamsType = z.infer<typeof GetRoleDetailParamsSchema>
type GetRoleDetailResType = z.infer<typeof GetRoleDetailResSchema>
type CreateRoleBodyType = z.infer<typeof CreateRoleBodySchema>
type UpdateRoleBodyType = z.infer<typeof UpdateRoleBodySchema>

export {
  GetRoleQuerySchema,
  GetRoleResSchema,
  GetRoleDetailParamsSchema,
  GetRoleDetailResSchema,
  CreateRoleBodySchema,
  CreateRoleResSchema,
  UpdateRoleBodySchema,
  GetRoleQueryType,
  GetRoleResType,
  GetRoleDetailParamsType,
  GetRoleDetailResType,
  CreateRoleBodyType,
  UpdateRoleBodyType
}
