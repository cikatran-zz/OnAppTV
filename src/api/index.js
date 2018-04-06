import config from './config';
import axios from 'axios';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error'
import {InMemoryCache} from 'apollo-cache-inmemory';
import {NativeModules, Platform} from 'react-native'


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

export const checkStbConnection = () => {
  return new Promise((resolve, reject) => {
    NativeModules.STBManager.isStbConnected((error, events) => {
      if (error) reject(error)
      else resolve(events)
    })
  })
}

export const getBookList = () => {
    let bookList = null;
    if (Platform.OS !== 'ios') {
      return checkStbConnection()
        .then((value) => {
          return getPvrBookList(value[0])
        })
        .then(value => {
          return new Promise((resolve, reject) => {
            resolve(value)
          })
        })
    }
    else {
      return getPvrBookList(false)
        .then(value => {
          return new Promise((resolve, reject) => {
            resolve(value)
          })
        })
    }
}

export const getPvrBookList = (isConnected) => {
    return new Promise((resolve, reject) => {
      if (!isConnected) {
        resolve([
          {
            "record":
              {
                "startTime": "1970-01-01 08:00:00",
                "recordMode": 1,
                "recordName": "Test1",
                "lCN": 1,
                "duration": 100
              },
            "metaData":
              {
                "endtime": "22:45",
                "starttime": "20:00",
                "title": "Pearl Harbor",
                "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Vintage_Car_Museum_%26_Event_Center_May_2017_21_%281940_LaSalle_taxi_from_Pearl_Harbor%29.jpg/1280px-Vintage_Car_Museum_%26_Event_Center_May_2017_21_%281940_LaSalle_taxi_from_Pearl_Harbor%29.jpg",
                "subTitle": "Movie"
              }
          },
          {
            "record":
              {
                "startTime": "1970-01-01 08:00:00",
                "recordMode": 1,
                "recordName": "Test2",
                "lCN": 2,
                "duration": 100
              },
            "metaData":
              {
                "endtime": "23:45",
                "starttime": "22:45",
                "title": "Pearl Harbor",
                "image": "http://baoquocte.vn/stores/news_dataimages/quangchinh/122016/06/15/155125_t1.jpg",
                "subTitle": "Movie"
              }
          },
          {
            "record":
              {
                "startTime": "1970-01-01 08:00:00",
                "recordMode": 1,
                "recordName": "Titanic",
                "lCN": 3,
                "duration": 100
              },
            "metaData":
              {
                "endtime": "23:45",
                "starttime": "22:45",
                "title": "Titanic",
                "image": "http://baoquocte.vn/stores/news_dataimages/quangchinh/122016/06/15/155125_t1.jpg",
                "subTitle": "Movie"
              }
          },
          {
            "record":
              {
                "startTime": "1970-01-01 08:00:00",
                "recordMode": 1,
                "recordName": "The Lastman Standing",
                "lCN": 4,
                "duration": 100
              },
            "metaData":
              {
                "endtime": "23:45",
                "starttime": "22:45",
                "title": "The Lastman Standing",
                "image": "http://baoquocte.vn/stores/news_dataimages/quangchinh/122016/06/15/155125_t1.jpg",
                "subTitle": "Movie"
              }
          }
        ]);
      }
      else {
         NativeModules.STBManager.getPvrBookListInJson((error, events) => {
           console.log('getPvrBookListInJson')
           console.log(error)
           console.log(events)
           if (error)
             reject(error)
           else {
             resolve(JSON.parse(events[0]))
           }
         })
       }
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
    }).then((response)=>{
        return new Promise((resolve,reject) => {
            NativeModules.RNUserKit.getProperty("favorite_categories", (error, results) => {
                if (error) {
                    reject(JSON.parse(error));
                } else {
                    var categories = response.data.viewer.genreMany;
                    var favoriteCategories = JSON.parse(results[0]);
                    console.log(favoriteCategories);
                    var categoriesResults=[];
                    for (var i = 0; i< categories.length; i++) {
                        var name = categories[i].name;
                        categoriesResults.push({id:categories[i]._id, name: name,favorite:(favoriteCategories[name] == null) ? false : favoriteCategories[name]});
                    }
                    resolve(categoriesResults);
                }
            });
        });
    });
};

export const getNews = () => {
    return client.query({
        query: config.queries.NEWS
    });
};

export const getEpgs = (serviceId) => {
  console.log(serviceId)
  return client.query({
    query: config.queries.EPG,
    variables: {id: serviceId}
  })
};

export const getGenresContent = (genresIds) => {
    var promises = [];

    genresIds.forEach((genresId)=> {
        promises.push(client.query({
            query: config.queries.GENRES_VOD,
            variables: {genresId: [genresId]}
        }));
    });

    promises.push(client.query({
        query: config.queries.GENRES_EPG,
        variables: {genresId: genresIds, currentTime: new Date()}
    }));

    return new Promise((resolve, reject) => {
        Promise.all(promises).then((values)=> {
            var results = {};
            for (var i=0; i<values.length-1; i++) {
                results[genresIds[i]] = {features: [], VOD: [], EPGs: []};
                values[i].data.viewer.videoMany.forEach((content)=>{
                    if (content.feature) {
                        results[genresIds[i]].features.push(content)
                    } else {
                        results[genresIds[i]].VOD.push(content)
                    }
                });
            }

            // Get EPGs
            values[values.length-1].data.viewer.epgMany.forEach((epg)=> {
                console.log(epg);
                epg.genreIds.forEach((genre)=> {
                    if (genresIds.indexOf(genre) > -1) {
                        results[genre].EPGs.push(epg);
                    }
                });
            });
            resolve(results);
        }).catch((error)=>{
            reject(error)
        });
    });
};

export const getEpgWithGenres = (genresIds) => {
  console.log(genresIds)
  return client.query({
    query: config.queries.EPG_WITH_GENRES,
    variables: {genreIds: genresIds}
  })
}

export const getEpgWithSeriesId = (seriesId) => {
  return client.query({
    query: config.queries.EPG_WITH_SERIES,
    variables: {id: seriesId}
  })
}

