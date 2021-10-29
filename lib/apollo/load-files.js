import fsSync from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import {mergeTypeDefs, mergeResolvers} from '@graphql-tools/merge'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
export async function listFiles(directory, filter = /^.*$/) {
  let fileList = []

  if (!fsSync.existsSync(directory)) {
    throw new Error(`Could not find '${directory}' directory.`)
  }

  const files = await fs.readdir(directory)
  for (const file of files) {
    const currentPath = path.join(directory, file)
    // eslint-disable-next-line no-await-in-loop
    if ((await fs.stat(currentPath)).isDirectory()) {
      // eslint-disable-next-line no-await-in-loop
      fileList = [...fileList, ...(await listFiles(currentPath, filter))]
    } else if (file.match(filter)?.length > 0) {
      // Filter for files matching search criterias
      fileList.push(currentPath)
    }
  }

  return fileList
}

/**
 * Load file by it's content. It do not import the file with it's methods.
 * This is a simple text file load.
 * @param {string} filePath File path to search for files
 * @param {RegExp} filter Regex filter to filter for specific files
 * @retuns {array}
 */
async function loadFiles(filePath, filter) {
  const staticFilesPath = path.join(__dirname, filePath)
  const files = await listFiles(staticFilesPath, filter)
  const filesData = []
  await Promise.all(files.map(async file => {
    const fileData = await fs.readFile(file, {encoding: 'utf8', flag: 'r'})
    filesData.push(fileData)
  }))

  return filesData
}

/**
 * Load Definitions files. This function is preset with file path and file filter.
 */
export async function loadTypeDefinitions() {
  const typeDefsArray = await loadFiles('./schemas/', /^.*\.graphql\w*$/)
  const typeDefs = mergeTypeDefs(typeDefsArray)
  return typeDefs
}

/**
 * ImportFiles use import method to import JS files.
 * When file has a default, we expect that this is the resolver object.
 * Otherwise th emethod lookoutz fo `ogmResolvers` function to create custom resolvers with the Neo4J OGM.
 * @param {string} filePath File path to search for files
 * @param {RegExp} filter Regex filter to filter for specific files
 * @param {object} ogm Neo4J OGM instance
 * @retuns {array}
 */
async function importFiles(filePath, filter, ogm) {
  const staticFilesPath = path.join(__dirname, filePath)
  const files = await listFiles(staticFilesPath, filter)
  const filesData = []

  await Promise.all(files.map(async file => {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const result = await import(url.pathToFileURL(file).toString())
    if (result.default) {
      filesData.push(result.default)
    }

    if (typeof result.ogmResolvers === 'function') {
      filesData.push(result.ogmResolvers(ogm))
    }
  }))

  return filesData
}

/**
 *
 * @param {object} ogm Neo4J OGM instance
 */
export async function loadResolvers(ogm) {
  const resolverArray = await importFiles('./schemas/', /^.*\.resolver\.js\w*$/, ogm)
  const resolvers = mergeResolvers(resolverArray)
  return resolvers
}
