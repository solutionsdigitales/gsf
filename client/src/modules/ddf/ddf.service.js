import PrototypeApiService from '../../service/httpService'
import ddfFilters from './prf.filters';
import DownloadService from '../../service/download';


function DDFService() {
  const baseUrl = '/frs';
  const service = new PrototypeApiService(baseUrl);
  service.filters = ddfFilters;
  service.unAuthorizedPrf = (params) => {
    return service.get(`/unauthorized/list`, params || {});
  }
  service.historic = (reference) => {
    return service.get(`/historic/${reference}`, {});
  }
  

  service.dowloadPdf = async (target, fileName, returnFile) => {
    return DownloadService.pdf(baseUrl, target, fileName, returnFile);
  };

  service.getFileName = (doc) => {
    return `${doc.employee_name} ${doc.reference} v${doc.version} ${doc.date}.pdf`;
  }
  
  return service;

}

const prfs = DDFService();
export default prfs;
