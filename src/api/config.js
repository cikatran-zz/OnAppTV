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
        }
      }
    }
  }
}`;

const zapperContentQuery = gql`
query queryZapperByTime($currentTime: Date){
  viewer{
    epgRange (
      current:$currentTime,
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
        }
        genresData {
          name
        }
        custom
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
      mediaData
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
      mediaData
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
        genresData {
          name
        }
        custom
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
const firstGQL = `query getLiveEPG($page: Int, $perPage: Int, $currentTime: Boolean){
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
            }
            genresData {
              name
            }
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
            custom
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
        }
      }
    })  {
      items {
          _id
          contentId
          durationInSeconds
          publishDate
          genreIds
          genresData {
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
          
          seriesId
          seasonIndex
          episodeIndex
          type
          
          updatedAt
          createdAt
          custom
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
          genresData {
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
          
          seriesId
          seasonIndex
          episodeIndex
          type
          
          updatedAt
          createdAt
          custom
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
      
      seriesId
      seasonIndex
      episodeIndex
      type
      
      state
      genresData {
        name
      }
      durationInSeconds
      originalImages {
        height
        width
        url
        name
        fileName
      }
      custom
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
        genresData {
          name
        }
        custom
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
        genresData {
          name
        }
        originalImages {
          height
          width
          url
          name
          fileName
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
          url
        }
        genresData {
          name
        }
        title
        longDescription
        shortDescription
        
        seriesId
        seasonIndex
        episodeIndex
        type
        
        custom
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
      seriesId
      seasonIndex
      episodeIndex
      type
      
      metadata
      originalImages {
        height
        width
        url
        name
        fileName
      },
      genresData {
        name
      }
      custom
    }
  }
}
`;

const liveChannelInZapper = gql`
query liveChannelInZapper($currentTime: Boolean, $serviceId: Float){
  viewer {
    channelPagination(filter: {
      _operators: {
        serviceId: {
          in: [$serviceId]
        }
      }
    }, page: 1, perPage: 1) {
      count
      items {
        serviceId
        lcn
        ipLink
        title
        longDescription
        shortDescription
        epgsData(current: true) {
          videoId
          genreIds
          videoData {
            contentId
            durationInSeconds
            publishDate
            title
            longDescription
            shortDescription
            feature
            genres {
              name
            }
            seriesId
            seasonIndex
            episodeIndex
            type
            impression
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
        LIVE_CHANNEL_IN_ZAPPER: liveChannelInZapper
    }
};
