import type {
  AdminCase,
  AdminCasePayload,
  AdminCounts,
  AdminNews,
  AdminNewsPayload,
  AdminReview,
  AdminReviewPayload,
  AdminSession,
  CaseDetail,
  CaseSummary,
  NewsItem,
  ReviewItem,
} from '../types/content'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, unknown>
}

type ApiErrorPayload = {
  message?: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers)
  let body = options.body as BodyInit | undefined

  if (body && !(body instanceof FormData) && typeof body !== 'string') {
    headers.set('content-type', 'application/json')
    body = JSON.stringify(body)
  }

  let response: Response

  try {
    response = await fetch(path, {
      ...options,
      body,
      credentials: 'same-origin',
      headers,
    })
  } catch {
    throw new ApiError(
      'Не удалось связаться с сервером. Проверьте доступность сервиса и повторите попытку.',
      0,
    )
  }

  let payload: T | ApiErrorPayload | null = null

  if (response.status !== 204) {
    payload = (await response.json().catch(() => null)) as T | ApiErrorPayload | null
  }

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload && payload.message
        ? payload.message
        : 'Ошибка запроса.'

    throw new ApiError(message, response.status)
  }

  return payload as T
}

export async function fetchCases() {
  const response = await request<{ items: CaseSummary[] }>('/api/cases')
  return response.items
}

export async function fetchCase(slug: string) {
  const response = await request<{ item: CaseDetail }>(`/api/cases/${slug}`)
  return response.item
}

export async function fetchReviews() {
  const response = await request<{ items: ReviewItem[] }>('/api/reviews')
  return response.items
}

export async function fetchNews() {
  const response = await request<{ items: NewsItem[] }>('/api/news')
  return response.items
}

export async function fetchNewsItem(slug: string) {
  const response = await request<{ item: Omit<NewsItem, 'excerpt'> }>(`/api/news/${slug}`)
  return response.item
}

export async function submitAuditForm(payload: { email: string; source?: string; website?: string }) {
  return request<{ ok: true }>('/api/forms/audit', {
    body: payload,
    method: 'POST',
  })
}

export async function submitContactForm(payload: {
  email: string
  message: string
  name: string
  website?: string
}) {
  return request<{ ok: true }>('/api/forms/contact', {
    body: payload,
    method: 'POST',
  })
}

export async function getAdminSession() {
  return request<AdminSession>('/api/admin/session')
}

export async function loginAdmin(email: string, password: string) {
  return request<AdminSession>('/api/admin/auth/login', {
    body: { email, password },
    method: 'POST',
  })
}

export async function logoutAdmin() {
  return request<{ ok: true }>('/api/admin/auth/logout', {
    method: 'POST',
  })
}

export async function fetchAdminOverview() {
  const response = await request<{ counts: AdminCounts }>('/api/admin/overview')
  return response.counts
}

export async function fetchAdminCases() {
  const response = await request<{ items: AdminCase[] }>('/api/admin/cases')
  return response.items
}

export async function fetchAdminCase(id: string) {
  const response = await request<{ item: AdminCase }>(`/api/admin/cases/${id}`)
  return response.item
}

export async function saveAdminCase(id: string | null, payload: AdminCasePayload) {
  const response = await request<{ item: AdminCase }>(
    id ? `/api/admin/cases/${id}` : '/api/admin/cases',
    {
      body: payload,
      method: id ? 'PATCH' : 'POST',
    },
  )

  return response.item
}

export async function deleteAdminCase(id: string) {
  await request<null>(`/api/admin/cases/${id}`, {
    method: 'DELETE',
  })
}

export async function fetchAdminReviews() {
  const response = await request<{ items: AdminReview[] }>('/api/admin/reviews')
  return response.items
}

export async function fetchAdminReview(id: string) {
  const response = await request<{ item: AdminReview }>(`/api/admin/reviews/${id}`)
  return response.item
}

export async function saveAdminReview(id: string | null, payload: AdminReviewPayload) {
  const response = await request<{ item: AdminReview }>(
    id ? `/api/admin/reviews/${id}` : '/api/admin/reviews',
    {
      body: payload,
      method: id ? 'PATCH' : 'POST',
    },
  )

  return response.item
}

export async function deleteAdminReview(id: string) {
  await request<null>(`/api/admin/reviews/${id}`, {
    method: 'DELETE',
  })
}

export async function fetchAdminNews() {
  const response = await request<{ items: AdminNews[] }>('/api/admin/news')
  return response.items
}

export async function fetchAdminNewsItem(id: string) {
  const response = await request<{ item: AdminNews }>(`/api/admin/news/${id}`)
  return response.item
}

export async function saveAdminNews(id: string | null, payload: AdminNewsPayload) {
  const response = await request<{ item: AdminNews }>(
    id ? `/api/admin/news/${id}` : '/api/admin/news',
    {
      body: payload,
      method: id ? 'PATCH' : 'POST',
    },
  )

  return response.item
}

export async function deleteAdminNews(id: string) {
  await request<null>(`/api/admin/news/${id}`, {
    method: 'DELETE',
  })
}

export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await request<{ url: string }>('/api/admin/upload', {
    body: formData,
    method: 'POST',
  })

  return response.url
}
