import PrototypeApiService from '../../service/httpService'

function SignatureService() {
  const baseUrl = '/signatures';
  const service = new PrototypeApiService(baseUrl);

  service.sign = (params) => {
    return service.post('/sign', params);
  }

  return service;
}

const SigService = SignatureService();
export default SigService;
