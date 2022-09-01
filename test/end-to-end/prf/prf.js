/* global by, element, browser, angular */
const helpers = require('../../shared/helpers');
const prfPage = require('./prf.page');
const components = require('../../shared/components');
const environmentInfo = require('../../integration/helpers');
const testData = require('../data');

function prfTests() {
  // the page object
  const page = new prfPage();
  const { prf1 } = testData.prfTest;
  const { employeeData } = testData.employeeTest;
  const { project4 } = testData.projectTest;
  environmentInfo.configureEnvironmentVariables();
  // navigate to the page
  before(() => {
    browser.waitForAngularEnabled(false);
  });

  it(`Shoud login as an employee`, async () =>  {
    browser.get(`${process.env.SERVER_PATH}/#/sign_in`);
    helpers.sleep(1000);
    await page.setValue('name', 'test');
    await page.setValue('password', 'admin');
    await page.submit();
  });

  it(`Should create an prf `, async () => {
    helpers.sleep(3000);
    await browser.get(`${process.env.SERVER_PATH}/#/prf_registration`);
    helpers.sleep(2000);
    // await page.setProject(project4.code);
    // helpers.sleep(2000);
    await page.setLocation(testData.officeTest.office2.name);
    helpers.sleep(2000);
    await components.dropdown.set('fctOffice', testData.officeTest.office2.name);

    await components.dropdown.set('services', prf1.services.first);
    helpers.sleep(1000);
    await components.dropdown.set('approvers',employeeData.employee.displayname);
    await page.setValue('delivery_phone', prf1.delivery.phone);
    await page.setValue('delivery_adress', prf1.delivery.address);
    await components.calendar.set('delivery_expected_date', prf1.delivery.expected_date);
    await components.button.click('newLine');
    await components.button.click('BL0');
    helpers.sleep(1000);
    await components.button.click('line0');
    
    await page.setDescription(0, prf1.lines.first.description);
    await page.setUnit(0, prf1.lines.first.unit);
    await page.setQuantity(0, prf1.lines.first.quantity);    
    await page.setUnitPrice(0, prf1.lines.first.unit_price);
    await components.button.click('newLine');
    await components.button.click('newLine');

    // remove empty lines in the 
    helpers.sleep(2000);
    await components.button.click('removeLine2');
    await components.button.click('removeLine1');
    await page.setValue('usefulness', prf1.usefulness);
    await page.submit();
    helpers.sleep(500);
    await components.notification.hasSuccess();
    helpers.sleep(1500);
    await components.button.click('closeButton');
  });

}

module.exports = prfTests;
