
class RoleModel {

  constructor() {
    this.create = `
      INSERT INTO  page SET ?
    `;

    this.update = ` UPDATE page SET ? WHERE code=? `;

    this.delete = `
      DELETE FROM page WHERE code=?
    `;

    this.list = ` 
      SELECT  code, label, url , isTreeItem, module_id 
      FROM page 
    `;

    this.moduleList = `
      SELECT  id, label, icon, description 
      FROM modules
    `;

    this.listPagesForUser = `     
      SELECT  DISTINCT p.code, p.label, p.url , p.isTreeItem, p.module_id
      FROM page as p
      JOIN role_page  as rp ON rp.page_code = p.code  
      JOIN users_roles as ur ON  rp.role_uuid= ur.roles_uuid
      WHERE p.module_id=? AND ur.users_id= ?
    `;

    /**
         * list of affected roles union unassigned ones for a user
     */
    this.listRolesForUser = ` 
      SELECT q.* FROM (
        SELECT BUID(r.uuid) as uuid, r.label , 1 as affected
        FROM roles r
        JOIN users_roles as usr ON usr.roles_uuid = r.uuid
        WHERE usr.users_id =?
        
        UNION ALL

        SELECT BUID(r.uuid) as uuid, r.label , 0 as affected
        FROM roles r WHERE r.uuid NOT IN (
          SELECT roles_uuid
          FROM   users_roles
          WHERE  users_id =?
        )
      )as q
      ORDER BY q.label
    `;

    this.listForRoles = ` 
      SELECT DISTINCT rqt.code,  rqt.label, rqt.url , rqt.module_id, rqt.affected FROM (
        SELECT  p.code, p.label, p.url , p.module_id,  1 as affected
        FROM page p
        JOIN role_page as rp ON rp.page_code = p.code
        WHERE rp.role_uuid =HUID(?)
      
        UNION ALL
      
        SELECT  code,label, url , module_id,  0 as affected
        FROM page 
        WHERE code NOT IN(
          SELECT  p.code
          FROM page p
          JOIN role_page as rp ON rp.page_code = p.code
          WHERE rp.role_uuid = HUID(?)
          )
        ) as rqt
      WHERE rqt.module_id = ?
      ORDER BY rqt.label
      `;

    this.moduleForUser = `
      SELECT DISTINCT m.id, m.label, m.icon, m.description
      FROM modules m
      JOIN page as p ON p.module_id = m.id
      JOIN role_page  as rp ON rp.page_code = p.code  
      JOIN users_roles as ur ON  rp.role_uuid= ur.roles_uuid
      JOIN user us ON us.id = ur.users_id
      WHERE ur.users_id= ?`;

    this.detail = ` 
      SELECT code, label, url, isTreeItem, module_id 
      FROM page WHERE code = ?
    `;

    this.lookUp = ` 
      SELECT code, label, url, isTreeItem, module_id 
      FROM page WHERE ?
    `;

    this.moduleByPageUrl = `
      SELECT m.label as module_label, p.*
        FROM  page p
      JOIN modules m ON m.id = p.module_id
      WHERE p.code =?
    `;
  }
}

module.exports = RoleModel;
