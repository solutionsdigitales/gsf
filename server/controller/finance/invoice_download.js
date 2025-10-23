const ExcelJS = require('exceljs');
const invoices = require('./invoice');
const db = require('../../lib/db');
const util = require('../../lib/util');
const i18n = require('../../lib/template/helpers/translate');

async function exportToExcel(req, res, next) {
    const options = req.query;
    const rqt = invoices.lookUp(options);
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
            { name : '#',},
            { name: t('FORM.LABELS.NUMBER'), filterButton: true, },
            { name: t('FORM.LABELS.DATE'), filterButton: true, },
            { name: t('TABLE.COLUMNS.DATE_REGISTERED') },
            { name: t('TREE.MEMBERS') , filterButton: true },
            { name: t('FORM.LABELS.AMOUNT'), filterButton: true, totalsRowFunction: 'sum'},
            { name: t('FORM.LABELS.CURRENCY'), filterButton: true },
            { name: t('FORM.LABELS.FREQUENCY'), filterButton: true },
            { name: t('TABLE.COLUMNS.REGISTERED_BY'), filterButton: true },
            { name: t('FORM.LABELS.CANCELED'), filterButton: true },
            
        ],
        rows: rows.map((row, index) => {
            if (row.month) {
                row.period = t('TABLE.COLUMNS.DATE_MONTH.' + row.month) + ' ' + (row.year || '');
            }

            row.member_fullname = `${row.member_number} - ${row.member_lastname} ${(row.member_middlename || '')} ${row.member_firstname}`;
            row.canceled = parseInt(`${row.locked}`)? t('FORM.LABELS.YES'): t('FORM.LABELS.NO');

            return [
                index + 1,
                row.number,
                row.date,
                row.created_at,
                row.member_fullname,
                row.amount,
                row.currency_symbol,
                row.frequency,
                row.user_name,
                row.canceled,
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
        `attachment; filename=invoices-${util.formatDate(new Date())}.xlsx`
    );

    return workbook.xlsx.write(res).then(() => {
        res.status(200).end();
    });
}

module.exports = {
    exportToExcel,
};

