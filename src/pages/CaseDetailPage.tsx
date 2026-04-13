import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowIcon } from '../components/icons'
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
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true
    setStatus('loading')
    setError(null)
    setActiveImageIndex(null)

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

  useEffect(() => {
    if (activeImageIndex === null) {
      return
    }

    const maxIndex = item ? item.galleryImages.length - 1 : -1

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImageIndex(null)
        return
      }

      if (maxIndex < 0) {
        return
      }

      if (event.key === 'ArrowRight') {
        setActiveImageIndex((current) => {
          if (current === null) {
            return 0
          }

          return current >= maxIndex ? 0 : current + 1
        })
      }

      if (event.key === 'ArrowLeft') {
        setActiveImageIndex((current) => {
          if (current === null) {
            return maxIndex
          }

          return current <= 0 ? maxIndex : current - 1
        })
      }
    }

    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeImageIndex, item])

  const activeImageUrl =
    item && activeImageIndex !== null ? item.galleryImages[activeImageIndex] ?? null : null

  const showPreviousImage = () => {
    if (!item || item.galleryImages.length === 0) {
      return
    }

    const maxIndex = item.galleryImages.length - 1

    setActiveImageIndex((current) => {
      if (current === null) {
        return maxIndex
      }

      return current <= 0 ? maxIndex : current - 1
    })
  }

  const showNextImage = () => {
    if (!item || item.galleryImages.length === 0) {
      return
    }

    const maxIndex = item.galleryImages.length - 1

    setActiveImageIndex((current) => {
      if (current === null) {
        return 0
      }

      return current >= maxIndex ? 0 : current + 1
    })
  }

  return (
    <div className="detail-page detail-page--case">
      <SiteHeader homeHref="/" auditHref="/#audit" mapNavHref={getHomeAnchorHref} />

      <main className="detail-main">
        <section className="detail-hero">
          <div className="container detail-hero__content">
            <Link className="detail-back detail-back--case" to="/">
              <ArrowIcon className="arrow-icon" direction="left" />
              <span>На главную</span>
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
                {item.description ? (
                  <div className="detail-copy">
                    <p>{item.description}</p>
                  </div>
                ) : null}
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
                    <button
                      className="detail-gallery__zoom-trigger"
                      type="button"
                      aria-label={`Открыть изображение ${index + 1} в полном размере`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img src={image} alt={`${item.title} — экран ${index + 1}`} loading="lazy" />
                    </button>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter mapNavHref={getHomeAnchorHref} />

      {activeImageUrl ? (
        <div
          className="detail-lightbox"
          role="presentation"
          onClick={() => setActiveImageIndex(null)}
        >
          <div
            className="detail-lightbox__dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр изображения кейса"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="detail-lightbox__close"
              type="button"
              aria-label="Закрыть"
              onClick={() => setActiveImageIndex(null)}
            >
              ×
            </button>

            {item && item.galleryImages.length > 1 ? (
              <button
                className="detail-lightbox__nav detail-lightbox__nav--prev"
                type="button"
                aria-label="Предыдущее изображение"
                onClick={showPreviousImage}
              >
                <ArrowIcon className="arrow-icon" direction="left" />
              </button>
            ) : null}

            <img
              className="detail-lightbox__image"
              src={activeImageUrl}
              alt={
                item && activeImageIndex !== null
                  ? `${item.title} — экран ${activeImageIndex + 1} (полный размер)`
                  : 'Изображение кейса'
              }
            />

            {item && item.galleryImages.length > 1 ? (
              <button
                className="detail-lightbox__nav detail-lightbox__nav--next"
                type="button"
                aria-label="Следующее изображение"
                onClick={showNextImage}
              >
                <ArrowIcon className="arrow-icon" direction="right" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
