
import PrototypeApiService from '../../service/httpService'

function EnitityService() {
  const baseUrl = '/entities';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const acc = EnitityService();
export default acc;
