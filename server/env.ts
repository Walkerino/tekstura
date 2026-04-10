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

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().int().min(1).max(65535),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(12),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),
  UPLOAD_DIR: z.string().min(1),
})

export const env = envSchema.parse(process.env)
