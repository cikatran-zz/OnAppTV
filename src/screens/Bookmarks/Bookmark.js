import React from 'react'
import { Text, View, TextInput, StyleSheet, FlatList } from 'react-native'
import HorizontalVideoThumbnail from '../../components/HorizontalVideoThumbnail'
import PinkRoundedLabel  from '../../components/PinkRoundedLabel'
import VideoThumbnail from '../../components/VideoThumbnail'
import { colors } from '../../utils/themeConfig'

export default class Bookmark extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  _keyExtractor = (item, index) => index

  _renderListBookmarks = (data) => {
    return (
      <View style={styles.bookmarkSection}>
        <View style={styles.bookmarkLabelContainer}>
          <PinkRoundedLabel text="BOOKING"/>
        </View>
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
      </View>
    )
  }

  _renderListScheduledRecords = (data) => {
      return(
        <FlatList
          style={styles.listScheduledRecord}
          horizontal={true}
          data={data}
          keyExtractor={this._keyExtractor}
          showsHorizontalScrollIndicator={false}
          renderItem={this._renderScheduledItem}/>
      )
  }

  render() {

    return (
      <View style={styles.container}>
        <PinkRoundedLabel text="MY SCHEDULED RECORD" style={styles.myScheduledRecordLabel}/>
        {this._renderListScheduledRecords(fakeList)}
        {this._renderListBookmarks(fakeList)}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  myScheduledRecordLabel: {
    width: 479,
    marginLeft: 143,
    marginTop: 21
  },
  listScheduledRecord: {
    marginTop: 16,
    width: '100%',
    height: 156,
    marginLeft: 8
  },
  horizontalItemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  textInputSearch: {
    width: 255,
    height: 29,
    marginLeft: 10
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