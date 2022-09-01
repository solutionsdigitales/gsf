/* global by, element, browser */
const components = require('../../shared/components');
const helpers = require('../../shared/helpers');

function LocationPage() {
  const page = this;
  page.openCreateModal = async () => {
    await components.button.click('addButton');
  };

  page.openEditModal = async (projectCode) => {
    const root = element.all(by.id(projectCode)).first();
    await root.click();
    helpers.sleep(500);
    const editTag = element(by.cssContainingText('span', 'Editer'));
    await editTag.click();
  };

  page.openConfirmModal = async (projectCode) => {
    const root = element.all(by.id(projectCode)).first();
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
  page.cancel = async () => {
    await components.button.click('cancelButton');
  };
}

module.exports = LocationPage;
