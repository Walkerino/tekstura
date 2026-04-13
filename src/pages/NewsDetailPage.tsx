import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowIcon } from '../components/icons'
import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'
import { fetchNewsItem } from '../lib/api'
import { formatNewsDate } from '../lib/format'

type NewsDetail = {
  content: string
  id: string
  publishedAt: string
  slug: string
  title: string
}

const getHomeAnchorHref = (href: string) => `/${href}`

export default function NewsDetailPage() {
  const { slug = '' } = useParams()
  const [item, setItem] = useState<NewsDetail | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setStatus('loading')
    setError(null)

    fetchNewsItem(slug)
      .then((response) => {
        if (!isMounted) {
          return
        }

        setItem(response)
        setStatus('ready')
      })
      .catch((reason: Error) => {
        if (!isMounted) {
          return
        }

        setStatus('error')
        setError(reason.message)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  return (
    <div className="detail-page detail-page--news">
      <SiteHeader homeHref="/" auditHref="/#audit" mapNavHref={getHomeAnchorHref} />

      <main className="detail-main">
        <section className="detail-hero">
          <div className="container detail-hero__content">
            <Link className="detail-back" to="/">
              <ArrowIcon className="arrow-icon" direction="left" />
              <span>На главную</span>
            </Link>

            {status === 'loading' ? <p className="detail-message">Загружаем новость...</p> : null}
            {status === 'error' ? <p className="detail-message detail-message--error">{error}</p> : null}

            {item ? (
              <>
                <div className="detail-meta">
                  <span>{formatNewsDate(item.publishedAt)}</span>
                </div>
                <h1 className="detail-title">{item.title}</h1>
                <div className="detail-copy">
                  {item.content.split('\n').map((paragraph, index) => (
                    <p key={`${item.id}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </section>
      </main>

      <SiteFooter mapNavHref={getHomeAnchorHref} />
    </div>
  )
}
