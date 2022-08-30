/**
 * Application Cache Service
 *
 * This service provides a uniform interface to both localStorage and
 * sessionStorage.
 *
 * NOTE - namespace clashing should not occur due to a prefix key set
 * in the main app.js module.
 *
 * @constructor AppCache
 */
function AppCache() {
  const service = {};
  service.set = (name, params) => {
    const typ = typeof(params);
    if(typ === 'object') {
      sessionStorage.setItem(name, JSON.stringify(params));
    }
    else {
      sessionStorage.setItem(name, `${params}`);
    }
  }

  service.get = (name) => {
    const result = sessionStorage.getItem(name);
    if(!result) return result;
    const isOBject = result.indexOf('{') !== -1 && result.indexOf('}');
    if(isOBject) {
      return JSON.parse(result);
    }
    return result;
  }

  return service;
}

const _AppCache = AppCache();
export default _AppCache;
