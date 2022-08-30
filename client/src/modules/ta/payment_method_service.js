import PrototypeApiService from '../../service/httpService'

function PaymentMethodService() {
  const baseUrl = '/payement_methods';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const p = PaymentMethodService();
export default p;
