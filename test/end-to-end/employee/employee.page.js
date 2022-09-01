/* global by, element, browser */
const components = require('../../shared/components');
const helpers = require('../../shared/helpers');

function EmployeePage() {
  const page = this;
  page.openCreateModal = async () => {
    await components.button.click('addButton');
  };

  page.openEditModal = async (reference) => {
    const root = element.all(by.id(reference)).first();
    await root.click();
    helpers.sleep(500);
    const editTag = element(by.cssContainingText('span', 'Editer'));
    await editTag.click();
  };

  page.openRolesModal = async (userName) => {
    const root = element.all(by.id(userName)).first();
    await root.click();
    helpers.sleep(500);
    const editTag = element.all(by.className('pi-cog')).first();
    await editTag.click();
  };

  page.openConfirmModal = async (EmployeeCode) => {
    const root = element.all(by.id(EmployeeCode)).first();
    await root.click();
    helpers.sleep(500);
    const deleteTag = element(by.cssContainingText('span', 'Supprimer'));
    await deleteTag.click();
    helpers.sleep(500);
    await components.button.click('submitButton');
  };

  page.setValue = async (id, value) => {
    await components.inputText.set(value, id);
  };

  page.submit = async () => {
    await components.button.click('submitButton');
  };
}

module.exports = EmployeePage;
