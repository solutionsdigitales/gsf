import moment from 'moment'
const _ = require('lodash');

function UtilService() {
  const service = {};
  service.formatDate = (_date, format) => {
    if (_date) {
      let dateTime = new Date(_date);
      // eslint-disable-next-line no-undef
      dateTime = moment(dateTime).format(format || 'YYYY-MM-DD HH:mm:ss');
      return dateTime;
    }
    return null;
  }
  service.arrayIncludes = (array, values) => {
    return values.some((value) => {
      return array.indexOf(value) !== -1;
    });
  };

  service.dateDiff = (date1, date2, type) => {
    if(type === 'day') {
      const difference = Math.abs(new Date(date2).getTime() -  new Date(date1).getTime());
      const days = Math.ceil(difference / (1000 * 3600 * 24));
      return (days || 0) + 1;

    }
    const a = moment(new Date(date1));
    const b = moment(new Date(date2));
    const result = Math.abs(a.diff(b, type));
    return type == 'day' ? (result + 1) : result;
  }
  
  service.isFutureDate = (_date, _dateFrom) => {
    if (!_date) return false;
    const currentDate = _dateFrom?  new Date(_dateFrom) : new Date();
    const a = service.formatDate(new Date(_date), 'YYYY-MM-DD');
    const b = service.formatDate( currentDate, 'YYYY-MM-DD');
    if (a === b) return true;

    let dateTime = new Date(_date);

    var m = moment(dateTime);
    return m.isAfter(new Date(service.formatDate(currentDate)));
  }

  service.nextDay = (_date) => {
    const dateTime = new Date(_date);
    return new Date(moment(dateTime).add(1, 'days'));
  }

  service.isPositiveInteger = (val) => {
    let str = String(val);
    str = str.trim();
    if (!str) {
      return false;
    }
    str = str.replace(/^0+/, "") || "0";
    const n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n > 0;
  };

  service.round = (num) => {
    const n = Math.round((num + Number.EPSILON) * 100) / 100;
    return n.toFixed(2);
  }

  service.isCorrectFloat = (val) => {
    let str = String(val);
    str = str.trim();
    if (!str) {
      return false;
    }
    var decimalReg = /^[+-]?\d+(\.\d+)?$/;
    return !!str.match(decimalReg);
  };

  service.isCorrectString = (str) => {
    if (str) {
      const s = str.trim();
      return s.length > 0;
    }
    return false;
  };

  /**
   * @function maskObjectFromKeys
   *
   * @description
   * This function will filter or "mask" an object, returning a new object with only
   * key/value pairs matching the array of keys passed in as the second parameter.  The
   * keys do not all have to be contained in the object.
   *
   * @param {Object} object - an existing object
   * @param {Array} mask - an array of (string) keys to mask
   *
   * @returns {Object} - a new object contain key/value pairs corresponding
   * to only the keys specified.
   */
  service.maskObjectFromKeys = function maskObjectFromKeys(object, mask) {
    return Object.keys(object)

      //  for each key, if the key exists in the mask, add the k/v pair to the
      //  screened object.
      .reduce((screenedObject, key) => {
        if (mask.indexOf(key) >= 0) {
          screenedObject[key] = object[key];
        }

        return screenedObject;
      }, {});
  };

  service.downloadURI = (url) => {
    const link = document.createElement("a");
    link.setAttribute("target", '_blank');
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  service.convertToCSV = (items) =>{
    const replacer = (key, value) => (value === null ? "" : value);
    const header = Object.keys(items[0]);
    return [
      header.join(","),
      ...items.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(",")
      ),
    ].join("\r\n");

};

service.exportCSVFile = (headers, items, fileTitle) => {
  if (headers) {
      items.unshift(headers);
  }

  function convertToCSV(objArray) {
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    const firstLine = array[0] || {};
    const keys =Object.keys(firstLine);
    keys.forEach((key, index) => {
      str += key;
      if(index !== keys.length -1) {
        str += ',';
      }
    });
    str += '\r\n';
    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (const index in array[i]) {
            let value = `${array[i][index]}`;
            if(value === 'null') {
              value = '';
            }
            if (line != '') line += ','
            line += value;
            
        }
        str += line + '\r\n';
    }
  
    return str;
  }
  // Convert Object to JSON
  const jsonObject = JSON.stringify(items);

  const csv = convertToCSV(jsonObject);

  const exportedFilenmae = fileTitle + '.csv' || 'export.csv';

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
      const link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilenmae);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }
}



/**
 * @method dateFormatter
 *
 * @description
 * Accepts an object of key/value pairs. Returns the same object with all values
 * that are dates converted to a standard format.
 */
 service.dateFormatter = (rows, dateFormat) => {
  const DATE_FORMAT = dateFormat || 'YYYY-MM-DD HH:mm:ss';

  _.forEach(rows, element => {
    _.forEach(element, (value, key) => {
      if (_.isDate(element[key])) {
        element[key] = moment(element[key]).format(DATE_FORMAT);
      }
    });
  });

  return rows;
};


  return service;
}

const util = UtilService();

export default util;