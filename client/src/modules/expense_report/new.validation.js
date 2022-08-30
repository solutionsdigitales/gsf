function detect() {
  const service = {};

  service.fields = {
   
    approvers : {
      id : 'approvers',
      text: 'PRF.BUDGET_HOLDER_NAME'
    },
    delivery_expected_date: {
      id: "delivery_expected_date",
      text: "PRF.EXPECTED_DATE"
    },
    activity : {
      id: "activity",
      text: "TREE.ACTIVITY"
    },
    traval_place: {
      id:'traval_place',
      text: "VOUCHERS.TRAVEL_PLACE"
    },
    advance_date : {
      id: "advance_date",
      text: "VOUCHERS.ADVANCE_DATE"
    },
    advance_amount : {
      id: "advance_amount",
      text: "VOUCHERS.ADVANCE_AMOUNT"
    },
    grid : {
      id : "budget_line_grid",
      text : "PRF.BUDGET_LINES_SECTION"
    },
    update_note: {
      id: "update_note",
      text: "PRF.UPDATE_NOTE"
    },
  };

  service.check = (key, value) => {
    if (service.fields[key]) {
      service.fields[key].error = value;
      return !!value;
    }
    return true;
  };

  service.process = () => {
    const badFielfs = Object.keys(service.fields).filter(k => service.fields[k].error);
    if (badFielfs.length === 0) return false;
    const {id, text} = service.fields[badFielfs[0]];
    let rect = document.getElementById(id).getBoundingClientRect();
    window.scrollTo({ top: rect.top, left: rect.left, behavior: 'smooth' });
    return {id, text};
  }
  return service;
}


const ddt = detect();
export default ddt;
