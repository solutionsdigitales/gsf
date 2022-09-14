import PrototypeApiService from '../../service/httpService'


/**
 * Member Service
 *
 * A service wrapper for the /members HTTP endpoint.
 */
function MemberService () {
    return new PrototypeApiService('/members');
}

const rs =  MemberService();
export default rs;
