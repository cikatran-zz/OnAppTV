import gql from "graphql-tag";


const channelQuery = gql`
query queryChannel($serviceIDs: [Float]!){
  viewer {
    channelPagination(perPage: 60, page: 1, filter:{
      _operators: {
        serviceId: {
          in: $serviceIDs
        }
      }
    }) {
      items {
        _id
        serviceId
        lcn
        title
        longDescription
        shortDescription
        createdAt
        updatedAt
        originalImages {
          height
          width
          url
          name
          fileName
          scaledImage {
              height
              width
              url
            }
        }
      }
    }
  }
}`;

const zapperContentQuery = gql`
query queryZapperByTime($currentTime: Date, $channelIds: [String]){
  viewer{
    epgRange (
      current:$currentTime,
      channelIds: $channelIds
    ) {
      videoId
      channelId
      startTime
      endTime
      channelData {
        title
        lcn
      }
      videoData {
        title
        originalImages {
          url
          name
          scaledImage {
              height
              width
              url
            }
        }
        genres {
          name
        }
        custom
        directors {
            name
          },
          casts {
            name  
          }
      }
    }
  }
}
`

const playlistQuery = gql`
query queryPlaylist($playList: String) {
  viewer{
    listOne(filter: {
      title:$playList
    }) {
      contentData {
        contentId
        content
        title
        longDescription
        shortDescription
        originalImages {
          scaledImage {
            url
          }
          fileName
          name
        }
        type
        kind
      }
    }
  }
}
`;

const bannerQuery = gql`
query {
  viewer{
    listOne(filter: {
      title: "HIGHLIGHT"
    }) {
      contentData {
        contentId
        content
        title
        longDescription
        shortDescription
        originalImages {
          scaledImage {
            height
            width
            url
          }
          fileName
          name
        }
        type
        kind
      }
    }
  }
}
`;

const adsQuery = gql`
query{
  viewer{
    adsOne{
      deal
      originalImages {
        height
        width
        url
        name
        fileName
        scaledImage {
              height
              width
              url
            }
      }
      url
    }
  }
}
`;

const  vodQuery = gql`
query queryVOD($perPage: Int, $page: Int){
  viewer{
    videoPagination(perPage: $perPage, page: $page) {
    	items {
    	  contentId
    	  durationInSeconds
    	  publishDate
    	  title
    	  longDescription
    	  shortDescription
    	  
    	  seriesId
    	  seasonIndex
    	  episodeIndex
    	  type
    	  
    	  updatedAt
    	  createdAt
        originalImages {
          height
          width
          url
          name
          fileName
          scaledImage {
              height
              width
              url
          }
        }
        genreIds
        genres {
          name
        }
        custom
        directors {
            name
        },
        casts {
            name  
        }
        series {
            contentId
            title
            longDescription
            sourceImage
            custom
            type
            kind
          }
    	}
    }
  }
}
`;

const categoryQuery = gql`
query{
  viewer{
    genreMany {
      _id
      name
      originalImages{
        name
        fileName
        scaledImage {
          height
          width
          url
          _id
        }
      }
  	}
	}
}
`;

const newsQuery = gql`
query{
  viewer{
    newsOne {
      title
      longDescription
      shortDescription
      url
      updatedAt
      createdAt
      originalImages {
        scaledImage {
          height
          width
          url
        }
        height
        width
        url
        name
        fileName
      }
    }
  }
}
`;
const firstGQL = `query getLiveEPG($page: Int, $perPage: Int){
  viewer{
    channelPagination(page: $page, perPage: $perPage, filter: {
      _operators: {`;
const lastGQL = `}
    }) {
      count
      items {
        serviceId
        lcn
        ipLink
        title
        longDescription
        shortDescription
        epgsData(current: true) {
            channelData {
              serviceId
              lcn
              ipLink
              updatedAt
              createdAt
              title
              longDescription
              shortDescription
              state
              custom
              projectId
              kind
            }
          videoId
          genreIds
          videoData {
            contentId
            durationInSeconds
            publishDate
            title
            longDescription
            shortDescription
            originalImages {
              height
              width
              url
              name
              fileName
              scaledImage {
                  height
                  width
                  url
              }
            }
            genres {
              name
            }
            seriesId
            seasonIndex
            episodeIndex
            type
            directors {
                name
              },
              casts {
                name  
              }
              series {
                contentId
                title
                longDescription
                sourceImage
                custom
                type
                kind
              }
            state
            custom
            createdAt
            updatedAt
            projectId
          }
          channelId
          startTime
          endTime
          state
          createdAt
          updatedAt
          projectId
        }
        state
        custom
        createdAt
        updatedAt
        projectId
      }
    }
  }
}`;

const ipLinkParam = `ipLink: {
          ne: ""
        }`;
const liveQuerySTB = gql`${firstGQL}${lastGQL}`;

const liveQueryNoSTB = gql`${firstGQL}${ipLinkParam}${lastGQL}`;


const epgQuery = gql`
query getEPGByChannel($channelId: Float){
  viewer{
      channelOne(filter: {
        serviceId: $channelId
      }
      ) {
        title
        longDescription
        shortDescription
        createdAt
        updatedAt
        originalImages {
              height
              width
              url
              name
              fileName
                          scaledImage {
              height
              width
              url
            }
        }
        epgsData(current: true) {
          videoId
          channelId
          channelData {
            title
            lcn
            serviceId
            originalImages {
              height
              width
              url
              name
              fileName
                          scaledImage {
              height
              width
              url
            }
            }
          }
          startTime
          endTime
          videoData {
            originalImages {
              height
              width
              url
              name
              fileName
                          scaledImage {
              height
              width
              url
            }
            }
            genres {
              name
            }
            contentId
            durationInSeconds
            publishDate
            title
            longDescription
            shortDescription
            series {
                contentId
                title
                longDescription
                sourceImage
                custom
                type
                kind
              }
            seriesId
            seasonIndex
            episodeIndex
            type
            
            state
            createdAt
            updatedAt
            custom
            directors {
                name
              },
              casts {
                name  
              }
          }
        }
      }  
    }
}
`;

const relatedEpgQuery = gql`
query getRelated($genreIds: [MongoID], $page: Int, $perPage: Int){
  viewer{
    videoPagination(page: $page, perPage: $perPage,filter: {
      _operators: {
        genreIds: {
            in: $genreIds
        },
        type: {
          nin: "Episode"
        }
      }
    })  {
      items {
          _id
          contentId
          durationInSeconds
          publishDate
          genreIds
          genres {
            name
          }
          title
          originalImages {
            height
            width
            url
            name
            fileName
            scaledImage {
              height
              width
              url
            }
          }
          genreIds
          longDescription
          shortDescription
          series {
            contentId
            title
            longDescription
            sourceImage
            custom
            type
            kind
          }
          seriesId
          seasonIndex
          episodeIndex
          type
          
          updatedAt
          createdAt
          custom
          directors {
            name
          },
          casts {
            name  
          }
      }
      count
    }
  }
}
`
const seriesEpgQuery = gql`
query getSeriesEpg($id: [MongoID], $page: Int, $perPage: Int){
    viewer{
  
    videoPagination(filter: {
      _operators: {
        seriesId: {
            in: $id
        }
      }
    }, page: $page, perPage: $perPage) {
        items {
            _id
          contentId
          durationInSeconds
          publishDate
          genreIds
          genres {
            name
          }
          title
          originalImages {
            height
            width
            url
            name
            fileName
            scaledImage {
              height
              width
              url
            }
          }
          longDescription
          shortDescription
          series {
            contentId
            title
            longDescription
            sourceImage
            custom
            type
            kind
          }
          seriesId
          seasonIndex
          episodeIndex
          type
          
          updatedAt
          createdAt
          custom
          directors {
            name
          },
          casts {
            name  
          }
        }
        count
    }
  }
}
`

const genresVOD = gql`
query genresVOD($genresId: [MongoID]){
  viewer{
    videoMany(filter: {
      _operators: {
        genreIds: {
          in: $genresId
        },
        type: {
          nin: "Episode"
        }
      }
    }, sort: _DESC) {
      contentId
      durationInSeconds
      title
      series {
        contentId
        title
        longDescription
        sourceImage
        custom
        type
        kind
      }
      seriesId
      seasonIndex
      episodeIndex
      type
      
      state
      genres {
        name
      }
      durationInSeconds
      originalImages {
        height
        width
        url
        name
        fileName
        scaledImage {
          height
          width
          url
        }
      }
      custom
      directors {
        name
      },
      casts {
        name  
      }
    }
  }
}
`;

const vodByGenres = gql`
query genresVOD($genresId: MongoID, $page: Int, $perPage: Int){
  viewer{
    videoPagination(page: $page, perPage: $perPage, filter: {
      _operators: {
        genreIds: {
          in: [$genresId]
        },
        type: {
          nin: "Episode"
        }
      }
    }) {
    	items {
    	  contentId
    	  durationInSeconds
    	  publishDate
    	  title
    	  longDescription
    	  shortDescription
    	  series {
            contentId
            title
            longDescription
            sourceImage
            custom
            type
            kind
          }
    	  seriesId
    	  seasonIndex
    	  episodeIndex
    	  type
    	  
    	  updatedAt
    	  createdAt
        originalImages {
          height
          width
          url
          name
          fileName
          scaledImage {
              height
              width
              url
          }
        }
        genreIds
        genres {
          name
        }
        custom
        directors {
            name
          },
          casts {
            name  
          }
    	}
    }
  }
}
`;

const genresEPGs = gql`
query genresEPGs($currentTime: Date, $genresId: MongoID, $limit: Int, $skip: Int){
  viewer{
    epgMany(filter: {
      _operators:{
        startTime: {
          lte: $currentTime
        },
        endTime:{
          gte: $currentTime
        },
        genreIds: {
          in: [$genresId]
        }
      }
    
    }, skip: $skip, limit: $limit) {
      startTime
      endTime
      channelData {
        serviceId
        lcn
        title
        state
      }
      videoData {
        contentId
        durationInSeconds
        title
        longDescription
        shortDescription
        seriesId
        seasonIndex
        episodeIndex
        type
        genres {
          name
        }
        originalImages {
          height
          width
          url
          name
          fileName
          scaledImage {
              height
              width
              url
            }
        }
        directors {
            name
          },
          casts {
            name  
          }
          series {
            contentId
            title
            longDescription
            sourceImage
            custom
            type
            kind
          }
      } 
    }
  }
}
`;

const seriesInfoQuery = gql`
query seriesInfo($id: [MongoID]) {
    viewer {
        seriesOne(filter: {
      _operators: {
        _id: {
        in: $id
        }
      }
    }) {
      contentId
          publishDate
          title
          longDescription
          shortDescription
          state
          createdAt
          updatedAt
    }
    }
}
`;

const searchBrightcoveQuery = gql`
query searchBc($id: String) {
    viewer{
    brightcoveSearchVideo(contentId: $id) {
      contentId
      durationInSeconds
      publishDate
      title
      longDescription
      shortDescription
      
      seriesId
      seasonIndex
      episodeIndex
      type
      
      state
      createdAt
      updatedAt
      sources
    }
  }
}
`;

const queryEpgSameTime = gql`
query getEpgSameTime($currentTime: Date, $id: [MongoID]){
  viewer{
    epgMany(filter: {
      _operators:{
        startTime: {
          lte: $currentTime
        },
        endTime:{
          gte: $currentTime
        },
        channelId: {
          nin: $id
        }
      }
    }) {
      channelData {
        title
        lcn
        serviceId
      }
      videoData {
        title
        originalImages {
          name
          url
          scaledImage {
              height
              width
              url
            }
        }
        genres {
          name
        }
        title
        longDescription
        shortDescription
        series {
            contentId
            title
            longDescription
            sourceImage
            custom
            type
            kind
          }
        seriesId
        seasonIndex
        episodeIndex
        type
        
        custom
        directors {
            name
          },
          casts {
            name  
          }
      }
      startTime
      endTime
    }
  }
}`;

const VODByIds = gql`
query getVODs($id: [String]!){
  viewer {
    videoMany(filter: {
      _operators: {
        contentId: {
          in: $id
        }
      }
    }) {
      contentId
      durationInSeconds
      title
      genres {
        name
        createdAt
        updatedAt
        projectId
      }
      series {
        contentId
        title
        longDescription
        sourceImage
        custom
        type
        kind
      }
      seriesId
      seasonIndex
      episodeIndex
      type
      custom
      originalImages {
        height
        width
        url
        name
        fileName
        scaledImage {
              height
              width
              url
            }
      },
      genres {
        name
      }
      custom
      directors {
        name
      },
      casts {
        name  
      }
    }
  }
}
`;

const liveChannelInZapper = gql`
query liveChannelInZapper($serviceId: [Float], $perPage: Int){
  viewer {
    channelPagination(filter: {
      _operators: {
        serviceId: {
          in: $serviceId
        }
      }
    }, page: 1, perPage: $perPage) {
      count
      items {
        serviceId
        lcn
        ipLink
        title
        longDescription
        shortDescription
        epgsData(current: true) {
        channelData {
              serviceId
              lcn
              ipLink
              updatedAt
              createdAt
              title
              longDescription
              shortDescription
              state
              custom
              projectId
              kind
            }
          videoId
          genreIds
          videoData {
            contentId
            durationInSeconds
            publishDate
            title
            longDescription
            shortDescription
            originalImages {
              height
              width
              url
              name
              fileName
              scaledImage {
                  height
                  width
                  url
              }
            }
            genres {
              name
            }
            series {
                contentId
                title
                longDescription
                sourceImage
                custom
                type
                kind
              }
            seriesId
            seasonIndex
            episodeIndex
            type
            directors {
                name
              },
              casts {
                name  
              }
            state
            custom
            createdAt
            updatedAt
            projectId
          }
          channelId
          startTime
          endTime
          state
          createdAt
          updatedAt
          projectId
        }
        state
        createdAt
        updatedAt
        projectId
      }
    }
  }
}
`;

const videoOne = gql`
query getVideoOne($contentId: String) {
   viewer {
   videoOne(filter: {
    contentId: $contentId
  }) {
    contentId
     sourceName
     durationInSeconds
     publishDate
     seriesId
     seasonIndex
     episodeIndex
     contentId
     content
     genres {
        name
        createdAt
        updatedAt
        projectId
      }
      series {
        contentId
        title
        longDescription
        sourceImage
        custom
        type
        kind
      }
      genreIds
     readingTime
     title
     longDescription
     shortDescription
     sourceImage
     originalImages {
       height
       width
       url
       name
       fileName
      scaledImage {
        height
        width
        url
        _id
      }
       _id
     }
     state
     custom
     createdAt
     updatedAt
     projectId
     type
     kind
    directors {
      name
      createdAt
      updatedAt
      projectId
    }
    casts {
        name
        createdAt
        updatedAt
        projectId
      }
   }
  }
}
`;

export default {
    serverURL: 'https://contentkit-api.mstage.io/graphql',
    queries: {
        BANNER: bannerQuery,
        PLAYLIST: playlistQuery,
        CHANNEL: channelQuery,
        ADS: adsQuery,
        CATEGORY: categoryQuery,
        LIVESTB: liveQuerySTB,
        LIVENOSTB:liveQueryNoSTB,
        VOD: vodQuery,
        NEWS: newsQuery,
        EPG: epgQuery,
        GENRES_VOD: genresVOD,
        GENRES_EPG: genresEPGs,
        EPG_WITH_GENRES: relatedEpgQuery,
        EPG_WITH_SERIES: seriesEpgQuery,
        SERIES_INFO: seriesInfoQuery,
        ZAPPER_CONTENT: zapperContentQuery,
        BRIGHTCOVE_SEARCH : searchBrightcoveQuery,
        EPG_SAME_TIME: queryEpgSameTime,
        VOD_BY_IDS: VODByIds,
        VOD_BY_GENRES: vodByGenres,
        LIVE_CHANNEL_IN_ZAPPER: liveChannelInZapper,
        VIDEO_ONE: videoOne
    }
};
