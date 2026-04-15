import bcrypt from 'bcryptjs'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { env } from '../env'
import { prisma } from './prisma'

export const adminCookieName = 'tekstura_admin_token'

export type AdminSession = {
  email: string
  sub: string
}

export async function ensureDefaultAdmin() {
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10)

  await prisma.adminUser.upsert({
    where: { email: env.ADMIN_EMAIL },
    update: { passwordHash },
    create: {
      email: env.ADMIN_EMAIL,
      passwordHash,
    },
  })
}

export async function resolveSession(
  request: FastifyRequest,
): Promise<AdminSession | null> {
  try {
    await request.jwtVerify<{ sub: string; email: string }>({ onlyCookie: true })
    const user = request.user as AdminSession

    return {
      sub: user.sub,
      email: user.email,
    }
  } catch {
    return null
  }
}

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const session = await resolveSession(request)

  if (!session) {
    reply.code(401).send({ message: 'Требуется авторизация администратора.' })
    return null
  }

  return session
}

export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { email },
  })

  if (!admin) {
    return null
  }

  const isValid = await bcrypt.compare(password, admin.passwordHash)

  if (!isValid) {
    return null
  }

  return {
    sub: admin.id,
    email: admin.email,
  }
}

export function setAdminSession(
  request: FastifyRequest,
  reply: FastifyReply,
  session: AdminSession,
) {
  const token = request.server.jwt.sign(session, {
    expiresIn: '7d',
  })

  reply.setCookie(adminCookieName, token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production',
  })
}

export function clearAdminSession(reply: FastifyReply) {
  reply.clearCookie(adminCookieName, {
    path: '/',
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production',
  })
}
