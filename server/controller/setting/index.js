const user = require('./user');
const role = require('./role');

const rate = require('./rate');
const currency = require('./currency');
const service = require('./service');
const division = require('./division');
const project = require('./project');
const transactions = require('./transactions');
const transactionsDownload = require('./transactions-download');
const templates = require('./template');
const paymentMethod = require('./payment_method');
const och_base = require('./och_base');
const member = require('./member');
const memberDownload = require('./member-download');
const cellule = require('./cellule');
const town = require('./town');
const pricing = require('./pricing');
module.exports = {
  user,
  templates,
  role,
  och_base,
  currency,
  project,
  transactions,
  transactionsDownload,
  rate,
  service,
  division,
  paymentMethod,
  member,
  cellule,
  town,
  memberDownload,
  pricing,
};
