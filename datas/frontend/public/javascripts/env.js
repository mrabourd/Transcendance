
let tpl_url = '/get_env';
let response = await fetch(tpl_url);
let JSONResponse = await response.json();
console.log("JSONResponse :", JSONResponse);


export const MY_ENV = {
    URL_BACK: JSONResponse['URL_BACK'],
    URL_FRONT: JSONResponse['URL_FRONT']
}
console.log("MY_ENV :", MY_ENV);
