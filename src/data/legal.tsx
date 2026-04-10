import type { ReactNode } from 'react'

export type LegalSection = {
  number: string
  title: string
  paragraphs: ReactNode[]
}

export const introParagraphs: ReactNode[] = [
  <>
    This Getnextjstemplates Terms of Service (“<strong>Agreement</strong>”) is entered
    into by and between Getnextjstemplates (“<strong>Getnextjstemplates</strong>”) and
    the entity or person placing an order for or accessing the Services (“
    <strong>Customer</strong>”). This Agreement consists of the terms and conditions set
    forth below and any Order Form. The “<strong>Effective Date</strong>” of this
    Agreement is the date which is the earlier of (a) Customer’s initial access to the
    Services through any online provisioning, registration or order process or (b) the
    Effective Date of the first Order Form. This Agreement will govern Customer’s
    initial purchase on the Effective Date as well as any future purchases made by
    Customer that reference this Agreement. Getnextjstemplates may modify this
    Agreement from time to time as permitted in Section 13.4 (Amendment).
  </>,
  <>
    Capitalized terms shall have the meanings set forth in Section 1, or in the section
    where they are first used
  </>,
]

export const legalSections: LegalSection[] = [
  {
    number: '1',
    title: 'Definitions',
    paragraphs: [
      <>
        <strong>1.1 “Authorized Devices”</strong>means those mobile, desktop, or other
        devices with which the Services can be accessed and used.
      </>,
      <>
        <strong>1.2 “Content”</strong>means code, content, fonts, graphics, designs,
        documents, or materials created using the Services by Customer and its Users or
        imported into the Services by Customer and its Users.
      </>,
      <>
        <strong>1.3 “Documentation”</strong>means the technical materials made available
        by Getnextjstemplates to Customer and/or its Users in hard copy or electronic
        form describing the use and operation of the Services.
      </>,
      <>
        <strong>1.4 “Services”</strong>Getnextjstemplates’s proprietary web-based
        products and services, along with downloadable desktop and mobile apps. Each
        Order Form will identify details of Customer’s Services subscription.
      </>,
      <>
        <strong>1.5 “Order Form”</strong>means a document signed by both Parties
        identifying the Enterprise Services to be made available by Getnextjstemplates
        pursuant to this Agreement.
      </>,
      <>
        <strong>1.6 “Packages”</strong>or<strong>“Components”</strong>means add-on
        modules made available within the Services. Packages and Components may be
        created by Getnextjstemplates, Customer or other third parties. Packages and
        Components created by Getnextjstemplates are supported as part of the Services.
        Getnextjstemplates will use reasonable efforts to support Customer’s use of
        Packages and Components created by third parties but disclaims all warranties as
        to such Packages and Components.
      </>,
      <>
        <strong>1.7 “User”</strong>means an employee, contractor or other individual
        associated with Customer who has been provisioned by Customer with access to the
        Services.
      </>,
      <>
        <strong>1.8 “Services”</strong>means Getnextjstemplates’s SaaS product, web
        design software, tools, along with downloadable desktop and mobile apps. Each
        Order Form will identify details of Customer’s subscription to the Services.
      </>,
    ],
  },
  {
    number: '2',
    title: 'License and use rights',
    paragraphs: [
      <>
        <strong>2.1 Services </strong>
        Getnextjstemplates hereby grants Customer a non-exclusive, non-transferable
        license during the Term (as defined in Section 12) to: (a) use the Services and
        to download and install desktop or mobile applications as applicable on the
        number and type of Authorized Devices solely for Customer’s internal business
        purposes in accordance with the Documentation, and/or (b) use our SaaS product,
        hosted systems, design software, tools, and build websites under the
        Getnextjstemplates.app domain.. The Services are delivered electronically.
      </>,
      <>
        <strong>2.2 Provisioning the Services </strong>
        Getnextjstemplates will provide to Customer the necessary passwords, security
        protocols, policies, network links or connections (“Access Protocols”) to allow
        Customer and its Users to access the Services as described herein; no other
        access to the website or servers from which the Services are delivered is
        permitted. Customer will provision its Users to access and use the features and
        functions of the Services through the Access Protocols. Customer may select one
        or more Users to act as administrators and control, manage and use the Services
        on Customer’s behalf. Customer shall be responsible for all acts and omissions
        of its Users
      </>,
    ],
  },
]
