import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'
import z from 'zod'

config({
  path: '.env'
})

// Check file .env is exist
if (!fs.existsSync(path.resolve('.env'))) {
  console.error('File .env is not exist')
  process.exit(1)
}

const configSchema = z.object({
  POST: z.string(),
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  SECRET_KEY: z.string(),
  ADMIN_NAME: z.string(),
  ADMIN_PASSWORD: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PHONE_NUMBER: z.string(),
  OTP_EXPIRES_IN: z.string(),
  RESEND_API_KEY: z.string()
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
  console.log('The values specified in .evn are invalid:', configServer.error)

  process.exit(1)
}

const envConfig = configServer.data

export default envConfig
