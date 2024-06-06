import axios from 'axios';
import cookies from 'js-cookie';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

instance.interceptors.request.use(config => {
    const csrftoken = cookies.get('csrftoken');
    config.headers['X-CSRFToken'] = csrftoken;
    return config;
}, error => {
    return Promise.reject(error);
});

export default instance;