
import PrototypeApiService from '../../service/httpService'

function FunctionCodeService() {
  const baseUrl = '/function_codes';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const cds = FunctionCodeService();
export default cds;
