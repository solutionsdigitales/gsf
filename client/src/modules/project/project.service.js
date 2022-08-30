
import PrototypeApiService from '../../service/httpService'

function ProjectService() {
  const baseUrl = '/projects';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const cds = ProjectService();
export default cds;
