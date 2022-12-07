const db = require('../../lib/db');
const FilterParser = require('../../lib/filter');

function read(req, res, next) {
  const options = req.query;
  const rqt = lookUp(options);
  db.exec(rqt.sql, rqt.params).then(pricings => {
    res.status(200).json(pricings);
  }).catch(next);
}

function lookUp(options) {
db.convert(options, ['uuid']);
  const filters = new FilterParser(options, { tableAlias: 'p' });
  let sql = `
    SELECT 
        BUID(p.uuid) AS uuid, p.name, 
        p.amount, p.is_periodic,  is_debt, is_refund
    FROM pricing as p
  `;
  filters.equals('uuid');
  filters.equals('name');
  filters.setOrder(' ORDER BY p.name ');
  return {
    sql: filters.applyQuery(sql),
    params: filters.parameters(),
  }


}

// retreive all pricings
function detail(req, res, next) {
  const sql = `
  SELECT 
    BUID(uuid) as uuid, name, amount, is_periodic, is_debt, is_refund
    FROM pricing
    WHERE uuid = ?
    `;
  const uuid = db.bid(req.params.uuid);
  db.one(sql, uuid).then(card => {
    res.status(200).json(card);
  }).catch(next);
}

// create a new pricing
function create(req, res, next) {
  const data = req.body;
  data.uuid = db.bid(data.uuid ? data.uuid : db.uuidString());
  db.exec('INSERT INTO pricing SET ?', data).then(() => {
    res.sendStatus(201);
  }).catch(next);
}

// update pricing infos
function update(req, res, next) {
  const data = req.body;
  db.convert(data, ['uuid']);
  const uuid = db.bid(req.params.uuid);
  data.last_update = new Date();
  delete data.created_at;
  db.exec('UPDATE pricing SET ? WHERE uuid=?', [data, uuid]).then(() => {
    res.sendStatus(200);
  }).catch(next);
}

// delete a pricing
function remove(req, res, next) {
    const uuid = db.bid(req.params.uuid);
  db.exec('DELETE FROM pricing  WHERE uuid=?', uuid).then(() => {
    res.sendStatus(200);
  }).catch(next);
}


module.exports = {
  read,
  detail,
  update,
  lookUp,
  delete: remove,
  create,
};
