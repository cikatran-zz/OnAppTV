import config from './config';
import axios from 'axios';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';


const instance = axios.create({
  baseURL: `${config.baseURL}`
});

const httpLink = new HttpLink({uri: `http://13.250.57.10:3000/graphql`})

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


const channelQuery = gql`
query allChannels($page: Int){
  viewer {
    channelPagination(page: $page) {
      count
      data: items {
        contentId
        originalImage
        title
        longDescription
        shortDescription
        thumbnails {
          url
          name
        }
      }
    } 
   }
}`

export const getChannel = () => {
  return client.query({
    query: channelQuery,
    variables: {page: 1}
  });
};

export const getBanner = () => {
  return get(config.endpoints.BANNER);
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


