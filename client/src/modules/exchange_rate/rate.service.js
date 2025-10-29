import PrototypeApiService from '../../service/httpService';

function _ExchangeRateService() {
  const baseUrl = '/rate';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const ExchangeRateService = _ExchangeRateService();
export default ExchangeRateService;
