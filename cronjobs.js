import path from 'node:path'
import Bree from 'bree'
import Graceful from '@ladjs/graceful'

/**
 * Define cronjobjs here
 */
export function initCron(logger) {
  const bree = new Bree({
    logger,
    root: path.resolve('cron/jobs'),
    jobs: [
      {
        name: 'delete-outdated-tokes',
        interval: '5m'
      }, {
        name: 'send-confirmation-mails',
        interval: '1m'
      }
    ]
  })

  const graceful = new Graceful({brees: [bree]})
  graceful.listen()

  bree.start()
}
