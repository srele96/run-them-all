const { extname, resolve } = require('path');
const { writeFile } = require('fs');

/**
 * Overwrites CLI configuration and saves users path.
 *
 * @param {string} path relative or absolute configuration path
 */
module.exports.saveConfigPath = function saveConfigPath(path) {
  if (typeof path !== 'string' || path === '')
    throw new Error('Path must be a non-empty string!');

  const supportedExtension = '.json';
  const isSupported = extname(path) === supportedExtension;

  if (isSupported) {
    const createAbsolutePath = resolve(path);
    const createFormattedConfig = JSON.stringify(
      { path: createAbsolutePath },
      null,
      2
    );

    writeFile('config.json', createFormattedConfig, (err) => {
      if (err)
        console.log('Failed to save path!\n', JSON.stringify(err, null, 2));
      else console.log('Saved path successfully!\n' + createFormattedConfig);
    });
  } else
    console.log(
      "Couldn't save your configuration: " +
        path +
        '. Currently supported configurations are: ' +
        supportedExtension.toUpperCase()
    );
};
