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
    View
} from 'react-native'
import HorizontalVideoThumbnail from '../../components/HorizontalVideoThumbnail'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import VideoThumbnail from '../../components/VideoThumbnail'
import {colors} from '../../utils/themeConfig'
import Modal from '../../components/DeleteBookmarModal'
import {timeFormatter} from '../../utils/timeUtils'

export default class Bookmark extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false,
      data: {},
    }
  }

  _toggleModal = (data) => {
    console.log('data')
    console.log(data)

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
      let newArray = listData.slice()
      let index = newArray.indexOf(data)
      newArray.splice(index, 1)
      console.log('Delete')
      console.log(newArray)

      this.setState({
        openModal: !this.state.openModal,
        data: {},
        listData: newArray
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
          <PinkRoundedLabel text="BOOKMARK" style={styles.bookingHeaderLabel}/>
          <View style={styles.textInputContainer}>
            <TextInput placeholder={'Emissions'} style={styles.textInput} underlineColorAndroid='rgba(0,0,0,0)'/>
            <Image source={require('../../assets/ic_close.png')} style={{position: 'absolute', right: 10, top: 0}}/>
          </View>
        </View>
        <FlatList
          style={styles.listBookmarks}
          horizontal={false}
          data={item}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderBookmarkItem}/>
      </View>
    )
  }

  _renderBookmarkItem = ({item}) => {
    return (
      <View>
        <HorizontalVideoThumbnail item={item.metaData}/>
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
        <Text style={styles.textTitle}>{item.metaData.title}</Text>
        <Text style={styles.textType}>{item.metaData.subTitle}</Text>
        <Text style={styles.textTime}>{timeFormatter(item.record.startTime)}</Text>
        <TouchableOpacity style={styles.closeIcon}>
          <Image source={require('../../assets/ic_close.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderListScheduledRecords = ({item}) => {
      return(
        <View style={{flexDirection: 'column'}}>
          <PinkRoundedLabel text="MY SCHEDULED RECORD" style={styles.myScheduledRecordLabel}/>
          <FlatList
            style={styles.listScheduledRecord}
            horizontal={true}
            data={item}
            keyExtractor={this._keyExtractor}
            showsHorizontalScrollIndicator={false}
            renderItem={this._renderScheduledItem}/>
        </View>
      )
  }

  render() {
    const {books} = this.props;
    if (books.data) {
        if (!this.state.listData || books.data.length < this.state.listData.length) {
            this.setState({
              listData: books.data
            })
        }
    }

    return (
      <View style={styles.container}>
        <StatusBar translucent={true}
                   backgroundColor='#00000000'
                   barStyle='dark-content'/>
        <Modal animationType={'fade'} transparent={true} visible={this.state.openModal} type={'bookmark'} onClosePress={this._toggleModal} data={this.state.data}/>
        <SectionList
          style={styles.container}
          keyExtractor={this._keyExtractor}
          stickySectionHeadersEnabled={false}
          onEndReachedThreshold={20}
          ListFooterComponent={this._renderListFooter}
          sections={[
            {data: [this.state.listData], renderItem: this._renderListScheduledRecords},
            {data: [this.state.listData], renderItem: this._renderListBookmarks}
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
    marginLeft: '38%',
    marginTop: 21,
    paddingLeft: 15,
    fontSize: 10
  },
  bookingHeaderLabel: {
    width: 85,
    textAlign: 'center',
    fontSize: 10
  },
  listScheduledRecord: {
    marginTop: 16,
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
    marginTop: 26,
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
    top: 42,
    right: 15,
    width: 44,
    height: 18,
    borderRadius: (Platform.OS === 'ios') ? 6 : 3,
    borderColor: colors.blackDeleteButton,
    borderWidth: 1
  },
  deleteTextStyle: {
    color: colors.textMainBlack,
    fontSize: 9
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
