
import PrototypeApiService from '../../service/httpService'

function CelluleService() {
  const baseUrl = '/cellules';
  return new PrototypeApiService(baseUrl);
}

const cds = CelluleService();
export default cds;
