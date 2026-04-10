import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { createExcerpt } from '../lib/content'

const auditSchema = z.object({
  email: z.string().email('Укажите корректный e-mail.'),
  source: z.string().trim().max(120).optional(),
  website: z.string().trim().max(120).optional(),
})

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Укажите имя.').max(120),
  email: z.string().email('Укажите корректный e-mail.'),
  message: z.string().trim().min(5, 'Опишите вопрос подробнее.').max(4000),
  website: z.string().trim().max(120).optional(),
})

function serializeCaseListItem(item: {
  id: string
  slug: string
  title: string
  tag: string
  coverImageUrl: string
}) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    tag: item.tag,
    coverImageUrl: item.coverImageUrl,
  }
}

export default async function publicRoutes(app: FastifyInstance) {
  app.get('/api/health', async () => ({
    ok: true,
  }))

  app.get('/api/cases', async () => {
    const items = await prisma.caseItem.findMany({
      where: { isPublished: true },
      orderBy: [{ createdAt: 'desc' }],
      select: {
        id: true,
        slug: true,
        title: true,
        tag: true,
        coverImageUrl: true,
      },
    })

    return {
      items: items.map(serializeCaseListItem),
    }
  })

  app.get('/api/cases/:slug', async (request, reply) => {
    const params = z
      .object({
        slug: z.string().min(1),
      })
      .parse(request.params)

    const item = await prisma.caseItem.findFirst({
      where: {
        slug: params.slug,
        isPublished: true,
      },
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
      item: {
        id: item.id,
        slug: item.slug,
        title: item.title,
        tag: item.tag,
        coverImageUrl: item.coverImageUrl,
        galleryImages: item.images.map((image) => image.imageUrl),
      },
    }
  })

  app.get('/api/reviews', async () => {
    const items = await prisma.reviewItem.findMany({
      where: { isPublished: true },
      orderBy: [{ createdAt: 'desc' }],
    })

    return {
      items: items.map((item) => ({
        id: item.id,
        companyName: item.authorName ?? '',
        logoUrl: item.logoUrl,
        quote: item.quote,
      })),
    }
  })

  app.get('/api/news', async () => {
    const items = await prisma.newsPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    })

    return {
      items: items.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        content: item.content,
        excerpt: createExcerpt(item.content),
        publishedAt: item.publishedAt.toISOString(),
      })),
    }
  })

  app.get('/api/news/:slug', async (request, reply) => {
    const params = z
      .object({
        slug: z.string().min(1),
      })
      .parse(request.params)

    const item = await prisma.newsPost.findFirst({
      where: {
        slug: params.slug,
        isPublished: true,
      },
    })

    if (!item) {
      reply.code(404).send({ message: 'Новость не найдена.' })
      return
    }

    return {
      item: {
        id: item.id,
        slug: item.slug,
        title: item.title,
        content: item.content,
        publishedAt: item.publishedAt.toISOString(),
      },
    }
  })

  app.post(
    '/api/forms/audit',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    async (request, reply) => {
      const body = auditSchema.safeParse(request.body)

      if (!body.success) {
        reply.code(400).send({
          message: body.error.issues[0]?.message ?? 'Некорректные данные формы.',
        })
        return
      }

      if (body.data.website) {
        return { ok: true }
      }

      await prisma.auditRequest.create({
        data: {
          email: body.data.email.trim(),
          source: body.data.source?.trim() || null,
        },
      })

      return { ok: true }
    },
  )

  app.post(
    '/api/forms/contact',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    async (request, reply) => {
      const body = contactSchema.safeParse(request.body)

      if (!body.success) {
        reply.code(400).send({
          message: body.error.issues[0]?.message ?? 'Некорректные данные формы.',
        })
        return
      }

      if (body.data.website) {
        return { ok: true }
      }

      await prisma.contactRequest.create({
        data: {
          name: body.data.name.trim(),
          email: body.data.email.trim(),
          message: body.data.message.trim(),
        },
      })

      return { ok: true }
    },
  )
}
