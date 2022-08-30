import Constants from '../../service/constant';
import FilterService from '../../service/filterService';
import PeriodService from '../../service/period';
import Util from '../../service/util';


function PRFFilters() {
  const service = new FilterService();
  // default filters will always be applied
  service.registerDefaultFilters(Constants.defaultFilters);
  /*service.registerDefaultFilters([
    { key: 'showFullTransactions', label: 'POSTING_JOURNAL.SHOW_FULL_TRANSACTION_RECORDS' },
  ]);*/

  // custom filters can be optionally applied
  service.registerCustomFilters([
    { key: 'reference', label: 'FORM.LABELS.REFERENCE' },
    { key: 'location', label: 'PRF.LINE.OFFICE' },
    { key: 'project', label: 'TREE.PROJECT' },
    { key: 'approver_uuid', label: 'PRF.APPROVER' },
    { key: 'employee_uuid', label: 'FORM.LABELS.EMPLOYEE' },
    { key: 'document_state_id', label: 'FORM.LABELS.STATE' },
    { key: 'unauthorized', label: 'FORM.INFO.UNAUTHORIZED' },
    { key: 'item_description', label: 'FORM.LABELS.DESCRIPTION' },
  ]);


  function assignDefaultFilters() {
    // get the keys of filters already assigned - on initial load this will be empty
    const assignedKeys = Object.keys(service.formatHTTP());

    // assign default period filter
    const periodDefined = Util.arrayIncludes(
      assignedKeys,
      ['period', 'custom_period_start', 'custom_period_end'],
    );

    if (!periodDefined) {
      service.assignFilters(PeriodService.defaultFilters());
    }

    // assign default limit filter
    if (assignedKeys.indexOf('limit') === -1) {
      service.assignFilter('limit', 100);
    }
  }
  assignDefaultFilters();

  return service;
}

const prff = PRFFilters();
export default prff;
