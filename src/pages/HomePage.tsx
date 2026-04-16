import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/icons'
import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'
import { fetchCases, fetchNews, fetchReviews, submitAuditForm, submitContactForm } from '../lib/api'
import { formatNewsDate } from '../lib/format'
import type { CaseSummary, NewsItem, ReviewItem } from '../types/content'

type Service = {
  accent?: boolean
  description: string
  icon: string
  title: string
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

export default function HomePage() {
  const [modalState, setModalState] = useState<ModalState>(null)
  const [heroVariantIndex, setHeroVariantIndex] = useState(0)
  const [typedHeroText, setTypedHeroText] = useState('')
  const [isDeletingHeroText, setIsDeletingHeroText] = useState(false)
  const [cases, setCases] = useState<CaseSummary[]>([])
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [contentError, setContentError] = useState<string | null>(null)
  const [auditEmail, setAuditEmail] = useState('')
  const [auditConsent, setAuditConsent] = useState(false)
  const [auditStatus, setAuditStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [auditError, setAuditError] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({
    email: '',
    message: '',
    name: '',
    website: '',
  })
  const [contactConsent, setContactConsent] = useState(false)
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [contactError, setContactError] = useState<string | null>(null)
  const heroTypeWidth = Math.max(...heroTitleVariants.map((variant) => variant.length))
  const heroTypeStyle = {
    '--hero-type-width': `${heroTypeWidth}ch`,
  } as CSSProperties
  const reviewsSlider = useAutoSlider(reviews.length)
  const newsSlider = useAutoSlider(newsItems.length)
  const testimonialSlides = reviews.length > 0 ? [...reviews, ...reviews] : []
  const newsSlides = newsItems.length > 0 ? [...newsItems, ...newsItems] : []

  useEffect(() => {
    let isMounted = true

    Promise.all([fetchCases(), fetchReviews(), fetchNews()])
      .then(([loadedCases, loadedReviews, loadedNews]) => {
        if (!isMounted) {
          return
        }

        setCases(loadedCases)
        setReviews(loadedReviews)
        setNewsItems(loadedNews)
      })
      .catch((error: Error) => {
        if (!isMounted) {
          return
        }

        setContentError(error.message)
      })

    return () => {
      isMounted = false
    }
  }, [])

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

  const openSuccessModal = (message: string) => {
    setModalState({ message })
  }

  const casePreviewItems = cases.slice(0, 4)

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
                <span>для </span>
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
              <img src="/assets/hero-mascot2.png" alt="Талисман Tekstura" />
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

            {contentError ? <p className="form-status form-status--error">{contentError}</p> : null}

            <div className="cases__grid">
              {casePreviewItems.map((item, index) => (
                <article
                  key={item.id}
                  className={`case-card case-card--portfolio${index === 0 ? ' case-card--wide' : ''}`}
                  style={{
                    backgroundImage: `url(${item.coverImageUrl})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                  }}
                >
                  <Link className="case-card__link" to={`/cases/${item.slug}`}>
                    <div className="case-card__content">
                      <h3>{item.title}</h3>
                      <span className="case-card__category">{item.tag}</span>
                    </div>
                    <span className="case-card__hover-label">
                      <span>Взглянуть работу</span>
                      <ArrowIcon className="arrow-icon" />
                    </span>
                  </Link>
                </article>
              ))}

              <article className="case-card case-card--cta">
                <Link className="case-card__cta" to="/cases">
                  <span>Все работы</span>
                  <ArrowIcon className="arrow-icon" />
                </Link>
              </article>
            </div>

            {casePreviewItems.length === 0 ? (
              <p className="cases__empty">Кейсы появятся здесь после публикации в админке.</p>
            ) : null}

            <div className="cases__controls">
              <Link className="button button--primary cases__mobile-cta" to="/cases">
                <span>Все работы</span>
                <ArrowIcon className="arrow-icon" />
              </Link>
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
              onSubmit={async (event) => {
                event.preventDefault()

                if (!auditConsent) {
                  setAuditStatus('error')
                  setAuditError('Подтвердите согласие на обработку персональных данных.')
                  return
                }

                setAuditStatus('loading')
                setAuditError(null)

                try {
                  await submitAuditForm({
                    consentToProcessing: auditConsent,
                    email: auditEmail,
                    source: 'landing-page',
                    website: '',
                  })
                  setAuditEmail('')
                  setAuditConsent(false)
                  setAuditStatus('idle')
                  openSuccessModal('Спасибо. Мы свяжемся с вами и согласуем удобный формат.')
                } catch (error) {
                  setAuditStatus('error')
                  setAuditError(error instanceof Error ? error.message : 'Не удалось отправить форму.')
                }
              }}
            >
              <div className="newsletter__row">
                <input
                  type="email"
                  name="email"
                  placeholder="Ваш E-mail"
                  value={auditEmail}
                  onChange={(event) => setAuditEmail(event.target.value)}
                  required
                />
                <button
                  className="button button--primary newsletter__submit"
                  type="submit"
                  disabled={auditStatus === 'loading' || !auditConsent}
                >
                  {auditStatus === 'loading' ? 'ОТПРАВКА...' : 'Записаться'}
                </button>
              </div>
              <input
                className="form-honeypot"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="form-consent newsletter__consent">
                <input
                  id="audit-consent"
                  type="checkbox"
                  checked={auditConsent}
                  onChange={(event) => setAuditConsent(event.target.checked)}
                  required
                />
                <label htmlFor="audit-consent">
                  Я соглашаюсь на обработку персональных данных и принимаю{' '}
                  <Link to="/privacy-policy">политику конфиденциальности</Link>.
                </label>
              </div>
            </form>

            {auditError ? <p className="form-status form-status--error">{auditError}</p> : null}

            <p className="newsletter__note">
              Оставьте контакт — свяжемся и договоримся об удобном формате.
            </p>
          </div>
        </section>

        <section className="section reviews" id="reviews">
          <div className="container reviews__content">
            <h2 className="section-title reviews__title">Отзывы</h2>

            {reviews.length === 0 ? (
              <p className="cases__empty">Отзывы появятся здесь после публикации в админке.</p>
            ) : (
              <>
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
                        <div key={`${item.id}-${index}`} className="slider__slide" data-slider-item="true">
                          <article className="review-card">
                            <div className="review-card__label">{item.companyName}</div>
                            <img src={item.logoUrl} alt={item.companyName} />
                            <p>{item.quote}</p>
                          </article>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="slider-dots" aria-hidden="true">
                  {reviews.map((item, index) => (
                    <span
                      key={item.id}
                      className={`slider-dots__dot${reviewsSlider.visibleIndex === index ? ' slider-dots__dot--active' : ''}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="section news" id="news">
          <div className="container news__content">
            <h2 className="section-title news__title">
              Актуальные <em>новости</em>
            </h2>

            {newsItems.length === 0 ? (
              <p className="cases__empty">Новости появятся здесь после публикации в админке.</p>
            ) : (
              <>
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
                        <div key={`${item.id}-${index}`} className="slider__slide" data-slider-item="true">
                          <article className="news-card">
                            <div className="news-card__date">{formatNewsDate(item.publishedAt)}</div>
                            <div className="news-card__body">
                              <h3>{item.title}</h3>
                              <p>{item.excerpt}</p>
                            </div>
                            <div className="news-card__footer">
                              <div className="news-card__author">
                                <img src="/assets/news-avatar-tekstura.png" alt="TEKSTURA" />
                                <span>TEKSTURA</span>
                              </div>
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
                      key={item.id}
                      className={`slider-dots__dot${newsSlider.visibleIndex === index ? ' slider-dots__dot--active' : ''}`}
                    />
                  ))}
                </div>
              </>
            )}
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
                    {/* <a href="https://t.me/teksturadesign" target="_blank" rel="noreferrer">
                      @teksturadesign
                    </a>
                    <a href="https://instagram.com/tekstura_design" target="_blank" rel="noreferrer">
                      @tekstura_design
                    </a> */}
                    <a href="mailto:ann.tereshko@mail.ru">ann.tereshko@mail.ru</a>
                  </div>
                </div>
              </div>

              <form
                className="contact-form"
                onSubmit={async (event) => {
                  event.preventDefault()

                  if (!contactConsent) {
                    setContactStatus('error')
                    setContactError('Подтвердите согласие на обработку персональных данных.')
                    return
                  }

                  setContactStatus('loading')
                  setContactError(null)

                  try {
                    await submitContactForm({
                      ...contactForm,
                      consentToProcessing: contactConsent,
                    })
                    setContactForm({
                      email: '',
                      message: '',
                      name: '',
                      website: '',
                    })
                    setContactConsent(false)
                    setContactStatus('idle')
                    openSuccessModal('Ваш вопрос успешно отправлен.')
                  } catch (error) {
                    setContactStatus('error')
                    setContactError(error instanceof Error ? error.message : 'Не удалось отправить форму.')
                  }
                }}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Имя"
                  value={contactForm.name}
                  onChange={(event) =>
                    setContactForm((current) => ({ ...current, name: event.target.value }))
                  }
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={contactForm.email}
                  onChange={(event) =>
                    setContactForm((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                />
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Сообщение..."
                  value={contactForm.message}
                  onChange={(event) =>
                    setContactForm((current) => ({ ...current, message: event.target.value }))
                  }
                  required
                />
                <input
                  className="form-honeypot"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={contactForm.website}
                  onChange={(event) =>
                    setContactForm((current) => ({ ...current, website: event.target.value }))
                  }
                />
                <div className="form-consent">
                  <input
                    id="contact-consent"
                    type="checkbox"
                    checked={contactConsent}
                    onChange={(event) => setContactConsent(event.target.checked)}
                    required
                  />
                  <label htmlFor="contact-consent">
                    Я соглашаюсь на обработку персональных данных и принимаю{' '}
                    <Link to="/privacy-policy">политику конфиденциальности</Link>.
                  </label>
                </div>
                <button
                  className="button button--primary contact-form__submit"
                  type="submit"
                  disabled={contactStatus === 'loading' || !contactConsent}
                >
                  {contactStatus === 'loading' ? 'Отправка...' : 'Отправить'}
                </button>
                {contactError ? <p className="form-status form-status--error">{contactError}</p> : null}
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
            <div className="modal-success-icon" aria-hidden="true">
              <svg viewBox="0 0 28 28" focusable="false" aria-hidden="true">
                <path d="M7.5 14.5L12 19L20.5 10.5" />
              </svg>
            </div>
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
