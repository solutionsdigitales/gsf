const router = require('express').Router();
const fetch = require('node-fetch');
const debug = require('node:util').debuglog('jericho:adobe');
const request = require('./lib/request');
const db = require('./lib/db');

const {
  ADOBE_ECHOSIGN_URL, ADOBE_CLIENT_ID, ADOBE_CLIENT_SECRET, ADOBE_REDIRECT_URI
} = process.env;

const parameters = {
  client_id: ADOBE_CLIENT_ID,
  client_secret: ADOBE_CLIENT_SECRET,
  redirect_uri: ADOBE_REDIRECT_URI,
};

// redirects a user to the appropriate URL for oauth
router.get('/auth', (req, res) => {
  const scopes = [
    'user_read:self',
    'user_write:self',
    'user_login:self',
    'agreement_read:self',
    'agreement_write:self',
    'agreement_send:self',
    'widget_read:self',
    'widget_write:self',
    'library_read:self',
    'library_write:self',
    'workflow_read:self',
    'workflow_write:self',
    'webhook_read:self',
    'webhook_write:self',
    'webhook_retention:self'
  ];

  // create the URL
  const _url = `${ADOBE_ECHOSIGN_URL}/public/oauth/v2`;
  const redirectAPI = ADOBE_REDIRECT_URI;
  const _scopes = scopes.join('+');
  const clientId = ADOBE_CLIENT_ID;
  const state = db.uuidString();
  const redirectUrl = `${_url}?redirect_uri=${redirectAPI}&response_type=code&client_id=${clientId}&state=${state}&scope=${_scopes}`;

  res.redirect(redirectUrl);
});

// receives the callback from the token
router.get('/token', async (req, res, next) => {
  debug('got a call to %s', req.url);
  const { code, state } = req.query;
  // For this case the state should be the user's id sent by the previous request
  // const { user } = req.session;

  debug('recevied auth code %s for user %s', code, state);

  // get the auth token
  // https://corusinternational.na1.adobesign.com/public/static/oauthDoc.jsp
  const url = new URL('/oauth/v2/token', ADOBE_ECHOSIGN_URL).toString();
  // const _request = new request(url, 'application/x-www-form-urlencoded; charset=UTF-8', '')
  const _params = {
    grant_type: 'authorization_code',
    // copy from global parameters
    ...parameters,
    code,
  }
  const params = new URLSearchParams();
  Object.keys(_params).forEach(key => {
    params.set(key, _params[key]);
  })
  
  try {
    const response = await fetch(url, { method: 'POST', body: params });
  const auth = await response.json();

  // data to store
  const data = {
    adobe_access_token: auth.access_token,
    adobe_refresh_token: auth.refresh_token,
    expires_in: auth.expires_irefresh_tokenn,
  };
  res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
  // write the token to the database
  // await db.exec('INSERT INTO user SET ?', [data]);

  // append authorization bearer token
);

module.exports = router;
// https://documenter.getpostman.com/view/14752/TzkyLzWB#3fd749b0-f58e-4130-8976-11a6b033d9ac
// https://helpx.adobe.com/sign/faq/api.html