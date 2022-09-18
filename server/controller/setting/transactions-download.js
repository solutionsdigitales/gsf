const ExcelJS = require('exceljs');
const transactions = require('./transactions');
const db = require('../../lib/db');
const util = require('../../lib/util');
const i18n = require('../../lib/template/helpers/translate');

async function exportToExcel(req, res, next) {
    const options = req.query;
    const rqt = transactions.lookUp(options);
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
            { name: t('FORM.LABELS.PAYMENT_METHOD') , filterButton: true  },
            { name: t('FORM.LABELS.TRANSACTION_TYPE') , filterButton: true },
            { name: t('FORM.LABELS.PERIOD') , filterButton: true },
            { name: t('TABLE.COLUMNS.REGISTERED_BY'), filterButton: true },
        ],
        rows: rows.map((row, index) => {
            if (row.month) {
                row.period = t('TABLE.COLUMNS.DATE_MONTH.' + row.month) + ' ' + (row.year || '');
            }

            row.member_fullname = `${row.member_number} - ${row.member_lastname} ${(row.member_middlename || '')} ${row.member_firstname}`;

            return [
                index + 1,
                row.number,
                row.date,
                row.created_at,
                row.member_fullname,
                row.amount,
                row.currency,
                row.payment_method,
                row.transaction_type,
                row.period,
                row.user_name,
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
        `attachment; filename=transactions-${util.formatDate(new Date())}.xlsx`
    );

    return workbook.xlsx.write(res).then(() => {
        res.status(200).end();
    });
}

module.exports = {
    exportToExcel,
};

