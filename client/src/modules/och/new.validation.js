function detect() {
  const service = {};

  service.fields = {
    ochBaseId: {
      id: "ochBaseId",
      text: "Base"
    },
  
    approvers : {
      id : 'approvers',
      text: 'PRF.BUDGET_HOLDER_NAME'
    },
    object : {
      id: "object",
      text: "VOUCHERS.OBJECT"
    },
    delivery_expected_date: {
      id: "delivery_expected_date",
      text: "VOUCHERS.PAYEMENT_DATE"
    },
    
    delivery_recipient: {
      id: "delivery_recipient",
      text: "PRF.RECIPIENT"
    },
    grid : {
      id : "budget_line_grid",
      text : "PRF.BUDGET_LINES_SECTION"
    },
    update_note: {
      id: "update_note",
      text: "PRF.UPDATE_NOTE"
    },
    usefulness : {
      id: "usefulness",
      text: "PRF.USEFULNESS"
    }
  };

  service.check = (key, value, errorObject = {}) => {
    if (service.fields[key]) {
      service.fields[key].error = value;
      const result =  !!value;
      if(!result) {
        delete errorObject[key];
      }else {
        errorObject[key] = true;
      }
      return result;
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
