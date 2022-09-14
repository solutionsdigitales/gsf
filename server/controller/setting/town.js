const db = require('../../lib/db');
const FilterParser = require('../../lib/filter');

function read(req, res, next) {
  const options = req.query;
  const rqt = lookUp(options);
  db.exec(rqt.sql, rqt.params).then(towns => {
    res.status(200).json(towns);
  }).catch(next);
}

function lookUp(options) {
  const filters = new FilterParser(options, { tableAlias: 't' });
  let sql = `
    SELECT 
        t.id, t.name, t.province_id
    FROM town as t
  `;
  filters.equals('id');
  filters.equals('name');
  filters.setOrder(' ORDER BY t.name ');
  return {
    sql: filters.applyQuery(sql),
    params: filters.parameters(),
  }


}

// retreive all towns
function detail(req, res, next) {
  const sql = `
  SELECT 
    id, name, province_id
    FROM town
    WHERE id = ?
    `;
  const { id } = req.params;
  db.one(sql, id).then(card => {
    res.status(200).json(card);
  }).catch(next);
}

// create a new town
function create(req, res, next) {
  const data = req.body;
  db.exec('INSERT INTO town SET ?', data).then(() => {
    res.sendStatus(201);
  }).catch(next);
}

// update town infos
function update(req, res, next) {
  const data = req.body;
  db.convert(data, ['id']);
  const { id } = req.params;
  data.last_update = new Date();
  delete data.created_at;
  db.exec('UPDATE town SET ? WHERE id=?', [data, id]).then(() => {
    res.sendStatus(200);
  }).catch(next);
}

// delete a town
function remove(req, res, next) {
  const { id } = req.params;
  db.exec('DELETE FROM town  WHERE id=?', id).then(() => {
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
