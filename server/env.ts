import 'dotenv/config'
import { z } from 'zod'

function setDefaultEnv(key: string, value: string) {
  if (!process.env[key]) {
    process.env[key] = value
  }
}

setDefaultEnv('NODE_ENV', 'development')
setDefaultEnv('PORT', '3001')
setDefaultEnv('DATABASE_URL', 'file:./dev.db')
setDefaultEnv('JWT_SECRET', 'tekstura-local-secret')
setDefaultEnv('ADMIN_EMAIL', 'admin@tekstura.local')
setDefaultEnv('ADMIN_PASSWORD', 'ChangeMe123!')
setDefaultEnv('UPLOAD_DIR', 'uploads')
setDefaultEnv('AUDIT_NOTIFICATION_EMAIL', 'kleynovino@mail.ru')
setDefaultEnv('SMTP_HOST', '')
setDefaultEnv('SMTP_PORT', '465')
setDefaultEnv('SMTP_SECURE', 'true')
setDefaultEnv('SMTP_USER', '')
setDefaultEnv('SMTP_PASSWORD', '')
setDefaultEnv('SMTP_FROM', '')

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().int().min(1).max(65535),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(12),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),
  UPLOAD_DIR: z.string().min(1),
  AUDIT_NOTIFICATION_EMAIL: z.string().email(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535),
  SMTP_SECURE: z
    .string()
    .transform((value) => value.toLowerCase() === 'true')
    .pipe(z.boolean()),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
})

export const env = envSchema.parse(process.env)

if (env.NODE_ENV === 'production') {
  if (env.JWT_SECRET === 'tekstura-local-secret') {
    throw new Error('В production необходимо задать уникальный JWT_SECRET в окружении.')
  }

  if (env.ADMIN_PASSWORD === 'ChangeMe123!') {
    throw new Error('В production необходимо задать безопасный ADMIN_PASSWORD в окружении.')
  }

  if (env.ADMIN_EMAIL === 'admin@tekstura.local') {
    throw new Error('В production необходимо задать реальный ADMIN_EMAIL в окружении.')
  }
}
