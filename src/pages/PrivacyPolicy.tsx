import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'
import { introParagraphs, legalSections } from '../data/legal'

const getHomeAnchorHref = (href: string) => `/${href}`

export default function PrivacyPolicyPage() {
  return (
    <div className="privacy-page">
      <div className="privacy-page__glow" aria-hidden="true" />
      <div className="privacy-page__texture" aria-hidden="true" />

      <SiteHeader homeHref="/" auditHref="/#audit" mapNavHref={getHomeAnchorHref} />

      <main className="privacy-main">
        <section className="privacy-policy" aria-labelledby="privacy-policy-title">
          <div className="container privacy-policy__container">
            <h1 className="privacy-policy__title" id="privacy-policy-title">
              <span>Политика </span>
              <em>конфиденциальности</em>
            </h1>

            <div className="privacy-policy__card">
              <div className="privacy-policy__intro">
                {introParagraphs.map((paragraph, index) => (
                  <p key={index} className="privacy-policy__paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>

              {legalSections.map((section) => (
                <section key={section.number} className="privacy-policy__section">
                  <h2 className="privacy-policy__section-title">
                    <span className="privacy-policy__section-number">{section.number}.</span>
                    <span>{section.title}</span>
                  </h2>

                  <div className="privacy-policy__section-body">
                    {section.paragraphs.map((paragraph, index) => (
                      <p
                        key={`${section.number}-${index}`}
                        className="privacy-policy__paragraph"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter mapNavHref={getHomeAnchorHref} socialMode="compact" />
    </div>
  )
}
