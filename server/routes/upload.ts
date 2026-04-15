import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { FastifyInstance } from 'fastify'
import { requireAdmin } from '../lib/auth'
import { env } from '../env'

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
])

const extensionByMimeType: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
}

export default async function uploadRoutes(app: FastifyInstance) {
  app.post('/api/admin/upload', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const file = await request.file()

    if (!file) {
      reply.code(400).send({ message: 'Файл не был загружен.' })
      return
    }

    if (!allowedMimeTypes.has(file.mimetype)) {
      reply.code(400).send({ message: 'Поддерживаются только изображения JPG, PNG, WEBP и SVG.' })
      return
    }

    const buffer = await file.toBuffer()
    const uploadRoot = path.resolve(process.cwd(), env.UPLOAD_DIR)
    const extension = extensionByMimeType[file.mimetype] ?? path.extname(file.filename) ?? ''
    const filename = `${Date.now()}-${randomUUID()}${extension}`

    await mkdir(uploadRoot, { recursive: true })
    await writeFile(path.join(uploadRoot, filename), buffer)

    return {
      url: `/uploads/${filename}`,
    }
  })
}
