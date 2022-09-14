
function Containts() {
  const c = {};
  c.defaultFilters = [
    { key: 'period', label: 'TABLE.COLUMNS.PERIOD', valueFilter: 'translate' },
    { key: 'includeEmptyLot', label: 'STOCK.INCLUDE_EMPTY_LOTS', valueFilter: 'boolean' },
    {
      key: 'custom_period_start',
      label: 'PERIODS.START',
      comparitor: '>',
      valueFilter: 'date',
    }, {
      key: 'custom_period_end',
      label: 'PERIODS.END',
      comparitor: '<',
      valueFilter: 'date',
    }, {
      key: 'limit',
      label: 'FORM.LABELS.LIMIT',
    },
  ];
  c.voucherTypes = {
    prf: 1,
    ddf: 2,
    exr: 3,
    och: 4,
    ta: 5,
  },
    c.weekDays = [
      { id: 0, label: 'FORM.LABELS.WEEK_DAYS.SUNDAY', checked: false },
      { id: 1, label: 'FORM.LABELS.WEEK_DAYS.MONDAY', checked: false },
      { id: 2, label: 'FORM.LABELS.WEEK_DAYS.TUESDAY', checked: false },
      { id: 3, label: 'FORM.LABELS.WEEK_DAYS.WEDNESDAY', checked: false },
      { id: 4, label: 'FORM.LABELS.WEEK_DAYS.THURSDAY', checked: false },
      { id: 5, label: 'FORM.LABELS.WEEK_DAYS.FRIDAY', checked: false },
      { id: 6, label: 'FORM.LABELS.WEEK_DAYS.SATURDAY', checked: false },
    ];

  c.dates = {
    minDOB: new Date('1900-01-01'),
    format: 'dd/MM/yyyy',
    formatDB: 'YYYY-MM-DD',
    formatLong: 'dd MMM yyyy hh:mm:ss',
  };
  c.yearOptions = {
    format: 'yyyy',
    datepickerMode: 'year',
    minMode: 'year',
  };

  c.dayOptions = {
    format: 'dd/MM/yyyy',
    datepickerMode: 'day',
    minMode: 'day',
  };
  c.lengths = {
    maxTextLength: 1000,
    minDecimalValue: 0.0001,
  };

  c.DOCUMENT_STATUS = {
    PENDING: 1,
    SIGNED: 2,
    APPROVED: 3,
    CLOSED: 4,
  };

  c.EMPLOYEE_CATEGORY = {
    PROCUREMENT: 1,
    FINANCE: 2,
  }
  c.MONTHS = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

return c;
}

const cts = Containts();

export default cts;