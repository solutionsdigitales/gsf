
const db = require('../../lib/db');

function read(req, res, next) {
  lookUp().then(methods => {
    res.status(200).json(methods);
  })
    .catch(next);
}

function lookUp() {
  const sql = `
    SELECT 
      id, label, translation_key
    FROM och_base`;
  return db.exec(sql);
}

function detail(req, res, next) {
  const sql = `
    SELECT 
        id, label, translation_key
    FROM och_base
    WHERE id=?`;

  db.one(sql, req.params.id)
    .then(method => {
      res.status(200).json(method);
    })
    .catch(next);
}

module.exports = {
  read, detail, lookUp
};
