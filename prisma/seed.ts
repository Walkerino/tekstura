import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@tekstura.local'
const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!'

async function main() {
  const passwordHash = await bcrypt.hash(adminPassword, 10)

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  })

  const [casesCount, reviewsCount, newsCount] = await Promise.all([
    prisma.caseItem.count(),
    prisma.reviewItem.count(),
    prisma.newsPost.count(),
  ])

  if (casesCount === 0) {
    await prisma.caseItem.createMany({
      data: [
        {
          id: 'case-1',
          slug: 'portfolio-one',
          title: 'Portfolio One',
          tag: 'Веб-дизайн',
          coverImageUrl: '/assets/classic.png',
          isPublished: true,
          sortOrder: 0,
        },
        {
          id: 'case-2',
          slug: 'portfolio-two',
          title: 'Portfolio Two',
          tag: 'Айдентика',
          coverImageUrl: '/assets/classic.png',
          isPublished: true,
          sortOrder: 1,
        },
        {
          id: 'case-3',
          slug: 'portfolio-three',
          title: 'Portfolio Three',
          tag: 'Дизайн упаковки',
          coverImageUrl: '/assets/classic.png',
          isPublished: true,
          sortOrder: 2,
        },
        {
          id: 'case-4',
          slug: 'portfolio-four',
          title: 'Portfolio Four',
          tag: 'UX/UI',
          coverImageUrl: '/assets/classic.png',
          isPublished: true,
          sortOrder: 3,
        },
      ],
    })

    await prisma.caseImage.createMany({
      data: [
        { caseId: 'case-1', imageUrl: '/assets/classic.png', sortOrder: 0 },
        { caseId: 'case-1', imageUrl: '/assets/contact-clouds.png', sortOrder: 1 },
        { caseId: 'case-2', imageUrl: '/assets/classic.png', sortOrder: 0 },
        { caseId: 'case-2', imageUrl: '/assets/contact-clouds.png', sortOrder: 1 },
        { caseId: 'case-3', imageUrl: '/assets/classic.png', sortOrder: 0 },
        { caseId: 'case-3', imageUrl: '/assets/contact-clouds.png', sortOrder: 1 },
        { caseId: 'case-4', imageUrl: '/assets/classic.png', sortOrder: 0 },
        { caseId: 'case-4', imageUrl: '/assets/contact-clouds.png', sortOrder: 1 },
      ],
    })
  }

  if (reviewsCount === 0) {
    await prisma.reviewItem.createMany({
      data: [
        {
          logoUrl: '/assets/review-webflow.png',
          quote:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim scelerisque massa, ac pretium lorem consequat eu. Praesent nec augue.',
          authorName: 'Webflow',
          authorRole: 'Клиент',
          isPublished: true,
          sortOrder: 0,
        },
        {
          logoUrl: '/assets/review-figma.png',
          quote:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim scelerisque massa, ac pretium lorem consequat eu. Praesent nec augue.',
          authorName: 'Figma',
          authorRole: 'Клиент',
          isPublished: true,
          sortOrder: 1,
        },
        {
          logoUrl: '/assets/review-relume.png',
          quote:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim scelerisque massa, ac pretium lorem consequat eu. Praesent nec augue.',
          authorName: 'Relume',
          authorRole: 'Клиент',
          isPublished: true,
          sortOrder: 2,
        },
      ],
    })
  }

  if (newsCount === 0) {
    await prisma.newsPost.createMany({
      data: [
        {
          slug: 'news-one',
          publishedAt: new Date('2026-04-03T00:00:00.000Z'),
          title: 'Заголовок новостей',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc diam nisi, tempus pretium sodales quis, bibendum in nibh.',
          isPublished: true,
        },
        {
          slug: 'news-two',
          publishedAt: new Date('2026-04-02T00:00:00.000Z'),
          title: 'Заголовок новостей',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc diam nisi, tempus pretium sodales quis, bibendum in nibh.',
          isPublished: true,
        },
      ],
    })
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
