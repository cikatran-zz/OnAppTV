import gql from "graphql-tag";


const channelQuery = gql`
query queryChannel($serviceIDs: [Float]!){
  viewer{
    channelMany(filter:{
      _operators: {
        serviceId: {
          in: $serviceIDs
        }
      }
    }) {
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
        lcn
      }
      videoData {
        originalImages {
          url
        }
      }
    }
  }
}
`

const bannerQuery = gql`
query{
  viewer{
		videoOne(filter:{
      feature: true
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
      shortDescription
      longDescription
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
        }
        genreIds
        genresData {
          name
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

const liveQuery = gql`
query getLiveEPG($currentTime: Date){
  viewer{
    epgMany(filter: {
      _operators:{
        startTime: {
          lte: $currentTime
        },
        endTime:{
          gte: $currentTime
        }
      }
    }) {
      channelId
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
      }
      startTime
      endTime
    }
  }
}
`;

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
          }
        }
      }  
    }
}
`;

const relatedEpgQuery = gql`
query getRelated($genreIds: [MongoID]){
  viewer{
    videoMany(filter: {
      _operators: {
        genreIds: {
          in: $genreIds
        }
      }
    })  {
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
    }
  }
}
`
const seriesEpgQuery = gql`
query getSeriesEpg($id: [MongoID]){
    viewer{
  
    videoMany(filter: {
      _operators: {
        seriesId: {
          in: $id
        }
      }
    }) {
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
    }
  }
}
`;

const genresEPGs = gql`
query genresEPGs($currentTime: Date, $genresId: [MongoID]){
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
          in: $genresId
        }
      }
    
    }) {
      channelData {
        title
      }
      videoData {
        title
        originalImages {
          url
        }
        genresData {
          name
        }
      }
      startTime
      endTime
      genreIds
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
    }
  }
}
`;

export default {
    serverURL: 'http://contentkit-prod.ap-southeast-1.elasticbeanstalk.com/graphql',
    queries: {
        BANNER: bannerQuery,
        CHANNEL: channelQuery,
        ADS: adsQuery,
        CATEGORY: categoryQuery,
        LIVE: liveQuery,
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
        VOD_BY_IDS: VODByIds
    }
};