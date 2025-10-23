import PrototypeApiService from '../../service/httpService'

function RateService() {
  const baseUrl = '/rate';
  return new PrototypeApiService(baseUrl);
}

const cds = RateService();
export default cds;
