import React from 'react'
import {SectionList, FlatList,Text, View, Image, ImageBackground, StyleSheet, StatusBar, Platform} from 'react-native'
import {colors} from '../utils/themeConfig'
import PinkRoundedLabel from './PinkRoundedLabel'

export default class LowerPageComponent extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  _renderBanner = ({item}) => {
      return (
        <View style={styles.topContainer}>
            <View style={styles.bannerContainer}>
              <Image source={{uri: item.url}} style={styles.banner}/>
            </View>
        </View>
      )
  }

  _renderBannerInfo = ({item}) => {
    let currentItem = item.EPGs[0]
    return (
      <View style={{flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.bannerInfoContainer}>
          <View style={{flexDirection: 'column', flex: 1, justifyContent: 'flex-start'}}>
            <Text style={styles.videoTitleText}>{currentItem.videoData.title}</Text>
            <Text style={styles.videoTypeText}>{currentItem.videoData.type}</Text>
          </View>
          <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
            <Image source={require('../assets/lowerpage_playbtn.png')} style={styles.videoPlayButton}/>
            <Image source={require('../assets/lowerpage_heart.png')} style={styles.videoLoveButton}/>
            <Image source={require('../assets/share.png')} style={styles.videoShareButton}/>
          </View>
        </View>
        <View style={styles.videoSpecificInfo}>
          <Text style={{fontSize: 12, color: '#ACACAC'}}>{currentItem.videoData.longDescription}</Text>
        </View>
      </View>
    )
  }

  _keyExtractor = (item, index) => index;

  _renderList = ({item}) => {
    let currentList = item.EPGs.slice(1)
    return (
      <View>
        <View style={styles.listHeader}>
          <View style={styles.nextButtonContainer}>
            <PinkRoundedLabel text="NEXT"/>
          </View>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/arte.png')}/>
          </View>
        </View>
        <FlatList
        style={styles.list}
        horizontal={false}
        data={currentList}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderListVideoItem}/>
      </View>
    )
  }

  _timeFormatter(time) {
    let date = new Date(time)
    let hours = date.getHours()
    let minutes = date.getMinutes()
    return ((hours < 10 ? '0' + hours : hours) + ":" + (minutes < 10 ? '0' + minutes : minutes))
  }

  _renderListVideoItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <Image
          style={styles.videoThumnbail}
          source={{uri: item.url ? item.url : fakeBannerData.url}}
        />
        <View style={styles.itemInformationContainer}>
          <Text style={styles.itemTitle}>{item.videoData.title}</Text>
          <Text style={styles.itemType}>{item.videoData.type}</Text>
          <Text style={styles.itemTime}>{this._timeFormatter(item.startTime)} - {this._timeFormatter(item.endTime)}</Text>
        </View>
        <View style={styles.itemActionsContainer}>
          <Image source={require('../assets/lowerpage_playbtn.png')} style={styles.itemPlayButton}/>
          <Image source={require('../assets/lowerpage_heart.png')} style={styles.itemLoveButton}/>
        </View>
      </View>
    )
  }

  render() {
    const {epgs} = this.props;
    if (!epgs.data)
      return null;

    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <StatusBar
          translucent={true}
          backgroundColor='#00000000'
          barStyle='light-content' />
        <SectionList
          style={styles.container}
          keyExtractor={this._keyExtractor}
          stickySectionHeadersEnabled={false}
          sections={[
            {data: [fakeBannerData],showHeader: false, renderItem: this._renderBanner},
            {data: [epgs.data], renderItem: this._renderBannerInfo},
            {data: [epgs.data],showHeader: false, renderItem: this._renderList},
          ]}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  topContainer: {
    flexDirection: 'row',
    height: 226,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    marginTop: 40,
    height: 164,
    width: '92%',
    backgroundColor: colors.whitePrimary,
    borderRadius: (Platform.OS === 'ios') ? 4 : 8
  },
  list: {
    width: '100%',
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
    flexDirection: 'column'
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
  bannerInfoContainer: {
    width: '90%',
    height: 35,
    flexDirection: 'row'
  },
  videoTitleText: {
    fontSize: 16,
    color: colors.textMainBlack
  },
  videoTypeText: {
    fontSize: 12,
    color: '#383838'
  },
  videoSpecificInfo: {
    width: '90%',
    marginTop: 15,
    maxHeight: 162,
    height: 162,
    flexDirection: 'column',
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
    flexDirection: 'row'
  }
})

const fakeBannerData = {
  url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'
}

// const fakeBannerInfoData = {
//   title: 'At Frida Kahlo’s',
//   type: 'Drama',
//   specificInfo: 'The Blue House” located in Mexico City, is the home where Frida Kahlo was born (1907) and would die (1954). She is surrounded not only by painter Diego Rivera, but also by Leon Trotsky, André Breton, Sergei Eisenstein, Pablo Neruda, Waldo Frank, Pablo Picasso, Marcel Duchamp, Vassily Kandinsky, etc'
// }
//
// const fakeListData = [
//   {key: 'Nicolas',type: 'Drama',start_time: '21h30',end_time: '22h30', url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'},
//   {key: 'Gorrilas in Danger',type: 'Documentary',start_time: '21h30',end_time: '22h30', url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'},
//   {key: 'I\'m Roger Casement',type: 'Art-Dance',start_time: '21h30',end_time: '22h30', url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'},
//   {key: 'Aaron',type: 'Concert',start_time: '21h30',end_time: '22h30', url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'},
//   {key: 'The Mythes - Orphee',type: 'Documentary',start_time: '21h30',end_time: '22h30', url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'},
//   {key: 'Art of Movie',type: 'Documentary',start_time: '22h30',end_time: '23h15',url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'}]
