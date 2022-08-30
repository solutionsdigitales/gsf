import PrototypeApiService from '../../service/httpService';

function UserService() {

  const baseUrl = '/users';
  const service = new PrototypeApiService(baseUrl);

  service.auth = (user) => {
    return service.post(`/log/in`, user);
  };

  service.logout = () => {
    return service.get(`/log/out`);
  };

  service.msauth = () => {
    return service.get(`/ms/auth`);
  };

  service.sessionStatus = () => {
    return service.get(`/sesssion/status`);
  };



  service.changeSelfPassword = (params) => {
    const url = '/changeSelfPassword';
    return service.post(url, params);
  };
  return service;
}

const a = UserService();
export default a; 