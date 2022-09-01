module.exports = {
    set : async (value, id) => {
        const root = element.all((id) ? by.id(id) : by.css(this.selector)).first();
        await root.clear();
        await root.sendKeys(value);
      },
}