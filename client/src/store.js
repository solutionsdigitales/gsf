
import { createStore } from 'vuex'
import AppCache from "./service/appCache";

export default createStore({
  state: {
    server: process.env.NODE_ENV === 'production' ? '/' : `http://localhost:${import.meta.env.VITE_APP_API_PORT}/`,
    session: AppCache.get('session'),
    enterprise : AppCache.get('enterprise'),
    order: {
      items : []
    },
    selectedCustomer : null,
    currencies : [],
    orderTotal: 1,
    translate: {
      'fr': {}
    },
  },
  mutations: {
    updateCurrencies(state, currencies) {
      state.currencies = currencies;
      AppCache.set('currencies', currencies);
    },
    updateSession(state, newObject) {
      state.session = newObject;
      AppCache.set('session', newObject);
    },
    updateEnterprise(state, newObject) {
      state.enterprise = newObject;
      AppCache.set('enterprise', newObject);
    },
  }
});
