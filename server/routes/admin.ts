import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  clearAdminSession,
  requireAdmin,
  resolveSession,
  setAdminSession,
  verifyAdminCredentials,
} from '../lib/auth'
import { prisma } from '../lib/prisma'
import { buildUniqueSlug } from '../lib/slug'
import { createExcerpt } from '../lib/content'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const caseSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  tag: z.string().trim().min(1),
  coverImageUrl: z.string().trim().min(1),
  galleryImages: z.array(z.string().trim().min(1)).default([]),
})

const reviewSchema = z.object({
  companyName: z.string().trim().min(1),
  logoUrl: z.string().trim().min(1),
  quote: z.string().trim().min(1),
})

const newsSchema = z.object({
  title: z.string().trim().min(1),
  publishedAt: z.string().min(1),
  content: z.string().trim().min(1),
})

const idParamsSchema = z.object({
  id: z.string().min(1),
})

function serializeCase(item: {
  id: string
  slug: string
  title: string
  description: string
  tag: string
  coverImageUrl: string
  createdAt: Date
  updatedAt: Date
  images: Array<{ imageUrl: string }>
}) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    tag: item.tag,
    coverImageUrl: item.coverImageUrl,
    galleryImages: item.images.map((image) => image.imageUrl),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }
}

function serializeReview(item: {
  id: string
  logoUrl: string
  quote: string
  authorName: string | null
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: item.id,
    companyName: item.authorName ?? '',
    logoUrl: item.logoUrl,
    quote: item.quote,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }
}

function serializeNews(item: {
  id: string
  slug: string
  title: string
  content: string
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    content: item.content,
    excerpt: createExcerpt(item.content),
    publishedAt: item.publishedAt.toISOString(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }
}

async function resolveCaseSlug(title: string, currentId?: string) {
  return buildUniqueSlug(title, async (candidate) => {
    const existing = await prisma.caseItem.findFirst({
      where: {
        slug: candidate,
        ...(currentId
          ? {
              NOT: {
                id: currentId,
              },
            }
          : {}),
      },
      select: { id: true },
    })

    return Boolean(existing)
  })
}

async function resolveNewsSlug(title: string, currentId?: string) {
  return buildUniqueSlug(title, async (candidate) => {
    const existing = await prisma.newsPost.findFirst({
      where: {
        slug: candidate,
        ...(currentId
          ? {
              NOT: {
                id: currentId,
              },
            }
          : {}),
      },
      select: { id: true },
    })

    return Boolean(existing)
  })
}

export default async function adminRoutes(app: FastifyInstance) {
  app.post(
    '/api/admin/auth/login',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '15 minutes',
        },
      },
    },
    async (request, reply) => {
      const body = loginSchema.safeParse(request.body)

      if (!body.success) {
        reply.code(400).send({ message: 'Некорректные данные для входа.' })
        return
      }

      const session = await verifyAdminCredentials(body.data.email.trim(), body.data.password)

      if (!session) {
        reply.code(401).send({ message: 'Неверный e-mail или пароль.' })
        return
      }

      setAdminSession(request, reply, session)

      return {
        authenticated: true,
        user: {
          email: session.email,
        },
      }
    },
  )

  app.post('/api/admin/auth/logout', async (_request, reply) => {
    clearAdminSession(reply)

    return {
      ok: true,
    }
  })

  app.get('/api/admin/session', async (request) => {
    const session = await resolveSession(request)

    return {
      authenticated: Boolean(session),
      user: session ? { email: session.email } : null,
    }
  })

  app.get('/api/admin/overview', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const [casesCount, reviewsCount, newsCount, auditsCount, contactsCount] =
      await Promise.all([
        prisma.caseItem.count(),
        prisma.reviewItem.count(),
        prisma.newsPost.count(),
        prisma.auditRequest.count(),
        prisma.contactRequest.count(),
      ])

    return {
      counts: {
        cases: casesCount,
        reviews: reviewsCount,
        news: newsCount,
        auditRequests: auditsCount,
        contactRequests: contactsCount,
      },
    }
  })

  app.get('/api/admin/cases', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const items = await prisma.caseItem.findMany({
      orderBy: [{ updatedAt: 'desc' }],
      include: {
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    })

    return {
      items: items.map(serializeCase),
    }
  })

  app.get('/api/admin/cases/:id', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const params = idParamsSchema.parse(request.params)

    const item = await prisma.caseItem.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    })

    if (!item) {
      reply.code(404).send({ message: 'Кейс не найден.' })
      return
    }

    return {
      item: serializeCase(item),
    }
  })

  app.post('/api/admin/cases', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const body = caseSchema.safeParse(request.body)

    if (!body.success) {
      reply.code(400).send({ message: 'Проверьте данные кейса.' })
      return
    }

    const slug = await resolveCaseSlug(body.data.title)

    const item = await prisma.caseItem.create({
      data: {
        slug,
        title: body.data.title,
        description: body.data.description,
        tag: body.data.tag,
        coverImageUrl: body.data.coverImageUrl,
        isPublished: true,
        images: {
          createMany: {
            data: body.data.galleryImages.map((imageUrl, index) => ({
              imageUrl,
              sortOrder: index,
            })),
          },
        },
      },
      include: {
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    })

    reply.code(201)

    return {
      item: serializeCase(item),
    }
  })

  app.patch('/api/admin/cases/:id', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const params = idParamsSchema.parse(request.params)
    const body = caseSchema.safeParse(request.body)

    if (!body.success) {
      reply.code(400).send({ message: 'Проверьте данные кейса.' })
      return
    }

    const existing = await prisma.caseItem.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      reply.code(404).send({ message: 'Кейс не найден.' })
      return
    }

    const slug = await resolveCaseSlug(body.data.title, existing.id)

    const item = await prisma.caseItem.update({
      where: { id: params.id },
      data: {
        slug,
        title: body.data.title,
        description: body.data.description,
        tag: body.data.tag,
        coverImageUrl: body.data.coverImageUrl,
        isPublished: true,
        images: {
          deleteMany: {},
          createMany: {
            data: body.data.galleryImages.map((imageUrl, index) => ({
              imageUrl,
              sortOrder: index,
            })),
          },
        },
      },
      include: {
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    })

    return {
      item: serializeCase(item),
    }
  })

  app.delete('/api/admin/cases/:id', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const params = idParamsSchema.parse(request.params)

    await prisma.caseItem.delete({
      where: { id: params.id },
    })

    reply.code(204)
    return reply.send()
  })

  app.get('/api/admin/reviews', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const items = await prisma.reviewItem.findMany({
      orderBy: [{ updatedAt: 'desc' }],
    })

    return {
      items: items.map(serializeReview),
    }
  })

  app.get('/api/admin/reviews/:id', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const params = idParamsSchema.parse(request.params)

    const item = await prisma.reviewItem.findUnique({
      where: { id: params.id },
    })

    if (!item) {
      reply.code(404).send({ message: 'Отзыв не найден.' })
      return
    }

    return {
      item: serializeReview(item),
    }
  })

  app.post('/api/admin/reviews', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const body = reviewSchema.safeParse(request.body)

    if (!body.success) {
      reply.code(400).send({ message: 'Проверьте данные отзыва.' })
      return
    }

    const item = await prisma.reviewItem.create({
      data: {
        logoUrl: body.data.logoUrl,
        quote: body.data.quote,
        authorName: body.data.companyName,
        authorRole: null,
        isPublished: true,
      },
    })

    reply.code(201)

    return {
      item: serializeReview(item),
    }
  })

  app.patch('/api/admin/reviews/:id', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const params = idParamsSchema.parse(request.params)
    const body = reviewSchema.safeParse(request.body)

    if (!body.success) {
      reply.code(400).send({ message: 'Проверьте данные отзыва.' })
      return
    }

    const item = await prisma.reviewItem.update({
      where: { id: params.id },
      data: {
        logoUrl: body.data.logoUrl,
        quote: body.data.quote,
        authorName: body.data.companyName,
        authorRole: null,
        isPublished: true,
      },
    })

    return {
      item: serializeReview(item),
    }
  })

  app.delete('/api/admin/reviews/:id', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const params = idParamsSchema.parse(request.params)

    await prisma.reviewItem.delete({
      where: { id: params.id },
    })

    reply.code(204)
    return reply.send()
  })

  app.get('/api/admin/news', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const items = await prisma.newsPost.findMany({
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
    })

    return {
      items: items.map(serializeNews),
    }
  })

  app.get('/api/admin/news/:id', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const params = idParamsSchema.parse(request.params)

    const item = await prisma.newsPost.findUnique({
      where: { id: params.id },
    })

    if (!item) {
      reply.code(404).send({ message: 'Новость не найдена.' })
      return
    }

    return {
      item: serializeNews(item),
    }
  })

  app.post('/api/admin/news', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const body = newsSchema.safeParse(request.body)

    if (!body.success) {
      reply.code(400).send({ message: 'Проверьте данные новости.' })
      return
    }

    const publishedAt = new Date(body.data.publishedAt)

    if (Number.isNaN(publishedAt.getTime())) {
      reply.code(400).send({ message: 'Укажите корректную дату публикации.' })
      return
    }

    const slug = await resolveNewsSlug(body.data.title)

    const item = await prisma.newsPost.create({
      data: {
        slug,
        title: body.data.title,
        content: body.data.content,
        publishedAt,
        isPublished: true,
      },
    })

    reply.code(201)

    return {
      item: serializeNews(item),
    }
  })

  app.patch('/api/admin/news/:id', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const params = idParamsSchema.parse(request.params)
    const body = newsSchema.safeParse(request.body)

    if (!body.success) {
      reply.code(400).send({ message: 'Проверьте данные новости.' })
      return
    }

    const existing = await prisma.newsPost.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      reply.code(404).send({ message: 'Новость не найдена.' })
      return
    }

    const publishedAt = new Date(body.data.publishedAt)

    if (Number.isNaN(publishedAt.getTime())) {
      reply.code(400).send({ message: 'Укажите корректную дату публикации.' })
      return
    }

    const slug = await resolveNewsSlug(body.data.title, existing.id)

    const item = await prisma.newsPost.update({
      where: { id: params.id },
      data: {
        slug,
        title: body.data.title,
        content: body.data.content,
        publishedAt,
        isPublished: true,
      },
    })

    return {
      item: serializeNews(item),
    }
  })

  app.delete('/api/admin/news/:id', async (request, reply) => {
    const session = await requireAdmin(request, reply)

    if (!session) {
      return
    }

    const params = idParamsSchema.parse(request.params)

    await prisma.newsPost.delete({
      where: { id: params.id },
    })

    reply.code(204)
    return reply.send()
  })
}
