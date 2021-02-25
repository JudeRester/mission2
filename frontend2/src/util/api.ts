import axios from 'axios'


const isProduction = process.env.NODE_ENV === 'production';
export const BASE_API_URL = isProduction
    ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`
    : 'http://localhost:8080/api';
let errorCount = 0;
const instance = axios.create({
    baseURL: BASE_API_URL,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});
instance.interceptors.response.use(
    function (response) {

        return response;
    },
    function (error) {
        if (error.config && error.response && error.response.status === 401 && errorCount===0) {
            errorCount++
            console.log(error.config)
            return instance.request(error.config);
        }else{
            errorCount=0
            return Promise.reject(error);
        }
    });
export default instance;