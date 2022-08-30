import PrototypeApiService from '../../service/httpService'

function LocationService() {
  const baseUrl = '/locations';
  const service = new PrototypeApiService(baseUrl);
  
  service.import = (data) => {
    return service.post('/import', data);
  };

  return service;
}

const nots = LocationService();
export default nots;
