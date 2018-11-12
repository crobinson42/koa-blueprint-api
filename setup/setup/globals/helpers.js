const fs = require('fs')
const path = require('path')
const debug = require('debug')('kba:setup:globals')

module.exports.loadGlobals = function loadGlobals(name, fileList = []) {
  if (!global[name]) global[name] = {}

  if (!fileList.length) return

  debug(`Loading globals for ${name}:`)

  fileList.forEach(fileInfo => {
    let value

    try {
      // eslint-disable-next-line
      value = require(fileInfo.path)
    } catch (e) {
      debug(
        `Failed to load file "${fileInfo.file}" for "${name}" @ ${
          fileInfo.path
        } ${e}`,
      )
      console.log(`
      
      Error Message:
      
      ${e.message}
      `)
      console.log(`
      Error Stack:
      
      ${e.stack}
      
      `)
      throw new Error(
        `Failed to load file "${fileInfo.file}" for "${name}" @ ${
          fileInfo.path
        }`,
      )
      process.exit(1)
    }

    Object.defineProperty(global[name], fileInfo.name, {
      enumerable: true,
      value,
      writable: false,
    })

    debug(` - ${fileInfo.name}`)
  })
}

module.exports.getDirFileList = function getDirFileList(
  dirPath,
  opts = { throw: false },
) {
  try {
    return fs.readdirSync(dirPath).map(file => ({
      file,
      name: file.substr(0, file.search(/\.js$/)),
      path: path.resolve(path.join(dirPath, file)),
    }))
  } catch (e) {
    if (opts.throw) {
      debug(`Failed to read directory ${dirPath} in utils/setup.js`, e)

      console.log(`
      
      Error Message:
      
      ${e.message}
      `)
      console.log(`
      Error Stack:
      
      ${e.stack}
      
      `)

      throw new Error(
        `Failed to read directorty ${dirPath} in utils/setup.js ${e}`,
      )
    }

    debug(`Directory does not exist, ${dirPath}`)
    return []
  }
}
