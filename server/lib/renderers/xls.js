const _ = require('lodash');
const date = require('../template/helpers/dates.js');

const header = {
  'Content-Type' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'Content-Disposition' : `attachment; filename=file-${Math.random()}.xls`,
};

exports.headers = header;
exports.render = render;
exports.renderTemplate = renderTemplate;


function renderTemplate(rows, displayNames) {
  const firstObject = rows[0] || {};

  // writing columns
  const firstLineCols = Object.keys(firstObject || {});

  if ((typeof displayNames) === 'string') {
    // eslint-disable-next-line no-param-reassign
    displayNames = JSON.parse(displayNames);
  }

  // console.log(Object.keys(renamedColumns[0]), firstLineCols);
  // tracks the index in the sheet
  let html = '<Row>';
  firstLineCols.forEach(key => {
    html += `<Cell ss:StyleID="allBorder"><Data ss:Type="String">${displayNames[key] || key}</Data></Cell>`;
  });
  html += '</Row>';
  rows.forEach(row => {

    html += '<Row>';
    firstLineCols.forEach(key => {

      if (_.isDate(row[key])) {
        row[key] = date.timestamp(row[key]);
      }
      if (row[key] === null) {
        html += `<Cell></Cell>`;
      } else {
        html += `<Cell><Data ss:Type="String">${row[key]}</Data></Cell>`;
      }
    });
    html += '</Row>';
  });

  return html;
}
function render(data) {

  let html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel">
<head>
    <!--[if gte mso 9]>
    <meta charset="utf-8">
    <xml>
        <x:ExcelWorkbook>
            <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                    <x:Name>Sheet 1</x:Name>
                    <x:WorksheetOptions>
                        <x:Print>
                            <x:ValidPrinterInfo/>
                        </x:Print>
                    </x:WorksheetOptions>
                </x:ExcelWorksheet>
            </x:ExcelWorksheets>
        </x:ExcelWorkbook>
    </xml>
    <![endif]-->
</head>`;


  const keys = Object.keys(data[0] || []);

  html += `<body><Table border='1'>
<thead bgcolor='#007bff; font-color='#fff'>
<tr>
`;

  keys.forEach(k => {
    html += `<th>${k}</th>`;
  });

  html += `</tr>
</thead>
<tbody>
`;


  data.forEach(row => {
    html += '<tr>';

    keys.forEach(k => {
      html += `<td style='font-size:10px'>${row[k] || ''}</td>`;
    });
    html += '</tr>';
  });
  html += `</tbody>

</Table>
</body></html>`;

  return html;
}
