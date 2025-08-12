import { PermissionSchema } from 'src/shared/models/shared-permission.model'
import z from 'zod'

const GetPermissionQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10)
  })
  .strict()

const GetPermissionResSchema = z.object({
  permissions: z.array(PermissionSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

const GetPermissionParamsSchema = z.object({
  permissionId: z.string()
})

const GetPermissionDetailResSchema = PermissionSchema

const CreatePermissionBodySchema = PermissionSchema.pick({
  name: true,
  path: true,
  method: true
}).strict()

const UpdatePermissionBodySchema = PermissionSchema.partial().strict()

type GetPermissionQueryType = z.infer<typeof GetPermissionQuerySchema>
type GetPermissionResType = z.infer<typeof GetPermissionResSchema>
type GetPermissionParamsType = z.infer<typeof GetPermissionParamsSchema>

type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>
type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>

export {
  PermissionSchema,
  GetPermissionQuerySchema,
  GetPermissionResSchema,
  GetPermissionParamsSchema,
  GetPermissionDetailResSchema,
  CreatePermissionBodySchema,
  UpdatePermissionBodySchema,
  GetPermissionQueryType,
  GetPermissionResType,
  GetPermissionParamsType,
  CreatePermissionBodyType,
  UpdatePermissionBodyType
}
