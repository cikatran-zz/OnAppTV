import React from 'react'
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, NativeModules } from 'react-native'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import Modal from '../../components/DeleteBookmarModal'
import VideoThumbnail from '../../components/VideoThumbnail'
import { colors } from '../../utils/themeConfig'
import { secondFormatter, timeFormatter } from '../../utils/timeUtils'

export default class RecordList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      data: {}
    }
  };

  _toggleModal = (item) => {

    if (item || item === -1) {
      // Open modal & close modal normally
      this.setState({
        openModal: !this.state.openModal,
        data: item
      })
    }
    else {
      // Delete
      const {downloaded, downloadedUserKit} = this.props
      const {data} = this.state

      let deletedList = [].concat(downloadedUserKit).filter(x => x.contentId !== data.contentId)

      let target = {
        remove_flag: 1,
        destination_path: data.destination_path,
        url: data.url
      }

      NativeModules.STBManager.mediaDownloadStopWithJson(JSON.stringify(target), (error, events) => {
        console.log('MediaRemove')
        if (JSON.parse(events[0]).return === 1) {

          NativeModules.RNUserKit.storeProperty("download_list", {dataArr: deletedList}, (e, r) => {
          })

          this.setState({
            openModal: !this.state.openModal,
            data: {},
            dataArr: deletedList
          })
        }
        else {
          console.log('Stop downloading file falure!')
          console.log(target)
        }
      })
    }
  }

  _getSubtitle = (item) => {
    if (item.type === 'Episode') {
      return 'Season ' + item.seasonIndex + ' - Episode ' + item.episodeIndex
    }
    else if (item.type === undefined) {
      return item.subTitle
    }
    else return item.type
  }

  _playPvr = (item) => {
    this.props.navigation.navigate('LocalVideoModal', {item: item, epg: [item], isLive: false})
  }

  _keyExtractor = (item, index) => index

  _renderItem = ({item}) => {

        return (
          <TouchableOpacity style={styles.itemContainer} onPress={() => this._playPvr(item)}>
            <VideoThumbnail imageUrl={item.originalImages[0].url} marginHorizontal={17}/>
            <View style={{flexDirection: 'column', marginRight: 60}}>
              <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode={'tail'}>{item.title}</Text>
              <Text style={styles.itemType}>{this._getSubtitle(item)}</Text>
              <Text style={styles.itemTime}>{secondFormatter(item.durationInSeconds)}</Text>
            </View>
            <TouchableOpacity style={styles.optionIcon} onPress={() => this._toggleModal(item)}>
              <Image source={require('../../assets/ic_three_dots.png')}/>
            </TouchableOpacity>
          </TouchableOpacity>
        )

  }

  _renderListFooter = () => (
    <View style={{width: '100%', height: Dimensions.get("window").height*0.08 + 20, backgroundColor:'transparent'}}/>
  )

  _isInDownloaded = (item, downloadedList) => {
    if (!item || !downloadedList) return false
    // Log & Temp file for checking download complete
    let tempFile = item.fileName + ".tmp"
    let logFile = item.fileName + ".log"
    return downloadedList.some((x) => x.fileName === item.fileName) && downloadedList.every((x) => x.fileName !== tempFile && x.fileName !== logFile)
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('ShouldComponentUpdate')
    console.log(nextProps)
    console.log(nextState)
    return true
  }

  _recordTransform = (item) => {
    let metaData = JSON.parse(item.metaData)
    return {
      title: metaData.title,
      durationInSeconds: item.duration,
      originalImages: [{
        url: metaData.image
      }],
      subTitle: metaData.subTitle
    }
  }

  render() {
    const {header, pvrList, downloaded, downloadedUserKit} = this.props;
    const {data, listRecords} = this.state
    let dataArr

    if (pvrList) dataArr = pvrList.map(x => this._recordTransform(x))
    else dataArr = downloadedUserKit ? downloadedUserKit.filter(x => this._isInDownloaded(x, downloaded)) : []

    return (
      <View style={styles.container}>
        <Modal animationType={'fade'} transparent={true} visible={this.state.openModal} type={'record'} onClosePress={this._toggleModal} data={data}/>
        <PinkRoundedLabel text={header} style={styles.headerLabel}/>
        <View style={{width: '100%'}}>
        <TextInput style={styles.textInput}
                   placeholder={'Search'}
                   inlineImageLeft='ic_search'
                   inlineImagePadding={8}
                   underlineColorAndroid='rgba(0,0,0,0)'
        />
        </View>
        <FlatList
          style={styles.list}
          horizontal={false}
          keyExtractor={this._keyExtractor}
          data={dataArr}
          renderItem={this._renderItem}
          ListFooterComponent={this._renderListFooter}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  list: {
    marginTop: 20,
    width: '100%',
  },
  textInput: {
    height: 29,
    marginLeft: 13,
    marginRight: 13,
    marginTop: 27,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 15,
    borderColor: '#95989A',
    borderWidth: 1,
  },
  itemContainer: {
    flexDirection: 'row',
  },
  headerLabel: {
    textAlign: 'center',
    marginTop: 21,
    borderRadius: 0,
    fontSize: 10
  },
  optionIcon: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '40%',
    right: 15,
    height: '20%',
    width: '10%'
  },
  itemTitle: {
    marginTop: 12,
    marginLeft: 10,
    color: colors.textMainBlack,
    fontWeight: 'bold',
    fontSize: 15
  },
  itemType: {
    marginTop: 2,
    marginLeft: 10,
    color: '#ACACAC',
    fontSize: 12
  },
  itemTime: {
    marginTop: 1,
    marginLeft: 10,
    color: '#ACACAC',
    fontSize: 12
  }
})
