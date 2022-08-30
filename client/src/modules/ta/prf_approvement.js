import PrototypeApiService from '../../service/httpService'
import prfFilters from './prf.filters';

function ApprovementService() {
    const baseUrl = '/approvements';
    const service = new PrototypeApiService(baseUrl);
    service.filters = prfFilters;
    service.approve = (params) => {
        return service.post('/approve', params);
    }
    service.desapprove = (params) => {
        return service.post('/desapprove', params);
    }
    return service;
}

const apps = ApprovementService();
export default apps;
