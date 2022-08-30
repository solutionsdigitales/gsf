import Constants from '../../service/constant';
import FilterService from '../../service/filterService';
import PeriodService from '../../service/period';
import Util from '../../service/util';


function BudgetLineFilters() {
  const service = new FilterService();
  // default filters will always be applied
  service.registerDefaultFilters(Constants.defaultFilters);
  /*service.registerDefaultFilters([
    { key: 'showFullTransactions', label: 'POSTING_JOURNAL.SHOW_FULL_TRANSACTION_RECORDS' },
  ]);*/

  // custom filters can be optionally applied
  service.registerCustomFilters([
    { key: 'entity_code', label: 'PRF.LINE.ENTITY_CODE' },
    {key :'loc', label: 'PRF.LINE.LOC'},
    { key: 'project', label: 'FORM.LABELS.PROJECT' },
    {key :'reporting_office', label: 'PRF.LINE.OFFICE'},
    {key :'activity', label: 'PRF.LINE.ACTIVITY'},
    {key :'function_code', label: 'PRF.LINE.FUNCTION_CODE'},
    {key :'sub_project', label: 'PRF.LINE.SUB_PROJECT'},
    {key :'funding_source', label: 'PRF.LINE.FUNDING_SOURCE'},
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
      service.assignFilter('limit', 200);
    }
  }
  assignDefaultFilters();

  return service;
}

const prff = BudgetLineFilters();
export default prff;
