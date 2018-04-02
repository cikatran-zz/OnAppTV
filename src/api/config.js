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

const bannerQuery = gql`
query{
  viewer{
		videoOne(filter:{
      feature: true
    }) {
		  title
		  shortDescription
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
    }
  }
}
`;

const epgQuery = gql`
query {
  viewer{
      channelById(_id : "5abe09087928db4dde77cfe6") {
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

export default {
    serverURL: 'http://13.250.57.10:3000/graphql',
    queries: {
        BANNER: bannerQuery,
        CHANNEL: channelQuery,
        ADS: adsQuery,
        CATEGORY: categoryQuery,
        LIVE: liveQuery,
        VOD: vodQuery,
        NEWS: newsQuery,
        EPG: epgQuery
    }
};