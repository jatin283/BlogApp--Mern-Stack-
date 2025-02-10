import axios from 'axios';
import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from '../constants/config';
import { getAccessToken, getType } from '../utils/common-utils';

const API_URL = 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        "content-type": "application/json"
    }

});

axiosInstance.interceptors.request.use(
    function (config) {
        if (config.TYPE.params) {
            config.params = config.TYPE.params;
        } else if (config.TYPE.query) {
            config.url = config.url + '/' + config.TYPE.query;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        // Stop global loader here
        console.log('Raw response:', response);
        return processResponse(response);
    },
    function (error) {
        // Stop global loader here
        console.log('Raw error:', error);
        return Promise.reject(ProcessError(error));
    }
)



////////////
// if success -> return {isSuccess: true, data:Object}
//if fail  -> return { isFailure: true, status: string, msg: string, code: int}
//////////
const processResponse = (response) => {
    console.log('Response:', response);
    if (response?.status === 200) {
        console.log('Response inside:', response);
        return { isSuccess: true, data: response.data };
    } else {
        return {
            isFailure: true,
            status: response?.status,
            msg: response?.msg,
            code: response?.code
        }
    }
}


////////////
// if success -> return {isSuccess: true, data:Object}
//if fail  -> return { isFailure: true, status: string, msg: string, code: int}
//////////
const ProcessError = async (error) => {
    console.log("ERROR: ", error);
    if (error.response) {
        // Request made and server responded with a status other
        //than falls out of the range 2.x.x
        console.log(error);
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.responseFailure,
            code: error.response.status
        }
    } else if (error.request) {
        // request made but no response was received
        console.log("ERROR IN REQUEST: ", error.toJSON());
        console.log(error);
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.requestFailure,
            code: ""
        }

    } else {
        // something happened in setting up request 
        //that trigges an error
        console.log("ERROR IN NETWORK: ", error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.networkError,
            code: ""
        }
    }
}


const API = {};

for (const [key, value] of Object.entries(SERVICE_URLS)) {
    API[key] = (body, showUploadProgress, showDownloadProgress) =>
        axiosInstance({
            method: value.method,
            url: value.url,
            data: value.method === 'DELETE' ? {} : body,
            responseType: value.responseType,
            headers: {
                authorization: getAccessToken()
            },
            TYPE: getType(value, body),
            onUploadProgress: function (progressEvent) {
                if (showUploadProgress) {
                    let percentageCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    showUploadProgress(percentageCompleted);
                }
            },
            onDownloadProgress: function (progressEvent) {
                if (showDownloadProgress) {
                    let percentageCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    showDownloadProgress(percentageCompleted);
                }
            }
        });
}

export { API };