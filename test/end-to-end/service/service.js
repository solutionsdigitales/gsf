/* global by, element, browser, angular */
const helpers = require('../../shared/helpers');
const servicePage = require('./service.page');
const components = require('../../shared/components');
const environmentInfo = require('../../integration/helpers');
const testData = require('../data');

function serviceTests() {
  // the page object
  const page = new servicePage();
  const { serviceTest } = testData;
  environmentInfo.configureEnvironmentVariables();
  // navigate to the page
  before(() => {
    browser.waitForAngularEnabled(false);
    browser.get(`${process.env.SERVER_PATH}/#/services`);
  });

  it(`Should create a service `, async () => {
    await page.openCreateModal();
    helpers.sleep(1000);
    await page.setValue('name', serviceTest.service.name);
    await page.submit();
    helpers.sleep(500);
    await components.notification.hasSuccess();
  });

  it(`Should edit a service `, async () => {
    await page.openEditModal( serviceTest.service.name);
    helpers.sleep(1000);
    await page.setValue('name',  serviceTest.serviceUpdate.name);
    helpers.sleep(500);
    await page.submit();
    await components.notification.hasSuccess();
  });

  
  it(`Should create a second service `, async () => {
    await page.openCreateModal();
    helpers.sleep(1000);
    await page.setValue('name', serviceTest.service2.name);
    await page.submit();
    helpers.sleep(500);
    await components.notification.hasSuccess();
  });

   
  it(`Should create a third service `, async () => {
    await page.openCreateModal();
    helpers.sleep(1000);
    await page.setValue('name', serviceTest.service3.name);
    await page.submit();
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

  it(`Should delete a service `, async () => {
    await page.openConfirmModal(serviceTest.service3.name);
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

}

module.exports = serviceTests;
