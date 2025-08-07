import z from 'zod'

const LanguageSchema = z.object({
  id: z.string().max(10),
  name: z.string().max(500),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

const GetAllLanguageResSchema = z.object({
  data: z.array(LanguageSchema),
  totalItem: z.number()
})
const GetLanguageParamsSchema = z
  .object({
    languageId: z.string().max(10)
  })
  .strict()
const GetDetailLanguageResSchema = LanguageSchema

const CreateLanguageBodySchema = LanguageSchema.pick({
  id: true,
  name: true
}).strict()

const CreateLanguageResSchema = LanguageSchema

const UpdateLanguageBodySchema = LanguageSchema.pick({
  name: true
})

const UpdateLanguageResSchema = LanguageSchema

type LanguageType = z.infer<typeof LanguageSchema>
type CreateLanguageBodyType = z.infer<typeof CreateLanguageBodySchema>
type CreateLanguageResType = z.infer<typeof CreateLanguageResSchema>
type UpdateLanguageBodyType = z.infer<typeof UpdateLanguageBodySchema>
type UpdateLanguageResType = z.infer<typeof UpdateLanguageResSchema>

export {
  LanguageSchema,
  GetAllLanguageResSchema,
  GetLanguageParamsSchema,
  GetDetailLanguageResSchema,
  CreateLanguageBodySchema,
  CreateLanguageResSchema,
  UpdateLanguageBodySchema,
  UpdateLanguageResSchema,
  // type
  LanguageType,
  CreateLanguageBodyType,
  CreateLanguageResType,
  UpdateLanguageBodyType,
  UpdateLanguageResType
}
