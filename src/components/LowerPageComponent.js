import React from 'react'
import {
  SectionList, FlatList, Text, View, Image, ImageBackground, StyleSheet, StatusBar, Platform, Dimensions,
  TouchableOpacity
} from 'react-native'
import {colors} from '../utils/themeConfig'
import PinkRoundedLabel from './PinkRoundedLabel'
import {secondFormatter, timeFormatter} from '../utils/timeUtils'

export default class LowerPageComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  _renderBanner = ({item}) => {
      return (
        <View style={styles.topContainer}>
            <View style={styles.bannerThumbnailContainer}>
              <Image source={{uri: item.originalImages[0].url}} style={styles.banner}/>
            </View>
        </View>
      )
  }

  _renderBannerInfo = ({item}) => {
    return (
      <View style={styles.bannerContainer}>
        <View style={styles.bannerInfoContainer}>
          <View style={styles.bannerInfo}>
            <Text style={styles.videoTitleText}>{item.title}</Text>
            <Text style={styles.videoTypeText}>{item.type}</Text>
          </View>
          <View style={styles.bannerButtonsContainer}>
            <TouchableOpacity>
              <Image source={require('../assets/lowerpage_playbtn.png')} style={styles.videoPlayButton}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../assets/lowerpage_heart.png')} style={styles.videoLoveButton}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../assets/share.png')} style={styles.videoShareButton}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.videoDescriptionContainer}>
          <Text style={styles.videoDescription}>{item.longDescription}</Text>
        </View>
      </View>
    )
  }

  _renderPinkIndicatorButton = () => {
      const {videoType} = this.props;
      switch (videoType) {
        case 'channel': return (<PinkRoundedLabel text={"NEXT"}/>)
        case 'episode': return (<PinkRoundedLabel text={"SEASON"}/>)
        case 'standalone': return (<PinkRoundedLabel text={"RELATED"}/>)
        default: return (<PinkRoundedLabel text={"NEXT"}/>)
      }
  }

  _renderLogoChannel = (urlArray) => {
    // let logoUrl = url ? url : '../assets/arte.png'
    let logoUrl = require('../assets/arte.png')
    if (urlArray && urlArray.length > 0) logoUrl = {uri :urlArray[0].url}
    if (this._isFromChannel()) {
        return (<Image source={logoUrl}/>)
    }
  }

  _keyExtractor = (item, index) => index;

  _renderList = (data) => {
    // data is list of epgs
    if (this._isFromChannel()) {
      return (
        <View>
          <View style={styles.listHeader}>
            <View style={styles.nextButtonContainer}>
              {this._renderPinkIndicatorButton()}
            </View>
            <View style={styles.logoContainer}>
              {/*// TODO: Logo*/}
              {this._renderLogoChannel(data.item.originalImages)}
            </View>
          </View>
          <FlatList
            style={styles.list}
            horizontal={false}
            data={data.item}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderListVideoItem}/>
        </View>
      )
    }
    else {
      return (
        <View>
          <View style={styles.listHeader}>
            <View style={styles.nextButtonContainer}>
              {this._renderPinkIndicatorButton()}
            </View>
          </View>
          <FlatList
            style={styles.list}
            horizontal={false}
            data={data.item}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderListVideoItem}/>
        </View>
      )
    }
  }

  _isFromChannel = () => this.props.videoType === 'channel'

  _renderListVideoItem = ({item}) => {
    console.log(this._isFromChannel())
    console.log(item)

    let videoData = this._isFromChannel() ? item.videoData : item
    console.log('lowerpage 118')
    console.log(videoData)
    return (
      <View style={styles.itemContainer}>
        <Image
          style={styles.videoThumnbail}
          source={{uri: videoData.originalImages.length > 0 ? videoData.originalImages[0].url : fakeBannerData.url}}/>
        <View style={styles.itemInformationContainer}>
          <Text style={styles.itemTitle}>{videoData.title}</Text>
          <Text style={styles.itemType}>{videoData.type}</Text>
          <Text style={styles.itemTime}>{this._isFromChannel() ? timeFormatter(item.startTime) + ' - ' + timeFormatter(item.endTime) : secondFormatter(item.durationInSeconds)}</Text>
        </View>
        <View style={styles.itemActionsContainer}>
          <TouchableOpacity>
            <Image source={require('../assets/lowerpage_playbtn.png')} style={styles.itemPlayButton}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/lowerpage_heart.png')} style={styles.itemLoveButton}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    // EPGs is EPG array, video is an EPG or videoModel depend on videoType
    const {listData, video} = this.props;

    console.log("RENDER_LOWERPAGE" )

    if (!listData || !video)
      return null;

    let videoModel
    if (this._isFromChannel()){
      videoModel = video.videoData
    } else {
      videoModel = video
    }

    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor='#00000000'
          barStyle='light-content' />
        <SectionList
          style={styles.container}
          keyExtractor={this._keyExtractor}
          stickySectionHeadersEnabled={false}
          sections={[
            {data: [videoModel],showHeader: false, renderItem: this._renderBanner},
            {data: [videoModel], renderItem: this._renderBannerInfo},
            {data: [listData],showHeader: false, renderItem: this._renderList}
          ]}
        />
      </View>
    )
  }

}
const {w, h} = Dimensions.get("window")
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: h,
  },
  topContainer: {
    flexDirection: 'row',
    height: 400,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerThumbnailContainer: {
    marginTop: 40,
    height: 164,
    width: '92%',
    backgroundColor: colors.whitePrimary,
    borderRadius: (Platform.OS === 'ios') ? 4 : 8
  },
  list: {
    width: '100%',
    paddingBottom: 90
  },
  itemContainer: {
    flexDirection: 'row',
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    height: 100,
  },
  videoThumnbail: {
    width: '41%',
    height: '100%',
    borderRadius: (Platform.OS === 'ios') ? 4 : 8
  },
  itemInformationContainer: {
    flexDirection: 'column',
    width: '50%',
  },
  itemActionsContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-end',
    width: 18,
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
  },
  banner: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.whitePrimary
  },
  bannerContainer: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bannerInfoContainer: {
    width: '90%',
    height: 35,
    flexDirection: 'row'
  },
  bannerInfo: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start'
  },
  bannerButtonsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  videoTitleText: {
    fontSize: 16,
    color: colors.textMainBlack
  },
  videoTypeText: {
    fontSize: 12,
    color: '#383838'
  },
  videoDescriptionContainer: {
    width: '90%',
    marginTop: 15,
    maxHeight: 162,
    flexDirection: 'column',
  },
  videoDescription: {
    fontSize: 12,
    color: '#ACACAC'
  },
  nextButtonContainer: {
    marginLeft: 14,
    justifyContent: 'flex-start'
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'column',
    marginRight: 14
  },
  listHeader: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 25
  }
})

const fakeBannerData = {
  url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'
}


