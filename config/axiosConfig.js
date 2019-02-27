const apiConfig = require('./apiConfig')

const axiosConfig = (method, url, params = {}) => {
    params.key = apiConfig.apiKey

    let config = {
        url: url,
        method: method,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Methods': 'HEAD, GET, POST, OPTIONS, PUT, PATCH, DELETE',
        },
        responseType: 'json',
        params: params
    }

    return config
}

module.exports = axiosConfig
