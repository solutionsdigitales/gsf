const _ = require('lodash');
const util = require('./util');
const xlsx = require('./renderers/xlsx');
const xls = require('./renderers/xls');
const json = require('./renderers/json');
const csv = require('./renderers/csv');
const html = require('./renderers/html');
const pdf = require('./renderers/pdf');
const pdf1 = require('./renderers/pdf1');

module.exports.render = redererselect;

async function redererselect(res, data, options) {
  try {
    const { displayNames, renameKeys } = options;
    const { renderer } = options;
    const lang = options.lang || 'fr';

    if (renderer === 'xlsx') {
      const stream = await xlsx.render(data, options.filename, options);
      res.status(200).set(xlsx.headers).send(stream);
    } else if (renderer === 'xls') {

      const stream = xls.render(data.rows || []);
      res.status(200).set(xls.headers).send(stream);

    } else if (renderer === 'json') {

      data.rows = (renameKeys) ? util.renameKeys(data.rows, displayNames) : data.rows;
      res.status(200).set(json.headers).send(data.rows);

    } else if (renderer === 'csv') {
      data.rows = (renameKeys) ? util.renameKeys(data.rows, displayNames) : data.rows;
      const stream = await csv.render(data, null, {
        csvKey: 'rows',
        suppressDefaultFiltering: true,
        renameKeys,
        displayNames,
      });
      res.status(200).set(csv.headers).send(stream);
    } else if (renderer === 'html') {
      data.serverPath = process.env.SERVER_PATH;
      const stream = await html.render(data, options.template, options);
      res.status(200).set(html.headers).send(stream);
    } else if (renderer === 'xls2') {
      if (renameKeys) {
        data.table = xls.renderTemplate(data.rows, displayNames);
      }

      data.hideHeader = _.isUndefined(data.hideHeader) ? true : !!data.hideHeader;
      data.serverPath = process.env.SERVER_PATH;
      const stream = await html.render(data, options.template, options);

      const xlsHeader = {
        'Content-Disposition': `attachment; filename=${util.translate(lang, options.filename)}-${new Date()}.xls`,
      };
      res.status(200).set(xlsHeader).send(stream);
    } else if (renderer === 'pdf') {
      data.serverPath = process.env.SERVER_PATH;
      const pdfOptions = {
        marginLeft: '1mm', // 0.20in
        marginRight: '1mm', // 0.20in
        marginTop: '3mm', // 0.20in,
        outline: true,
        javascriptDelay: 4000,
        animation: false,
        dpi: 96,
        zoom: 1,
        enableJavascript: true,
        enableSmartShrinking: true,
        noStopSlowScripts: true,
        pageSize: 'A4',
      };

      pdf1.render(data, options.template, options).then(pdfStream => {

        const attach = Boolean(options.attachment);
        const _stream = Boolean(options.stream);
        const fileName = options.fileName || 'report.pdf';
        if (_stream) {
          return res.send(pdfStream);
        } else if (attach) {
          res.setHeader('Content-Disposition', `attachment;filename=${fileName}`);
        }
        res.setHeader('Content-Type', 'application/pdf');

        res.send(pdfStream);
      }).catch((err) => {
        console.log(err);
      });


    } else {
      res.sendStatus(500);
    }
  } catch (ex) {
    console.log(ex);
  }
}
