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
export const addNewTags = data => API.get(`/api/add_tag?tag_name=${data.tagName}`);
export const addImageTag = data => API.get(`/api/add_img_tag?img_id=${data.imgId}&user_id=${data.userId}&tag_id=${data.tagId}`);
export const removeImageTag = data => API.get(`/api/remove_img_tag?img_id=${data.imgId}&user_id=${data.userId}&tag_id=${data.tagId}`);
export const getImageByTagId = data => API.get(`/api/get_img_by_tag?tag_id=${data.tagId}`);
export const getTagByImageId = data => API.get(`/api/get_tag_of_img?img_id=${data.imageId}`);
export const getUserFavorite = data => API.get(`/api/get_user_favorite?user_id=${data.userId}`);
export const upload = data => API.post(`/api/upload`, data.form);
export const changePwd = data => API.get(`/api/change_password?user_id=${data.userId}&password=${data.pwd}`);
