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

type PermissionType = z.infer<typeof PermissionSchema>

export { PermissionSchema, PermissionType }
