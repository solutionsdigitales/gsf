import Constants from '../../service/constant';
import FilterService from '../../service/filterService';
import PeriodService from '../../service/period';
import Util from '../../service/util';


function myFilters() {
  const service = new FilterService();
  // default filters will always be applied
  service.registerDefaultFilters(Constants.defaultFilters);
  // custom filters can be optionally applied
  service.registerCustomFilters([
    { key: 'number', label: 'FORM.LABELS.NUMBER' },
    { key: 'lastname', label: 'FORM.LABELS.NAME' },
    { key: 'middlename', label: 'FORM.LABELS.MIDDLE_NAME' },
    { key: 'firstname', label: 'FORM.LABELS.FIRST_NAME' },
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
      service.assignFilter('limit', 20);
    }
  }
  assignDefaultFilters();

  return service;
}

const prff = myFilters();
export default prff;
