
import PrototypeApiService from './httpService'
import AppCache from "./appCache";

function CurrencyService() {
  const baseUrl = '/currencies';
  const service = new PrototypeApiService(baseUrl);
  
  service.format = (amount, currecnyId) => {
    if(typeof(amount) === 'undefined') return '';
    const currencies = AppCache.get('currencies') || []; 
    const currency = currencies.filter(c => c.id === currecnyId)[0] || {};
    const formatNumber = currency.intel_number_format || "en-US";
    const formatter = new Intl.NumberFormat(formatNumber, {
      style: "currency",
      currency: currency.format_key || "USD",
      minimumFractionDigits: 2,
    });
    return formatter.format(amount);
  }
  return service;
}

const crr = CurrencyService();
export default crr;
