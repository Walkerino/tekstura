import { exec as execCallback } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { promisify } from 'node:util'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import rateLimit from '@fastify/rate-limit'
import fastifyStatic from '@fastify/static'
import Fastify from 'fastify'
import adminRoutes from './routes/admin'
import publicRoutes from './routes/public'
import uploadRoutes from './routes/upload'
import { adminCookieName, ensureDefaultAdmin } from './lib/auth'
import { env } from './env'

const exec = promisify(execCallback)
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(projectRoot, 'dist')
const uploadsDir = path.resolve(projectRoot, env.UPLOAD_DIR)
const prismaDir = path.join(projectRoot, 'prisma')
const initSqlPath = path.join(prismaDir, 'init.sql')

function resolveSqliteDbPath(databaseUrl: string) {
  if (!databaseUrl.startsWith('file:')) {
    throw new Error('Для текущей конфигурации поддерживается только SQLite DATABASE_URL.')
  }

  const relativePath = databaseUrl.slice('file:'.length)
  return path.resolve(prismaDir, relativePath)
}

async function ensureDatabase() {
  const dbPath = resolveSqliteDbPath(env.DATABASE_URL)
  await mkdir(path.dirname(dbPath), { recursive: true })

  if (!existsSync(initSqlPath)) {
    throw new Error(`Не найден SQL-файл инициализации: ${initSqlPath}`)
  }

  if (!existsSync(dbPath)) {
    throw new Error(
      `SQLite база не найдена: ${dbPath}. Создайте файл БД через scripts/deploy.sh (npm run db:push) перед запуском сервиса.`,
    )
  }

  // Best-effort init: if sqlite3 CLI is unavailable on host, app should still start with existing DB.
  await exec(`sqlite3 "${dbPath}" < "${initSqlPath}"`, {
    cwd: projectRoot,
  }).catch((error) => {
    const stderr = typeof error?.stderr === 'string' ? error.stderr : ''
    const stdout = typeof error?.stdout === 'string' ? error.stdout : ''
    const output = `${stderr}\n${stdout}`.trim()

    if (output.includes('sqlite3: not found') || output.includes('command not found')) {
      console.warn('[startup] sqlite3 CLI not found, skipping DB bootstrap at runtime.')
      return
    }

    throw error
  })
}

async function start() {
  await ensureDatabase()
  await mkdir(uploadsDir, { recursive: true })

  const app = Fastify({
    logger: env.NODE_ENV !== 'production',
  })

  if (env.NODE_ENV === 'production') {
    app.addHook('onSend', async (_request, reply) => {
      reply.header('X-Content-Type-Options', 'nosniff')
      reply.header('X-Frame-Options', 'DENY')
      reply.header('Referrer-Policy', 'strict-origin-when-cross-origin')
      reply.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
      reply.header('Cross-Origin-Opener-Policy', 'same-origin')
      reply.header('Cross-Origin-Resource-Policy', 'same-origin')
      reply.header(
        'Content-Security-Policy',
        "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self'",
      )
    })
  }

  await app.register(cookie)
  await app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: adminCookieName,
      signed: false,
    },
  })
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 1,
    },
  })
  await app.register(rateLimit, {
    global: false,
  })

  if (existsSync(distDir)) {
    await app.register(fastifyStatic, {
      root: distDir,
      prefix: '/',
    })
  }

  await app.register(fastifyStatic, {
    root: uploadsDir,
    prefix: '/uploads/',
    decorateReply: false,
  })

  await app.register(publicRoutes)
  await app.register(adminRoutes)
  await app.register(uploadRoutes)

  if (existsSync(distDir)) {
    app.setNotFoundHandler((request, reply) => {
      if (
        request.method !== 'GET' ||
        request.url.startsWith('/api') ||
        request.url.startsWith('/uploads/')
      ) {
        reply.code(404).send({ message: 'Маршрут не найден.' })
        return
      }

      reply.type('text/html').sendFile('index.html')
    })
  } else {
    app.setNotFoundHandler((_request, reply) => {
      reply.code(404).send({ message: 'Маршрут не найден.' })
    })
  }

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error)
    const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500

    reply.code(statusCode).send({
      message:
        statusCode >= 500 || env.NODE_ENV === 'production'
          ? 'Ошибка выполнения запроса.'
          : error.message,
    })
  })

  await ensureDefaultAdmin()

  await app.listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
}

start().catch((error) => {
  console.error(error)
  process.exit(1)
})
