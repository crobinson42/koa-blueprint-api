const fs = require('fs');
const path = require('path');

function loadGlobals(name, fileList = []) {
  if (!global[name]) global[name] = {};

  if (!fileList.length) return;

  console.log(`Loading globals for ${name}:`);

  fileList.forEach((fileInfo) => {
    let value;

    try {
      // eslint-disable-next-line
      value = require(fileInfo.path)
    } catch (e) {
      console.log('');
      console.log(
        `Failed to load file "${fileInfo.file}" for "${name}" @ ${
          fileInfo.path
        }`,
        e,
      );
      process.exit(1);
    }

    Object.defineProperty(global[name], fileInfo.name, {
      enumerable: true,
      value,
      writable: false,
    });

    console.log(` - ${fileInfo.name}`);
  });
}

function getDirFileList(dirPath) {
  try {
    return fs.readdirSync(dirPath).map(file => ({
      file,
      name: file.substr(0, file.search(/\.js$/)),
      path: path.resolve(path.join(dirPath, file)),
    }));
  } catch (e) {
    console.log(`Failed to read directorty ${dirPath} in utils/setup.js`, e);
    return process.exit(1);
  }
}

// load/register globals from /api dir
module.exports = function setupGlobals() {
  /**
   ****** ORDER MATTERS ******
   * Do NOT change order - app
   * and controllers relies on
   * this order of loading
   */
  loadGlobals('_config', getDirFileList('./config'));
  loadGlobals('Services', getDirFileList('./api/services'));
  loadGlobals('Models', getDirFileList('./api/models'));
  loadGlobals('Policies', getDirFileList('./api/policies'));
  loadGlobals('Hooks', getDirFileList('./api/hooks'));
  loadGlobals('Controllers', getDirFileList('./api/controllers'));
};
