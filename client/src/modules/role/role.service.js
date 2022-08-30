import PrototypeApiService from '../../service/httpService'


/**
 * Account Service
 *
 * A service wrapper for the /roles HTTP endpoint.
 */
function RolesService () {
    
    const service = new PrototypeApiService('/roles');

    service.loadModules = (roleUuid) => {
        return service.get(`/modulesForUser/${roleUuid}`);
    }

    service.userRoles = (userId) => {
        return service.get(`/userRoles/${userId}`);
    }

    service.userAddRoles = (data) => {
        return service.post(`/assignRoles`, data);
    }

    service.affectPages = (data) => {
        return service.post(`/affectPages`, data);
    }

    service.loadUserModules = (userId) =>{
        return service.get(`/userModules/${userId}`);
    }
    service.pageInfos = (pageCode) => {
        return service.get(`/pageInfos/${pageCode}`);
    }

    service.actions = (roleUuid) => {
        const url = `/actions/${roleUuid}`;
        return service.get(url);
    }

    service.assignActions = (data) => {
        const url = `/actions`;
        return service.post(url, data);
    }

    service.userHasAction = (actionId) => {
        const url = `/actions/user/${actionId}`;
        return service.get(url);
    }

    return service;
}



const rs =  RolesService();
export default rs; 
