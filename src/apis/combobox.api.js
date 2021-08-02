import http from '../services/request'

export const getCombobox = params => http.get('/system/combobox/search', params);