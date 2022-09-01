/* global by, element, browser */
const components = require('../../shared/components');
const helpers = require('../../shared/helpers');

function PrfPage() {
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

  page.setProject = async (projectCode) => {
    const tag = element(by.id(projectCode));
    await tag.click();
  };

  
  page.setLocation = async (projectCode) => {
    const tag = element(by.id(projectCode));
    await tag.click();
  };

  page.setQuantity = async (index, value) => {
    await components.button.click(`quantity${index}`);
    await page.setValue(`quantity_input${index}`, value);
  };

  page.setDescription = async (index, value) => {
    await components.button.click(`description${index}`);
    await page.setValue(`description_input${index}`, value);
  };

  
  page.setUnitPrice = async (index, value) => {
    await components.button.click(`unit_price${index}`);
    await page.setValue(`unit_price_input${index}`, value);
  };
  
  page.setUnit= async (index, value) => {
    await components.button.click(`unit${index}`);
    await components.dropdown.set(`unit_input${index}`, value);
  };
  

  page.openConfirmModal = async (PrfCode) => {
    const root = element.all(by.id(PrfCode)).first();
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

module.exports = PrfPage;
