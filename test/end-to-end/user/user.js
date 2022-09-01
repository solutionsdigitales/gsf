/* global by, element, browser, angular */
const helpers = require('../../shared/helpers');
const UserPage = require('./user.page');
const components = require('../../shared/components');
const environmentInfo = require('../../integration/helpers');
const testData = require('../data');

function UserTests() {
  // the page object
  const page = new UserPage();
  const { userTest } = testData;
  environmentInfo.configureEnvironmentVariables();
  // navigate to the page
  before(() => {
    browser.waitForAngularEnabled(false);
    browser.get(`${process.env.SERVER_PATH}/#/users`);
  });

  it(`Should open the modal `, async () => {
    await page.openCreateModal();
    helpers.sleep(1000);
  });

  it(`Should create a user `, async () => {
    await page.setValue('name', userTest.user1.name);
    await page.setValue('password', userTest.user1.password);
    await page.submit();
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

  it(`Should edit a user `, async () => {
    helpers.sleep(1000);
    await page.openEditModal(userTest.user1.name);
    helpers.sleep(1000);
    await page.setValue('name', userTest.user1Update.name);
    helpers.sleep(400);
    await page.submit();
    await components.notification.hasSuccess();
  });


  it(`Should add role`, async () => {
    helpers.sleep(1000);
    await page.openRolesModal(userTest.user1Update.name);
    helpers.sleep(1000);
    await components.checkbox.click('role0');
    await page.submit();
    await components.notification.hasSuccess();
  })
}

module.exports = UserTests;
