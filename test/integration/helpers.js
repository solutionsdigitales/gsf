const dotEnv = require('../../server/node_modules/dotenv');


function configureEnvironmentVariables() {
  // if the process NODE_ENV is not set, default to production.
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  // decode the file path for the environmental variables.
  const dotfile = `.env`;

  // load the environmental variables into process using the dotenv module
  dotEnv.config({ path : dotfile });
}

module.exports = {
  configureEnvironmentVariables,
};
