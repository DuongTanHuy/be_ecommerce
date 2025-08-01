import { createZodDto } from 'nestjs-zod'
import {
  GetAuthorizationUrlResSchema,
  LoginBodySchema,
  LoginResSchema,
  LogoutBodySchema,
  RefreshTokenBodySchema,
  RefreshTokenResSchema,
  RegisterBodySchema,
  RegisterResSchema,
  SendOtpBodySchema,
  SendOtpResSchema
} from 'src/routes/auth/entities/auth.entity'

// const RegisterBodySchema = z
//   .object({
//     email: z.string().email(),
//     password: z.string().min(6).max(100),
//     name: z.string().min(1).max(100),
//     confirmPassword: z.string().min(6).max(100),
//     phoneNumber: z.string().min(9).max(15)
//   })
//   // neu du lieu bi du thua thi se throw ra loi
//   .strict()
//   .superRefine(({ confirmPassword, password }, ctx) => {
//     if (confirmPassword !== password) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Password and confirm password must match',
//         path: ['confirmPassword']
//       })
//     }
//   })

class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}
class RegisterResDto extends createZodDto(RegisterResSchema) {}

class SendOtpBodyDto extends createZodDto(SendOtpBodySchema) {}
class SendOtpResDto extends createZodDto(SendOtpResSchema) {}

class LoginBodyDto extends createZodDto(LoginBodySchema) {}
class LoginResDto extends createZodDto(LoginResSchema) {}

class RefreshTokenBodyDto extends createZodDto(RefreshTokenBodySchema) {}
class RefreshTokenResDto extends createZodDto(RefreshTokenResSchema) {}

class LogoutBodyDto extends createZodDto(LogoutBodySchema) {}

class GetAuthorizationUrlResDto extends createZodDto(GetAuthorizationUrlResSchema) {}

export {
  RegisterBodyDto,
  RegisterResDto,
  SendOtpBodyDto,
  SendOtpResDto,
  LoginBodyDto,
  LoginResDto,
  RefreshTokenBodyDto,
  RefreshTokenResDto,
  LogoutBodyDto,
  GetAuthorizationUrlResDto
}
