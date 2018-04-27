import React, {PureComponent} from 'react'
import {
  Dimensions,
  FlatList,
  Image, Modal,
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

export default class DetailsPage extends React.Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    const {item, isLive} = this.props.navigation.state.params

    console.log('ComponentDidMount')
    console.log(item)
    console.log(isLive)

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
        this.props.getEpgs([item.channelData.serviceId])
        this.props.getEpgSameTime(new Date(), item.channelId)
      }
    }
  }

  _onPress = (item) => {
    const {isLive} = this.props.navigation.state.params
    const {epg, navigation} = this.props

    navigation.replace('VideoControlModal', {
      item: item,
      epg: epg.data,
      isLive: isLive
    })
  }

  _renderBanner = ({item}) => {
    const {isLive} = this.props.navigation.state.params

    let data = isLive === true ? item.videoData : item
      return (
        <View style={styles.topContainer} >
            <TouchableOpacity style={{marginTop: 12, alignSelf: 'flex-start', marginLeft: '4%', width: '20%'}} onPress={() => this.props.navigation.goBack()}>
              <Image source={require('../../assets/ic_back_details.png')} style={{width: '17%', resizeMode: 'contain'}}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bannerThumbnailContainer} onPress={() => this._onPress(item)}>
              <Image source={{uri: data.originalImages[0].url}} style={styles.banner}/>
            </TouchableOpacity>
            <TouchableOpacity style={{position: 'absolute', bottom: '8%', left: '6%'}}>
              <Image source={require('../../assets/ic_change_orientation.png')}/>
            </TouchableOpacity>
        </View>
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
      const {item} = this.props.navigation.state.params

      if (this._isFromChannel()) {
        // isLive
        return (<PinkRoundedLabel text={"NEXT CHANNEL"}/>)
      }

      switch (item.type) {
        case 'Episode': {
          let seasonIndex = item.seasonIndex ? item.seasonIndex : ''
          return (<PinkRoundedLabel text={"SEASON " + seasonIndex}/>)
        }
        case 'Standalone': return (<PinkRoundedLabel text={"RELATED"}/>)
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

  _renderNextInChannelItem = ({item}) => {
    console.log('nextChannelItem')
    console.log(item)

    return (
      <View style={{flexDirection: 'column', marginLeft: 8, alignSelf: 'flex-start', alignItems: 'center'}}>
        <View style={styles.nextInChannelContainer}>
          <Image source={{uri: item.videoData.originalImages[0].url}} style={{width: '100%', height: '100%'}}/>
        </View>
        <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.nextInChannelItemText}>{item.videoData.title}</Text>
      </View>
    )
  }

  _renderListNextInChannel = (item) => {
    if (!item || item.length === 0) return null
    return (
      <View>
        <View style={styles.listHeader}>
          <View style={styles.nextButtonContainer}>
            <PinkRoundedLabel text={"NEXT"}/>
          </View>
        </View>
        <FlatList
          horizontal={true}
          data={item}
          showsHorizontalScrollIndicator={false}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderNextInChannelItem}
        />
      </View>
    )
  }

  _renderListApps = (item) => {
    
  }

  _renderListEpgInSameTime = ({item}) => {
    if (!item || item.length === 0) return null
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
          data={item}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderListVideoItem}/>
      </View>
    )
  }

  _keyExtractor = (item, index) => index;

  _renderList = ({item}) => {
    console.log('RenderList')
    console.log(item)
    // data is list of epgs
    if (this._isFromChannel()) {
      return (
        <View>
          {this._renderListNextInChannel(item)}
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
            data={item}
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

  _isOldData = (list, isLive) => {
    if (isLive) {
      // EPG should have channelId
      if (list.length > 0) {
        return list.every(x => x.channelId)
      }
      else return false
    }
    else {
      // EPG should have contentId
      if (list.length > 0) {
        return list.every(x => x.contentId)
      }
      else return false
    }
  }

  render() {
    // EPGs is EPG array, video is an EPG or videoModel depend on videoType
    const {epg, epgSameTime} = this.props;
    const {item, isLive} = this.props.navigation.state.params

    if (isLive && !item)
      return null
    else if (!epg || !epg.data || !item)
      return null;
    else if (this._isOldData(epg.data, isLive))
      return null

    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor='#00000000'
          barStyle='light-content'/>
        <SectionList
          style={styles.container}
          keyExtractor={this._keyExtractor}
          stickySectionHeadersEnabled={false}
          //onScroll={(e) => this._onScroll(e)}
          sections={[
            {data: [item],showHeader: false, renderItem: this._renderBanner},
            {data: [item], renderItem: this._renderBannerInfo},
            {data: [epg.data],showHeader: false, renderItem: this._renderList},
            {data: [epgSameTime.data], showHeader: false, renderItem: this._renderListEpgInSameTime}
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
    flexDirection: 'column',
    height: 265,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bannerThumbnailContainer: {
    marginTop: 15,
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
  },
  nextInChannelContainer: {
    borderRadius: 4,
    borderWidth: 2,
    overflow: 'hidden',
    borderColor: "#95989A",
    width: 150,
    height: 75,
    marginVertical: 5,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextInChannelItemText: {
    marginTop: 18,
    color: colors.textMainBlack,
    fontSize: 15
  }
})

const fakeBannerData = {
  url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'
}


