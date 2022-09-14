const ExcelJS = require('exceljs');
const member = require('./member');
const db = require('../../lib/db');
const util = require('../../lib/util');
const i18n = require('../../lib/template/helpers/translate');

async function exportToExcel(req, res, next) {
  const options = req.query;
  const rqt = member.lookUp(options);
  const rows = await db.exec(rqt.sql, rqt.params);
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('Sheet1');
  // translate function
  function t(label) {
    return i18n(options.lang)(label);
  }

  ws.addTable({
    name: 'MyTable',
    ref: 'A1',
    headerRow: true,
    totalsRow: true,
    /*style: {
      theme: 'TableStyleDark3',
      showRowStripes: true,
    },*/
    columns: [
      { name: '#',},
      { name: t('FORM.LABELS.LAST_NAME'), filterButton: true ,},
      { name: t('FORM.LABELS.MIDDLE_NAME') },
      { name: t('FORM.LABELS.FIRST_NAME') },
      { name: t('FORM.LABELS.GENDER'), filterButton: true},
      { name: t('FORM.LABELS.ADDRESS') },
      { name: t('FORM.LABELS.PROFESSION') },
      { name: t('TREE.TOWN') },
      { name: t('FORM.LABELS.PHONE'), filterButton: true },
      { name: t('FORM.LABELS.EMAIL'), filterButton: true },
      { name: t('TREE.CELLULE'), filterButton: true },
    ],
    rows: rows.map((row, index) => {
      return [
        index + 1,
        row.lastname,
        row.middlename,
        row.firstname,
        row.gender,
        row.address,
        row.profession,
        row.town_id,
        row.phone,
        row.email,
        `${row.cellule_number} - ${row.cellule_name}`,
      ];
    })
  });

  ws.properties.defaultRowHeight = 35;
  ws.properties.defaultColWidth = 15;


  // res is a Stream object
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename=member_list-${util.formatDate(new Date())}.xlsx`
  );

  return workbook.xlsx.write(res).then(() => {
    res.status(200).end();
  });
}

module.exports = {
  exportToExcel,
};

