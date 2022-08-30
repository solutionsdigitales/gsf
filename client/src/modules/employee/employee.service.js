
import PrototypeApiService from '../../service/httpService'

function EmployeeService() {
  const baseUrl = '/employees';
  const categoryUrl = '/employee_categories';
  const service = new PrototypeApiService(baseUrl);
  service.categories = new PrototypeApiService(categoryUrl);
  service.import = (data) => {
    return service.post('/import', data);
  };

  service.projects = (uuid) => {
    return service.get(`/projects/${uuid}`);
  };
  service.voucherAccess = (uuid) => {
    return service.get(`/voucher_access/${uuid}`);
  };


  return service;
}

const empS = EmployeeService();
export default empS;
