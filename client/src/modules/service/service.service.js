
import PrototypeApiService from '../../service/httpService'

function SersersService() {
  const baseUrl = '/services';
  const service = new PrototypeApiService(baseUrl);
  
  return service;
}

const cds = SersersService();
export default cds;
