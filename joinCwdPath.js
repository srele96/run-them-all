const join = require('path').join;

/**
 * @param {string} path an absolute or relative path
 * @returns {string} an absolute path from the users root
 */
module.exports.joinCwdPath = function joinCwdPath(path) {
  if (typeof path === 'string' && path !== '') return join(process.cwd(), path);
  else throw new Error('Path must be a non empty string!');
};
