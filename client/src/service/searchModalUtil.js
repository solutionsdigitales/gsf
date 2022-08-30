
function SearchModalUtilService() {
  const service = {};

  service.isDefined = (myVar) => {
    return (typeof myVar !== 'undefined');
  }

  service.getChanges = (searchQueries, changes, displayValues, lastDisplayValues) => {

    // push all searchQuery values into the changes array to be applied
    Object.keys(searchQueries).forEach(key => {
      const value = searchQueries[key];
      if (service.isDefined(value)) {
        const hasDisplayValue = service.isDefined(displayValues[key]);
        const hasLastDisplayValue = service.isDefined(lastDisplayValues[key]);

        let displayValue = value;
        if (hasDisplayValue) {
          displayValue = displayValues[key];
        } else if (hasLastDisplayValue) {
          displayValue = lastDisplayValues[key];
        }

        changes.post({ key, value, displayValue });
      }
    });

    return changes.getAll();
  };


  service.setDropDownValue = (component, key, list, selected, id, label) => {
    if (component.filterMap[key]) {
      component[selected] =
        list.filter((l) => l[id] === component.filterMap[key]._value)[0] || {};
      component.displayValues[key] = component[selected][label];
    }
  };

  service.setFilters = (component, keys, filterType) => {
    component.filters[filterType].forEach((filter) => {
      keys.forEach((d) => {
        if (d === filter._key) {
          component.search[filterType][d] = filter._value;
          component.filterMap[d] = filter;
        }
      });
    });
  };

  return service;
}

const s = SearchModalUtilService();

export default s;
