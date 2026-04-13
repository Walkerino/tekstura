import { ArrowIcon } from '../components/icons'
import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'
import { digitHandles } from '../data/site'

export default function NotFoundPage() {
  const getHomeAnchorHref = (href: string) => `/${href}`

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    window.location.assign('/')
  }

  return (
    <div className="error-page">
      <div className="error-page__glow" aria-hidden="true" />
      <div className="error-page__texture" aria-hidden="true" />

      <SiteHeader
        homeHref="/"
        auditHref="/#audit"
        mapNavHref={getHomeAnchorHref}
      />

      <main className="error-main">
        <section className="error-hero" aria-labelledby="error-title">
          <div className="error-hero__art" aria-hidden="true">
            <div className="error-hero__frame">
              <span className="error-hero__corner error-hero__corner--top-left" />
              <span className="error-hero__corner error-hero__corner--top-right" />
              <span className="error-hero__corner error-hero__corner--bottom-right" />
              <span className="error-hero__corner error-hero__corner--bottom-left" />
              <div className="error-hero__digits">404</div>
              {digitHandles.map((handle) => (
                <span
                  key={`${handle.left}-${handle.top}`}
                  className="error-hero__handle"
                  style={{ left: handle.left, top: handle.top }}
                />
              ))}
            </div>

            <img className="error-hero__pointer" src="/assets/pointer-32.png" alt="" />
          </div>

          <div className="error-hero__copy">
            <h1 className="error-hero__title" id="error-title">
              <span>Упс! Страницы, которую</span>
              <span>
                вы ищете, <em>не существует</em>
              </span>
            </h1>

            <button className="error-hero__button" type="button" onClick={handleGoBack}>
              <span>Вернуться назад</span>
              <span className="error-hero__button-icon">
                <ArrowIcon className="arrow-icon" />
              </span>
            </button>
          </div>
        </section>
      </main>

      <SiteFooter mapNavHref={getHomeAnchorHref} />
    </div>
  )
}
