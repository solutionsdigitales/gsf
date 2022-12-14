
const db = require('../../lib/db');
const _ = require('lodash');
const FilterParser = require('../../lib/filter');


// database connection
const uuidToConvert = [
  'uuid', 'member_uuid', 'user_id',
  'pricing_uuid', 'pricing', 'membre_cellule'
];

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
  const sql = 'INSERT INTO transactions SET ?';
  if(data.months) {
    const months = _.clone(data.months);
    delete data.months;
    
    const transaction = db.transaction();
    const transactionNumber = await getMaxNumber();
    let monthIteration = 0;
    for(const month of months) {
      let _data = Object.assign({}, data);
      _data.uuid = db.bid(db.uuidString());
      _data.number = transactionNumber + monthIteration;
      _data.month = month;
      _data.amount = data.amount/months.length;
      transaction.addQuery(sql, _data);
      monthIteration++;
    }
    return transaction.execute();
  } else {
  data.uuid = db.bid(data.uuid ? data.uuid : db.uuidString());
  data.number = await getMaxNumber();
  
  return db.exec(sql, data);
  }
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

function remove(req, res, next) {
  const uuid = db.bid(req.params.uuid);
  const data = {
    locked: 1,
  };
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
        t.month, t.year,
        t.locked,
        FORMAT_DATETIME(t.created_at) AS 'created_at',
        FORMAT_ENTITY_NUMBER(t.number) as number,
        FORMAT_DATE(t.date) as 'date', FORMAT_DATETIME(t.last_update) AS 'last_update',
        BUID(m.uuid) AS 'member_uuid', m.lastname as member_lastname,
        m.middlename as member_middlename, m.firstname as member_firstname, m.number as member_number,
        u.name as 'user_name'
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
  filters.equals('number');
  filters.custom('pricing', 't.pricing_uuid = ?');
  filters.equals('phone');
  filters.equals('year');
  filters.equals('month');
  filters.custom('membre_number', 'm.number = ?');
  filters.custom('membre_cellule', 'm.cellule_uuid = ?');
  
  filters.custom('member_uuid', 'm.uuid=?');
  filters.setOrder(' ORDER BY t.number DESC');

  return {
    sql: filters.applyQuery(sql),
    params: filters.parameters(),
  }
}



function summery(req, res, next) {
  const sql = `
    SELECT transaction_type, SUM(amount) AS 'amount', currency
    FROM transactions
    WHERE transactions.locked = 0 
    GROUP BY transaction_type, currency
    ORDER BY transaction_type;
  `;

  db.exec(sql).then(results => {
    res.status(200).json(results);
  }).catch(next);

}


// delete a member
function count(req, res, next) {
  db.one(`
    SELECT count(uuid) as nbr 
    FROM transactions
    WHERE transactions.locked = 0`).then((result) => {
    res.status(200).json(result);
  }).catch(next);
}


module.exports = {
  read, create, update, detail, lookUp, delete : remove, summery, count
}
