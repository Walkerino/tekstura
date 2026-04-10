import { useEffect, useState } from 'react'
import { ArrowUpRightIcon, FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from '../components/icons'
import { digitHandles, footerPrimaryLinks, footerSecondaryLinks, navigation } from '../data/site'

export default function NotFoundPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

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

      <header className="site-header">
        <div className="container site-header__inner">
          <a className="brand" href="/" aria-label="Tekstura">
            <img className="brand__image" src="/assets/logo.png" alt="Tekstura" />
          </a>

          <nav className="site-nav" aria-label="Основная навигация">
            {navigation.map((item) => (
              <a key={item.href} href={getHomeAnchorHref(item.href)}>
                {item.label}
              </a>
            ))}
          </nav>

          <a className="button button--primary button--small header-cta" href="/#audit">
            Бесплатный аудит
          </a>

          <button
            className={`menu-toggle${isMenuOpen ? ' menu-toggle--active' : ''}`}
            type="button"
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {isMenuOpen ? (
        <div className="mobile-menu" id="mobile-menu">
          <div className="mobile-menu__panel">
            <nav className="mobile-menu__nav" aria-label="Мобильная навигация">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={getHomeAnchorHref(item.href)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <a
              className="button button--primary"
              href="/#audit"
              onClick={() => setIsMenuOpen(false)}
            >
              Бесплатный аудит
            </a>
          </div>
        </div>
      ) : null}

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
                <ArrowUpRightIcon />
              </span>
            </button>
          </div>
        </section>
      </main>

      <footer className="error-footer">
        <div className="error-shell error-footer__inner">
          <div className="error-footer__top">
            <div className="error-footer__brand">
              <a className="error-brand error-brand--footer" href="/" aria-label="Tekstura">
                <img src="/assets/logo-footer.svg" alt="Tekstura" />
              </a>
              <p>
                Создаем брендинг, сайты и digital-дизайн для бизнеса, которому важны
                качество, ясность и сильная визуальная подача.
              </p>
            </div>

            <div className="error-footer__nav-group">
              <h2>Навигация</h2>
              <div className="error-footer__nav-columns">
                <div className="error-footer__nav-column">
                  {footerPrimaryLinks.map((item) => (
                    <a key={item.href} href={`/${item.href}`}>
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="error-footer__nav-column">
                  {footerSecondaryLinks.map((item) => (
                    <a key={item.href} href={`/${item.href}`}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="error-footer__bottom">
            <div className="error-footer__meta">
              <span>© 2026 TEKSTURA. Все права защищены.</span>
              <a href="/">Политика конфиденциальности</a>
              <a href="/">Публичная оферта</a>
            </div>

            <div className="error-footer__socials" aria-label="Социальные сети">
              <a href="/" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="/" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="/" aria-label="LinkedIn">
                <LinkedinIcon />
              </a>
              <a href="/" aria-label="YouTube">
                <YoutubeIcon />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
