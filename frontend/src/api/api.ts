import axios from 'axios';
import { config } from '../config/config';

const { BASE_URL } = config;

const AxiosInstance = axios.create({ baseURL: BASE_URL });

AxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config
})