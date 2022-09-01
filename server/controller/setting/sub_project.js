const db = require('../../lib/db');
const FilterParser = require('../../lib/filter');

const uuidToConvert = ['uuid', 'project_uuid'];

function read(req, res, next) {
  const options = req.query;
  const rqt = lookUp(options);
  db.exec(rqt.sql, rqt.params).then(projects => {
    res.status(200).json(projects);
  }).catch(next);
}

function lookUp(options) {
  db.convert(options, uuidToConvert);
  const filters = new FilterParser(options, { tableAlias: 'sp' });
  let sql = `
    SELECT 
        BUID(sp.uuid) as uuid,
        sp.name, 
        sp.code,
        sp.short_name,
        BUID(p.uuid) as project_uuid,
        p.created_at,
        p.name as project_name,
        p.short_name as project_short_name,
        p.code as project_code
    FROM sub_project sp
    JOIN project p ON p.uuid = sp.project_uuid
  `;
  filters.equals('uuid');
  filters.equals('name');
  filters.equals('project_uuid');
  filters.setOrder(' ORDER BY sp.name ');
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
      BUID(project_uuid) as project_uuid,
      name,
      short_name,
      code,
      created_at,
      last_update
    FROM sub_project
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
  db.convert(data, uuidToConvert);
  data.uuid = db.bid(data.uuid ? data.uuid : db.uuidString());
  db.exec('INSERT INTO sub_project SET ?', data).then(() => {
    res.sendStatus(201);
  }).catch(next);
}

// update project infos
function update(req, res, next) {
  const data = req.body;
  db.convert(data, uuidToConvert);
  const uuid = db.bid(req.params.uuid);
  data.last_update = new Date();
  delete data.created_at;
  db.exec('UPDATE sub_project SET ? WHERE uuid=?', [data, uuid]).then(() => {
    res.sendStatus(200);
  }).catch(next);
}

// delete a project
function remove(req, res, next) {
  const uuid = db.bid(req.params.uuid);
  db.exec('DELETE FROM sub_project  WHERE uuid=?', uuid).then(() => {
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
