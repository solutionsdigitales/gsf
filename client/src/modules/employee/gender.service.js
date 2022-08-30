
import PrototypeApiService from '../../service/httpService'

function GenderService() {
  const baseUrl = '/genders';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const empS = GenderService();
export default empS;
