/* global by, element, browser, angular */
const path = require('path');
const helpers = require('../../shared/helpers');
const BudgetLinePage = require('./page');
const components = require('../../shared/components');
const environmentInfo = require('../../integration/helpers');
const testData = require('../data');

function BudgetLineTests() {
  // the page object
  const page = new BudgetLinePage();
  const { templatePath } = testData.budgetLineTest;
  environmentInfo.configureEnvironmentVariables();
  // navigate to the page
  before(() => {
    browser.waitForAngularEnabled(false);
    browser.get(`${process.env.SERVER_PATH}/#/budget_lines`);
  });

  it(`Should import lines `, async () => {
    const temp = path.resolve(__dirname, templatePath);
    helpers.sleep(2000);
    await page.openImportModal();
    helpers.sleep(1000);
    await page.setValue('updaload', temp);
    await page.submit();
    helpers.sleep(2000);
    await components.notification.hasSuccess();
  });


}

module.exports = BudgetLineTests;
