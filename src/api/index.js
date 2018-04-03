import config from './config';
import axios from 'axios';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory';
import { NativeModules } from 'react-native'


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

getPvrBookList = () => {
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.getPvrBookListInJson((error, events) => {
            if (error)
                reject(error)
            else {
                resolve(JSON.parse(events[0]))
            }
        })
    })
}

getSTBChannel = () => {
    return new Promise((resolve, reject) => {
        resolve([
            {
                "favorite" : 0,
                "satelliteID" : 1,
                "scrambled" : 0,
                "transportStreamID" : 1,
                "serviceID" : 100,
                "orginalNetworkID" : 1,
                "invisible" : 0,
                "removed" : 0,
                "carrierID" : 1025,
                "serviceType" : 1,
                "lCN" : 1,
                "transponderIndex" : 1,
                "hDLCN" : 0,
                "serviceName" : "MOSAIC",
                "locked" : 0,
                "reserved" : 0
            },
            {
                "favorite" : 0,
                "satelliteID" : 1,
                "scrambled" : 0,
                "transportStreamID" : 1,
                "serviceID" : 200,
                "orginalNetworkID" : 1,
                "invisible" : 0,
                "removed" : 0,
                "carrierID" : 1025,
                "serviceType" : 1,
                "lCN" : 2,
                "transponderIndex" : 1,
                "hDLCN" : 0,
                "serviceName" : "France 24 (in English)",
                "locked" : 0,
                "reserved" : 0
            },
            {
                "favorite" : 0,
                "satelliteID" : 1,
                "scrambled" : 0,
                "transportStreamID" : 1,
                "serviceID" : 300,
                "orginalNetworkID" : 1,
                "invisible" : 0,
                "removed" : 0,
                "carrierID" : 1025,
                "serviceType" : 1,
                "lCN" : 3,
                "transponderIndex" : 1,
                "hDLCN" : 0,
                "serviceName" : "Orange",
                "locked" : 0,
                "reserved" : 0
            },
            {
                "favorite" : 0,
                "satelliteID" : 1,
                "scrambled" : 0,
                "transportStreamID" : 1,
                "serviceID" : 310,
                "orginalNetworkID" : 1,
                "invisible" : 0,
                "removed" : 0,
                "carrierID" : 1025,
                "serviceType" : 1,
                "lCN" : 4,
                "transponderIndex" : 1,
                "hDLCN" : 0,
                "serviceName" : "DisneyXD",
                "locked" : 0,
                "reserved" : 0
            },
            {
                "favorite" : 0,
                "satelliteID" : 1,
                "scrambled" : 0,
                "transportStreamID" : 1,
                "serviceID" : 400,
                "orginalNetworkID" : 1,
                "invisible" : 0,
                "removed" : 0,
                "carrierID" : 1025,
                "serviceType" : 1,
                "lCN" : 5,
                "transponderIndex" : 1,
                "hDLCN" : 0,
                "serviceName" : "UTVSTAR",
                "locked" : 0,
                "reserved" : 0
            },
            {
                "favorite" : 0,
                "satelliteID" : 1,
                "scrambled" : 0,
                "transportStreamID" : 1,
                "serviceID" : 500,
                "orginalNetworkID" : 1,
                "invisible" : 0,
                "removed" : 0,
                "carrierID" : 1025,
                "serviceType" : 1,
                "lCN" : 6,
                "transponderIndex" : 1,
                "hDLCN" : 0,
                "serviceName" : "Nickelodeon",
                "locked" : 0,
                "reserved" : 0
            },
            {
                "favorite" : 0,
                "satelliteID" : 1,
                "scrambled" : 0,
                "transportStreamID" : 1,
                "serviceID" : 600,
                "orginalNetworkID" : 1,
                "invisible" : 0,
                "removed" : 0,
                "carrierID" : 1025,
                "serviceType" : 1,
                "lCN" : 7,
                "transponderIndex" : 1,
                "hDLCN" : 0,
                "serviceName" : "Music India",
                "locked" : 0,
                "reserved" : 0
            },
            {
                "favorite" : 0,
                "satelliteID" : 1,
                "scrambled" : 0,
                "transportStreamID" : 1,
                "serviceID" : 800,
                "orginalNetworkID" : 1,
                "invisible" : 0,
                "removed" : 0,
                "carrierID" : 1025,
                "serviceType" : 1,
                "lCN" : 8,
                "transponderIndex" : 1,
                "hDLCN" : 0,
                "serviceName" : "Disney Channel",
                "locked" : 0,
                "reserved" : 0
            },
            {
                "favorite" : 0,
                "satelliteID" : 1,
                "scrambled" : 0,
                "transportStreamID" : 1,
                "serviceID" : 900,
                "orginalNetworkID" : 1,
                "invisible" : 0,
                "removed" : 0,
                "carrierID" : 1025,
                "serviceType" : 1,
                "lCN" : 9,
                "transponderIndex" : 1,
                "hDLCN" : 0,
                "serviceName" : "Fox Family Movies",
                "locked" : 0,
                "reserved" : 0
            }
        ]);

        // NativeModules.STBManager.getZapServiceListInJson((error, events) => {
        //     if (error) {
        //         reject(error);
        //     } else {
        //         resolve(JSON.parse(events[0]))
        //     }
        // });
    });
};

export const getBookList = () => {
    let bookList = null;
    return getPvrBookList()
      .then((value) => {
          console.log(value)
      })
}

export const getChannel = (limit) => {
    var zapList = null;
    return getSTBChannel()
      .then((value) => {
          zapList = value;
          var serviceIDs = []
          for (var i = 0; i< value.length; i++) {
              serviceIDs.push(value[i].serviceID);
          }
          return client.query({
              query: config.queries.CHANNEL,
              variables:  {serviceIDs: serviceIDs}
          })
      })
      .then((response) =>{
          var images = {};
          var shortTitles = {}
          let data = response.data.viewer.channelMany;
          for (var i = 0; i< data.length; i++) {
              if (data[i].originalImages != null && data[i].originalImages.length > 0) {
                  images[data[i].serviceId] = data[i].originalImages[0].url;
              }
              shortTitles[data[i].serviceId] = data[i].shortDescription;

          }
          for (var i = 0; i< zapList.length; i++) {
              zapList[i].image = images[zapList[i].serviceID];
              zapList[i].shortDescription = shortTitles[zapList[i].serviceID];
          }
          return new Promise((resolve,reject) => {
              resolve(zapList);
          });
      });
};

export const getBanner = () => {
    return client.query({
        query: config.queries.BANNER
    });
};

export const getAds = () => {
    return client.query({
        query: config.queries.ADS
    });
};

export const getLive = (currentTime) => {
    return client.query({
        query: config.queries.LIVE,
        variables:  {currentTime: currentTime}
    });
};
export const getVOD = (page, itemPerPage) => {
    return client.query({
        query: config.queries.VOD,
        variables:  {page: page, perPage: itemPerPage}
    });
};

export const getCategory = () => {
    return client.query({
        query: config.queries.CATEGORY
    });
};

export const getNews = () => {
    return client.query({
        query: config.queries.NEWS
    });
};

export const getEpgs = (channelId) => {
  return client.query({
    query: config.queries.EPG,
    variables: {channelId: channelId}
  })
}

