export type CaseSummary = {
  coverImageUrl: string
  id: string
  slug: string
  tag: string
  title: string
}

export type CaseDetail = CaseSummary & {
  galleryImages: string[]
}

export type ReviewItem = {
  companyName: string
  id: string
  logoUrl: string
  quote: string
}

export type NewsItem = {
  content: string
  excerpt: string
  id: string
  publishedAt: string
  slug: string
  title: string
}

export type AdminCase = CaseDetail & {
  createdAt: string
  updatedAt: string
}

export type AdminCasePayload = {
  coverImageUrl: string
  galleryImages: string[]
  tag: string
  title: string
}

export type AdminReview = ReviewItem & {
  createdAt: string
  updatedAt: string
}

export type AdminReviewPayload = {
  companyName: string
  logoUrl: string
  quote: string
}

export type AdminNews = NewsItem & {
  createdAt: string
  updatedAt: string
}

export type AdminNewsPayload = {
  content: string
  publishedAt: string
  title: string
}

export type AdminCounts = {
  auditRequests: number
  cases: number
  contactRequests: number
  news: number
  reviews: number
}

export type AdminSession = {
  authenticated: boolean
  user: {
    email: string
  } | null
}
