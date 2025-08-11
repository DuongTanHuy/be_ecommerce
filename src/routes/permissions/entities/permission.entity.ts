import { HTTPMethod } from 'src/shared/constants/role.constant'
import z from 'zod'

const PermissionSchema = z.object({
  id: z.number(),
  name: z.string().max(500),
  description: z.string(),
  path: z.string().max(1000),
  method: z.nativeEnum(HTTPMethod),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

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

type PermissionType = z.infer<typeof PermissionSchema>

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
  PermissionType,
  GetPermissionQueryType,
  GetPermissionResType,
  GetPermissionParamsType,
  CreatePermissionBodyType,
  UpdatePermissionBodyType
}
