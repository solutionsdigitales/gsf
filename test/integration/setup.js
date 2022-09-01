/**
 * @overview setup
 *
 * @description
 * This file runs before all other mocha tests, attaching global variables used in tests.
 *
 * @requires chai
 * @requires q
 * @requires chai-http
 * @requires chai-datetime
 *
 */

// import plugins
const chai = require('../../server/node_modules/chai');
const chaiHttp = require('../../server/node_modules/chai-http');
const ePRFTests = require('./eprf');
// server
const server = require('../../server/app');

// runs before any tests in the repository
before(async () => {
  console.log('Setting up install test suite...');

  // attach plugins
  chai.use(chaiHttp);

  // set global variables
  global.chai = chai;
  global.expect = chai.expect;
  global.agent = chai.request.agent(server);
  process.env.NODE_ENV = 'development';
  const { agent } = global;
});

// runs after all tests are completed
after((done) => {
  console.log('Install test suite completed.');
  global.agent.close((err) => { done(err); });
});
