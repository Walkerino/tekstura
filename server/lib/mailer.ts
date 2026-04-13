import nodemailer from 'nodemailer'
import { env } from '../env'

function assertSmtpConfig() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) {
    throw new Error(
      'SMTP не настроен. Укажите SMTP_HOST, SMTP_USER и SMTP_PASSWORD в переменных окружения.',
    )
  }
}

function createTransporter() {
  assertSmtpConfig()

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  })
}

function buildAuditHtml(clientEmail: string) {
  return `<!doctype html>
<html lang="ru">
  <body style="margin:0;padding:24px;background:#f6f6f6;font-family:Arial,sans-serif;color:#121212;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e8e8e8;padding:28px;">
      <h2 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;">Новая заявка на бесплатный аудит дизайна</h2>
      <p style="margin:0 0 20px 0;font-size:15px;line-height:1.5;">
        Клиент оставил email и хочет попасть на бесплатный аудит дизайна.
      </p>
      <div style="margin:20px 0;padding:18px;border:1px dashed #cfcfcf;background:#fafafa;text-align:center;">
        <div style="font-size:13px;line-height:1.4;color:#666;">Email клиента</div>
        <div style="font-size:22px;line-height:1.4;font-weight:700;color:#121212;">${clientEmail}</div>
      </div>
    </div>
  </body>
</html>`
}

export async function sendAuditRequestEmail(clientEmail: string) {
  const transporter = createTransporter()
  const from = env.SMTP_FROM || env.SMTP_USER || env.AUDIT_NOTIFICATION_EMAIL

  await transporter.sendMail({
    from,
    to: env.AUDIT_NOTIFICATION_EMAIL,
    replyTo: clientEmail,
    subject: 'Заявка на бесплатный аудит дизайна',
    text: [
      'Новая заявка на бесплатный аудит дизайна.',
      '',
      `Email клиента: ${clientEmail}`,
      '',
      'Отправлено с формы записи на аудит сайта Tekstura.',
    ].join('\n'),
    html: buildAuditHtml(clientEmail),
  })
}

function buildContactHtml(payload: { name: string; email: string; message: string }) {
  return `<!doctype html>
<html lang="ru">
  <body style="margin:0;padding:24px;background:#f6f6f6;font-family:Arial,sans-serif;color:#121212;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e8e8e8;padding:28px;">
      <h2 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;">Новая заявка с формы вопросов</h2>
      <p style="margin:0 0 20px 0;font-size:15px;line-height:1.5;">
        Клиент отправил вопрос через форму на сайте Tekstura.
      </p>
      <div style="margin:20px 0;padding:18px;border:1px dashed #cfcfcf;background:#fafafa;">
        <div style="font-size:13px;line-height:1.4;color:#666;">Имя</div>
        <div style="font-size:18px;line-height:1.4;font-weight:700;color:#121212;margin-bottom:14px;">${payload.name}</div>
        <div style="font-size:13px;line-height:1.4;color:#666;">Email</div>
        <div style="font-size:18px;line-height:1.4;font-weight:700;color:#121212;margin-bottom:14px;">${payload.email}</div>
        <div style="font-size:13px;line-height:1.4;color:#666;">Сообщение</div>
        <div style="font-size:16px;line-height:1.6;color:#121212;white-space:pre-wrap;">${payload.message}</div>
      </div>
    </div>
  </body>
</html>`
}

export async function sendContactRequestEmail(payload: {
  name: string
  email: string
  message: string
}) {
  const transporter = createTransporter()
  const from = env.SMTP_FROM || env.SMTP_USER || env.AUDIT_NOTIFICATION_EMAIL

  await transporter.sendMail({
    from,
    to: env.AUDIT_NOTIFICATION_EMAIL,
    replyTo: payload.email,
    subject: 'Новая заявка с формы вопросов',
    text: [
      'Новая заявка с формы вопросов.',
      '',
      `Имя: ${payload.name}`,
      `Email: ${payload.email}`,
      '',
      'Сообщение:',
      payload.message,
      '',
      'Отправлено с формы "Вопросы?" сайта Tekstura.',
    ].join('\n'),
    html: buildContactHtml(payload),
  })
}
