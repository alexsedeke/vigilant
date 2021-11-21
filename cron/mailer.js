import nodemailer from 'nodemailer'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import ejs from 'ejs'
import juice from 'juice'
import {htmlToText} from 'html-to-text'
import {config} from '../config.js'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 
 */
const smtp = nodemailer.createTransport({
  host: config.VL_MAIL_SMTP,
  port: config.VL_MAIL_PORT,
  secure: false,
  auth: {
    user: config.VL_MAIL_AUTH_USER,
    pass: config.VL_MAIL_AUTH_PASSWORD
  }
})

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export async function sendmail ({template: templateName, templateVars, ...restOfOptions}) {
  const templatePath = path.join(__dirname, 'mailtemplates', `${templateName}.html`)
  const options = {...restOfOptions}

  if (templateName && fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, "utf-8")
    const html = ejs.render(template, templateVars)
    const text = htmlToText(html)
    const htmlWithStylesInlined = juice(html)

    options.html = htmlWithStylesInlined
    options.text = text
  }

  return smtp.sendMail(options)
};
