import constants from './constant';

export default class DocumentService {

  static url(voucherTypeId) {
    const documentUrl = {};
    documentUrl[constants.voucherTypes.prf] = 'prfs';
    documentUrl[constants.voucherTypes.ddf] = 'frs';
    documentUrl[constants.voucherTypes.exr] = 'expense_reports';
    documentUrl[constants.voucherTypes.och] = 'ochs';
    documentUrl[constants.voucherTypes.ta] = 'traval_advances';
    return documentUrl[voucherTypeId];
  }

}