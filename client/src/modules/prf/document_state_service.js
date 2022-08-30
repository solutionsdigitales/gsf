import PrototypeApiService from '../../service/httpService'
import constants from '../../service/constant';
function DocStateService() {
  const baseUrl = '/document_states';
  const service = new PrototypeApiService(baseUrl);


  service.getState = (params) => {
    const pending = constants.DOCUMENT_STATUS.PENDING;
    const approved = constants.DOCUMENT_STATUS.APPROVED;
    const resultDocStatus = params.documentStateId;

    let privilegedUser = false;
    if(!params.clone && params.currentEmployee.uuid !== params.documentMaker && approved === resultDocStatus) {
      if(
        [
          constants.EMPLOYEE_CATEGORY.PROCUREMENT,
          constants.EMPLOYEE_CATEGORY.FINANCE
          ].includes(
        
        params.currentEmployee.category_id )) {
          privilegedUser = true;
        }
    }
        
    const _state =
      params.prfStatusList.filter((st) => {
        const id = privilegedUser ?  
          resultDocStatus : (params.clone ? pending : resultDocStatus);
        return st.id === id;
      })[0] || {};
      
    return {
      state : _state,
      privilegedUser
    };
  }
  return service;
}

const docState = DocStateService();
export default docState;
