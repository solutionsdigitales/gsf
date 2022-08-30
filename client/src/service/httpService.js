
import axios from 'axios';
import AppCache from "./appCache";

const env = require('./../../.env.js');



function unwrapHttpResponse(response) {
  return response.data;
}

function httpRequest(url, method, param = {}) {
  const _data = param;
  delete _data.$$hashKey;
  const cache = AppCache.get('session') || {};
  return axios({
    url,
    method,
    data: _data,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': cache.token,
      'Authorization': `Bearer ${cache.token}`,
    },
    responseType: 'json',
  }).then(unwrapHttpResponse);
}

function pdfStreamRequest(url, method, param = {}) {
  const _data = param;
  delete _data.$$hashKey;
  const cache = AppCache.get('session') || {};
  return axios({
    url,
    method,
    data: _data,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': cache.token,
      'Authorization': `Bearer ${cache.token}`,

    },
   responseType: 'arraybuffer'
  }).then(unwrapHttpResponse);
}

// will be passed back as the prototype API service
export default class Api {

  constructor(url) {
    this.server = process.env.NODE_ENV === 'production' ? '' : `http://127.0.0.1:${env.serverPort}`;
    this.url = this.server + url;
    this.$http = axios;
    this.unwrapHttpResponse = unwrapHttpResponse;
  }

  request(url, method, param = {}) {
    return httpRequest(url, method, param);
  }

  create(param) {
    const target = `${this.url}`;
    return this.request(target, 'POST', param);
  }

  serelize(params) {

    return Object.entries(Object.assign({}, params, {})).
      filter(([key, value])=> key && `${value}` !== 'null').
      map(([key, value]) => `${key}=${value}`).
      join('&');

  }
  read(uuid, params) {
    const req = uuid ? (`/${uuid}`) : '';
    let target = `${this.url + req}`;
    if(Object.keys(params || {}).length > 0) {
      target +=`?${this.serelize(params || {})}`;
    }
    return this.request(target, 'GET', params);
  }

  update(id, param) {
    const target = `${this.url}/${id}`;
    return httpRequest(target,'PUT', param);
  }

  delete(id) {
    const target = `${this.url}/${id}`;
    return httpRequest(`${target}`, 'DELETE', {});
  }

  get(target, params = {}) {
    return httpRequest(`${this.url}${target}`, 'GET', params);
  }
  
  getPdfStream(target, params = {}) {
    return pdfStreamRequest(`${this.url}${target}`, 'GET', params);
  }

  post(target, param) {
    const url = `${this.url}${target}`;
    return this.request(url, 'POST', param);
  }

  put(target, param) {
    const url = `${this.url}${target}`;
    return this.request(url, 'PUT', param);
  }

}