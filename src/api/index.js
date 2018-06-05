import config from './config';
import axios from 'axios';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error'
import {InMemoryCache} from 'apollo-cache-inmemory';
import {NativeModules, Platform} from 'react-native'
import {getImageFromArray} from '../utils/images'
import _ from 'lodash';

const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiI1YWRlZWJkMTVmNGEwNTAwMWU5Nzg5ZDQiLCJpYXQiOjE1MjQ1NTg4MDF9.pOyAXvsRaN3dj_dU5luKjgNyULnN6pNlpBnxGcHax0M';

const instance = axios.create({
    serverURL: `${config.serverURL}`
});

const httpLink = new HttpLink({
    uri: config.serverURL,
    headers: {
        Authorization: AUTH_KEY}
});

const errorHandler = onError(({networkError}) => {
    console.log()
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
            if (error) reject(error);
            else resolve(JSON.parse(events[0]))
        })
    })
};

getSTBChannel = () => {
    return new Promise((resolve, reject) => {

        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getZapServiceListInJson((error, events) => {
                    if (error) {
                        reject(error);
                    } else {
                        syncUserKitWithSTBChannels(JSON.parse(events[0])).then((values) => {
                            resolve(values);
                        }).catch((e) => {
                            resolve(JSON.parse(events[0]));
                        });
                    }
                });
            } else {
                NativeModules.RNUserKit.getProperty("favorite_channels", (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        try {
                            let jsonObj = JSON.parse(result[0]);
                            resolve(jsonObj.data);
                        } catch(err) {
                            reject(err);
                        }
                    }
                });
            }
        });

    });
};

syncUserKitWithSTBChannels = (channels) => {
    return new Promise((resolve, reject) => {
        NativeModules.RNUserKit.getProperty("favorite_channels", (error, result) => {
            if (error) {
                reject(error);
            } else {
                let jsonObj = null;
                try {
                    jsonObj = JSON.parse(result[0]);
                } catch (err) {
                    reject(err);
                    return;
                }
                if (jsonObj.data != null) {
                    var userKitResult = new Array(0);
                    for (let i = 0; i < channels.length; i++) {
                        let foundObj = jsonObj.data.find((element) => element.serviceID == channels[i].serviceID);
                        let element = channels[i];
                        if (foundObj != null) {
                            element.favorite = foundObj.favorite;
                        }
                        userKitResult.push(element);
                    }
                    NativeModules.RNUserKit.storeProperty("favorite_channels", {data: userKitResult}, (e, r) => {
                    });
                    resolve(userKitResult);
                } else {
                    NativeModules.RNUserKit.storeProperty("favorite_channels", {data: channels}, (e, r) => {
                    });
                    reject({error_message: "Cannot found property"});
                }
            }
        });
    });
};

export const checkStbConnection = async () => {
    try {
        let {isSTBConnect} = await NativeModules.STBManager.isStbConnected();
        return isSTBConnect;
    } catch (e) {
        return false;
    }

};

export const getRecordList = () => {
    let recordList = null;
    return getRecordPvrList()
        .then((value) => {
            return new Promise((resolve, reject) => {
                resolve(value)
            })
        })
}

export const getBookList = () => {
    return getPvrBookList()
        .then(value => {
            return new Promise((resolve, reject) => {
                resolve(value)
            })
        })
}

export const getPvrBookList = () => {
    return new Promise((resolve, reject) => {
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
    })
}

export const getChannel = (limit) => {
    let zapList = null;
    return getSTBChannel()
        .then((value) => {
            if (value == undefined || value == null)
                value = [];
            zapList = _.cloneDeep(value);
            var serviceIDs = [];
            for (let i = 0; i < value.length; i++) {
                serviceIDs.push(value[i].serviceID);
            }
            return client.query({
                query: config.queries.CHANNEL,
                variables: {serviceIDs: serviceIDs}
            })
        })
        .then((response) => {
            let images = {};
            let shortTitles = {}
            let ids = {}
            let data = response.data.viewer.channelPagination.items;
            for (let i = 0; i < data.length; i++) {
                images[data[i].serviceId] = getImageFromArray(data[i].originalImages, "logo", "feature");
                shortTitles[data[i].serviceId] = data[i].shortDescription;
                ids[data[i].serviceId] = data[i]._id;
            }
            for (let i = 0; i < zapList.length; i++) {
                zapList[i].image = images[zapList[i].serviceID];
                zapList[i].shortDescription = shortTitles[zapList[i].serviceID];
                zapList[i].channelId = ids[zapList[i].serviceID];
            }
            return new Promise((resolve, reject) => {
                resolve(zapList);
            });
        });
};

export const getBanner = () => {
    return client.query({
        query: config.queries.BANNER
    });
};

export const getPlaylist = (playlist) => {
    return client.query({
        query: config.queries.PLAYLIST,
        variables: {playList: playlist}
    })
};

export const getAds = () => {
    return client.query({
        query: config.queries.ADS
    });
};

export const getLive = (currentTime, page, itemPerPage) => {
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                resolve(client.query({
                    query: config.queries.LIVESTB,
                    variables: {page: page, perPage: itemPerPage}
                }));
            } else {
                resolve(client.query({
                    query: config.queries.LIVENOSTB,
                    variables: {page: page, perPage: itemPerPage}
                }));
            }

        });
    });

};
export const getVOD = (page, itemPerPage) => {
    return client.query({
        query: config.queries.VOD,
        variables: {page: page, perPage: itemPerPage}
    });
};

export const getCategory = () => {
    return client.query({
        query: config.queries.CATEGORY
    }).then((response) => {
        return new Promise((resolve, reject) => {
            NativeModules.RNUserKit.getProperty("favorite_categories", (error, results) => {
                if (error) {
                    reject(JSON.parse(error));
                } else {
                    let categories = response.data.viewer.genreMany;
                    let favoriteCategories = JSON.parse(results[0]);
                    let categoriesResults = [];
                    for (let i = 0; i < categories.length; i++) {
                        let name = categories[i].name;
                        let originalImages = categories[i].originalImages;
                        categoriesResults.push({
                            id: categories[i]._id,
                            name: name,
                            favorite:  (favoriteCategories[name] == null) ? 0 : favoriteCategories[name],
                            originalImages: originalImages
                        });
                    }
                    resolve(categoriesResults);
                }
            });
        });
    })
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

export const getVODByGenres = (genresId, page, perPage) => {
    return client.query({
        query: config.queries.VOD_BY_GENRES,
        variables: {genresId: genresId, page: page, perPage: perPage}
    })
};

export const getEPGByGenres = (genresId, currentTime, limit, skip) => {
    return client.query({
        query: config.queries.GENRES_EPG,
        variables: {genresId: genresId, limit: limit, skip: skip, currentTime: currentTime}
    })
};

export const getGenresContent = (genresIds) => {
    let promises = [];

    genresIds.forEach((genresId) => {
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
        Promise.all(promises).then((values) => {
            let results = {};
            for (let i = 0; i < values.length - 1; i++) {
                results[genresIds[i]] = {features: [], VOD: [], EPGs: []};
                values[i].data.viewer.videoMany.forEach((content) => {
                    if (content.feature) {
                        if (results[genresIds[i]].features.length < 3) {
                            results[genresIds[i]].features.push(content)
                        }
                    } else {
                        results[genresIds[i]].VOD.push(content)
                    }
                });
            }

            // Get EPGs
            values[values.length - 1].data.viewer.epgMany.forEach((epg) => {
                console.log(epg);
                epg.genreIds.forEach((genre) => {
                    if (genresIds.indexOf(genre) > -1) {
                        results[genre].EPGs.push(epg);
                    }
                });
            });
            resolve(results);
        }).catch((error) => {
            reject(error)
        });
    });
};

export const getEpgWithGenres = (genresIds, page, perPage, contentId) => {
    return client.query({
        query: config.queries.EPG_WITH_GENRES,
        variables: {genreIds: genresIds, page: page, perPage: perPage}
    })
}

export const getEpgWithSeriesId = (seriesId, page, perPage, contentId) => {
    return client.query({
        query: config.queries.EPG_WITH_SERIES,
        variables: {id: seriesId, page: page, perPage: perPage}
    })
};

export const getZapperContentTimeRange = (currentTime) => {
    return getChannel(-1)
      .then((value) => {
        let ids = value.map(x => x.channelId);
        return client.query({
          query: config.queries.ZAPPER_CONTENT,
          variables: {currentTime: currentTime, channelIds: ids}
        })
      })

}

// Settings screen

// Audio language
export const getAudioLanguage = () => {
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getPreferAudioLanguageInJson((error, results) => {
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
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getPreferSubtitleLanguageInJson((error, results) => {
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
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getResolutionInJson((error, results) => {
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
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getAspectRatioInJson((error, results) => {
                    let aspectRatio = JSON.parse(results[0]).aspectRatio;
                    resolve(aspectRatio);
                });
            } else {
                reject({errorMessage: "No STB connection"});
            }
        });
    });
};

export const getCurrentSTBInfo = () => {
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getCurrentSTBInfoInJson((error, results) => {
                    resolve(results[0]);
                });
            } else {
                reject({errorMessage: "No STB connection"});
            }
        });
    })
};

export const getWifiInfo = () => {
    return new Promise((resolve, reject) => {
        // NativeModules.STBManager.getMobileWifiInfoInJson((error, results) => {
        //     resolve(JSON.parse(results[0]));
        // });
        getCurrentSTBInfo().then((value) => {
            resolve({SSID: value.IPAddress});
        }).catch((err)=> reject(err));
    })
};

export const getUSBDisks = () => {
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getUSBDisksInJson((error, results) => {
                    resolve(JSON.parse(results[0]));
                });
            } else {
                reject({errorMessage: "No STB connection"});
            }
        });
    })
};

export const getParentalControl = () => {
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getParentalGuideRatingInJson((error, results) => {
                    let jsonObj = JSON.parse(results[0]);
                    let rating = parseInt(jsonObj.parentalGuideRating);
                    resolve(rating);
                });
            } else {
                reject({errorMessage: "No STB connection"});
            }
        });
    })
};

export const getSatellite = () => {
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getSatelliteListInJson((error, results) => {
                    let jsonObj = JSON.parse(results[0]);
                    if (jsonObj.length > 0) {
                        resolve(jsonObj[jsonObj.length - 1]);
                    } else {
                        reject({errorMessage: "Satellite not found"});
                    }
                });
            } else {
                reject({errorMessage: "No STB connection"});
            }
        });
    });
};

export const getTimeShiftLimitSize = () => {
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getTimeshiftLimitSizeInJson((error, results) => {
                    let jsonObj = JSON.parse(results[0]);
                    resolve(parseFloat(jsonObj.timeshiftLimitSize));
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
    let resolutions = ["1080P", "1080I", "720P", "576P", "576I"];
    let aspectRatio = ["4:3 Letter Box", "4:3 Center Cut Out", "4:3 Extended", "16:9 Pillar Box", "16:9 Full Screen", "16:9 Extended"];
    let usbFileSystems = ["FAT 16", "FAT 32", "NTFS", "EXT2", "EXT3", "EXT4"];
    return new Promise((resolve, reject) => {
        Promise.all([getAudioLanguage(), getSubtitles(), getResolution(), getVideoFormat(), getCurrentSTBInfo(), getUSBDisks(), getParentalControl()]).then((values) => {
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

            let manufacturerID = values[4].STBID;
            let hardwareVersion = values[4].hardwareVersion;
            let bootLoaderVersion = values[4].loaderVersion;
            let softwareVersion = values[4].softwareVersion;
            let decoderID = values[4].STBID;

            let hardDiskFile = "";
            let hardDiskTotalSize = 0;
            let hardDiskFreeSize = 0;

            if (values[5].length > 0) {
                let disk = values[5][values[5].length - 1];
                if (disk.partitionArr != null && disk.partitionArr.length > 0) {
                    let partition = disk.partitionArr[disk.partitionArr.length - 1];
                    hardDiskFile = usbFileSystems[partition.fileSystemType];
                    hardDiskTotalSize = partition.partitionTotalSize / 1024;
                    hardDiskFreeSize = partition.partitionFreeSize / 1024;
                }
            }

            let parentalControl = (values[6] == 0) ? "Off" : values[6] + ""

            resolve({
                AudioLanguage: audioLanguage,
                Subtitles: subLanguage,
                Resolution: resolution,
                VideoFormat: ratio,
                ManufacturerID: manufacturerID,
                HardwareVersion: hardwareVersion.toFixed(1),
                BootLoaderVersion: bootLoaderVersion.toFixed(1),
                STBSoftwareVersion: softwareVersion.toFixed(1),
                DecoderID: decoderID,
                HardDiskFile: hardDiskFile,
                HardDiskTotalSize: (hardDiskTotalSize > 0) ? hardDiskTotalSize.toFixed(1) + "G" : "",
                HardDiskFreeSize: (hardDiskFreeSize > 0) ? hardDiskFreeSize.toFixed(1) + "G" : "",
                ParentalControl: parentalControl
            });
        }).catch((error) => {
            reject(error);
        })
    });
};

export const getSeriesInfo = (seriesId) => {
    return client.query({
        query: config.queries.SERIES_INFO,
        variables: {id: seriesId}
    })
};

export const getNotification = () => {
    return new Promise((resolve, reject) => {
        NativeModules.RNUserKit.getProperty("notification", (error, result) => {
            try {
                let json = JSON.parse(result[0]).data
                resolve(json);
            } catch (err) {
                reject(err);
            }
        });
    })
};

export const getProfileInfo = () => {
    return new Promise((resolve, reject)=> {
        NativeModules.RNUserKit.getProperty("_base_info", (error, result) => {
            if (error) {
                reject(error)
            } else {
                try {
                    let json = JSON.parse(result[0]);
                    resolve(json);
                }catch (err) {
                    reject(err);
                }
            }
        });
    });
};

export const getBcVideos = (contentId) => {
    return client.query({
        query: config.queries.BRIGHTCOVE_SEARCH,
        variables: {id: contentId}
    })
}

export const readUsbDir = (dir_path) => {
    console.log(dir_path)
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                let json = {
                    dir_path: dir_path
                }

                NativeModules.STBManager.readUSBDirWithJsonString(JSON.stringify(json), (error, events) => {
                    resolve(JSON.parse(events[0]))
                })
            } else {
                reject({errorMessage: "No STB connection"});
            }
        })

    })
}

export const getPvrList = () => {
    return new Promise((resolve, reject) => {
        NativeModules.STBManager.getPvrListInJson((error, events) => {
            resolve(JSON.parse(events[0]))

        })
    }).then(value => {
        let promises = value.map(x => {
          return new Promise((resolve, reject) => {
            let json = {
              recordName: x
            }
            NativeModules.STBManager.getPvrInfoWithJsonString(JSON.stringify(json), (error, events) => {
              console.log(events)
              resolve(JSON.parse(events[0]))
            })
          })

        })
        return new Promise((resolve, reject) => {
          Promise.all(promises).then(value => {
              console.log(value)
              resolve(value)
          })
        })
    })
};

export const getEpgSameTime = (currentTime, channelId) => {
    return client.query({
      query: config.queries.EPG_SAME_TIME,
      variables: {currentTime: currentTime, id: [channelId]}
    })
};

export const getWatchingHistory = () => {
    return new Promise((resolve, reject) => {

        NativeModules.RNUserKitIdentity.checkSignIn((error, results) => {
            let result = JSON.parse(results[0]);
            if (result.is_sign_in) {
                NativeModules.RNWatchingHistory.getWatchingHistory((error, result) => {
                    // result = JSON.parse(result);
                    // if (_.isEmpty(result));
                    //     result = [];
                    console.log("RES", result);
                    try {
                        let contentIds = result.map((item)=>item.id);
                        console.log("CONTENTIDS", contentIds);
                        client.query({
                            query: config.queries.VOD_BY_IDS,
                            variables: {id: contentIds}
                        }).then((values)=>{
                            let finalRes = [];
                            result.forEach((item)=> {
                                let destItems = values.data.viewer.videoMany.filter((it)=> it.contentId === item.id);
                                if (destItems.length > 0) {
                                    let destItem = _.cloneDeep(destItems[0]);
                                    destItem["stop_position"] = item.stop_position;
                                    finalRes.push(destItem);
                                }
                            });
                            resolve(finalRes);
                        }).catch((err)=> {
                            reject(err);
                        });
                    }catch (err) {
                        reject({message: "Not found VOD"})
                    }
                });
            } else {
                reject({message: "Not logged in"});
            }
        });

    })
};

export const getLiveEpgInChannel = (currentTime, serviceId) => {
    return client.query({
        query: config.queries.LIVE_CHANNEL_IN_ZAPPER,
        variables: {serviceId: serviceId, perPage: serviceId.length}
    })
}



