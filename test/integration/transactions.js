/* global expect, agent */
const server = require('../../server/app');
const testData = require('../data.js');

function transactionTest() {
  const baseUrl = '/transactions';
  const { transaction,transaction2, transactionUpdate } = testData.transactionTest;

  it("Create a transaction", async () => {
    const res = await agent.post(baseUrl)
      .send(transaction);
    expect(res.status).to.equal(201);
  });

  it("Update a transaction", async () => {
    const res = await agent.put(`${baseUrl}/${transaction.uuid}`)
      .send(transactionUpdate);
    expect(res.status).to.equal(200);
  });
  
  it("Create a second transaction", async () => {
    const res = await agent.post(baseUrl)
      .send(transaction2);
    expect(res.status).to.equal(201);
  });
  
  it("Get transaction's list", async () => {
    const res = await agent.get(baseUrl);
    const rows = res.body;
    expect(res.status).to.equal(200);
    expect(rows.length).to.equal(2);
  });

}

module.exports = transactionTest;
