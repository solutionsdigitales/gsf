
import PrototypeApiService from '../../service/httpService'

function inventoryUnitService() {
  const baseUrl = '/inventoty_units';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const invS = inventoryUnitService();
export default invS;