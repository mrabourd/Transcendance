export const USER_STATUS = {
    OFFLINE : 0,
    ONLINE : 1,
    PLAYING : 2,
    WAITING_PLAYER : 3,
    WAITING_FRIEND : 4,
    WAITING_TOURNAMENT : 5
}

/*
let tpl_url = '/get_env';
let response = await fetch(tpl_url);
let JSONResponse = await response.json();
console.log("resut", JSONResponse['BACK_URL'])
const env = {};
env['BACK_URL'] = JSONResponse['BACK_URL'];
env['FRONT_URL'] = JSONResponse['FRONT_URL'];
export default env
*/