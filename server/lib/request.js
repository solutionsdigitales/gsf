const request = require('request-promise-native');
const q = require('q');

const defaultContentType =  'application/json';

class Request {

  constructor(url, contentType, token, bearerAuth) {
    this.url = url;
    this.contentType = contentType;
    this.token = token;
    this.bearerAuth = bearerAuth || '';
  }

  postData(params) {
    const deferred = q.defer();
    const type = this.contentType || defaultContentType;

    const headers = {
      'Content-Type': this.contentType || defaultContentType,
    };

    if(this.token) {
      headers['x-access-token'] = this.token;
    }

    if(this.bearerAuth) {
      headers['Authorization'] = this.bearerAuth;
    }
    
    request({
      url: params.url || this.url,
      method: 'POST',
      data : params.data,
      body: params.data,
      json : type === defaultContentType,
      headers,
      rejectUnauthorized: false,
      timeout : 15000
    }, function (error, response, body) {
      if (!error) {
        return deferred.resolve(body);
      }
      return deferred.reject(error);
    });

    return deferred.promise;
  }

  
  getData(params = {}) {
    const deferred = q.defer();
    request({
      url: params.url || this.url,
      method: 'GET',
      body: params.data,
      headers: {
        'Content-Type': this.contentType || 'application/json',
        'x-access-token' : this.token || ''
      }
    }, function (error, response, body) {
      if (!error) {
        return deferred.resolve(body);
      }
      return deferred.reject(error);
    });

    return deferred.promise;
  }
}

module.exports = Request;
