
const dotEnv = require('dotenv');
const _ = require('lodash');
const path = require('path');
configureEnvironmentVariables();

const express = require('express');
const cors = require('cors');

const session = require('express-session');
const memoryStore = require('memorystore')(session)
const routes = require('./routes');

const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const access = require('../server/config/access');

let app = express();

app.use(bodyParser.json({ limit: '18mb' }));
app.use(xmlparser());

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '18mb'
}));


// session
app.use(session({
  secret: 'e_prf',
  resave: false,
  saveUninitialized: true,
  store: new memoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    maxAge: 86400000
  },
}));

app.disable("x-powered-by");

app.use(express.static(`${__dirname}/upload`));
app.use(express.static(path.resolve(__dirname, '../client/dist/')));

const corsOptions = [{
  origin: `http://localhost:${process.env.CLIENT_DEV_PORT}`,
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET, PUT, POST, DELETE"
}];


app.use(cors(corsOptions));


access(app);

new routes(app);
/**
 * @function configureEnvironmentVariables
 *
 * @description
 * Uses dotenv to add environmental variables from the .env.* file to the
 * process object.  If the NODE_ENV system variable is not set, the function
 * defaults to 'production'
 */
function configureEnvironmentVariables() {
  // if the process NODE_ENV is not set, default to production.
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';

  // decode the file path for the environmental variables.
  const dotfile = path.resolve(__dirname, '../.env');
  // load the environmental variables into process using the dotenv module
  dotEnv.config({ path: dotfile });
}

const port = process.env.PORT;
app.listen(port);
console.log(`app runs on port : ${port}`);

module.exports = app;
