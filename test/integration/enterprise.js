/* global expect, agent, token */
const testData = require('../data.js');
function EnterpriseTest() {
  const baseUrl = '/enterprises';

  it("Get entreprice's list", async () => {
    const res = await agent.get(baseUrl);
    const rows = res.body;
    expect(res.status).to.equal(200);
    expect(rows.length).to.equal(1);
  });
}

module.exports = EnterpriseTest;
