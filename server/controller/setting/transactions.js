
const db = require('../../lib/db');
const FilterParser = require('../../lib/filter');


// database connection
const uuidToConvert = ['uuid', 'member_uuid', 'user_id'];

function read(req, res, next) {
  const options = req.query;
  const rqt = lookUp(options);
  db.exec(rqt.sql, rqt.params).then(rows => {
    res.status(200).json(rows);
  }).catch(next);
}

function detail(req, res, next) {
  const uuid = db.bid(req.params.uuid);
  const sql = `
    SELECT
      BUID(t.uuid) AS 'uuid', t.payment_method, t.phone, t.email, t.amount, 
      t.currency,t.currency_id, t.quantity, t.transaction_type,
      IF(t.status='OUI', 1, 0) AS 'status', 
      FORMAT_DATETIME(t.created_at) AS 'created_at',
      t.number,
      t.date, FORMAT_DATETIME(t.last_update) AS 'last_update'
    FROM transactions t
  `;
  db.exec(sql, uuid).then(transactions => {
    res.status(200).json(transactions);
  }).catch(next);
}


async function getMaxNumber() {
  const sql = 'SELECT MAX(number) as max_number FROM transactions';
  const result = await db.one(sql);
  return (result.max_number || 0) + 1
}

function create(req, res, next) {
  const data = req.body;
  createProcess(data).then(rows => {
    res.status(201).json(rows);
  }).catch(next);
}

async function createProcess(data) {
  db.convert(data, uuidToConvert);
  data.uuid = db.bid(data.uuid ? data.uuid : db.uuidString());
  data.number = await getMaxNumber();
  const sql = 'INSERT INTO transactions SET ?';
  return db.exec(sql, data);
}

function update(req, res, next) {
  const data = req.body;
  const uuid = db.bid(req.params.uuid);
  db.convert(data, uuidToConvert);
  const sql = 'UPDATE transactions SET ? WHERE uuid = ?';
  db.exec(sql, [data, uuid]).then(rows => {
    res.status(200).json(rows);
  }).catch(next);
}

function lookUp(options) {
  db.convert(options, uuidToConvert);
  const filters = new FilterParser(options, { tableAlias: 't' });
  const sql = `
    SELECT
        BUID(t.uuid) AS 'uuid', t.payment_method, t.phone, t.email, t.amount, 
        t.currency,t.currency_id, t.quantity, t.transaction_type,
        IF(t.status='OUI', 1, 0) AS 'status', 
        FORMAT_DATETIME(t.created_at) AS 'created_at',
        t.number,
        t.date, FORMAT_DATETIME(t.last_update) AS 'last_update',
        BUID(m.uuid) AS 'member_uuid', m.lastname as member_lastname,
        m.middlename as member_middlename, m.firstname as member_firstname
    FROM transactions t
    LEFT JOIN  member m ON m.uuid = t.member_uuid
    LEFT JOIN  user u ON u.id = t.user_id
  `;

  filters.equals('document_uuid');
  filters.equals('transaction_type');
  filters.equals('reference');
  filters.equals('payment_mode');
  filters.equals('currency');
  filters.equals('locked');
  filters.equals('phone');
  filters.custom('member_uuid', 'm.uuid=?');

  return {
    sql: filters.applyQuery(sql),
    params: filters.parameters(),
  }
}

module.exports = {
  read, create, update, detail,
}
