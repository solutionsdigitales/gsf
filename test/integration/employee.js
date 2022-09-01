/* global expect, agent */
const path = require('path');
const testData = require('../data.js');

function employeeTest() {
  const baseUrl = '/employees';
  const {
    employeeData,
    employeeDataUpdate,
    employeeData2,
    employeeData3,
    templatePath
  } = testData.employeeTest;

  it("Create an employee", async () => {
    const res = await agent.post(baseUrl)
      .send(employeeData);
    expect(res.status).to.equal(201);
  });

  it("Update employee info", async () => {
    const res = await agent.put(`${baseUrl}/${employeeData.employee.uuid}`)
      .send(employeeDataUpdate);
    expect(res.status).to.equal(200);
  });

  it("Create a second employee", async () => {
    const res = await agent.post(baseUrl)
      .send(employeeData2);
    expect(res.status).to.equal(201);
  });

  it("Get employee's list", async () => {
    const res = await agent.get(baseUrl);
    const rows = res.body;
    expect(res.status).to.equal(200);
    expect(rows.length).to.equal(3);
  });

  it("Create a third employee", async () => {
    const res = await agent.post(baseUrl)
      .send(employeeData3);
    expect(res.status).to.equal(201);
  });

  it("Delete an employee", async () => {
    const res = await agent.delete(`${baseUrl}/${employeeData3.employee.uuid}`)
    expect(res.status).to.equal(200);
  });

  it("Login using employee account", async () => {
    const res = await agent.post('/users/log/in')
      .send({
        name: employeeData.user.name,
        pwd: employeeData.user.pwd,
      });
    const result = res.body;
    expect(res.status).to.equal(200);
    expect(result.user.id).to.equal(employeeData.user.id);
    expect(typeof (result.token)).to.equal('string');
    expect(result.employee.uuid).to.equal(employeeData.employee.uuid);
  });


  it("Login using a bad employee account", async () => {
    const res = await agent.post('/users/log/in')
      .send({
        name: 'uhjjj',
        pwd: 'wrink',
      });
    expect(res.status).to.equal(404);
  });

  it("Import employees from Excel", async () => {
    const filePath = path.resolve(__dirname, templatePath);
    const res = await agent.post(`${baseUrl}/import`)
      .field('office_uuid', employeeData.employee.office_uuid)
      .attach('excelFile', filePath);
    expect(res.status).to.equal(201);
  });
}

module.exports = employeeTest;
