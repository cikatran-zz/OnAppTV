import config from './config';
import axios from 'axios';

const instance = axios.create({
    baseURL: `${config.baseURL}`
});

const get = (endpoints) => {
    return instance.get(`${endpoints}`)
        .then((response) => {
            switch (response.status) {
                case 403:
                    return {error: {message: 'Invalid token'}, kickOut: true};
                case 404:
                    return {error: {message: 'Cannot connect to server'}};
                default:
                    return response;
            }
        })
        .catch((err) => {
            throw err;
        });
};


export const getBanner = () => {
    return get(config.endpoints.BANNER);
};
export const getChannel = () => {
    return get(config.endpoints.CHANNEL);
};
export const getLive = () => {
  return get(config.endpoints.LIVE);
};
export const getVOD = () => {
  return get(config.endpoints.VOD);
};

export const getCategory = () => {
    return get(config.endpoints.CATEGORY);
};


