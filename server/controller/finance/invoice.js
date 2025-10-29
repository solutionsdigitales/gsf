const db = require("../../lib/db");
const FilterParser = require("../../lib/filter");
const util = require("../../lib/util");

const uuidToConvert = ["uuid", "member_uuid"];

function read(req, res, next) {
  const options = req.query;
  const rqt = lookUp(options);
  db.exec(rqt.sql, rqt.params).then((cellules) => {
    res.status(200).json(cellules);
  }).catch(next);
}

async function getMaxNumber() {
  const sql = "SELECT MAX(number) as max_number FROM invoice";
  const result = await db.one(sql);
  return (result.max_number || 0) + 1;
}

function lookUp(options) {
  db.convert(options, uuidToConvert);
  const filters = new FilterParser(options, { tableAlias: "iv" });
  let sql = `
    SELECT 
        BUID(iv.uuid) as uuid,
        BUID(iv.member_uuid) as member_uuid,
        FORMAT_ENTITY_NUMBER(iv.number) as number,
        FORMAT_DATE(iv.date) as date,
        iv.amount,
        iv.amount_equiv,
        iv.rate,
        INVOICE_PAYMENT(iv.uuid) as paid_amount,
        iv.currency_id,
        c.symbol as currency_symbol,
        iv.frequency,
        iv.created_at,
        BUID(iv.created_by) as created_by,
        m.lastname as member_lastname,
        m.firstname as member_firstname,
        m.phone as member_phone,
        FORMAT_ENTITY_NUMBER(m.number) as member_number,
        u.name as user_name

    FROM invoice iv
    JOIN member m ON m.uuid =iv.member_uuid
    JOIN currency c ON c.id = iv.currency_id
    JOIN user u ON u.id = iv.created_by
  `;

  filters.equals("uuid");
  filters.equals("number");
  filters.equals("member_uuid");
  filters.setOrder(" ORDER BY iv.number ");
  return {
    sql: filters.applyQuery(sql),
    params: filters.parameters(),
  };
}

// retreive all cellules
function detail(req, res, next) {
  const sql = `
    SELECT 
        BUID(iv.uuid) as uuid,
        BUID(iv.member_uuid) as member_uuid,
        FORMAT_ENTITY_NUMBER(iv.number) as number,
        iv.amount,
        iv.amount_equiv,
        iv.rate,
        iv.currency_id,
        iv.frequency,
        FORMAT_DATE(iv.date) as date,
        iv.created_at,
        BUID(iv.created_by) as created_by
    FROM invoice iv
    WHERE uuid=?
  `;
  const uuid = db.bid(req.params.uuid);
  db.one(sql, uuid).then((cellule) => {
    res.status(200).json(cellule);
  }).catch(next);
}
async function getEnterpriseCurrencyid() {
  const sql = "SELECT currency_id FROM enterprise";
  const result = await db.one(sql);
  return result.currency_id;
}

// create a new project
async function create(req, res, next) {
  try {
    const data = req.body;
    db.convert(data, ["uuid", "created_by", "member_uuid"]);
    data.uuid = db.bid(data.uuid ? data.uuid : db.uuidString());
    data.date = util.formatDate(data.date, "YYYY-MM-DD");
    data.number = await getMaxNumber();

    const enterpriseCurrencyId = await getEnterpriseCurrencyid();
    if (data.currency_id == enterpriseCurrencyId) {
      data.rate = 1;
    } else {
      const rate = await db.one(
        `
              SELECT buy_rate
              FROM exchange_rate
              WHERE currency_id = ?
              ORDER BY date DESC
              LIMIT 1
            `,
        data.currency_id,
      );
      data.rate = rate.buy_rate;
    }
    data.amount_equiv = data.amount / data.rate;

    await db.exec("INSERT INTO invoice SET ?", data);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
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

  if (data.creation_date) {
    data.creation_date = util.formatDate(data.creation_date, "YYYY-MM-DD");
  }

  db.exec("UPDATE invoice SET ? WHERE uuid=?", [data, uuid]).then(() => {
    res.sendStatus(200);
  }).catch(next);
}

// delete a project
function remove(req, res, next) {
  const uuid = db.bid(req.params.uuid);
  db.exec("DELETE FROM invoice  WHERE uuid=?", uuid).then(() => {
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
