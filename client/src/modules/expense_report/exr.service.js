import PrototypeApiService from '../../service/httpService'
import prfFilters from './prf.filters';
import DownloadService from '../../service/download';

function ExpenseReportService() {
  const baseUrl = '/expense_reports';
  const service = new PrototypeApiService(baseUrl);
  service.filters = prfFilters;
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
    return DownloadService.getFileName(doc);
  }

  return service;
}

const exr = ExpenseReportService();
export default exr;
