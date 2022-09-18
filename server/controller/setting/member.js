const util = require('../../lib/util');
const db = require('../../lib/db');
const FilterParser = require('../../lib/filter');

const uuidToConvert = ['uuid', 'cellule_uuid', 'created_by'];

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
        m.address, m.profession, m.phone, m.gender, m.email, FORMAT_ENTITY_NUMBER(m.number) as number,
        m.joining_date, m.created_at,
        m.town_id, t.name as town_name, 
        BUID(m.cellule_uuid) AS cellule_uuid, c.name as cellule_name, FORMAT_ENTITY_NUMBER(c.number) as cellule_number,
        BUID(u.id) as created_by, u.name as user_name
    FROM member m
    JOIN  cellule c ON c.uuid = m.cellule_uuid
    JOIN  town t ON t.id = m.town_id
    LEFT JOIN  user u ON u.id = m.created_by
  `;

  filters.equals('uuid');
  filters.equals('lastname');
  filters.equals('middlename');
  filters.equals('firstname');
  filters.equals('cellule_uuid');
  filters.setOrder(' ORDER BY m.created_at DESC ');
  return {
    sql: filters.applyQuery(sql),
    params: filters.parameters(),
  }

}

function setUpper(member){
  const cols = ['lastname', 'middlename', 'firstname'];
  cols.forEach(c => {
    if(member[c]) {
      member[c] = `${member[c]}`.toUpperCase();
    }
  });
  return member;
}
// retreive all members
function detail(req, res, next) {
  const sql = `
    SELECT 
      BUID(uuid) as uuid,
      lastname, middlename, firstname, gender, number,
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
    data.created_by = req.session.user.id;
    db.convert(data, uuidToConvert);
    data.uuid = db.bid(data.uuid ? data.uuid : db.uuidString());
    data.number = await getMaxNumber();
    data.joining_date = util.formatDate(data.joining_date, 'YYYY-MM-DD');
    
    setUpper(data);
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
  if(data.joining_date) {
    data.joining_date = util.formatDate(data.joining_date, 'YYYY-MM-DD');
  }
  
  setUpper(data);
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
