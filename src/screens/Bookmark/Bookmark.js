import React from 'react'
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    SectionList,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    NativeModules
} from 'react-native'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import VideoThumbnail from '../../components/VideoThumbnail'
import {colors} from '../../utils/themeConfig'
import Modal from '../../components/DeleteBookmarModal'
import {timeFormatter} from '../../utils/timeUtils'
import { checkInTime } from '../../book-download-util/bookUtils'

export default class Bookmark extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false,
      data: {}
    }
  }

  _toggleModal = (data) => {

    if (data || data === -1) {
      // Open modal & close modal normally
      this.setState({
        openModal: !this.state.openModal,
        data: data
      })
    }
    else {
      // Delete
      const {listData, data} = this.state
      NativeModules.STBManager.deletePvrBookWithJson(JSON.stringify(data), (error, events) => {
        if (JSON.parse(events[0]).return !== 1) {
          console.log('Delete Pvr in bookmark error %s')
          console.log(data)
        }
        else {
          console.log('Delete PVR successfully!')
          let newArray = listData.slice()
          let index = newArray.indexOf(data)
          newArray.splice(index, 1)

          this.setState({
            openModal: !this.state.openModal,
            data: {},
            listData: newArray
          })
        }
      })
    }

  }

  _renderListFooter = () => (
    <View style={{width: '100%', height: Dimensions.get("window").height*0.08 + 20, backgroundColor:'transparent'}}/>
  )

  _keyExtractor = (item, index) => index

  _renderListBookmarks = ({item}) => {

    return (
      <View style={styles.bookmarkSection}>
        <View style={styles.bookmarkLabelContainer}>
          <PinkRoundedLabel text="BOOKING" style={styles.bookingHeaderLabel}/>
          <View style={styles.textInputContainer}>
            <TextInput placeholder={'Emissions'} onChangeText={text => this.setState({inputText: text})} value={this.state.inputText ?  this.state.inputText : ''} style={styles.textInput} inlineImageLeft='ic_search' inlineImagePadding={8} underlineColorAndroid='rgba(0,0,0,0)'/>
            <TouchableOpacity onPress={() => this.setState({inputText: ''})} style={{position: 'absolute', right: 0, top: 0, paddingRight: 7, height: '100%', width: '10%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
              <Image source={require('../../assets/ic_close.png')} />
            </TouchableOpacity>
          </View>
        </View>
        {this._bookmarkListOrNon(item)}
      </View>
    )
  }

  _renderBookmarkItem = ({item}) => {
    console.log(JSON.stringify(item))

    return (
      <View style={{flexDirection: 'row'}}>
        <VideoThumbnail imageUrl={item.metaData.image} marginHorizontal={17}/>
        <View style={{flexDirection: 'column', marginRight: 60}}>
          <Text style={styles.itemTitle}>{item.metaData.title}</Text>
          <Text style={styles.itemType}>{item.metaData.subTitle}</Text>
          <Text style={styles.itemTime}>{timeFormatter(item.record.startTime)}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => this._toggleModal(item)}>
          <Text style={styles.deleteTextStyle}>Delete</Text>
        </TouchableOpacity>
      </View>
    )
  }


  _renderScheduledItem = ({item}) => {
    return (
      <View style={styles.horizontalItemContainer}>
        <VideoThumbnail imageUrl={item.metaData.image} marginHorizontal={17}/>
        <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.textTitle}>{item.metaData.title}</Text>
        <Text style={styles.textType}>{item.metaData.subTitle}</Text>
        <Text style={styles.textTime}>{timeFormatter(item.record.startTime)} - {item.metaData.endtime}</Text>
        <TouchableOpacity style={styles.closeIcon}>
          <Image source={require('../../assets/ic_close.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderListScheduledRecords = ({item}) => {
      return(
        <View style={{flexDirection: 'column'}}>
          {this._recordListOrNon(item)}
        </View>
      )
  }

  componentWillReceiveProps(nextProps) {
    const {books} = nextProps
    if (books.data) {
      if (!this.state.listData || books.data.length < this.state.listData.length) {
        this.setState({
          listData: books.data
        })
      }
    }
  }

  _recordListOrNon = (item) => {
    if (item.length === 0) {
      return (
        <View style={{flexDirection: 'column', height: 156, marginLeft: 8, alignSelf: 'flex-start', alignItems: 'center'}}>
            <View style={styles.noBookmarkContainer}>
              <Text style={{color: colors.blackNoBooking, fontSize: 15}}>NO RECORD</Text>
            </View>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.textTitle]}>No record</Text>
        </View>
      )
    }
    else {
      return (
        <FlatList
          style={styles.listScheduledRecord}
          horizontal={true}
          data={item}
          keyExtractor={this._keyExtractor}
          showsHorizontalScrollIndicator={false}
          renderItem={this._renderScheduledItem}/>
      )
    }
  }

  _bookmarkListOrNon = (item) => {
    if (item.length === 0) {
      return (
        <View style={{flexDirection: 'row', marginTop: '4%', width: '100%'}}>
          <View style={styles.noBookmarkContainer}>
            <Text style={{color: colors.blackNoBooking, fontSize: 15}}>NO BOOKING</Text>
          </View>
          <View style={{flexDirection: 'column', width: '100%'}}>
            <Text style={styles.itemTitle}>No booking</Text>
            <Text style={styles.itemType}>No details</Text>
          </View>
        </View>
      )
    }
    else {
      return (
        <FlatList
          style={styles.listBookmarks}
          horizontal={false}
          data={item}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderBookmarkItem}/>
      )
    }
  }

  render() {
    const {listData} = this.state

    let recording = listData ? listData.filter(x => checkInTime(x.record.startTime, x.record.duration)) : []

    return (
      <View style={styles.container}>

        <Modal animationType={'fade'} transparent={true} visible={this.state.openModal} type={'bookmark'} onClosePress={this._toggleModal} data={this.state.data}/>
        <View style={styles.myScheduledRecordContainer}>
        <PinkRoundedLabel text="MY SCHEDULED RECORD" style={styles.myScheduledRecordLabel}/>
        </View>
        <SectionList
          style={styles.container}
          keyExtractor={this._keyExtractor}
          stickySectionHeadersEnabled={false}
          onEndReachedThreshold={20}
          ListFooterComponent={this._renderListFooter}
          sections={[
            {data: [recording], renderItem: this._renderListScheduledRecords},
            {data: [listData ? listData : []], renderItem: this._renderListBookmarks}
          ]}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  },
  myScheduledRecordLabel: {
    width: 479,
    fontSize: 10,
  },
  myScheduledRecordContainer: {
    height: '8%',
    marginTop: 21,
    marginLeft: '38%',
    paddingLeft: 15,
  },
  bookingHeaderLabel: {
    width: 85,
    textAlign: 'center',
    fontSize: 10
  },
  listScheduledRecord: {
    width: '100%',
    height: 156,
    marginLeft: 8,
  },
  horizontalItemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTitle: {
    marginTop: 15,
    color: colors.textMainBlack,
    fontSize: 15
  },
  textType: {
    marginTop: 2,
    color: colors.greyDescriptionText,
    fontSize: 12
  },
  textTime: {
    marginTop: 2,
    color: colors.greyDescriptionText,
    fontSize: 12
  },
  bookmarkSection: {
    width: '100%',
  },
  bookmarkLabelContainer: {
    marginTop: 15,
    width: '100%',
    paddingLeft: 17,
    flexDirection: 'row'
  },
  listBookmarks: {
    marginTop: '4%',
    width: '100%',
  },
  closeIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greyCloseIconBg,
    aspectRatio: 1,
    width: 15,
    borderRadius: 7.5,
    position: 'absolute',
    top: 6,
    right: 12,
  },
  textInputContainer: {
    width: '68%',
    height: 29,
    borderRadius: 15,
    borderColor: '#95989A',
    borderWidth: 1,
    marginLeft: 10,
  },
  textInput: {
    width: '100%',
    height: '100%',
    paddingLeft: 10,
    paddingTop: 0,
    paddingBottom: 0
  },
  deleteButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '37%',
    right: 15,
    width: 44,
    height: '25%',
    borderRadius: 3,
    borderColor: 'rgba(78,78,78,0.3)',
    borderWidth: 1
  },
  deleteTextStyle: {
    color: colors.textMainBlack,
    fontSize: 9
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
  },
  noBookmarkContainer: {
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
  }
})

const fakeData = {
  url : "http://hitwallpaper.com/wp-content/uploads/2013/06/Cartoons-Disney-Company-Simba-The-Lion-King-3d-Fresh-New-Hd-Wallpaper-.jpg",
  videoData : {
    title: "Test",
    type: "Documentary",
    originalImages: [{
      url: "http://hitwallpaper.com/wp-content/uploads/2013/06/Cartoons-Disney-Company-Simba-The-Lion-King-3d-Fresh-New-Hd-Wallpaper-.jpg"
    }]
  }
}

const fakeList = [fakeData, fakeData, fakeData, fakeData, fakeData]
