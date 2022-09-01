const q = require('q');
const db = require('../../lib/db');
const FilterParser = require('../../lib/filter');
const RoleModel = require('./roleModel');

module.exports.read = read;
module.exports.detail = detail;
module.exports.update = update;
module.exports.delete = remove;
module.exports.create = create;
module.exports.modulesForUser = modulesForUser;
module.exports.userRoles = userRoles;
module.exports.assignRoles = assignRoles;
module.exports.assignPages = assignPages;
module.exports.userModules = userModules;
module.exports.pageInfos = pageInfos;
module.exports.rolesAction = rolesAction;
module.exports.assignActionToRole = assignActionToRole;
module.exports.hasAction = hasAction;
// database connection

// get all roles
function read(req, res, next) {
  const options = req.query;
  db.convert(options, ['uuid']);
  const filters = new FilterParser(options, { tableAlias : 'r' });
  let sql = `
    SELECT HEX(uuid) as uuid, label, is_default
    FROM roles r
  `;

  filters.equals('uuid');
  sql = filters.applyQuery(sql);
  const parms = filters.parameters();

  db.exec(sql, parms).then(roles => {
    res.status(200).json(roles);
  }).catch(next);

}

// retreive all roles
function detail(req, res, next) {
  const sql = `
      SELECT HEX(uuid) as uuid, label, is_default
      FROM roles
      WHERE uuid = ?
    `;
  const uuid = db.bid(req.params.uuid);

  db.one(sql, uuid).then(role => {
    res.status(200).json(role);
  }).catch(next);
}


// create a new roles
function create(req, res, next) {
  const data = req.body;
  db.convert(data, ['uuid']);
  data.uuid = data.uuid ? data.uuid : db.uuid();
  db.exec('INSERT INTO roles SET ?', data).then(() => {
    res.sendStatus(201);
  }).catch(next);
}

// update roles infos
function update(req, res, next) {
  const data = req.body;
  db.convert(data, ['uuid']);
  const uuid = db.bid(req.params.uuid);
  db.exec('UPDATE roles SET ? WHERE uuid=?', [data, uuid]).then(() => {
    res.sendStatus(200);
  }).catch(next);
}

// delete a roles
function remove(req, res, next) {
  const uuid = db.bid(req.params.uuid);
  db.exec('DELETE FROM roles  WHERE uuid=?', uuid).then(() => {
    res.sendStatus(200);
  }).catch(next);
}


async function modulesForUser(req, res, next) {
  try {
    const roleModel = new RoleModel();
    const roleUuid = req.params.role_uuid;
    const modules = await db.exec(roleModel.moduleList);

    for (let index = 0; index < modules.length; index++) {
      const mod = modules[index];
      mod.pages = await db.exec(roleModel.listForRoles, [roleUuid, roleUuid, mod.id]);
    }
    res.status(200).json(modules);
  } catch (error) {
    next(error);
  }
}


async function assignPages(req, res, next) {

  const data = req.body;
  const pageCodes = [].concat(data.pageCodes);
  const roleUuid = data.role_uuid;
  const transaction = db.transaction();
  transaction.addQuery(`DELETE FROM role_page WHERE role_uuid =?`, db.bid(roleUuid));
  pageCodes.forEach(code => {
    transaction.addQuery('INSERT INTO role_page SET ?', {
      uuid : db.uuid(),
      page_code : code,
      role_uuid : db.bid(roleUuid),
    });
  });
  transaction.execute().then(() => {
    res.sendStatus(201);
  }).catch(next);

}


// userRoles
async function userRoles(req, res, next) {
  try {
    const roleModel = new RoleModel();
    const userId = db.bid(req.params.user_id);
    const roles = await db.exec(roleModel.listRolesForUser, [userId, userId]);
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
}

// assing roles

function assignRoles(req, res, next) {
  const data = req.body;
  const userId = db.bid(data.user_id);
  const roleUuids = [].concat(data.roles_uuids);

  db.exec('DELETE FROM users_roles WHERE users_id=?', userId).then(() => {
    return q.all(roleUuids.map(uuid => {
      return db.exec('INSERT INTO users_roles SET ?', {
        uuid : db.uuid(),
        users_id : userId,
        roles_uuid : db.bid(uuid),
      });
    }));
  }).then(() => {
    res.sendStatus(201);
  }).catch(next);

}

async function userModules(req, res, next) {
  try {
    const roleModel = new RoleModel();
    const userId = db.bid(req.params.user_id);
    const modules = await db.exec(roleModel.moduleForUser, userId);

    for (let i = 0; i < modules.length; i++) {
      const mod = modules[i];
      mod.pages = await db.exec(roleModel.listPagesForUser, [mod.id, userId]);
    }
    res.status(200).json(modules);
  } catch (error) {
    next(error);
  }
}


async function pageInfos(req, res, next) {
  try {
    const roleModel = new RoleModel();
    const page_id = req.params.code;
    const sql = roleModel.moduleByPageUrl;
    const page = await db.one(sql, page_id);
    res.status(200).json(page);
  } catch (error) {
    next(error);
  }

}


function rolesAction(req, res, next) {
  const roleUuid = db.bid(req.params.roleUuid);

  const sql = `
    SELECT a.id, a.description, IFNULL(s.affected, 0) as affected
    FROM actions a
    LEFT JOIN (
      SELECT  actions_id , 1 as affected
      FROM role_actions ra
      JOIN roles ro ON ra.role_uuid = ro.uuid
      WHERE ro.uuid = ?
    )s ON s.actions_id = a.id
  `;

  db.exec(sql, [roleUuid])
    .then(actions => {
      res.json(actions);
    })
    .catch(next);
}

// affect roles to a user
// actions ares permissions for a role used most of the time in the view
// some actions are sensitive
function assignActionToRole(req, res, next) {
  const data = req.body;

  const actionIds = [...data.action_ids];
  const roleUuid = db.bid(data.role_uuid);
  const transaction = db.transaction();

  const deleleUserRoles = `DELETE FROM role_actions WHERE role_uuid = ?`;
  const addAction = `INSERT INTO role_actions SET ?`;

  db.exec(deleleUserRoles, roleUuid)
    .then(() => {
      actionIds.forEach(actionId => {
        transaction.addQuery(addAction, { uuid : db.uuid(), role_uuid : roleUuid, actions_id : actionId });
      });
      return transaction.execute();
    })
    .then(() => {
      res.sendStatus(201);
    })
    .catch(next);
}

async function isAllowed(params) {
  const { actionId, userId } = params;
  const sql = `
    SELECT count(ra.uuid) as nbr
    FROM role_actions ra
    JOIN users_roles as ur ON ur.roles_uuid = ra.role_uuid
    WHERE actions_id =? AND ur.users_id = ?
  `;

  const result = await db.exec(sql, [actionId, db.bid(userId)]);
  if (result.length > 0) {
    return result[0].nbr > 0;
  }
  return false;
}

function hasAction(req, res, next) {
  isAllowed({
    actionId : req.params.action_id,
    userId : req.session.user.id,
  }).then(result => {
    if (result) {
      res.status(200).json(true);
    } else {
      res.status(403).json(false);
    }
  })
    .catch(next);
}
