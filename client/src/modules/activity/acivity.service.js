
import PrototypeApiService from '../../service/httpService'

function ActivityService() {
  const baseUrl = '/activities';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const fds = ActivityService();
export default fds;
