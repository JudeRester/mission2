import axios from 'axios'

const isProduction = process.env.NODE_ENV === 'production';
const BASE_API_URL = isProduction
    ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`
    : 'http://localhost:8080/api';
let token = sessionStorage.getItem("current_user_token");
const instance = axios.create({
    baseURL: BASE_API_URL,
    headers: {
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*'
    }
});

export default instance;