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
    { key: 'membre_number', label: 'TREE.MEMBERS' },
    { key: 'pricing', label: 'Opération' },
    { key: 'cellule', label: 'TREE.CELLULE' },    
    { key: 'month', label: 'FORM.LABELS.MONTH' }, 
    { key: 'year', label: 'FORM.LABELS.YEAR' },
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
      service.assignFilter('limit', 30);
    }
  }
  assignDefaultFilters();

  return service;
}

const prff = myFilters();
export default prff;
