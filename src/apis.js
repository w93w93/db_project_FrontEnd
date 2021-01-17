import axios from 'axios';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const API = axios.create({
    baseURL: 'http://localhost:3001'
})

export const login = data => API.get(`/api/login?username=${data.username}&password=${data.password}`);
export const getImages = () => API.get(`/api/images`);
export const search = data => API.get(`/api/search?user_id=${data.userId}&content=${data.content}`);
export const register = data => API.get(`/api/register?username=${data.username}&password=${data.password}`);
export const imgInfo = data => API.get(`/api/img_info/${data.imgId}?user_id=${data.userId}`);
export const changeFavorite = data => API.get(`/api/favorite?user_id=${data.userId}&img_id=${data.imgId}&on=${data.on}`);
export const changeLike = data => API.get(`/api/like?user_id=${data.userId}&img_id=${data.imgId}&on=${data.on}`);
export const rate = data => API.get(`/api/rate?user_id=${data.userId}&img_id=${data.imgId}&rate=${data.rate}`);
export const comment = data => API.get(`/api/comment?user_id=${data.userId}&img_id=${data.imgId}&content=${data.content}`);
export const getTags = () => API.get(`/api/get_tag`);