/* global by, element, browser*/
module.exports = {
  set: async (id, value) => {
    const root = element(by.id(id));
    await root.clear();
    await root.sendKeys(value);
    await browser.actions().mouseMove({ x: 0, y: 0 }).click().perform();
  }
};