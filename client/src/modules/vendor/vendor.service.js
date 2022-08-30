
import PrototypeApiService from '../../service/httpService'

function vendorService() {
  const baseUrl = '/vendors';
  const service = new PrototypeApiService(baseUrl);
  
  service.import = (data) => {
    return service.post('/import', data);
  };

  return service;
}

const acc = vendorService();
export default acc;
