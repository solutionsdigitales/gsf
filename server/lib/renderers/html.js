/**
 * @overview lib/renderers/html
 *
 * @description
 * This service is responsible for compiling valid HTML documents given a path
 * to a handlebars template.
 *
 * @requires moment
 * @requires process
 * @requires path
 * @requires inline-source
 * @requires debug
 * @requires server/lib/template
 * @requires server/lib/util
 */
const moment = require('moment');
const process = require('process');
const debug = require('debug')('renderers:html');
const path = require('path');
const util = require('../util');
const hbs = require('../template');

const translateHelperFactory = require('../template/helpers/translate');
const concatHelperFactory = require('../template/helpers/concat');

const headers = {
  'Content-Type' : 'text/html',
};

exports.render = renderHTML;
exports.extension = '.html';
exports.headers = headers;

/**
 * @function getNodeModulesPath
 *
 * @description
 * This function returns the node_modules path, no matter where this file
 * lies by using node's underlying require() algorithm.
 *
 * @return {string} the node_modules path
 */
function getNodeModulesPath() {
  const isWin = process.platform === 'win32';
  const barcodePath = require.resolve('jsbarcode');
  const [nodeModulesDir] = barcodePath.split(isWin ? 'node_modules\\' : 'node_modules/');
  return path.join(nodeModulesDir, 'node_modules');
}

/**
 *
 * @param {Object} data     Object of keys and values that will be made available to the template
 * @param {String} template Path to a handlebars template
 * @param {Object} options  The default options, including language setting
 * @returns {Promise}       Promise resolving in a rendered template (HTML)
 */
async function renderHTML(data, template, options = {}) {
  debug(`initializing ${options.lang} date locale`);
  // load local language for momentjs if possible
  const languageDependency = `moment/locale/${options.lang}`;
  util.loadModuleIfExists(languageDependency);

  moment.locale(options.lang);

  // inlining assets requires absolute path to be passed to templates
  data.absolutePath = path.join(process.cwd(), 'client');

  data.nodeModulesPath = getNodeModulesPath();
  data.serverPath = process.env.SERVER_PATH;
  data.isPrinting = options.isPrinting;

  debug(`initializing ${options.lang} translation locale`);
  // make sure that we have the appropriate language set.  If options.lang is
  // not specified, will default to English.  To change this behavior, see the
  // factory code.
  const translate = translateHelperFactory(options.lang);
  const _concat = concatHelperFactory(translate);

  hbs.helpers.translate = translate;
  hbs.helpers.concat = _concat;


  debug(`rendering HTML file`);

  const html = await hbs.render(template, data);
  return html;
}
