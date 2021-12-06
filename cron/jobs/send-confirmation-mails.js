import {driver} from '../neo4j.js'
import {config} from '../../config.js'
import {logger} from '../logger.js'
import {sendmail} from '../mailer.js'

const session = driver.session()

try {
  // Get all emails to send confirmation email
  const emails = await session.readTransaction(async tx => {
    const result = await tx.run('MATCH (a:Account) WHERE a.confirmmail = false RETURN a.email as email')
    return result.records.map(record => record.get('email'))
  })
  // Send mail
  await session.writeTransaction(tx =>
    Promise.all(
      emails.map(async email => {
        // Send mail
        await sendmail({
          from: config.VL_MAIL_FROM,
          to: email,
          subject: 'Confirm your email',
          template: 'confirm-email',
          templateVars: {
            emailAddress: email,
            confirmLink: config.VL_MAIL_LINK_CONFIRM,
          }
        })
        // set confirmmail tag
        tx
          .run(
            'MATCH (a:Account {email: $person_email}) SET a.confirmmail = true RETURN a',
            { person_email: email }
          )
          .then(
            result => {
              if (result.summary.counters.updates().propertiesSet === 1) {
                logger.info({ message: 'confirmation mail send', email })
              }
            }
          )
        }
      )
    )
  )
}  catch (executionError) {
  logger.error(executionError)
} finally {
  await session.close()
  await driver.close()
}
