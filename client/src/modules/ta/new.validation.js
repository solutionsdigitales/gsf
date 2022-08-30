function detect() {
  const service = {};

  service.fields = {
    paymentMethod: {
      id: "paymentMethod",
      text: "FORM.LABELS.PAYMENT_METHOD"
    },
    account_to_credit : {
      id: "account_to_credit",
      text: "VOUCHERS.ACCOUNT_TO_CREDIT"
    },
    approvers : {
      id : 'approvers',
      text: 'PRF.BUDGET_HOLDER_NAME'
    },
    delivery_expected_date: {
      id: "delivery_expected_date",
      text: "PRF.EXPECTED_DATE"
    },
    
    delivery_recipient: {
      id: "delivery_recipient",
      text: "PRF.RECIPIENT"
    },
    destinations : {
      id : 'destinations',
      text: 'TRAVAL_ADVANCE.DESTINATIONS'
    },
    itinerary : {
      id : 'itinerary',
      text: 'TRAVAL_ADVANCE.ITINERARY'
    },
    
    object : {
      id : 'object',
      text: 'TRAVAL_ADVANCE.OBJECT'
    },

    dateFrom : {
      id : 'dateFrom',
      text: 'TRAVAL_ADVANCE.DATES'
    },
    transport_mean : {
      id : 'transport_mean',
      text : 'PRF.TRANSPORT_MEAN'
    },
    dateTo : {
      id : 'dateTo',
      text: 'TRAVAL_ADVANCE.DATES'
    },
    
    ticket_budget_line_grid : {
      id : "ticket_budget_line_grid",
      text : "TRAVAL_ADVANCE.PLANE_TICKET"
    },
    perdiem_budget_line_grid : {
      id : "perdiem_budget_line_grid",
      text : "VOUCHERS.PERDIEM"
    },
    hosting_budget_line_grid : {
      id : "hosting_budget_line_grid",
      text : "VOUCHERS.HOSTING"
    },
    expense_budget_line_grid : {
      id : "expense_budget_line_grid",
      text : "TRAVAL_ADVANCE.OTHER_EXPENSES"
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

  service.check = (key, value) => {
    if (service.fields[key]) {
      service.fields[key].error = value;
      return !!value;
    }
    return true;
  };
   
  service.init = () => {
    Object.keys(service.fields).forEach(k => {
      delete service.fields[k].error;
    });
  }
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
