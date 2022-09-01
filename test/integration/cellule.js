/* global expect, agent */
const server = require('../../server/app');
const testData = require('../data.js');

function celluleTest() {
  const baseUrl = '/cellules';
  const { cellule,cellule2, celluleUpdate} = testData.celluleTest;

  it("Create a cellule", async () => {
    const res = await agent.post(baseUrl)
      .send(cellule);
    expect(res.status).to.equal(201);
  });

  it("Update a cellule", async () => {
    const res = await agent.put(`${baseUrl}/${cellule.uuid}`)
      .send(celluleUpdate);
    expect(res.status).to.equal(200);
  });
  
  it("Create a second cellule", async () => {
    const res = await agent.post(baseUrl)
      .send(cellule2);
    expect(res.status).to.equal(201);
  });
  
  it("Get cellule's list", async () => {
    const res = await agent.get(baseUrl);
    const rows = res.body;
    expect(res.status).to.equal(200);
    expect(rows.length).to.equal(2);
  });

}

module.exports = celluleTest;
