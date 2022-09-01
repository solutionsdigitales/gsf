/* global by, element, browser, angular */
const helpers = require('../../shared/helpers');
const ProjectPage = require('./project.page');
const components = require('../../shared/components');
const environmentInfo = require('../../integration/helpers');
const testData = require('../data');

function projectTests() {
  // the page object
  const page = new ProjectPage();
  const { projectTest } = testData;
  environmentInfo.configureEnvironmentVariables();
  // navigate to the page
  before(() => {
    browser.waitForAngularEnabled(false);
    browser.get(`${process.env.SERVER_PATH}/#/projects`);
  });


  it(`Should create a project `, async () => {
    await page.openCreateModal();
    helpers.sleep(1000);
    await page.setValue('code', projectTest.project1.code);
    await page.setValue('name', projectTest.project1.name);
    await page.submit();
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

  it(`Should edit a project `, async () => {
    await page.openEditModal(projectTest.project1.code);
    helpers.sleep(1000);
    await page.setValue('short_name', projectTest.project1Update.short_name);
    helpers.sleep(500);
    await page.submit();
    await components.notification.hasSuccess();
  });

  
  it(`Should create a second project `, async () => {
    await page.openCreateModal();
    helpers.sleep(1000);
    await page.setValue('code', projectTest.project2.code);
    await page.setValue('name', projectTest.project2.name);
    await page.submit();
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

   
  it(`Should create a third project `, async () => {
    await page.openCreateModal();
    helpers.sleep(1000);
    await page.setValue('code', projectTest.project3.code);
    await page.setValue('name', projectTest.project3.name);
    await page.submit();
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

  it(`Should delete a project `, async () => {
    await page.openConfirmModal(projectTest.project3.code);
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

}

module.exports = projectTests;
