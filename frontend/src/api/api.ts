import axios from 'axios';
import { config } from '../config/config';

const { BASE_URL } = config;

export const ApiInstance = axios.create({ baseURL: BASE_URL });

ApiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config
})