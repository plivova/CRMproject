import axios from "axios";

export const apiInstance = axios.create({
    baseURL: 'https://localhost:7216/api',
    timeout: 5000,
});