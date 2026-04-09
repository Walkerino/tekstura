import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import './App.css'

type NavItem = {
  label: string
  href: string
}

type Service = {
  icon: string
  title: string
  description: string
  accent?: boolean
}

type CaseItem = {
  title: string
  category?: string
  featured?: boolean
  cta?: boolean
}

type Testimonial = {
  logo: string
  alt: string
  quote: string
}

type NewsItem = {
  date: string
  title: string
  description: string
}

type ModalState = {
  message: string
} | null

const navigation: NavItem[] = [
  { label: 'О нас', href: '#about' },
  { label: 'Услуги', href: '#services' },
  { label: 'Кейсы', href: '#cases' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Новости', href: '#news' },
  { label: 'Контакты', href: '#contact' },
]

const services: Service[] = [
  {
    icon: '/assets/icon-branding.svg',
    title: 'Брендинг и Айдентика',
    description:
      'Создаем визуальную основу бренда: позиционирование в образе, характер, стиль, правила и целостную систему восприятия.',
    accent: true,
  },
  {
    icon: '/assets/icon-packaging.svg',
    title: 'Дизайн упаковки',
    description:
      'Продумываем упаковку, которая помогает продукту выделяться на полке, быть узнаваемым и выглядеть аккуратно на всех уровнях контакта.',
  },
  {
    icon: '/assets/icon-web.svg',
    title: 'Веб-дизайн',
    description:
      'Проектируем лендинги, корпоративные сайты и интернет-магазины с понятной структурой, сильной подачей и акцентом на конверсию.',
    accent: true,
  },
  {
    icon: '/assets/icon-audit.svg',
    title: 'Дизайн-аудит',
    description:
      'Проводим визуальный аудит сайта/бренда/интерфейса: показываем слабые места и практические направления для усиления.',
  },
  {
    icon: '/assets/icon-dev.svg',
    title: 'Разработка сайта',
    description:
      'Создаем интерфейсы, в которых удобно ориентироваться, легко совершать целевые действия и приятно взаимодействовать с продуктом.',
    accent: true,
  },
  {
    icon: '/assets/icon-uxui.svg',
    title: 'UX/UI Дизайн',
    description:
      'Создаем интерфейсы, в которых удобно ориентироваться, легко совершать целевые действия и приятно взаимодействовать с продуктом.',
  },
]

const cases: CaseItem[] = [
  { title: 'Portfolio One', category: 'Веб-дизайн', featured: true },
  { title: 'Portfolio Two', category: 'Веб-дизайн' },
  { title: 'Portfolio Three', category: 'Веб-дизайн' },
  { title: 'Portfolio Four', category: 'Веб-дизайн' },
  { title: 'Все работы →', cta: true },
]

const testimonials: Testimonial[] = [
  {
    logo: '/assets/review-webflow.png',
    alt: 'Webflow',
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim scelerisque massa, ac pretium lorem consequat eu. Praesent nec augue.',
  },
  {
    logo: '/assets/review-figma.png',
    alt: 'Figma',
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim scelerisque massa, ac pretium lorem consequat eu. Praesent nec augue.',
  },
  {
    logo: '/assets/review-relume.png',
    alt: 'Relume',
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim scelerisque massa, ac pretium lorem consequat eu. Praesent nec augue.',
  },
]

const newsItems: NewsItem[] = [
  {
    date: '03 Апреля 2026',
    title: 'Заголовок новостей',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc diam nisi, tempus pretium sodales quis, bibendum in nibh.',
  },
  {
    date: '03 Апреля 2026',
    title: 'Заголовок новостей',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc diam nisi, tempus pretium sodales quis, bibendum in nibh.',
  },
]

const footerPrimaryLinks = navigation.slice(0, 3)
const footerSecondaryLinks = navigation.slice(3)
const heroTitleVariants = ['брендов', 'продуктов', 'бизнеса']
const sliderStepDelay = 7000
const sliderTransitionDuration = 720
const sliderGap = 24

const digitHandles = [
  { left: '18.9%', top: '20.6%' },
  { left: '27.1%', top: '20.6%' },
  { left: '6.5%', top: '56.7%' },
  { left: '61.4%', top: '56.7%' },
  { left: '6.3%', top: '65.7%' },
  { left: '61.2%', top: '65.7%' },
  { left: '13%', top: '56.2%' },
  { left: '67.9%', top: '56.2%' },
  { left: '21%', top: '56.2%' },
  { left: '20.9%', top: '33%' },
  { left: '27.3%', top: '56.2%' },
  { left: '31.2%', top: '56.2%' },
  { left: '39.8%', top: '48.8%' },
  { left: '41%', top: '59.9%' },
  { left: '40.4%', top: '38.2%' },
  { left: '45.9%', top: '29.3%' },
  { left: '45.9%', top: '19.6%' },
  { left: '54%', top: '25.1%' },
  { left: '37.5%', top: '25.1%' },
  { left: '57.6%', top: '35.9%' },
  { left: '34.3%', top: '35.9%' },
  { left: '58.5%', top: '48.8%' },
  { left: '33.4%', top: '47.7%' },
  { left: '57%', top: '63.6%' },
  { left: '34.8%', top: '63.6%' },
  { left: '52.2%', top: '73.3%' },
  { left: '45.9%', top: '76.4%' },
  { left: '38.8%', top: '72.3%' },
  { left: '51%', top: '38.2%' },
  { left: '51%', top: '59.9%' },
  { left: '45.9%', top: '66.7%' },
  { left: '51.6%', top: '48.8%' },
  { left: '31.2%', top: '65.7%' },
  { left: '27.3%', top: '65.7%' },
  { left: '27.3%', top: '75.9%' },
  { left: '21%', top: '75.9%' },
  { left: '21%', top: '65.7%' },
]

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path
        d="M6 14L14 6M8 6H14V12"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path
        d="M9.2 14V8.72H11l.27-2.2H9.2V5.1c0-.64.17-1.08 1.08-1.08h1.14V2.05C11.22 2.02 10.74 2 10.17 2 8.48 2 7.33 3.03 7.33 4.93v1.59H5.5v2.2h1.83V14H9.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path
        d="M4.56 2h6.88A2.56 2.56 0 0 1 14 4.56v6.88A2.56 2.56 0 0 1 11.44 14H4.56A2.56 2.56 0 0 1 2 11.44V4.56A2.56 2.56 0 0 1 4.56 2Zm0 1.14c-.78 0-1.42.64-1.42 1.42v6.88c0 .78.64 1.42 1.42 1.42h6.88c.78 0 1.42-.64 1.42-1.42V4.56c0-.78-.64-1.42-1.42-1.42H4.56Zm6.13.84a.72.72 0 1 1 0 1.44.72.72 0 0 1 0-1.44ZM8 4.86A3.14 3.14 0 1 1 4.86 8 3.14 3.14 0 0 1 8 4.86Zm0 1.14A2 2 0 1 0 10 8 2 2 0 0 0 8 6Z"
        fill="currentColor"
      />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path
        d="M3.44 5.16H1V15h2.44V5.16Zm.16-3.04A1.41 1.41 0 1 0 3.58 5a1.41 1.41 0 0 0 .02-2.88ZM15 9c0-2.6-1.39-3.81-3.24-3.81A2.8 2.8 0 0 0 9.24 6.6V5.16H6.89c.03.95 0 9.84 0 9.84h2.35V9.5c0-.3.02-.6.11-.82a1.54 1.54 0 0 1 1.45-1.03c1.02 0 1.43.78 1.43 1.92V15H15V9Z"
        fill="currentColor"
      />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path
        d="M14.67 4.62a1.9 1.9 0 0 0-1.34-1.34C12.15 3 8 3 8 3s-4.15 0-5.33.28A1.9 1.9 0 0 0 1.33 4.62 19.73 19.73 0 0 0 1 8a19.73 19.73 0 0 0 .33 3.38 1.9 1.9 0 0 0 1.34 1.34C3.85 13 8 13 8 13s4.15 0 5.33-.28a1.9 1.9 0 0 0 1.34-1.34A19.73 19.73 0 0 0 15 8a19.73 19.73 0 0 0-.33-3.38ZM6.68 10.1V5.9L10.3 8 6.68 10.1Z"
        fill="currentColor"
      />
    </svg>
  )
}

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const updatePathname = () => {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', updatePathname)

    return () => {
      window.removeEventListener('popstate', updatePathname)
    }
  }, [])

  return pathname
}

function useAutoSlider(length: number) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [stepWidth, setStepWidth] = useState(0)
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true)

  useEffect(() => {
    setActiveIndex(0)
    setIsTransitionEnabled(true)
  }, [length])

  useEffect(() => {
    if (length <= 0) {
      return
    }

    const measure = () => {
      const firstSlide = viewportRef.current?.querySelector<HTMLElement>('[data-slider-item]')

      if (!firstSlide) {
        return
      }

      setStepWidth(firstSlide.getBoundingClientRect().width + sliderGap)
    }

    const frameId = window.requestAnimationFrame(measure)
    window.addEventListener('resize', measure)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', measure)
    }
  }, [length])

  useEffect(() => {
    if (length <= 1 || stepWidth === 0 || !isTransitionEnabled) {
      return
    }

    const timerId = window.setTimeout(() => {
      setActiveIndex((current) => current + 1)
    }, sliderStepDelay)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [activeIndex, isTransitionEnabled, length, stepWidth])

  useEffect(() => {
    if (length <= 1 || activeIndex < length) {
      return
    }

    const resetTimerId = window.setTimeout(() => {
      setIsTransitionEnabled(false)
      setActiveIndex(0)
    }, sliderTransitionDuration)

    return () => {
      window.clearTimeout(resetTimerId)
    }
  }, [activeIndex, length])

  useEffect(() => {
    if (isTransitionEnabled) {
      return
    }

    let nestedFrameId = 0
    const frameId = window.requestAnimationFrame(() => {
      nestedFrameId = window.requestAnimationFrame(() => {
        setIsTransitionEnabled(true)
      })
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      if (nestedFrameId) {
        window.cancelAnimationFrame(nestedFrameId)
      }
    }
  }, [isTransitionEnabled])

  return {
    viewportRef,
    activeIndex,
    visibleIndex: length === 0 ? 0 : activeIndex % length,
    isTransitionEnabled,
    trackOffset: activeIndex * stepWidth,
  }
}

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [modalState, setModalState] = useState<ModalState>(null)
  const [heroVariantIndex, setHeroVariantIndex] = useState(0)
  const [typedHeroText, setTypedHeroText] = useState('')
  const [isDeletingHeroText, setIsDeletingHeroText] = useState(false)
  const heroTypeWidth = Math.max(...heroTitleVariants.map((variant) => variant.length))
  const heroTypeStyle = {
    '--hero-type-width': `${heroTypeWidth}ch`,
  } as CSSProperties
  const reviewsSlider = useAutoSlider(testimonials.length)
  const newsSlider = useAutoSlider(newsItems.length)
  const testimonialSlides = [...testimonials, ...testimonials]
  const newsSlides = [...newsItems, ...newsItems]

  useEffect(() => {
    if (!isMenuOpen && !modalState) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        setModalState(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen, modalState])

  const openSuccessModal = (message: string) => {
    setModalState({ message })
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const currentVariant = heroTitleVariants[heroVariantIndex]
    const isVariantComplete = typedHeroText === currentVariant
    const isVariantRemoved = typedHeroText === ''
    let timeout = isDeletingHeroText ? 64 : 118

    if (!isDeletingHeroText && isVariantComplete) {
      timeout = 1400
    } else if (isDeletingHeroText && isVariantRemoved) {
      timeout = 220
    }

    const timerId = window.setTimeout(() => {
      if (!isDeletingHeroText && isVariantComplete) {
        setIsDeletingHeroText(true)
        return
      }

      if (isDeletingHeroText && isVariantRemoved) {
        setIsDeletingHeroText(false)
        setHeroVariantIndex((current) => (current + 1) % heroTitleVariants.length)
        return
      }

      const nextLength = typedHeroText.length + (isDeletingHeroText ? -1 : 1)
      setTypedHeroText(currentVariant.slice(0, nextLength))
    }, timeout)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [heroVariantIndex, isDeletingHeroText, typedHeroText])

  return (
    <div className="page-shell">
      <div className="page-shell__glow" aria-hidden="true" />

      <header className="site-header">
        <div className="container site-header__inner">
          <a className="brand" href="#top" aria-label="Tekstura">
            <img className="brand__image" src="/assets/logo.png" alt="Tekstura" />
          </a>

          <nav className="site-nav" aria-label="Основная навигация">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <a className="button button--primary button--small header-cta" href="#audit">
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
                <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
            </nav>
            <a
              className="button button--primary"
              href="#audit"
              onClick={() => setIsMenuOpen(false)}
            >
              Бесплатный аудит
            </a>
          </div>
        </div>
      ) : null}

      <main id="top">
        <section className="hero">
          <div className="container hero__content">
            <h1 className="hero__title">
              <span>Агентство дизайна</span>
              <span className="hero__title-line hero__title-line--accent" style={heroTypeStyle}>
                <span>для  </span>
                <span className="hero__typewriter-text">{typedHeroText}</span>
                <span className="hero__caret" aria-hidden="true" />
              </span>
            </h1>

            <div className="hero__divider" aria-hidden="true" />

            <p className="hero__description">
              <span>Текстура</span> — студия дизайна, где визуальная выразительность
              сочетается с понятной структурой, бизнес-логикой и вниманием к деталям.
              Помогаем брендам выглядеть сильнее, цельнее и современнее.
            </p>

            <a className="button button--primary hero__button" href="#contact">
              Обсудить проект
            </a>
          </div>
        </section>

        <section className="section about" id="about">
          <div className="container about__content">
            <div className="about__copy">
              <h2 className="section-title">Об агентстве</h2>
              <p className="section-copy">
                <span className="about__lead">Текстура</span> — это про ощущение бренда:
                глубину, характер, материал, детали, которые считываются с первого экрана.
                Мы создаем дизайн, в котором есть тактильность, ритм и ясность — от
                айдентики до интерфейсов.
              </p>

              <div className="about__actions">
                <a className="button button--primary button--caps about__action" href="#cases">
                  Кейсы
                </a>
                <a className="button button--secondary button--caps about__action" href="#reviews">
                  Отзывы
                </a>
              </div>
            </div>

            <div className="about__mascot">
              <img src="/assets/hero-mascot.png" alt="Талисман Tekstura" />
            </div>
          </div>
        </section>

        <section className="section services" id="services">
          <div className="container">
            <h2 className="section-title services__title">
              <em>Услуги</em> агентства
            </h2>

            <div className="services__grid">
              {services.map((service) => (
                <article
                  key={service.title}
                  className={`service-card${service.accent ? ' service-card--accent' : ''}`}
                >
                  <span
                    className="service-card__icon"
                    style={{ '--service-icon': `url(${service.icon})` } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section cases" id="cases">
          <div className="container">
            <h2 className="section-title cases__title">
              Наши <em>кейсы</em>
            </h2>

            <div className="cases__grid">
              {cases.map((item) => (
                <article
                  key={item.title}
                  className={`case-card${item.featured ? ' case-card--wide' : ''}${item.cta ? ' case-card--cta' : ''}${item.cta ? '' : ' case-card--portfolio'}`}
                >
                  {item.cta ? (
                    <a className="case-card__cta" href="#contact">
                      <span>{item.title}</span>
                    </a>
                  ) : (
                    <>
                      <div className="case-card__content">
                        <h3>{item.title}</h3>
                        <span className="case-card__category">{item.category}</span>
                      </div>
                      <span className="case-card__hover-label">Взглянуть работу -&gt;</span>
                    </>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section newsletter" id="audit">
          <div className="container newsletter__content">
            <div className="newsletter__heading">
              <h2 className="section-title">
                <em>Бесплатный</em> аудит дизайна
              </h2>
              <p className="section-copy">
                Покажем, что в вашем визуале уже работает хорошо, а что можно усилить,
                чтобы бренд, сайт или интерфейс выглядели убедительнее.
              </p>
            </div>

            <form
              className="newsletter__form"
              onSubmit={(event) => {
                event.preventDefault()
                openSuccessModal('Спасибо. Мы свяжемся с вами и согласуем удобный формат')
              }}
            >
              <input type="email" name="email" placeholder="Ваш E-mail" />
              <button className="button button--primary newsletter__submit" type="submit">
                ЗАПИСАТЬСЯ
              </button>
            </form>

            <p className="newsletter__note">
              Оставьте контакт — свяжемся и договоримся об удобном формате.
            </p>
          </div>
        </section>

        <section className="section reviews" id="reviews">
          <div className="container reviews__content">
            <h2 className="section-title reviews__title">Отзывы</h2>

            <div className="slider slider--reviews">
              <div className="slider__viewport" ref={reviewsSlider.viewportRef}>
                <div
                  className="slider__track"
                  style={{
                    transform: `translateX(-${reviewsSlider.trackOffset}px)`,
                    transitionDuration: reviewsSlider.isTransitionEnabled
                      ? `${sliderTransitionDuration}ms`
                      : '0ms',
                  }}
                >
                  {testimonialSlides.map((item, index) => (
                    <div
                      key={`${item.alt}-${index}`}
                      className="slider__slide"
                      data-slider-item="true"
                    >
                      <article className="review-card">
                        <div className="review-card__label">Клиент</div>
                        <img src={item.logo} alt={item.alt} />
                        <p>{item.quote}</p>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="slider-dots" aria-hidden="true">
              {testimonials.map((item, index) => (
                <span
                  key={item.alt}
                  className={`slider-dots__dot${reviewsSlider.visibleIndex === index ? ' slider-dots__dot--active' : ''}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="section news" id="news">
          <div className="container news__content">
            <h2 className="section-title news__title">
              Актуальные <em>новости</em>
            </h2>

            <div className="slider slider--news">
              <div className="slider__viewport" ref={newsSlider.viewportRef}>
                <div
                  className="slider__track"
                  style={{
                    transform: `translateX(-${newsSlider.trackOffset}px)`,
                    transitionDuration: newsSlider.isTransitionEnabled
                      ? `${sliderTransitionDuration}ms`
                      : '0ms',
                  }}
                >
                  {newsSlides.map((item, index) => (
                    <div
                      key={`${item.date}-${item.title}-${index}`}
                      className="slider__slide"
                      data-slider-item="true"
                    >
                      <article className="news-card">
                        <div className="news-card__date">{item.date}</div>
                        <div className="news-card__body">
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                        </div>
                        <div className="news-card__footer">
                          <div className="news-card__author">
                            <img src="/assets/news-avatar.png" alt="" />
                            <span>CEO Агентства</span>
                          </div>
                          <span>Label</span>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="slider-dots" aria-hidden="true">
              {newsItems.map((item, index) => (
                <span
                  key={`${item.date}-${item.title}-${index}`}
                  className={`slider-dots__dot${newsSlider.visibleIndex === index ? ' slider-dots__dot--active' : ''}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="section partners">
          <div className="container partners__content">
            <div className="partners__heading">
              <h2 className="section-title">Партнёры</h2>
              <p className="section-copy">
                Проект создан при поддержке Федерального государственного бюджетного
                учреждения «Фонд содействия развитию малых форм предприятий в
                научно-технической сфере» в рамках программы «Студенческий стартап»
                федерального проекта «Платформа университетского технологического
                предпринимательства»
              </p>
            </div>

            <div className="partners__logos">
              <img src="/assets/partner-fund.png" alt="Фонд содействия инновациям" />
              <img src="/assets/partner-startup.png" alt="Студенческий стартап" />
            </div>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="container contact__content">
            <div className="contact__heading">
              <h2 className="section-title">Остались вопросы?</h2>
              <p className="contact__subtitle">С радостью ответим на них</p>
            </div>

            <div className="contact__grid">
              <div className="contact__info">
                <div className="contact__image-wrap">
                  <img src="/assets/contact-clouds.png" alt="" />
                </div>

                <div className="contact__text-row">
                  <p>
                    Если вы хотите обсудить проект, уточнить стоимость или понять, с
                    чего лучше начать — напишите нам. Коротко разберем вашу задачу и
                    подскажем оптимальный формат работы.
                  </p>

                  <div className="contact__links">
                    <a href="https://t.me/" target="_blank" rel="noreferrer">
                      @telegram
                    </a>
                    <a href="https://instagram.com/" target="_blank" rel="noreferrer">
                      @instagram
                    </a>
                    <a href="mailto:tekstura@mail.ru">tekstura@mail.ru</a>
                  </div>
                </div>
              </div>

              <form
                className="contact-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  openSuccessModal('Ваш вопрос успешно отправлен')
                }}
              >
                <input type="text" name="name" placeholder="Имя" />
                <input type="email" name="email" placeholder="E-mail" />
                <textarea name="message" rows={5} placeholder="Сообщение..." />
                <button className="button button--primary contact-form__submit" type="submit">
                  Отправить
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__top">
          <div className="site-footer__brand">
            <img src="/assets/logo-footer.svg" alt="Tekstura" />
            <p>
              Создаем брендинг, сайты и digital-дизайн для бизнеса, которому важны
              качество, ясность и сильная визуальная подача.
            </p>
          </div>

          <div className="site-footer__nav">
            <div className="site-footer__column">
              <h3>Навигация</h3>
              {footerPrimaryLinks.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>

            <div className="site-footer__column site-footer__column--secondary">
              {footerSecondaryLinks.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="container site-footer__bottom">
          <div className="site-footer__meta">
            <span>© 2026 TEKSTURA. Все права защищены.</span>
            <a href="/">Политика конфиденциальности</a>
            <a href="/">Публичная оферта</a>
          </div>

          <div className="site-footer__socials" aria-label="Социальные сети">
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
      </footer>

      {modalState ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setModalState(null)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label="Сообщение"
            onClick={(event) => event.stopPropagation()}
          >
            <p>{modalState.message}</p>
            <button
              className="button button--primary button--small"
              type="button"
              onClick={() => setModalState(null)}
            >
              Закрыть
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ErrorPage() {
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

      <header className="error-header">
        <div className="error-shell error-header__inner">
          <a className="error-brand" href="/" aria-label="Tekstura">
            <img src="/assets/logo-footer.svg" alt="Tekstura" />
          </a>

          <nav className="error-nav" aria-label="Основная навигация">
            {navigation.map((item) => (
              <a key={item.href} href={`/${item.href}`}>
                {item.label}
              </a>
            ))}
          </nav>

          <button className="error-header__cta" type="button" onClick={handleGoBack}>
            Вернуться
          </button>
        </div>
      </header>

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
              <span>Упс! Страницы, которую вы ищете,</span>
              <span>
                <em>не существует</em>
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

function App() {
  const pathname = usePathname()
  const isHome = pathname === '/' || pathname === '/index.html'

  return isHome ? <LandingPage /> : <ErrorPage />
}

export default App
