
import PrototypeApiService from '../../service/httpService'

function AccountService() {
  const baseUrl = '/accounts';
  const service = new PrototypeApiService(baseUrl);
  
  service.import = (data) => {
    return service.post('/import', data);
  };

  return service;
}

const acc = AccountService();
export default acc;
