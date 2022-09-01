const md5 = require('md5');
const msal = require('@azure/msal-node');
const debug = require('debug')('imadata:msauth');
const _ = require('lodash');
const JWTConfig = require('../api/token');
const db = require('../../lib/db');
const FilterParser = require('../../lib/filter');

// Logout, destroy the user session
async function logOut(req, res, next) {
  const { user } = req.session;
  try {
    await db.exec('INSERT INTO user_op SET ? ', {
      id: db.uuid(),
      user_id: db.bid(user.id),
      text: `deconnexion (${user.name})`,
    });
    delete req.session.user;
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}


async function auth(req, res, next) {
  try {
    const sql = `
    SELECT HEX(id) as id, name 
    FROM user 
    WHERE name=? AND pwd=?
  `;

    const { name, pwd } = req.body;
    const users = await db.exec(sql, [name, md5(pwd)]);

    if (users.length === 0) {
      res.status(404).json({ msg: 'user not found', status: 'Failed' });
      return;
    }
    const user = users[0] || {};
    if (user.locked === 1) {
      res.status(500).json({ msg: 'User account locked', status: 'Failed', code: 'locked' });
      return;
    }
    const result = await authProcess(user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function authProcess(user, msauthPassKey) {
  await db.exec('INSERT INTO user_op SET ? ', {
    id: db.uuid(),
    user_id: db.bid(user.id),
    text: `connexion (${user.name})`,
  });

  return {
    user,
    token: JWTConfig.create(user.id),
    msauthPassKey: msauthPassKey
  };
}


async function changePassword(req, res, next) {
  try {
    const { newPwd, oldPwd } = req.body;
    if (!newPwd || !oldPwd) return res.sendStatus(500);
    const pwd = md5(newPwd);
    const oldPassword = md5(oldPwd);
    const id = db.bid(req.body.user_id);

    /* check first if the old password is correct */
    const finUserSql = `SELECT name FROM user WHERE id=? AND pwd=?`;
    const userInfos = await db.exec(finUserSql, [id, oldPassword]);
    if (userInfos.length > 0) {
      await db.exec(`UPDATE user SET pwd = ? WHERE id=?`, [pwd, id]);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
  return 0;
}
// get all users
async function read(req, res, next) {
  try {
    const options = req.query;
    db.convert(options, ['id']);
    const filters = new FilterParser(options, { tableAlias: 'u' });
    let sql = `
    SELECT HEX(id) as id, name, locked
    FROM user u
   `;

    filters.equals('id');
    sql = filters.applyQuery(sql);
    const parms = filters.parameters();

    const users = await db.exec(sql, parms);

    const roleQuery = `
    SELECT BUID(r.uuid) as uuid, r.label
    FROM roles r
    JOIN users_roles as usr ON usr.roles_uuid = r.uuid
    WHERE usr.users_id =?
  `;

    const roles = await Promise.all(users.map(u => {
      return db.exec(roleQuery, db.bid(u.id));
    }));

    const result = [];
    users.forEach((r, index) => {
      const obj = users[index];
      obj.roles = roles[index].map(r => {
        return r.label
      }).join(', ');
      result.push(obj);
    });
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }

}

// retreive all users
function detail(req, res, next) {
  const sql = `
      SELECT HEX(id) as id, name, locked
      FROM user
      WHERE id = ?
    `;
  const id = db.bid(req.params.id);

  db.one(sql, id).then(user => {
    res.status(200).json(user);
  }).catch(next);
}


// create a new user
function create(req, res, next) {
  const data = req.body;
  db.convert(data, ['id']);

  if (!data.pwd || !data.name) {
    res.status(400).json({
      title: 'Bad request',
      message: 'Name or password not specified'
    })
    return;
  }
  data.pwd = md5(data.pwd);
  data.id = data.id ? db.bid(data.id) : db.uuid();

  db.exec('INSERT INTO user SET ?', data).then(() => {
    res.sendStatus(201);
  }).catch(next);
}

// update user infos
function update(req, res, next) {
  const data = req.body;
  db.convert(data, ['id']);
  const id = db.bid(req.params.id);
  if (data.pwd) {
    data.pwd = md5(data.pwd);
  }

  db.exec('UPDATE user SET ? WHERE id=?', [data, id]).then(() => {
    res.sendStatus(200);
  }).catch(next);
}


// delete a user
function remove(req, res, next) {
  const id = db.bid(req.params.id);
  db.exec('DELETE FROM user  WHERE id=?', id).then(() => {
    res.sendStatus(200);
  }).catch(next);
}



function sessionStatus(req, res, next) {
  JWTConfig.verify(req, (decoded) => {
    res.status(200).json(decoded)
  }, (error) => {
    res.status(403).json({ message: 'Session expired or not exist', error });
    next();
  });
}

// get microsoft auth. info
function sessionInfo(req, res, next) {
  if (!req.session.msauth) {
    res.status(404).json({
      title: 'Not found',
      message: 'No msauth session exists'
    });
    return;
  }
  const { uuid } = req.session.msauth;

  db.one(
    `SELECT BUID(u.id) as id, u.name
     FROM msauth_cache mc
     JOIN user u ON u.id = mc.user_id
     WHere mc.uuid = ?    
    `, db.bid(uuid)).then(user => {
      return authProcess(user, uuid);
    }).then(result => {
      res.status(200).json(result);
    }).catch(next);
}

module.exports = {
  read,
  detail,
  update,
  delete: remove,
  create,
  auth,
  changePassword,
  logOut,
  sessionInfo,
  sessionStatus,
}

