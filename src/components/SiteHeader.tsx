import { useEffect, useState } from 'react'
import { navigation } from '../data/site'

type SiteHeaderProps = {
  auditHref: string
  homeHref: string
  mapNavHref?: (href: string) => string
}

const defaultMapNavHref = (href: string) => href

export default function SiteHeader({
  auditHref,
  homeHref,
  mapNavHref = defaultMapNavHref,
}: SiteHeaderProps) {
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

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <a className="brand" href={homeHref} aria-label="Tekstura">
            <img className="brand__image" src="/assets/logo.png" alt="Tekstura" />
          </a>

          <nav className="site-nav" aria-label="Основная навигация">
            {navigation.map((item) => (
              <a key={item.href} href={mapNavHref(item.href)}>
                {item.label}
              </a>
            ))}
          </nav>

          <a className="button button--primary button--small header-cta" href={auditHref}>
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
        <div
          className="mobile-menu"
          id="mobile-menu"
          role="presentation"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="mobile-menu__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Мобильная навигация"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-menu__header">
              <a
                className="brand mobile-menu__brand"
                href={homeHref}
                aria-label="Tekstura"
                onClick={() => setIsMenuOpen(false)}
              >
                <img className="brand__image mobile-menu__brand-image" src="/assets/logo.png" alt="Tekstura" />
              </a>

              <button
                className="mobile-menu__close"
                type="button"
                aria-label="Закрыть меню"
                onClick={() => setIsMenuOpen(false)}
              >
                <span />
                <span />
              </button>
            </div>

            <nav className="mobile-menu__nav" aria-label="Мобильная навигация">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={mapNavHref(item.href)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <a
              className="button button--primary"
              href={auditHref}
              onClick={() => setIsMenuOpen(false)}
            >
              Бесплатный аудит
            </a>
          </div>
        </div>
      ) : null}
    </>
  )
}
