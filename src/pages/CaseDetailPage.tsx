import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'
import { fetchCase } from '../lib/api'
import type { CaseDetail } from '../types/content'

const getHomeAnchorHref = (href: string) => `/${href}`

export default function CaseDetailPage() {
  const { slug = '' } = useParams()
  const [item, setItem] = useState<CaseDetail | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setStatus('loading')
    setError(null)

    fetchCase(slug)
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
    <div className="detail-page">
      <SiteHeader homeHref="/" auditHref="/#audit" mapNavHref={getHomeAnchorHref} />

      <main className="detail-main">
        <section className="detail-hero">
          <div className="container detail-hero__content">
            <Link className="detail-back" to="/">
              ← На главную
            </Link>

            {status === 'loading' ? <p className="detail-message">Загружаем кейс...</p> : null}
            {status === 'error' ? <p className="detail-message detail-message--error">{error}</p> : null}

            {item ? (
              <>
                <div className="detail-meta">
                  <span>{item.tag}</span>
                </div>
                <h1 className="detail-title">{item.title}</h1>
                <div className="detail-cover">
                  <img src={item.coverImageUrl} alt={item.title} />
                </div>
              </>
            ) : null}
          </div>
        </section>

        {item ? (
          <section className="detail-gallery">
            <div className="container detail-gallery__content">
              <div className="detail-gallery__header">
                <h2>Детали кейса</h2>
              </div>

              <div className="detail-gallery__grid">
                {item.galleryImages.map((image, index) => (
                  <figure key={`${image}-${index}`} className="detail-gallery__item">
                    <img src={image} alt={`${item.title} — экран ${index + 1}`} />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter mapNavHref={getHomeAnchorHref} />
    </div>
  )
}
