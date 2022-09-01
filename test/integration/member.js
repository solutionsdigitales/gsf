/* global expect, agent */
const server = require('../../server/app');
const testData = require('../data.js');

function memberTest() {
  const baseUrl = '/members';
  const { member,member2, memberUpdate } = testData.memberTest;

  it("Create a member", async () => {
    const res = await agent.post(baseUrl)
      .send(member);
    expect(res.status).to.equal(201);
  });

  it("Update a member", async () => {
    const res = await agent.put(`${baseUrl}/${member.uuid}`)
      .send(memberUpdate);
    expect(res.status).to.equal(200);
  });
  
  it("Create a second member", async () => {
    const res = await agent.post(baseUrl)
      .send(member2);
    expect(res.status).to.equal(201);
  });
  
  it("Get member's list", async () => {
    const res = await agent.get(baseUrl);
    const rows = res.body;
    expect(res.status).to.equal(200);
    expect(rows.length).to.equal(2);
  });

}

module.exports = memberTest;
