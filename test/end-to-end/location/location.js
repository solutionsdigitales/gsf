/* global by, element, browser, angular */
const helpers = require('../../shared/helpers');
const locationPage = require('./location.page');
const components = require('../../shared/components');
const environmentInfo = require('../../integration/helpers');
const testData = require('../data');

function locationTests() {
  // the page object
  const page = new locationPage();
  const { officeTest } = testData;
  environmentInfo.configureEnvironmentVariables();
  // navigate to the page
  before(() => {
    browser.waitForAngularEnabled(false);
    browser.get(`${process.env.SERVER_PATH}/#/locations`);
  });


  it(`Should create a location `, async () => {
    await page.openCreateModal();
    helpers.sleep(1000);
    await page.setValue('code', officeTest.office.code);
    await page.setValue('name', officeTest.office.name);
    await page.setValue('address', officeTest.office.adress);
    await page.submit();
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

  it(`Should edit a location `, async () => {
    await page.openEditModal(officeTest.office.code);
    helpers.sleep(1000);
    await page.setValue('name', officeTest.officeUpdate.name);
    helpers.sleep(500);
    await page.submit();
    await components.notification.hasSuccess();
  });

  
  it(`Should create a second location `, async () => {
    await page.openCreateModal();
    helpers.sleep(1000);
    await page.setValue('code',officeTest.office2.code);
    await page.setValue('name', officeTest.office2.name);
    await page.submit();
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

   
  it(`Should create a third location `, async () => {
    await page.openCreateModal();
    helpers.sleep(1000);
    await page.setValue('code', officeTest.office3.code);
    await page.setValue('name', officeTest.office3.name);
    await page.submit();
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

  it(`Should Avoid invalid data entry`, async () => {
    await page.openCreateModal();
    helpers.sleep(1000);
    await page.submit();
    helpers.sleep(500);
    await components.notification.hasError();
    await page.cancel();
  });

  it(`Should delete a location `, async () => {
    helpers.sleep(1000);
    await page.openConfirmModal(officeTest.office3.code);
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

}

module.exports = locationTests;
