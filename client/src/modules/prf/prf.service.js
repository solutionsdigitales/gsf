import PrototypeApiService from '../../service/httpService';
import prfFilters from './prf.filters';
import DownloadService from '../../service/download';

function PRFService() {
  const baseUrl = '/prfs';
  const service = new PrototypeApiService(baseUrl);
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

  service.getFileName = (prf) => {
    return DownloadService.getFileName(prf);
  }

  service.filters = prfFilters;
  return service;
}

const prfs = PRFService();
export default prfs;
