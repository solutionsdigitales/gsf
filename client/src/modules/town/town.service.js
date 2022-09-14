import PrototypeApiService from '../../service/httpService'

function TownService () {
    return new PrototypeApiService('/towns');
}

const rs =  TownService();
export default rs;
