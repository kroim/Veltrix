const axios = require('axios');

const API_BASE_URL = (process.env.NODE_ENV === 'production'? '/api':'http://localhost:4000/api');

export const postCall = (data, successCallback, failCallback = null) => {
    let token = localStorage.getItem('token');
    let headers = { 'Content-Type': 'application/graphql' };
    if(token){
        headers['x-access-token'] = token;
    }
    console.log('postCall ', data, headers);
    axios.post(
        `${API_BASE_URL}`,
        data,
        {
            headers: headers
        }
    ).then((result) => {
        console.log('postCall Success :', result.data.data);
        successCallback(result.data.data);
    }).catch((error) => {
        console.log('postCall Failed', error);
        if(failCallback) {
            failCallback(error);
        }
    })
}

export const getCall = (data, successCallback, failCallback = null) => {
    let token = localStorage.getItem('token');
    let headers = { 'Content-Type': 'application/graphql' };
    if(token){
        headers['x-access-token'] = token;
    }
    axios({
        url: `${API_BASE_URL}?query=${data}`,
        mothod: 'GET',
        headers: headers
    }).then((result) => {
        console.log('getCall Success :', result.data.data);
        successCallback(result.data.data);
    }).catch((error) => {
        console.log('gettCall Failed', error);
        if(failCallback) {
            failCallback(error);
        }
    })
}