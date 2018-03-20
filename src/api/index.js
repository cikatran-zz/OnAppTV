import config from './config';
import axios from 'axios';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';


const instance = axios.create({
  serverURL: `${config.serverURL}`
});

const httpLink = new HttpLink({uri: config.serverURL})

const errorHandler = onError(({ networkError }) => {
  switch (networkError.statusCode) {
    case 404:
      return {error: {message: 'Cannot connect to server'}};
    default:
      return {error: {message: 'Unknown error'}};
  }
})

const client = new ApolloClient({
  link: errorHandler.concat(httpLink),
  cache: new InMemoryCache()
})

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

export const getChannel = (limit) => {
  return client.query({
     query: config.queries.CHANNEL,
     variables:  {limit: limit}
  });
};

export const getBanner = () => {
    return client.query({
        query: config.queries.BANNER
    });
};

export const getLive = () => {
  return get(config.queries.LIVE);
};
export const getVOD = () => {
  return get(config.queries.VOD);
};

export const getCategory = () => {
  return get(config.queries.CATEGORY);
};


