import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/icons'
import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'
import { fetchCases } from '../lib/api'
import type { CaseSummary } from '../types/content'

const getHomeAnchorHref = (href: string) => `/${href}`

export default function CasesPage() {
  const [items, setItems] = useState<CaseSummary[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setStatus('loading')
    setError(null)

    fetchCases()
      .then((response) => {
        if (!isMounted) {
          return
        }

        setItems(response)
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
  }, [])

  return (
    <div className="detail-page">
      <SiteHeader homeHref="/" auditHref="/#audit" mapNavHref={getHomeAnchorHref} />

      <main className="detail-main">
        <section className="section cases-catalog">
          <div className="container">
            <h1 className="section-title cases__title">
              Все <em>кейсы</em>
            </h1>

            {status === 'loading' ? <p className="cases__empty">Загружаем кейсы...</p> : null}
            {status === 'error' ? <p className="cases__empty form-status--error">{error}</p> : null}

            {status === 'ready' && items.length === 0 ? (
              <p className="cases__empty">Кейсы появятся здесь после публикации в админке.</p>
            ) : null}

            {items.length > 0 ? (
              <div className="cases-list" aria-label="Список кейсов">
                {items.map((item) => (
                  <article key={item.id} className="cases-list__item">
                    <div className="cases-list__main">
                      <h2 className="cases-list__title">{item.title}</h2>
                      <span className="cases-list__tag">{item.tag}</span>
                    </div>

                    <Link className="cases-list__view" to={`/cases/${item.slug}`} aria-label={`Открыть кейс: ${item.title}`}>
                      <span>Взглянуть</span>
                      <ArrowIcon className="arrow-icon" />
                    </Link>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <SiteFooter mapNavHref={getHomeAnchorHref} />
    </div>
  )
}
