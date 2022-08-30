
import PrototypeApiService from '../../service/httpService'

function EnterpriseService() {
  const baseUrl = '/enterprises';
  const service = new PrototypeApiService(baseUrl);
  
  return service;
}

const eSvc = EnterpriseService();
export default eSvc;
