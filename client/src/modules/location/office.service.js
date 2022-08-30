
import PrototypeApiService from '../../service/httpService'

function LocationService() {
  const baseUrl = '/offices';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const locs = LocationService();
export default locs;
