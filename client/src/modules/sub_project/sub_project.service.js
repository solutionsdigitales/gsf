
import PrototypeApiService from '../../service/httpService'

function SubProjectService() {
  const baseUrl = '/sub_projects';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const cds = SubProjectService();
export default cds;
