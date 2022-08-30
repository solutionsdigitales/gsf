import PrototypeApiService from '../../service/httpService'
import prfFilters from './prf.filters';
import DownloadService from '../../service/download';

function OCHService() {
  const baseUrl = '/ochs';
  const service = new PrototypeApiService(baseUrl);

  service.base = new PrototypeApiService('/och_bases');
  
  service.filters = prfFilters;

  service.unAuthorizedPrf = (params) => {
    return service.get(`/unauthorized/list`, params || {});
  }
  service.historic = (reference) => {
    return service.get(`/historic/${reference}`, {});
  }

  service.exportCSV = (uuid) => {
    return service.get(`/export/json/${uuid}`, {});
  }
  
  service.dowloadPdf = async (target, fileName, returnFile) => {
    return DownloadService.pdf(baseUrl, target, fileName, returnFile);
  };

  service.getFileName = (doc) => {
    return `${doc.employee_name} ${doc.reference} v${doc.version} ${doc.date}.pdf`;
  }
  
  return service;
}

const ochs = OCHService();
export default ochs;
