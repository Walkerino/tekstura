import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from './components/icons'
import { footerPrimaryLinks, footerSecondaryLinks, navigation } from './data/site'
import { usePathname } from './hooks/usePathname'
import NotFoundPage from './pages/NotFound'
import './App.css'

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

const heroTitleVariants = ['брендов', 'продуктов', 'бизнеса']
const sliderStepDelay = 7000
const sliderTransitionDuration = 720
const sliderGap = 24

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

function App() {
  const pathname = usePathname()
  const isHome = pathname === '/' || pathname === '/index.html'

  return isHome ? <LandingPage /> : <NotFoundPage />
}

export default App
