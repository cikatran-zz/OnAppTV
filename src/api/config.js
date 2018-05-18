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
query queryZapperByTime($gtTime: Date, $ltTime: Date){
  viewer{
    epgRange (
      startTimeBegin:$gtTime,
      startTimeEnd:$ltTime
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

const bannerQuery = gql`
query {
  viewer{
    playlistOne(filter: {
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
    	  feature
    	  seriesId
    	  seasonIndex
    	  episodeIndex
    	  type
    	  impression
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
        epgsData(current: $currentTime) {
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
        epgsData {
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
            feature
            seriesId
            seasonIndex
            episodeIndex
            type
            impression
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
query getRelated($genreIds: [MongoID], $page: Int, $perPage: Int, $contentId: [String]){
  viewer{
    videoPagination(page: $page, perPage: $perPage,filter: {
      _operators: {
        genreIds: {
            in: $genreIds
        },
        contentId: {
            nin: $contentId
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
          }
          genreIds
          longDescription
          shortDescription
          feature
          seriesId
          seasonIndex
          episodeIndex
          type
          impression
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
query getSeriesEpg($id: [MongoID], $page: Int, $perPage: Int, $contentId: [String]){
    viewer{
  
    videoPagination(filter: {
      _operators: {
        seriesId: {
            in: $id
        },
        contentId: {
            nin: $contentId
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
          }
          longDescription
          shortDescription
          feature
          seriesId
          seasonIndex
          episodeIndex
          type
          impression
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
        }
      }
    }, sort: FEATURE_DESC) {
      contentId
      durationInSeconds
      title
      feature
      seriesId
      seasonIndex
      episodeIndex
      type
      impression
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
query genresVOD($genresId: MongoID, $limit: Int, $skip: Int){
  viewer{
    videoMany(filter: {
      _operators: {
        genreIds: {
          in: [$genresId]
        }
      }
    }, limit: $limit, skip: $skip) {
      contentId
      durationInSeconds
      title
      feature
      seriesId
      seasonIndex
      episodeIndex
      type
      impression
      state
      genresData {
        name
      }
      genreIds
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
      feature
      seriesId
      seasonIndex
      episodeIndex
      type
      impression
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
        feature
        seriesId
        seasonIndex
        episodeIndex
        type
        impression
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
      impression
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
        epgsData(current: $currentTime) {
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