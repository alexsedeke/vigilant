import fsSync from 'node:fs'
import fs from 'fs/promises'
import path from 'node:path'
import url from 'node:url'
import { mergeTypeDefs } from '@graphql-tools/merge'
import asyncForEach from '../../lib/asyncForEach.js'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 
 * @param {*} fileName 
 */
async function readFile (fileName) {
  return await fs.readFile(fileName, { encoding: 'utf8', flag: 'r' })
}

/**
 * List files of directory and subdirectory.
 * The filter use regex expression to match a file.
 *
 * Some regex helping information:
 * ^ - Anchor to start of string
 * .* - Matches anything one or more times except newline character
 * \. - Matches . (dot)
 * \w* - Matches word character one or more time
 * $ - End of string
 *
 * Example: ^.*\.graphql\w*$  will match all files containing '.graphql'
 *
 * @param {string} directory directory path
 * @returns {Promise<Array<string>>}
 */
export async function listFiles (directory, filter = /^.*$/) {
  let fileList = []

  if (!fsSync.existsSync(directory)) {
    throw new Error(`Could not find '${directory}' directory.`)
  }

  const files = await fs.readdir(directory)
  for (const file of files) {
    const currentPath = path.join(directory, file)
    if ((await fs.stat(currentPath)).isDirectory()) {
      fileList = [...fileList, ...(await listFiles(currentPath))]
    } else {
      // Filter for files matching search criterias
      if (file.match(filter).length) {
        fileList.push(currentPath)
      }
    }
  }

  return fileList
}

export async function loadFiles(filePath, filter) {
  const staticFilesPath = path.join(__dirname, filePath)
  const files = await listFiles(staticFilesPath, filter)
  const filesData = []
  await asyncForEach(files, async (file) => {
    const fileData = await readFile(file)
    filesData.push(fileData)
  })

  return filesData
}

const typeDefsArray = await loadFiles('./typeDefs/' ,/^.*\.graphql\w*$/)
const typeDefs = mergeTypeDefs(typeDefsArray)

export { typeDefs } 
