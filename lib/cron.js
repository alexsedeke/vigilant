import Bree from 'bree'
import Graceful from '@ladjs/graceful'

/**
 * Define cronjobjs here
 */
export default function initCron(logger) {
  const bree = new Bree({
    logger,
    jobs: [
      {
        name: 'delete-outdated-tokes',
        interval: '5m'
      }
    ]
  })

  const graceful = new Graceful({brees: [bree]})
  graceful.listen()

  bree.start()
}
