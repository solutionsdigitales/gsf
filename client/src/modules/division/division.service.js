
import PrototypeApiService from '../../service/httpService'

function DivisionService() {
  const baseUrl = '/divisions';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const cds = DivisionService();
export default cds;
