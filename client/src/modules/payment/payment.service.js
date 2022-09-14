import PrototypeApiService from '../../service/httpService'

function PaymentService() {
  const baseUrl = '/transactions';
  return new PrototypeApiService(baseUrl);
}

const cds = PaymentService();
export default cds;
