import PrototypeApiService from '../../service/httpService'
import membreFilters from './membre.filters';

/**
 * Member Service
 *
 * A service wrapper for the /members HTTP endpoint.
 */
function MemberService() {
  const service = new PrototypeApiService('/members');
  service.filters = membreFilters;

  service.count = () => service.get('/counting/number');
  
  return service;
}

const rs = MemberService();
export default rs;
