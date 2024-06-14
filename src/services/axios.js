import axios from 'axios';
import cookies from 'js-cookie';
import router from '../router/router';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

instance.interceptors.request.use(config => {
    const currentRoute = router.currentRoute.value;

    const csrftoken = cookies.get('csrftoken');
    if (csrftoken) {
        config.headers['X-CSRFToken'] = csrftoken;
    }

    const accessToken = cookies.get('accessToken');
    const passwordToken = cookies.get('passwordToken');

    if (currentRoute.path.includes('redefinir-senha')) {
        if (passwordToken) {
            config.headers['Authorization'] = `Bearer ${passwordToken}`;
        }
    } else {
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }

    return config;
}, error => {
    return Promise.reject(error);
});

export default instance;