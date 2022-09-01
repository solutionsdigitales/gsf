const debug = require('debug')('app');
const _ = require('lodash');
const JWTConfig = require('../controller/api/token');
const { Unauthorized } = require('../lib/errors');

module.exports = (app) => {
  // public routes that any user can access without session
  const publicRoutes = [
    '/users/log/out',
    '/users/log/in',
    '/users/sesssion/status',
    '/download/',
    '/images/',
    '/auth',
    '/adobe/token',
  ];

  function within(value, array) {
    return array.filter(item => value.indexOf(item) !== -1).length > 0;
  }
  // 'Your are not authorised to access this path, make sure your are connected. Maybe your token has expired'

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    
    let token = req.headers['x-access-token'] || req.query.x_access_token;
    let sessionExists = true;
  
    if(typeof(token) === 'string') {
      if (token === 'undefined') token = undefined;
    }

    if(within(req.path, publicRoutes)) {
      next();
      return;
    }
    else if (token && !_.isUndefined(token)) {
      JWTConfig.verify(req, (session) => {
        if (!session) {
          sessionExists = false;
          return;
        }
        _.merge(req.session, { user : { id : session.id}});
      }, (error) => {
        sessionExists = false;
        debug(error);
      });
    }

    if (sessionExists) {
      if (_.isUndefined(req.session.user)) {
        debug(`Rejecting unauthorized access to ${req.path} from ${req.ip}`);
        next(new Unauthorized('You are not logged into the system.'));
      } else {
        next();
      }
    } else {
      debug('token not valid');
      res.status(401).json({
        msg: 'token not valid',
      });
    }
  });

};