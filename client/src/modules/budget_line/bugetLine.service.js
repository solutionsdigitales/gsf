import PrototypeApiService from '../../service/httpService'
import BLFilters from './budgetLine.filter';

function BudgetLineService() {
  const baseUrl = '/budget_lines';
  const service = new PrototypeApiService(baseUrl);
  
  service.import = (data) => {
    return service.post('/import', data);
  };

  service.removeLine = (uuids) => {
    return service.post('/remove_lines', uuids);
  };

  service.setBudgetHolder = (params) => {
    return service.put('/set/budget_holder', params);
  };
  

  service.filters = BLFilters;
  return service;
}

const bgt = BudgetLineService();
export default bgt;
