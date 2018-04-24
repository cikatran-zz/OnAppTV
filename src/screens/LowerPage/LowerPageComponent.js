import React, {PureComponent} from 'react'
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    SectionList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {colors} from '../../utils/themeConfig'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import {secondFormatter, timeFormatter} from '../../utils/timeUtils'

export default class LowerPageComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {item, isLive} = this.props.navigation.state.params
    switch (item.type) {
      case 'Standalone': {
        // Find video with related genre
        this.props.getEpgWithGenre(item.genreIds)
        break;
      }
      case 'Episode': {
        this.props.getEpgWithSeriesId([item.seriesId])
        break;
      }
      default: {
        this.props.getEpgs([item.serviceID])
      }
    }
  }

  _onPress = (item) => {
    const {isLive} = this.props.navigation.state.params
    const {epg, navigation} = this.props

    navigation.navigate('VideoControlModal', {
      item: item,
      epg: epg.data,
      isLive: isLive
    })
  }

  _renderBanner = ({item}) => {
    const {isLive} = this.props.navigation.state.params

    let data = isLive === true ? item.videoData : item
      return (
        <TouchableOpacity style={styles.topContainer} onPress={() => this._onPress(item)}>
            <View style={styles.bannerThumbnailContainer}>
              <Image source={{uri: data.originalImages[0].url}} style={styles.banner}/>
            </View>
        </TouchableOpacity>
      )
  }

  _renderBannerInfo = ({item}) => {
    let data = this._isFromChannel() ? item.videoData : item

    return (
      <View style={styles.bannerContainer}>
        <View style={styles.bannerInfoContainer}>
          <View style={styles.bannerInfo}>
            <Text style={styles.videoTitleText}>{data.title}</Text>
            <Text style={styles.videoTypeText}>{data.type}</Text>
          </View>
          <View style={styles.bannerButtonsContainer}>
            <TouchableOpacity>
              <Image source={require('../../assets/lowerpage_record.png')} style={styles.videoPlayButton}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../../assets/lowerpage_heart.png')} style={styles.videoLoveButton}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../../assets/share.png')} style={styles.videoShareButton}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.videoDescriptionContainer}>
          <Text style={styles.videoDescription}>{data.longDescription}</Text>
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
    let logoUrl
    if (urlArray && urlArray.length > 0) logoUrl = {uri :urlArray[0].url}
    if (this._isFromChannel() && logoUrl) {
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

  _isFromChannel = () => this.props.navigation.state.params.isLive === true

  _renderListVideoItem = ({item}) => {

    let videoData = this._isFromChannel() ? item.videoData : item

    if (videoData) {
      return (
        <View style={styles.itemContainer}>
          <TouchableOpacity
            style={styles.videoThumnbailContainer}
            onPress={() => this._onPress(item)}>
            <Image
              style={styles.videoThumbnail}
              source={{uri: videoData.originalImages.length > 0 ? videoData.originalImages[0].url : fakeBannerData.url}}/>
          </TouchableOpacity>
          <View style={styles.itemInformationContainer}>
            <Text style={styles.itemTitle}>{videoData.title}</Text>
            <Text style={styles.itemType}>{videoData.type}</Text>
            <Text
              style={styles.itemTime}>{this._isFromChannel() ? timeFormatter(item.startTime) + ' - ' + timeFormatter(item.endTime) : secondFormatter(item.durationInSeconds)}</Text>
          </View>
          <View style={styles.itemActionsContainer}>
            <TouchableOpacity>
              <Image source={require('../../assets/lowerpage_record.png')} style={styles.itemPlayButton}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../../assets/lowerpage_heart.png')} style={styles.itemLoveButton}/>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    else return null
  }

  _onScroll(e) {
    this.props.listScrollOffsetY(e.nativeEvent.contentOffset.y)
  }

  render() {
    // EPGs is EPG array, video is an EPG or videoModel depend on videoType
    const {epg} = this.props;
    const {item, isLive} = this.props.navigation.state.params
    console.log(epg)
    console.log(item)

    if (isLive) {
      if (!item) return null
    }
    else if (!epg || !epg.data || !item)
      return null;

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
          //onScroll={(e) => this._onScroll(e)}
          sections={[
            {data: [item],showHeader: false, renderItem: this._renderBanner},
            {data: [item], renderItem: this._renderBannerInfo},
            {data: [epg.data],showHeader: false, renderItem: this._renderList}
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
    height: 225,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerThumbnailContainer: {
    height: '72%',
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
  videoThumnbailContainer: {
    width: '41%',
    height: '100%',
    borderRadius: (Platform.OS === 'ios') ? 4 : 8
  },
  videoThumbnail: {
    width: '100%',
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
    marginTop: 20,
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

