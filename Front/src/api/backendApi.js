import axios from "axios";

const backendApi = axios.create({
    baseURL: 'http://localhost:3000/api/v1' // ✅ este puerto y este prefijo
});

backendApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default backendApi;
