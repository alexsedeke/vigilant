import nodemailer from 'nodemailer'
import {config} from '../lib/config.js'

export async function sendmail() {
  const transporter = nodemailer.createTransport({
    host: config.VL_MAIL_SMTP,
    port: config.VL_MAIL_PORT,
    secure: false, // Upgrade later with STARTTLS
    auth: {
      user: config.VL_MAIL_AUTH_USER,
      pass: config.VL_MAIL_AUTH_PASSWORD
    }
  })

  const mail = await transporter.sendMail({
    from: config.VL_MAIL_FROM,
    to: 'thorsten.sedeke@icloud.com',
    subject: 'Hello ✔',
    text: 'Hello world?',
    html: '<b>Hello world?</b>'
  })

  return mail
}

// main().catch(console.error)
