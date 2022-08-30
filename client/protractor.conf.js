/* global element, browser */

const q = require('q');
const components = require('../test/shared/components');
const environmentInfo = require('../test/integration/helpers');
// const FU = require('../test/shared/FormUtils');
// we want to make sure we run tests locally, but TravisCI
// should run tests on it's own driver.  To find out if it
// is Travis loading the configuration, we parse the
// process.env.TRAVIS_BUILD_NUMBER and reconfigure for travis
// as appropriate.

environmentInfo.configureEnvironmentVariables();

const config = {

  specs: [
    '../test/end-to-end/*.spec.js',
  ],
  seleniumAddress: 'http://localhost:4444/wd/hub',
  framework: 'mocha',
  allScriptsTimeout: 5000000,
  baseUrl: process.env.SERVER_PATH,
  mochaOpts: {
    reporterOptions: {
      reportDir: `${__dirname}/test/artifacts/`,
      reportName: 'mochawesome-end-to-end',
      reportTitle: 'erp End to End Tests',
      takePassedScreenshot: true,
      clearOldScreenshots: true,
      jsonReport: false,
    },
    timeout: 5190000,
  },
  capabilities: {
    'browserName': 'chrome', // or 'safari'
    'marionnette': true,
  },

  chromeOptions: {
    args: [
      '--disable-gpu','--window-size=1380,1324'
    ],
  },
  binary: '/usr/bin/chromedriver',

  // this will log the user in to begin with
  onPrepare: () => {
    return q.fcall(async () => {
      await browser.driver.manage().window().maximize();
      browser.waitForAngularEnabled(false);
      browser.get(`${process.env.SERVER_PATH}/#/sign_in`);
      await components.inputText.set('admin', 'name');
      await components.inputText.set('admin', 'password');
      await components.button.click('submitButton');
    }).delay(5500);
  },
};

// configuration for running on SauceLabs via Travis
if (process.env.TRAVIS_BUILD_NUMBER) {
  // SauceLabs credentials
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;

  // modify the browsers to use Travis identifiers
  config.multiCapabilities = [{
    // 'browserName': 'firefox',
    //  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    //  'build': process.env.TRAVIS_BUILD_NUMBER,
    // }, {
    browserName: 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    build: process.env.TRAVIS_BUILD_NUMBER,
  }];

  // make Travis take screenshots!
  config.mochaOpts = {
    reporter: 'mochawesome-screenshots',
    reporterOptions: {
      reportDir: `${__dirname}/test/artifacts/`,
      reportName: `protractor-${new Date().toDateString().replace(/\s/g, '-')}-${process.env.TRAVIS_BUILD_NUMBER}`,
      reportTitle: 'EPRF End to End Tests',
      takePassedScreenshot: false,
      clearOldScreenshots: true,
    },
    timeout: 30000,
  };
}

// expose to the outside world
exports.config = config;
