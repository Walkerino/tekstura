import { InstagramIcon, TelegramIcon } from './icons'
import { footerPrimaryLinks, footerSecondaryLinks } from '../data/site'

type SocialMode = 'compact' | 'full'

type SiteFooterProps = {
  mapNavHref?: (href: string) => string
  offerHref?: string
  privacyHref?: string
  socialMode?: SocialMode
}

const defaultMapNavHref = (href: string) => href
const defaultPrivacyHref = '/privacy-policy'
const defaultOfferHref = '/public-offer'

const socialLinks = [
  {
    href: 'https://instagram.com/tekstura_design',
    label: 'Instagram',
    Icon: InstagramIcon,
  },
  {
    href: 'https://t.me/teksturadesign',
    label: 'Telegram',
    Icon: TelegramIcon,
  },
]

export default function SiteFooter({
  mapNavHref = defaultMapNavHref,
  offerHref = defaultOfferHref,
  privacyHref = defaultPrivacyHref,
  socialMode = 'full',
}: SiteFooterProps) {
  const visibleSocialLinks =
    socialMode === 'compact' ? socialLinks.slice(0, 2) : socialLinks

  return (
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
              <a key={item.href} href={mapNavHref(item.href)}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="site-footer__column site-footer__column--secondary">
            {footerSecondaryLinks.map((item) => (
              <a key={item.href} href={mapNavHref(item.href)}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <div className="site-footer__meta">
          <span>© 2026 TEKSTURA. Все права защищены.</span>
          <a href={privacyHref}>Политика конфиденциальности</a>
          <a href={offerHref}>Публичная оферта</a>
        </div>

        <div className="site-footer__socials" aria-label="Социальные сети">
          {visibleSocialLinks.map(({ href, label, Icon }) => (
            <a key={label} href={href} aria-label={label}>
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
