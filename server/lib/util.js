const uuid = require('uuid/v4');
const moment = require('moment');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const sizeOf = require('image-size');

const uploadPath = '../upload/';
const imageTypes = ['jpg', 'png', 'gif', 'jpeg', 'PNG', 'JPG', 'BMP'];

// eslint-disable-next-line no-unused-vars
function formatDate(_date, format) {
  if (_date) {
    let dateTime = new Date(_date);
    // eslint-disable-next-line no-undef
    dateTime = moment(dateTime).format(format || 'YYYY-MM-DD HH:mm:ss');
    return dateTime;
  }
  return null;

}

function ExcelDateToJSDate(serial) {
  var utc_days  = Math.floor(serial - 25569);
  var utc_value = utc_days * 86400;                                        
  var date_info = new Date(utc_value * 1000);

  var fractional_day = serial - Math.floor(serial) + 0.0000001;

  var total_seconds = Math.floor(86400 * fractional_day);

  var seconds = total_seconds % 60;

  total_seconds -= seconds;

  var hours = Math.floor(total_seconds / (60 * 60));
  var minutes = Math.floor(total_seconds / 60) % 60;

  var dt = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
  return moment(dt).format('YYYY-MM-DD HH:mm:ss');


}

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
};



function parseMulipartUpload(req) {
  const form = formidable({ multiples : true });

  return new Promise((successCallback, failureCallback) => {

    form.parse(req, (err, fields, files) => {
      if (err) {
        return failureCallback(err);
      }
      return successCallback({ fields, files });
    });
  });
}

function hasKeys (row, keys) {
  for(const k of keys) {
    const rs = Object.keys(row).includes(k);
    if(!rs) return false;
  }
  return true;
};

/**
 * @function loadDictionary
 *
 * @description
 * Either returns a cached version of the dictionary, or loads the dictionary
 * into the cache and returns it.
 *
 * @param {String} key - either 'fr' or 'en'
 */
function loadDictionary(key, dictionaries = {}) {
  const dictionary = dictionaries[key];
  if (dictionary) { return dictionary; }

  // eslint-disable-next-line import/no-dynamic-require
  dictionaries[key] = require(`../../client/src/i18n/${key}.json`);
  return dictionaries[key];
}


/*
 * rename an object's keys
 */

function renameKeys(objs, newKeys) {
  const formatedKeys = _.isString(newKeys) ? JSON.parse(newKeys) : newKeys;
  if (_.isArray(objs)) {
    _.forEach(objs, (obj, index) => {
      objs[index] = renameObjectKeys(obj, formatedKeys);
    });
    return objs;
  }
  return renameObjectKeys(objs, formatedKeys);
}

function renameObjectKeys(obj, newKeys) {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey] : obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

/**
 * @method requireModuleIfExists
 * @description load a module if it exists
 */
function requireModuleIfExists(moduleName) {
  try {
    require(moduleName);
    // eslint-disable-next-line no-undef
    debug(`Dynamically loaded ${moduleName}.`);
  } catch (err) {
    return false;
  }
  return true;
}

function round(num) {
  const n = Math.round((num + Number.EPSILON) * 100) / 100;
  return n.toFixed(2);
}


exports.uuid = () => uuid().toUpperCase().replace(/-/g, '');
exports.formatDate = formatDate;
exports.renameKeys = renameKeys;
exports.round = round;
exports.loadDictionary = loadDictionary;
exports.loadModuleIfExists = requireModuleIfExists;
exports.formatMoney = formatMoney;
exports.parseMulipartUpload = parseMulipartUpload;
exports.ExcelDateToJSDate = ExcelDateToJSDate;
exports.hasKeys = hasKeys;
