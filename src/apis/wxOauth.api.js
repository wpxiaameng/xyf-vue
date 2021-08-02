import http from '../services/request'
// export const getOpenid = params => http.get('/wXAuthorizeController/wxCheck2', params);
export const getOpenid = params => http.get('/wXAuthorizeController/getOpenid', params);