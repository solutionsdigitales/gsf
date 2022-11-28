import PrototypeApiService from '../../service/httpService'
import payFilters from './payment.filters';

function PaymentService() {
  const baseUrl = '/transactions';
  const service = new PrototypeApiService(baseUrl);
  service.filters = payFilters;
  return service;
}

const cds = PaymentService();
export default cds;
