
import PrototypeApiService from '../../service/httpService'

function FundingSourceService() {
  const baseUrl = '/funding_sources';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const fds = FundingSourceService();
export default fds;
