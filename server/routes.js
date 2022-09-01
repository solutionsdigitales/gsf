
const setting = require('./controller/setting');

class Routes {

  constructor(app) {
    app.get('/currencies', setting.currency.read);
    app.get('/currencies', setting.currency.read);
    app.get('/currencies/:id', setting.currency.detail);

    app.get('/payement_methods', setting.paymentMethod.read);
    app.get('/payement_methods/:id', setting.paymentMethod.detail);

    // exchange rate
    app.get('/rate', setting.rate.read);
    app.get('/rate/:id', setting.rate.detail);
    app.delete('/rate/:id', setting.rate.delete);
    app.put('/rate/:id', setting.rate.update);
    app.post('/rate', setting.rate.create);


    app.get('/users', setting.user.read);
    app.get('/users/:id', setting.user.detail);
    app.get('/users/sesssion/status', setting.user.sessionStatus);
    app.get('/users/log/out', setting.user.logOut);
   
    app.post('/users', setting.user.create);
    app.post('/users/changeSelfPassword', setting.user.changePassword);
    app.post('/users/log/in', setting.user.auth);

    // microsoft authentification
    app.get('/users/ms/auth', setting.user.sessionInfo);
    
    //
    app.put('/users/:id', setting.user.update);
    app.delete('/users/:id', setting.user.delete);

    app.get('/roles', setting.role.read);
    app.get('/roles/:uuid', setting.role.detail);
    app.get('/roles/modulesForUser/:role_uuid', setting.role.modulesForUser);
    app.get('/roles/userModules/:user_id', setting.role.userModules);
    app.get('/roles/userRoles/:user_id', setting.role.userRoles);
    app.get('/roles/pageInfos/:code', setting.role.pageInfos);


    app.get('/roles/actions/:roleUuid', setting.role.rolesAction);
    app.get('/roles/actions/user/:action_id', setting.role.hasAction);
    app.post('/roles/actions', setting.role.assignActionToRole);
    
    app.post('/roles', setting.role.create);
    app.post('/roles/assignRoles', setting.role.assignRoles);
    app.post('/roles/affectPages', setting.role.assignPages);

    app.put('/roles/:uuid', setting.role.update);
    app.delete('/roles/:uuid', setting.role.delete);

   
    app.post('/services', setting.service.create);
    app.put('/services/:uuid', setting.service.update);
    app.delete('/services/:uuid', setting.service.delete);
    app.get('/services', setting.service.read);
    app.get('/services/:uuid', setting.service.detail);

    
    app.post('/members', setting.member.create);
    app.put('/members/:uuid', setting.member.update);
    app.delete('/members/:uuid', setting.member.delete);
    app.get('/members', setting.member.read);
    app.get('/members/:uuid', setting.member.detail);

    app.post('/cellules', setting.cellule.create);
    app.put('/cellules/:uuid', setting.cellule.update);
    app.delete('/cellules/:uuid', setting.cellule.delete);
    app.get('/cellules', setting.cellule.read);
    app.get('/cellules/:uuid', setting.cellule.detail);

    
    app.post('/transactions', setting.transactions.create);
    app.put('/transactions/:uuid', setting.transactions.update);
    app.get('/transactions', setting.transactions.read);
    app.get('/transactions/:uuid', setting.transactions.detail);
  }

}

module.exports = Routes;
