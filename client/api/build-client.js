import axios from 'axios';

export default ({req}) => {
    if (typeof window === 'undefined') {
        //we are on the server
        return axios.create({
            baseURL: 'http://my-release-ingress-nginx-controller',
            headers: req.headers
        })
    } else {
        //we are on the client
        return axios.create({
            baseURL: '/'
        })
    }
}