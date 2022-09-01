const db = require('../../lib/db');
module.exports = {
  read, detail
};


function read(req, res, next) {
  const sql = `
    SELECT 
      id, name,format_key, 
      symbol, note, intel_number_format,
      min_monentary_unit 
    FROM currency`;

  db.exec(sql).then(currencies => {
    res.status(200).json(currencies);
  })
    .catch(next)
}

/**
 * gives information about a specifique currency
 */
function detail(req, res, next) {
  const sql = `
    SELECT 
      id, name,format_key,
      symbol, note, intel_number_format,
      min_monentary_unit 
    FROM currency WHERE id=?`;

  db.one(sql, req.params.id)
    .then(currency => {
      res.status(200).json(currency);
    })
    .catch(next)
    .done();
}