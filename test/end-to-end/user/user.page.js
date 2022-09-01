/* global by, element, browser */
const components = require('../../shared/components');
const helpers = require('../../shared/helpers');

function UserPage() {
  const page = this;
  page.openCreateModal = async () => {
    await components.button.click('addButton');
  };

  page.openEditModal = async (userName) => {
    const root = element.all(by.id(userName)).first();
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

  page.setValue = async (id, value) => {
    await components.inputText.set(value, id);
  };

  page.submit = async () => {
    await components.button.click('submitButton');
  };
}

module.exports = UserPage;
