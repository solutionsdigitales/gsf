import PrototypeApiService from '../../service/httpService'


/**
 * Account Service
 *
 * A service wrapper for the /roles HTTP endpoint.
 */
function PricingService () {
    return new PrototypeApiService('/pricing');
}

const rs =  PricingService();
export default rs; 
