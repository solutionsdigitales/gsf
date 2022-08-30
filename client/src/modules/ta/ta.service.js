import TAFilters from './prf.filters';
import PrototypeApiService from '../../service/httpService';
import DownloadService from '../../service/download';

function TravalAdvanceService() {
  const baseUrl = '/traval_advances';
  const service = new PrototypeApiService(baseUrl);
  service.filters = TAFilters;

  service.dowloadPdf = async (target, fileName, returnFile) => {
    return DownloadService.pdf(baseUrl, target, fileName, returnFile);
  };

  service.getFileName = (doc) => {
    return DownloadService.getFileName(doc);
  }

  return service;
}

const prfs = TravalAdvanceService();
export default prfs;
