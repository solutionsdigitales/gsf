const db = require('../../lib/db');
const FilterParser = require('../../lib/filter');

function read(req, res, next) {
  const options = req.query;
  const rqt = lookUp(options);
  db.exec(rqt.sql, rqt.params).then(divisions => {
    res.status(200).json(divisions);
  }).catch(next);
}

function lookUp(options) {
  db.convert(options, ['uuid']);
  const filters = new FilterParser(options, { tableAlias: 's' });
  let sql = `
    SELECT 
        HEX(s.uuid) as uuid, s.name, 
        s.created_at
    FROM division s
  `;
  filters.equals('uuid');
  filters.equals('name');
  filters.setOrder(' ORDER BY s.name ');
  return {
    sql: filters.applyQuery(sql),
    params: filters.parameters(),
  }


}

// retreive all divisions
function detail(req, res, next) {
  const sql = `
  SELECT 
    HEX(s.uuid) as uuid, s.name, 
    s.created_at
    FROM division s
    WHERE s.uuid = ?
    `;
  const uuid = db.bid(req.params.uuid);
  db.one(sql, uuid).then(card => {
    res.status(200).json(card);
  }).catch(next);
}

// create a new division
function create(req, res, next) {
  const data = req.body;
  db.convert(data, ['uuid']);
  data.uuid = db.bid(data.uuid ? data.uuid : db.uuidString());
  db.exec('INSERT INTO division SET ?', data).then(() => {
    res.sendStatus(201);
  }).catch(next);
}

// update division infos
function update(req, res, next) {
  const data = req.body;
  db.convert(data, ['uuid']);
  const uuid = db.bid(req.params.uuid);
  data.last_update = new Date();
  db.exec('UPDATE division SET ? WHERE uuid=?', [data, uuid]).then(() => {
    res.sendStatus(200);
  }).catch(next);
}

// delete a division
function remove(req, res, next) {
  const uuid = db.bid(req.params.uuid);
  db.exec('DELETE FROM division  WHERE uuid=?', uuid).then(() => {
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
}
