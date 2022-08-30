import PrototypeApiService from '../../service/httpService'

function DocStateService() {
  const baseUrl = '/document_states';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const docState = DocStateService();
export default docState;
