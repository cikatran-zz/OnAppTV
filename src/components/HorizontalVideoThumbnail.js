import React from 'react'
import { Text, View, Image, StyleSheet, Platform} from 'react-native'
import {colors} from '../utils/themeConfig'
import {timeFormatter} from '../utils/StringUtils'

export default class HorizontalVideoThumbnail extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    let item = this.props.item
    if (!item)
      return null

    let videoData = item.videoData
    return (
      <View style={styles.itemContainer}>
        <Image
          style={styles.videoThumbnail}
          source={{uri: (item.url ? item.url : fakeBannerData.url)}}
        />
        <View style={styles.itemInformationContainer}>
          <Text style={styles.itemTitle}>{videoData.title}</Text>
          <Text style={styles.itemType}>{videoData.type}</Text>
          {/*<Text style={styles.itemTime}>{timeFormatter(item.startTime)} - {timeFormatter(item.endTime)}</Text>*/}
        </View>
        {/*<View style={styles.itemActionsContainer}>*/}
          {/*<Image source={require('../assets/lowerpage_playbtn.png')} style={styles.itemPlayButton}/>*/}
          {/*<Image source={require('../assets/lowerpage_heart.png')} style={styles.itemLoveButton}/>*/}
        {/*</View>*/}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    height: 100,
  },
  videoThumbnail: {
    width: '41%',
    height: '100%',
    borderRadius: (Platform.OS === 'ios') ? 4 : 8
  },
  itemInformationContainer: {
    flexDirection: 'column'
  },
  itemActionsContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-end',
  },
  itemTitle: {
    marginTop: 12,
    marginLeft: 12,
    color: colors.textMainBlack,
    fontWeight: 'bold',
    fontSize: 15
  },
  itemType: {
    marginTop: 2,
    marginLeft: 13,
    color: '#ACACAC',
    fontSize: 12
  },
  itemTime: {
    marginTop: 1,
    marginLeft: 13,
    color: '#ACACAC',
    fontSize: 12
  },
  itemPlayButton: {
    marginTop: 14,
    width: 17,
    height: 17
  },
  itemLoveButton: {
    resizeMode: 'contain',
    marginTop: 12,
    width: 17,
    height: 17
  },
  videoPlayButton: {
    width: 17,
    height: 17,
    marginRight: 18,
  },
  videoLoveButton: {
    resizeMode: 'contain',
    width: 17,
    height: 17,
    marginRight: 18
  },
  videoShareButton: {
    resizeMode: 'contain',
    width: 17,
    height: 17,
    marginRight: 3
  }
})

const fakeBannerData = {
  url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'
}

