const db = require('../../lib/db');
const FilterParser = require('../../lib/filter');

const uuidToConvert = ['uuid', 'cellule_uuid'];

function read(req, res, next) {
  const options = req.query;
  const rqt = lookUp(options);
  db.exec(rqt.sql, rqt.params).then(members => {
    res.status(200).json(members);
  }).catch(next);
}

function lookUp(options) {
  db.convert(options, uuidToConvert);
  const filters = new FilterParser(options, { tableAlias: 'm' });
  let sql = `
    SELECT 
        BUID(m.uuid) as uuid, m.lastname, m.middlename, m.firstname,
        m.address, m.profession, m.phone, m.email,
        m.joining_date, m.created_at,
        m.town_id, t.name as town_name, 
        BUID(m.cellule_uuid) AS cellule_uuid, c.name as cellule_name, c.number as cellule_number
    FROM member m
    LEFT JOIN  cellule c ON c.uuid = m.cellule_uuid
    LEFT JOIN  town t ON t.id = m.town_id
  `;

  filters.equals('uuid');
  filters.equals('lastname');
  filters.equals('middlename');
  filters.equals('firstname');
  filters.equals('cellule_uuid');
  filters.setOrder(' ORDER BY m.lastname, m.middlename, m.firstname ');
  return {
    sql: filters.applyQuery(sql),
    params: filters.parameters(),
  }

}

// retreive all members
function detail(req, res, next) {
  const sql = `
    SELECT 
      BUID(uuid) as uuid,
      lastname, middlename, firstname,
      address, profession,phone, email, town_id, 
      BUID(cellule_uuid) as cellule_uuid,
      joining_date, created_at
    FROM member
    WHERE uuid = ?
  `;
  const uuid = db.bid(req.params.uuid);
  db.one(sql, uuid).then(member => {
    res.status(200).json(member);
  }).catch(next);
}


async function getMaxNumber() {
  const sql = 'SELECT MAX(number) as max_number FROM member';
  const result = await db.one(sql);
  return (result.max_number || 0) + 1
}

// create a new member
async function create(req, res, next) {
  try {
    const data = req.body;
    db.convert(data, uuidToConvert);
    data.uuid = db.bid(data.uuid ? data.uuid : db.uuidString());
    data.number = await getMaxNumber();
    await db.exec('INSERT INTO member SET ?', data)
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
}

// update member infos
function update(req, res, next) {
  const data = req.body;
  db.convert(data, uuidToConvert);
  const uuid = db.bid(req.params.uuid);
  data.last_update = new Date();
  delete data.created_at;
  db.exec('UPDATE member SET ? WHERE uuid=?', [data, uuid]).then(() => {
    res.sendStatus(200);
  }).catch(next);
}

// delete a member
function remove(req, res, next) {
  const uuid = db.bid(req.params.uuid);
  db.exec('DELETE FROM member  WHERE uuid=?', uuid).then(() => {
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
