/* global by, element, browser, angular */
const helpers = require('../../shared/helpers');
const employeePage = require('./employee.page');
const components = require('../../shared/components');
const environmentInfo = require('../../integration/helpers');
const testData = require('../data');

function employeeTests() {
  // the page object
  const page = new employeePage();
  const { employeeData,  employeeDataUpdate, employeeData2 } = testData.employeeTest;
  const { office } = testData.officeTest;
  environmentInfo.configureEnvironmentVariables();
  // navigate to the page
  before(() => {
    browser.waitForAngularEnabled(false);
    browser.get(`${process.env.SERVER_PATH}/#/employees`);
  });


  it(`Should create an employee `, async () => {
    await page.openCreateModal();
    helpers.sleep(1000);
    await page.setValue('displayname', employeeData.employee.displayname);
    await components.dropdown.set('gender', employeeData.employee.gender);
    await page.setValue('phone', employeeData.employee.phone);
    await page.setValue('email', employeeData.employee.email);
    await page.setValue('address', employeeData.employee.address);
    await components.calendar.set('dob', employeeData.employee.dob);
    await components.dropdown.set('location', employeeData.employee.office);
    await page.setValue('position', employeeData.employee.position);
    await components.dropdown.set('projects', employeeData.employee.projects.first);
    helpers.sleep(1000);
    await components.dropdown.set('projects', employeeData.employee.projects.second);
    helpers.sleep(1000);
    //
    await components.dropdown.set('projectsAccess', employeeData.employee.projects.first);
    helpers.sleep(1000);
    await components.dropdown.set('projectsAccess', employeeData.employee.projects.second);
    await components.dropdown.set('service', employeeData.employee.service);
    await components.checkbox.click('is_budget_holderLabel');
    await page.setValue('userName', employeeData.user.name);
    await page.setValue('password', employeeData.user.pwd);
    await page.submit();
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

  it(`Should edit employee's info`, async () => {
    const reference = `EMP.${office.code}.3`;
    await page.openEditModal(reference);
    helpers.sleep(1000);
    await page.setValue('grade', employeeDataUpdate.employee.grade);
    await page.submit();
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

  
  it(`Should create an other employee `, async () => {
    await page.openCreateModal();
    helpers.sleep(1000);
    await page.setValue('displayname', employeeData2.employee.displayname);
    await components.dropdown.set('gender', employeeData2.employee.gender);
    await page.setValue('phone', employeeData2.employee.phone);
    await page.setValue('email', employeeData2.employee.email);
    await page.setValue('address', employeeData2.employee.address);
    await components.calendar.set('dob', employeeData2.employee.dob);
    await components.dropdown.set('location', employeeData2.employee.office);
    await page.setValue('position', employeeData2.employee.position);
    await components.dropdown.set('projects', employeeData2.employee.projects.first);
    await components.dropdown.set('service', employeeData2.employee.service);
    await page.setValue('userName', employeeData2.user.name);
    await page.setValue('password', employeeData2.user.pwd);
    await page.submit();
    helpers.sleep(1000);
    await components.notification.hasSuccess();
  });

  it(`Should add user-role for this employee`, async () => {
    browser.get(`${process.env.SERVER_PATH}/#/users`);
    helpers.sleep(1000);
    await page.openRolesModal(employeeData.user.name);
    helpers.sleep(1000);
    await components.checkbox.click('role0');
    await page.submit();
    await components.notification.hasSuccess();
    helpers.sleep(3000);
  });

}

module.exports = employeeTests;
