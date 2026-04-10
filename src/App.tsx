import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import { usePathname } from './hooks/usePathname'
import NotFoundPage from './pages/NotFound'
import PrivacyPolicyPage from './pages/PrivacyPolicy'
import PublicOfferPage from './pages/PublicOffer'
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
  const pointerIdRef = useRef<number | null>(null)
  const dragStartXRef = useRef(0)
  const dragStartYRef = useRef(0)
  const dragOffsetRef = useRef(0)
  const isDraggingRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [stepWidth, setStepWidth] = useState(0)
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true)
  const [isDragEnabled, setIsDragEnabled] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [autoplayCycle, setAutoplayCycle] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
    setIsTransitionEnabled(true)
    setIsDragging(false)
    setDragOffset(0)
    dragOffsetRef.current = 0
    isDraggingRef.current = false
    pointerIdRef.current = null
  }, [length])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1100px)')
    const updateDragAvailability = () => {
      setIsDragEnabled(mediaQuery.matches)
    }

    updateDragAvailability()
    mediaQuery.addEventListener('change', updateDragAvailability)

    return () => {
      mediaQuery.removeEventListener('change', updateDragAvailability)
    }
  }, [])

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
    if (length <= 1 || stepWidth === 0 || !isTransitionEnabled || isDragging) {
      return
    }

    const timerId = window.setTimeout(() => {
      setActiveIndex((current) => current + 1)
    }, sliderStepDelay)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [activeIndex, autoplayCycle, isDragging, isTransitionEnabled, length, stepWidth])

  useEffect(() => {
    if (length <= 1 || activeIndex < length || isDragging) {
      return
    }

    const resetTimerId = window.setTimeout(() => {
      setIsTransitionEnabled(false)
      setActiveIndex(0)
    }, sliderTransitionDuration)

    return () => {
      window.clearTimeout(resetTimerId)
    }
  }, [activeIndex, isDragging, length])

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

  const resetAutoplayTimer = () => {
    setAutoplayCycle((current) => current + 1)
  }

  const releasePointer = () => {
    const pointerId = pointerIdRef.current

    if (pointerId !== null && viewportRef.current?.hasPointerCapture(pointerId)) {
      viewportRef.current.releasePointerCapture(pointerId)
    }
  }

  const resetDraggingState = () => {
    pointerIdRef.current = null
    dragOffsetRef.current = 0
    isDraggingRef.current = false
    setDragOffset(0)
    setIsDragging(false)
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragEnabled || length <= 1 || stepWidth === 0) {
      return
    }

    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    pointerIdRef.current = event.pointerId
    dragStartXRef.current = event.clientX
    dragStartYRef.current = event.clientY
    dragOffsetRef.current = 0
    isDraggingRef.current = false
    setDragOffset(0)
    setIsDragging(false)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId || !isDragEnabled || length <= 1) {
      return
    }

    const deltaX = event.clientX - dragStartXRef.current
    const deltaY = event.clientY - dragStartYRef.current

    if (!isDraggingRef.current) {
      if (Math.abs(deltaX) < 8 || Math.abs(deltaX) <= Math.abs(deltaY)) {
        return
      }

      viewportRef.current?.setPointerCapture(event.pointerId)
      isDraggingRef.current = true
      setIsDragging(true)
    }

    event.preventDefault()
    dragOffsetRef.current = deltaX
    setDragOffset(deltaX)
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return
    }

    releasePointer()

    if (!isDraggingRef.current) {
      resetDraggingState()
      return
    }

    const swipeThreshold = Math.min(stepWidth * 0.18, 96)
    const currentOffset = dragOffsetRef.current

    let nextIndex = activeIndex

    if (currentOffset <= -swipeThreshold) {
      nextIndex = Math.min(activeIndex + 1, length)
    } else if (currentOffset >= swipeThreshold) {
      nextIndex = Math.max(activeIndex - 1, 0)
    }

    resetDraggingState()

    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex)
    }

    resetAutoplayTimer()
  }

  const onPointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return
    }

    releasePointer()
    resetDraggingState()
    resetAutoplayTimer()
  }

  return {
    viewportRef,
    activeIndex,
    dragOffset,
    isDragEnabled,
    isDragging,
    onPointerCancel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    visibleIndex: length === 0 ? 0 : activeIndex % length,
    isTransitionEnabled,
    trackOffset: activeIndex * stepWidth,
  }
}

function LandingPage() {
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
    if (!modalState) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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
  }, [modalState])

  const openSuccessModal = (message: string) => {
    setModalState({ message })
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

      <SiteHeader homeHref="#top" auditHref="#audit" />

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

            <div className="cases__controls">
              <div className="slider-dots cases__dots" aria-hidden="true">
                <span className="slider-dots__dot slider-dots__dot--active" />
                <span className="slider-dots__dot" />
                <span className="slider-dots__dot" />
                <span className="slider-dots__dot" />
              </div>

              <a className="button button--primary cases__mobile-cta" href="#contact">
                Все работы →
              </a>
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
              <div
                className={`slider__viewport${reviewsSlider.isDragEnabled ? ' slider__viewport--interactive' : ''}${reviewsSlider.isDragging ? ' slider__viewport--dragging' : ''}`}
                ref={reviewsSlider.viewportRef}
                onPointerDown={reviewsSlider.onPointerDown}
                onPointerMove={reviewsSlider.onPointerMove}
                onPointerUp={reviewsSlider.onPointerUp}
                onPointerCancel={reviewsSlider.onPointerCancel}
              >
                <div
                  className="slider__track"
                  style={{
                    transform: `translateX(${reviewsSlider.dragOffset - reviewsSlider.trackOffset}px)`,
                    transitionDuration:
                      reviewsSlider.isDragging || !reviewsSlider.isTransitionEnabled
                        ? '0ms'
                        : `${sliderTransitionDuration}ms`,
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
              <div
                className={`slider__viewport${newsSlider.isDragEnabled ? ' slider__viewport--interactive' : ''}${newsSlider.isDragging ? ' slider__viewport--dragging' : ''}`}
                ref={newsSlider.viewportRef}
                onPointerDown={newsSlider.onPointerDown}
                onPointerMove={newsSlider.onPointerMove}
                onPointerUp={newsSlider.onPointerUp}
                onPointerCancel={newsSlider.onPointerCancel}
              >
                <div
                  className="slider__track"
                  style={{
                    transform: `translateX(${newsSlider.dragOffset - newsSlider.trackOffset}px)`,
                    transitionDuration:
                      newsSlider.isDragging || !newsSlider.isTransitionEnabled
                        ? '0ms'
                        : `${sliderTransitionDuration}ms`,
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
              <p className="contact__mobile-title">
                <span>С радостью ответим</span>
                <span>на вопросы</span>
              </p>
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

      <SiteFooter />

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
  const normalizedPathname =
    pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  const isHome = normalizedPathname === '/' || normalizedPathname === '/index.html'
  const isPrivacyPolicy = normalizedPathname === '/privacy-policy'
  const isPublicOffer = normalizedPathname === '/public-offer'

  if (isHome) {
    return <LandingPage />
  }

  if (isPrivacyPolicy) {
    return <PrivacyPolicyPage />
  }

  if (isPublicOffer) {
    return <PublicOfferPage />
  }

  return <NotFoundPage />
}

export default App
