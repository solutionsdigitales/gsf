import PrototypeApiService from './httpService'
import { saveAs } from 'file-saver';
import NProgress from 'nprogress';

function DownloadService() {
  const service = {};
  service.pdf = async (baseUrl, target, fileName, returnFile) => {
    // responseType: 'arraybuffer'
    NProgress.start();
    try {
      const APIs = new PrototypeApiService(baseUrl);

      const arraybuffer = await APIs.getPdfStream(`/${target}`, {});
      const file = new Blob([arraybuffer], {
        type: 'application/pdf',
      });

      if (returnFile) {
        NProgress.done();
        return file;
      }

      saveAs(file, fileName || 'report-name.pdf');
    } catch (error) {
      console.log(error);
      NProgress.done();
      return null;
    }
    NProgress.done();

  };

  service.getFileName = (doc) => {
    return `${doc.employee_name} ${doc.reference} v${doc.version} ${doc.date}.pdf`;
  }

  return service;
}

const downLService = DownloadService();
export default downLService;
