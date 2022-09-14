
const db = require('../../lib/db');
const util = require('../../lib/util');
const FilterParser = require('../../lib/filter');


module.exports = {
  read, detail, create,
  delete: remove, update
};


function create(req, res, next) {
  const sql = `INSERT INTO exchange_rate SET ?`;
  let data = req.body;
  data.date = (data.date) ? data.date : util.formatDate(new Date());
  data.rate = data.buy_rate;

  db.exec(sql, data)
    .then(() => {
      res.sendStatus(201);
    }).
    catch(next);
}


function update(req, res, next) {
  const sql = `UPDATE  exchange_rate SET ? WHERE id=?`;
  let data = req.body;
  data.rate = data.buy_rate;
  db.exec(sql, [data, req.params.id])
    .then(() => {
      res.sendStatus(200);
    }).
    catch(next)
    ;
}

function read(req, res, next) {
  const options = req.query;
  const rqt = lookUp(options);
  db.exec(rqt.sql, rqt.params).then(members => {
    res.status(200).json(members);
  }).catch(next);
}

function lookUp(options) {
  let sql = `
    SELECT er.id, c.name as currencyName, c.format_key, c.symbol, er.buy_rate,
        er.sell_rate, er.bank_rate, er.date 
    FROM exchange_rate as er
    JOIN currency as c ON c.id = er.currency_id  
  `;
  const filters = new FilterParser(options, { tableAlias: 'er' });

  filters.custom('currency_id', 'c.id=?');
  filters.setOrder('ORDER BY er.date DESC');
  return {
    sql: filters.applyQuery(sql),
    params: filters.parameters(),
  }

}

// an exchange rate details  
function detail(req, res, next) {
  const sql = `SELECT * FROM exchange_rate WHERE id=?`;
  db.one(sql, req.params.id)
    .then((rate) => {
      res.status(200).json(rate);
    }).
    catch(next)
}

// delete an exchange rate
function remove(req, res, next) {
  const sql = `DELETE FROM exchange_rate WHERE id=?`;
  db.exec(sql, req.params.id)
    .then(() => {
      res.sendStatus(200);
    }).
    catch(next);
}
