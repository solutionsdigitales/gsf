/* global expect, agent */
const testData = require('../data.js');

function userTest () {
  const baseUrl = '/users/log/in';
  const { user } = testData.userTest;
  let token = null;
  it("Login as a user", async () => {
    const res = await agent.post(baseUrl)
      .send(user);
    expect(res.status).to.equal(200);
    token = res.body.token;
  });

  it("get users", async () => {
    const res = await agent.get('/users').set('x-access-token', token);
    expect(res.status).to.equal(200);
  });
  

}

module.exports = userTest;
