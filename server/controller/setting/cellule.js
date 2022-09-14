const db = require('../../lib/db');
const FilterParser = require('../../lib/filter');

const uuidToConvert = ['uuid'];

function read(req, res, next) {
  const options = req.query;
  const rqt = lookUp(options);
  db.exec(rqt.sql, rqt.params).then(cellules => {
    res.status(200).json(cellules);
  }).catch(next);
}

async function getMaxNumber() {
  const sql = 'SELECT MAX(number) as max_number FROM cellule';
  const result = await db.one(sql);
  return (result.max_number || 0) + 1
}

function lookUp(options) {
  db.convert(options, uuidToConvert);
  const filters = new FilterParser(options, { tableAlias: 'c' });
  let sql = `
    SELECT 
        BUID(c.uuid) as uuid, c.name,
        FORMAT_ENTITY_NUMBER(c.number) as number,
        FORMAT_DATE(c.creation_date) as creation_date,
        c.town_id, c.created_at
    FROM cellule c
  `;

  filters.equals('uuid');
  filters.equals('number');
  filters.equals('name');
  filters.setOrder(' ORDER BY c.number ');
  return {
    sql: filters.applyQuery(sql),
    params: filters.parameters(),
  }

}

// retreive all cellules
function detail(req, res, next) {
  const sql = `
    SELECT 
        BUID(c.uuid) as uuid, c.name,
        c.number, FORMAT_DATE(c.creation_date) as creation_date,
        c.town_id, c.created_at
    FROM cellule c
    WHERE c.uuid = ?
  `;
  const uuid = db.bid(req.params.uuid);
  db.one(sql, uuid).then(cellule => {
    res.status(200).json(cellule);
  }).catch(next);
}

// create a new project
async function create(req, res, next) {
  try {
    const data = req.body;
    db.convert(data, ['uuid']);
    data.uuid = db.bid(data.uuid ? data.uuid : db.uuidString());
    data.number = await getMaxNumber();
    await db.exec('INSERT INTO cellule SET ?', data);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
}

// update project infos
function update(req, res, next) {
  const data = req.body;
  db.convert(data, uuidToConvert);
  const uuid = db.bid(req.params.uuid);
  data.last_update = new Date();
  delete data.created_at;
  db.exec('UPDATE cellule SET ? WHERE uuid=?', [data, uuid]).then(() => {
    res.sendStatus(200);
  }).catch(next);
}

// delete a project
function remove(req, res, next) {
  const uuid = db.bid(req.params.uuid);
  db.exec('DELETE FROM cellule  WHERE uuid=?', uuid).then(() => {
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
