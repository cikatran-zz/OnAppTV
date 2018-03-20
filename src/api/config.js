import gql from "graphql-tag";


const channelQuery = gql`
query{
  viewer{
    channelMany(limit: $limit) {
      channelId
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
      title
      longDescription
      shortDescription
    }
  }
}`

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
`

export default {
    serverURL: 'http://13.250.57.10:3000/graphql',
    queries: {
        BANNER: bannerQuery,
        CHANNEL: channelQuery,
        CATEGORY: '/5a7036b03300004f00ff5b42',
        LIVE: '/5a6feeb13300001000ff59de',
        VOD: '/5a702f7f3300001000ff5b1d'
    }
};