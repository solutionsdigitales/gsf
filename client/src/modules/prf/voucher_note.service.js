import PrototypeApiService from '../../service/httpService'

function NotesService() {
  const baseUrl = '/voucher_notes';
  const service = new PrototypeApiService(baseUrl);
  return service;
}

const nots = NotesService();
export default nots;
