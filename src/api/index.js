import config from './config';
import axios from 'axios';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error'
import {InMemoryCache} from 'apollo-cache-inmemory';
import {NativeModules, Platform} from 'react-native'
import _ from 'lodash';


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

getRecordPvrList = () => {
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.getPvrListInJson((error, events) => {
            if (error) reject(error)
            else resolve(JSON.parse(events[0]))
        })
    })
}

getSTBChannel = () => {
    return new Promise((resolve, reject) => {
        // resolve([
        //     {
        //         "favorite" : 0,
        //         "satelliteID" : 1,
        //         "scrambled" : 0,
        //         "transportStreamID" : 1,
        //         "serviceID" : 100,
        //         "orginalNetworkID" : 1,
        //         "invisible" : 0,
        //         "removed" : 0,
        //         "carrierID" : 1025,
        //         "serviceType" : 1,
        //         "lCN" : 1,
        //         "transponderIndex" : 1,
        //         "hDLCN" : 0,
        //         "serviceName" : "MOSAIC",
        //         "locked" : 0,
        //         "reserved" : 0
        //     },
        //     {
        //         "favorite" : 0,
        //         "satelliteID" : 1,
        //         "scrambled" : 0,
        //         "transportStreamID" : 1,
        //         "serviceID" : 200,
        //         "orginalNetworkID" : 1,
        //         "invisible" : 0,
        //         "removed" : 0,
        //         "carrierID" : 1025,
        //         "serviceType" : 1,
        //         "lCN" : 2,
        //         "transponderIndex" : 1,
        //         "hDLCN" : 0,
        //         "serviceName" : "France 24 (in English)",
        //         "locked" : 0,
        //         "reserved" : 0
        //     },
        //     {
        //         "favorite" : 0,
        //         "satelliteID" : 1,
        //         "scrambled" : 0,
        //         "transportStreamID" : 1,
        //         "serviceID" : 300,
        //         "orginalNetworkID" : 1,
        //         "invisible" : 0,
        //         "removed" : 0,
        //         "carrierID" : 1025,
        //         "serviceType" : 1,
        //         "lCN" : 3,
        //         "transponderIndex" : 1,
        //         "hDLCN" : 0,
        //         "serviceName" : "Orange",
        //         "locked" : 0,
        //         "reserved" : 0
        //     },
        //     {
        //         "favorite" : 0,
        //         "satelliteID" : 1,
        //         "scrambled" : 0,
        //         "transportStreamID" : 1,
        //         "serviceID" : 310,
        //         "orginalNetworkID" : 1,
        //         "invisible" : 0,
        //         "removed" : 0,
        //         "carrierID" : 1025,
        //         "serviceType" : 1,
        //         "lCN" : 4,
        //         "transponderIndex" : 1,
        //         "hDLCN" : 0,
        //         "serviceName" : "DisneyXD",
        //         "locked" : 0,
        //         "reserved" : 0
        //     },
        //     {
        //         "favorite" : 0,
        //         "satelliteID" : 1,
        //         "scrambled" : 0,
        //         "transportStreamID" : 1,
        //         "serviceID" : 400,
        //         "orginalNetworkID" : 1,
        //         "invisible" : 0,
        //         "removed" : 0,
        //         "carrierID" : 1025,
        //         "serviceType" : 1,
        //         "lCN" : 5,
        //         "transponderIndex" : 1,
        //         "hDLCN" : 0,
        //         "serviceName" : "UTVSTAR",
        //         "locked" : 0,
        //         "reserved" : 0
        //     },
        //     {
        //         "favorite" : 0,
        //         "satelliteID" : 1,
        //         "scrambled" : 0,
        //         "transportStreamID" : 1,
        //         "serviceID" : 500,
        //         "orginalNetworkID" : 1,
        //         "invisible" : 0,
        //         "removed" : 0,
        //         "carrierID" : 1025,
        //         "serviceType" : 1,
        //         "lCN" : 6,
        //         "transponderIndex" : 1,
        //         "hDLCN" : 0,
        //         "serviceName" : "Nickelodeon",
        //         "locked" : 0,
        //         "reserved" : 0
        //     },
        //     {
        //         "favorite" : 0,
        //         "satelliteID" : 1,
        //         "scrambled" : 0,
        //         "transportStreamID" : 1,
        //         "serviceID" : 600,
        //         "orginalNetworkID" : 1,
        //         "invisible" : 0,
        //         "removed" : 0,
        //         "carrierID" : 1025,
        //         "serviceType" : 1,
        //         "lCN" : 7,
        //         "transponderIndex" : 1,
        //         "hDLCN" : 0,
        //         "serviceName" : "Music India",
        //         "locked" : 0,
        //         "reserved" : 0
        //     },
        //     {
        //         "favorite" : 0,
        //         "satelliteID" : 1,
        //         "scrambled" : 0,
        //         "transportStreamID" : 1,
        //         "serviceID" : 800,
        //         "orginalNetworkID" : 1,
        //         "invisible" : 0,
        //         "removed" : 0,
        //         "carrierID" : 1025,
        //         "serviceType" : 1,
        //         "lCN" : 8,
        //         "transponderIndex" : 1,
        //         "hDLCN" : 0,
        //         "serviceName" : "Disney Channel",
        //         "locked" : 0,
        //         "reserved" : 0
        //     },
        //     {
        //         "favorite" : 0,
        //         "satelliteID" : 1,
        //         "scrambled" : 0,
        //         "transportStreamID" : 1,
        //         "serviceID" : 900,
        //         "orginalNetworkID" : 1,
        //         "invisible" : 0,
        //         "removed" : 0,
        //         "carrierID" : 1025,
        //         "serviceType" : 1,
        //         "lCN" : 9,
        //         "transponderIndex" : 1,
        //         "hDLCN" : 0,
        //         "serviceName" : "Fox Family Movies",
        //         "locked" : 0,
        //         "reserved" : 0
        //     }
        // ]);

        NativeModules.STBManager.isConnect((connectString)=>{
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getZapServiceListInJson((error, events) => {
                    if (error) {
                        reject(error);
                    } else {
                        syncUserKitWithSTBChannels(JSON.parse(events[0])).then((values)=>{
                            resolve(values);
                        }).catch((e)=>{
                            resolve(JSON.parse(events[0]));
                        });
                    }
                });
            } else {
                NativeModules.RNUserKit.getProperty("favorite_channels", (error, result)=> {
                    if (error) {
                        reject(error);
                    } else {
                        let jsonObj = JSON.parse(result[0]);
                        resolve(jsonObj.data);
                    }
                });
            }
        });

    });
};

syncUserKitWithSTBChannels = (channels)=> {
    return new Promise((resolve, reject)=> {
        NativeModules.RNUserKit.getProperty("favorite_channels", (error, result)=> {
            if (error) {
                reject(error);
            } else {
                let jsonObj = JSON.parse(result[0]);
                if (jsonObj.data != null) {
                    var userKitResult = new Array(0);
                    for(let i = 0; i< channels.length; i++) {
                        let foundObj = jsonObj.data.find((element)=> element.serviceID == channels[i].serviceID);
                        let element = channels[i];
                        if (foundObj != null) {
                            element.favorite = foundObj.favorite;
                        }
                        userKitResult.push(element);
                    }
                    NativeModules.RNUserKit.storeProperty("favorite_channels", {data: userKitResult}, (e, r)=>{});
                    resolve(userKitResult);
                } else {
                    NativeModules.RNUserKit.storeProperty("favorite_channels", {data: channels}, (e, r)=>{});
                    reject({error_message: "Cannot found property"});
                }
            }
        });
    });
};

export const checkStbConnection = () => {
  return new Promise((resolve, reject) => {
    NativeModules.STBManager.isStbConnected((error, events) => {
      if (error) reject(error)
      else resolve(events)
    })
  })
};

export const getRecordList = () => {
    let recordList = null
      return getRecordPvrList()
        .then((value) => {
          return new Promise((resolve, reject) => {
            resolve(value)
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
          zapList = _.cloneDeep(value);
          var serviceIDs = [];
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
};


// Settings screen

// Audio language
export const getAudioLanguage = () => {
    return new Promise((resolve, reject)=> {
        NativeModules.STBManager.isConnect((connectString)=>{
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getPreferAudioLanguageInJson((error, results)=> {
                    let audioLanguage = JSON.parse(results[0]).audioLanguageCode;
                    resolve(audioLanguage);
                });
            } else {
                reject({errorMessage: "No STB connection"});
            }
        });
    });
};

// Subtitles
export const getSubtitles = () => {
    return new Promise((resolve, reject)=> {
        NativeModules.STBManager.isConnect((connectString)=>{
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getPreferSubtitleLanguageInJson((error, results)=> {
                    let subLanguage = JSON.parse(results[0]).subtitleLanguageCode;
                    resolve(subLanguage);
                });
            } else {
                reject({errorMessage: "No STB connection"});
            }
        });
    });
};

// Resolution
export const getResolution = () => {
    return new Promise((resolve, reject)=> {
        NativeModules.STBManager.isConnect((connectString)=>{
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getResolutionInJson((error, results)=> {
                    let resolution = JSON.parse(results[0]).resolution;
                    resolve(resolution);
                });
            } else {
                reject({errorMessage: "No STB connection"});
            }
        });
    });
};

export const getVideoFormat = () => {
    return new Promise((resolve, reject)=> {
        NativeModules.STBManager.isConnect((connectString)=>{
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getAspectRatioInJson((error, results)=> {
                    let aspectRatio = JSON.parse(results[0]).aspectRatio;
                    resolve(aspectRatio);
                });
            } else {
                reject({errorMessage: "No STB connection"});
            }
        });
    });
};

export const getSettings = () => {
    let languageFull = ["English", "French", "Spanish", "Italian", "Chinese", "Off"];
    let languageShort = ["eng", "fre", "spa", "ita", "chi", "000"];
    let resolutions = ["1080P","1080I","720P","576P","576I"];
    let aspectRatio = ["4:3 Letter Box","4:3 Center Cut Out","4:3 Extended","16:9 Pillar Box","16:9 Full Screen","16:9 Extended"];
    return new Promise((resolve, reject) => {
        Promise.all([getAudioLanguage(), getSubtitles(), getResolution(), getVideoFormat()]).then((values)=> {
            // Audio lang
            let indexLang = languageShort.indexOf(values[0]);
            if (indexLang == -1) {
                indexLang = 0;
            }
            let audioLanguage = languageFull[indexLang];

            // Subtitles lang
            indexLang = languageShort.indexOf(values[1]);
            if (indexLang == -1) {
                indexLang = 0;
            }
            let subLanguage = languageFull[indexLang];

            // Resolution
            let resolution = resolutions[values[2]];

            // Video format
            let ratio = aspectRatio[values[3]];

            resolve({
                AudioLanguage: audioLanguage,
                Subtitles: subLanguage,
                Resolution: resolution,
                VideoFormat: ratio
            });
        }).catch((error)=> {
            reject(error);
        })
    });
};

