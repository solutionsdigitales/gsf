
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
    id, name, translation_key
  FROM payment_method`;
  return db.exec(sql);
}

function detail(req, res, next) {
  const sql = `
    SELECT 
      id, name, translation_key 
    FROM payment_method
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
