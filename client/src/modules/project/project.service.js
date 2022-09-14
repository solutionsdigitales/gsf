import PrototypeApiService from '../../service/httpService'

function ProjectService() {
  const baseUrl = '/projects';
  return new PrototypeApiService(baseUrl);
}

const cds = ProjectService();
export default cds;
