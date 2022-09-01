const jwt = require('jsonwebtoken');

const config = {
  'secret': 'api_salt_001'
};

function verify(req, successCallBack, failedCallBack) {
  var token = req.headers['x-access-token'];
  if (!token)
    return failedCallBack({ auth: false, message: 'No token provided. x-access-token should be provided' });
    
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) failedCallBack(err);
    // if everything good, save to request for use in other routes
    successCallBack(decoded);
  });
}

function create(id) {
  return jwt.sign({ id }, config.secret, {
    expiresIn: 86400,// expires in 24 hours
  });
}

module.exports = {
  verify,
  create,
  config
};