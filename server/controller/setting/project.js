const db = require('../../lib/db');
const FilterParser = require('../../lib/filter');

function read(req, res, next) {
  const options = req.query;
  const rqt = lookUp(options);
  db.exec(rqt.sql, rqt.params).then(projects => {
    res.status(200).json(projects);
  }).catch(next);
}

function lookUp(options) {
  db.convert(options, ['uuid']);
  const filters = new FilterParser(options, { tableAlias: 'p' });
  let sql = `
    SELECT 
        HEX(p.uuid) as uuid, p.name, p.code, p.short_name,
        p.created_at
    FROM project p
  `;

  filters.equals('uuid');
  filters.equals('name');
  filters.equals('short_name');
  filters.setOrder(' ORDER BY p.name ');
  return {
    sql: filters.applyQuery(sql),
    params: filters.parameters(),
  }


}

// retreive all projects
function detail(req, res, next) {
  const sql = `
  SELECT 
    BUID(uuid) as uuid,
    name, short_name, code,
    created_at
    FROM project
    WHERE uuid = ?
    `;
  const uuid = db.bid(req.params.uuid);
  db.one(sql, uuid).then(card => {
    res.status(200).json(card);
  }).catch(next);
}

// create a new project
function create(req, res, next) {
  const data = req.body;
  db.convert(data, ['uuid']);
  data.uuid = db.bid(data.uuid ? data.uuid : db.uuidString());
  db.exec('INSERT INTO project SET ?', data).then(() => {
    res.sendStatus(201);
  }).catch(next);
}

// update project infos
function update(req, res, next) {
  const data = req.body;
  db.convert(data, ['uuid']);
  const uuid = db.bid(req.params.uuid);
  data.last_update = new Date();
  delete data.created_at;
  db.exec('UPDATE project SET ? WHERE uuid=?', [data, uuid]).then(() => {
    res.sendStatus(200);
  }).catch(next);
}

// delete a project
function remove(req, res, next) {
  const uuid = db.bid(req.params.uuid);
  db.exec('DELETE FROM project  WHERE uuid=?', uuid).then(() => {
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
