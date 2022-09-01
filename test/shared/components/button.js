
module.exports = {
    selector : '[button]',
    click : async (id) => {
        const root = element.all((id) ? by.id(id) : by.css(this.selector)).first();
        await root.click();
      },
}