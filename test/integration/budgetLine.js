/* global expect, agent */

const path = require('path');
const server = require('../../server/app');
const { expect } = require('../../server/node_modules/chai');
const testData = require('../data.js');

function BudgetLineTest() {
  const baseUrl = '/budget_lines';
  const {
    budgetLine, budgetLineUpdate,
    budgetLine2, budgetLine3,
    incorrectBudgetLine,
    templatePath,
    templatePath2 } = testData.budgetLineTest;

  it("Import budget line from Excel", async () => {
    const filePath = path.resolve(__dirname, templatePath);
    const res = await agent.post(`${baseUrl}/import`)
      .attach('excelFile', filePath)
    expect(res.status).to.equal(201);
  });

  it("Import budget line from an incorrect Excel file, returns http:409", async () => {
    const filePath = path.resolve(__dirname, templatePath2);
    const res = await agent.post(`${baseUrl}/import`)
      .attach('excelFile', filePath)
    expect(res.status).to.equal(409);
  });


  it("Create a budget line", async () => {
    const res = await agent.post(baseUrl)
      .send(budgetLine);
    expect(res.status).to.equal(201);
  });

  it("Create an incorrect budget line, returns http:409", async () => {
    const res = await agent.post(baseUrl)
      .send(incorrectBudgetLine);
    expect(res.status).to.equal(409);
  });


  it("Update a budget line", async () => {
    const res = await agent.put(`${baseUrl}/${budgetLine.uuid}`)
      .send(budgetLineUpdate);
    expect(res.status).to.equal(200);
  });

  it("Create an other budget line", async () => {
    const res = await agent.post(baseUrl)
      .send(budgetLine2);
    expect(res.status).to.equal(201);
  });

  it("Get budget line's list", async () => {
    const res = await agent.get(baseUrl);
    const rows = res.body;
    expect(res.status).to.equal(200);
    expect(rows.length).to.equal(574);
  });

  it("Create a budget line, to be deleted", async () => {
    const res = await agent.post(baseUrl)
      .send(budgetLine3);
    expect(res.status).to.equal(201);
  });

  it("Delete a budget line", async () => {
    const res = await agent.delete(`${baseUrl}/${budgetLine3.uuid}`);
    expect(res.status).to.equal(200);
  });
}

module.exports = BudgetLineTest;
