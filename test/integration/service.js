/* global expect, agent */
const server = require('../../server/app');
const testData = require('../data.js');

function serviceTest() {
  const baseUrl = '/services';
  const { service, serviceUpdate, service2 } = testData.serviceTest;

  it("Create a service", async () => {
    const res = await agent.post(baseUrl)
      .send(service);
    expect(res.status).to.equal(201);
  });

  it("Update a service", async () => {
    const res = await agent.put(`${baseUrl}/${service.uuid}`)
      .send(serviceUpdate);
    expect(res.status).to.equal(200);
  });
  
  it("Create a second service", async () => {
    const res = await agent.post(baseUrl)
      .send(service2);
    expect(res.status).to.equal(201);
  });
  
  it("Get service's list", async () => {
    const res = await agent.get(baseUrl);
    const rows = res.body;
    expect(res.status).to.equal(200);
    expect(rows.length).to.equal(2);
  });

}

module.exports = serviceTest;
