import PrototypeApiService from '../../service/httpService'

function LocationTypeService() {
  const baseUrl = '/location_types';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const nots = LocationTypeService();
export default nots;
