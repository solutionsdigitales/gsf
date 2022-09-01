/* global by, element, browser*/
module.exports = {
  set: async (id, label) => {
    await element.all(by.id(id)).first().click();
    await element(by.css(`[aria-label="${label}"]`)).click();
    await browser.actions().mouseMove({ x: 0, y: 0 }).click().perform();
  },
}