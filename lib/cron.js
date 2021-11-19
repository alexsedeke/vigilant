import Bree from 'bree'
import Graceful from '@ladjs/graceful'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log(__dirname)

/**
 * Define cronjobjs here
 */
const bree = new Bree({
  jobs: [
    {
      name: 'test',
      interval: '1m'
    }
  ]
})

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [bree] })
graceful.listen()

// start all jobs (this is the equivalent of reloading a crontab):
// bree.start()

export default bree
