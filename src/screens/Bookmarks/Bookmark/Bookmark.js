import React from 'react'
import {
  Text, View, SectionList, Button, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, Platform,
  Dimensions
} from 'react-native'
import HorizontalVideoThumbnail from '../../../components/HorizontalVideoThumbnail'
import PinkRoundedLabel  from '../../../components/PinkRoundedLabel'
import VideoThumbnail from '../../../components/VideoThumbnail'
import { colors } from '../../../utils/themeConfig'
import Modal from '../../../components/DeleteBookmarModal'

export default class Bookmark extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false,
      data: {}
    }
  }

  _toggleModal = (data) => {
    const {openModal} = this.state

    console.log('Toggle ' + data)

    this.setState({
      openModal: !openModal,
      data: data
    })
  }

  _renderListFooter = () => (
    <View style={{width: '100%', height: Dimensions.get("window").height*0.08 + 20, backgroundColor:'transparent'}}/>
  )

  _keyExtractor = (item, index) => index

  _renderListBookmarks = ({data}) => {
    return (
      <View style={styles.bookmarkSection}>
        <View style={styles.bookmarkLabelContainer}>
          <PinkRoundedLabel text="BOOKMARK" style={styles.bookingHeaderLabel}/>
          <View style={styles.textInputContainer}>
            <TextInput placeholder={'Emissions'} style={styles.textInput} underlineColorAndroid='rgba(0,0,0,0)' inlineImageLeft='ic_search' inlineImagePadding={8}/>
            <Image source={require('../../../assets/ic_close.png')} style={{position: 'absolute', right: 10, top: 0}}/>
          </View>
        </View>
        <FlatList
          style={styles.listBookmarks}
          horizontal={false}
          data={fakeList}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderBookmarkItem}/>
      </View>
    )
  }

  _renderBookmarkItem = ({item}) => {
    return (
      <View>
        <HorizontalVideoThumbnail item={item}/>
        <TouchableOpacity style={styles.deleteButton} onPress={() => this._toggleModal(item)}>
          <Text style={styles.deleteTextStyle}>Delete</Text>
        </TouchableOpacity>
      </View>
    )
  }


  _renderScheduledItem = ({item}) => {
    return (
      <View style={styles.horizontalItemContainer}>
        <VideoThumbnail imageUrl={item.videoData.originalImages[0].url} marginHorizontal={17}/>
        <Text style={styles.textTitle}>{item.videoData.title}</Text>
        <Text style={styles.textType}>{item.videoData.type}</Text>
        <Text style={styles.textTime}>15/07 - 15h30 to 17h15</Text>
        <TouchableOpacity style={styles.closeIcon}>
          <Image source={require('../../../assets/ic_close.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderListScheduledRecords = ({data}) => {
      return(
        <View style={{flexDirection: 'column'}}>
          <PinkRoundedLabel text="MY SCHEDULED RECORD" style={styles.myScheduledRecordLabel}/>
          <FlatList
            style={styles.listScheduledRecord}
            horizontal={true}
            data={fakeList}
            keyExtractor={this._keyExtractor}
            showsHorizontalScrollIndicator={false}
            renderItem={this._renderScheduledItem}/>
        </View>
      )
  }

  render() {

    console.log('render bookmark')
    return (
      <View style={styles.container}>
        <Modal animationType={'fade'} transparent={true} visible={this.state.openModal} type={'bookmark'} onClosePress={() => this._toggleModal({})} data={this.state.data}/>
        <SectionList
          style={styles.container}
          keyExtractor={this._keyExtractor}
          stickySectionHeadersEnabled={false}
          onEndReachedThreshold={20}
          ListFooterComponent={this._renderListFooter}
          sections={[
            {data: [fakeList], renderItem: this._renderListScheduledRecords},
            {data: [fakeList], renderItem: this._renderListBookmarks}
          ]}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  myScheduledRecordLabel: {
    width: 479,
    marginLeft: 143,
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
    marginTop: 18,
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
