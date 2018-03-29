import React from 'react'
import {
  Text, View, SectionList, TextInput, StyleSheet, FlatList, TouchableOpacity, Platform,
  Image
} from 'react-native'
import HorizontalVideoThumbnail from '../../components/HorizontalVideoThumbnail'
import PinkRoundedLabel  from '../../components/PinkRoundedLabel'
import { colors } from '../../utils/themeConfig'

export default class RecordList extends React.PureComponent {
  constructor(props) {
    super(props);
  };

  _keyExtractor = (item, index) => index

  _renderItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <HorizontalVideoThumbnail item={item}/>
        <TouchableOpacity style={styles.optionIcon}>
          <Image source={require('../../assets/three_dot.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const {header} = this.props;

    return (
      <View style={styles.container}>
        <PinkRoundedLabel text={header} style={styles.headerLabel}/>
        <TextInput style={styles.textInput} placeholder={'Search'}/>
        <FlatList
          style={styles.list}
          horizontal={false}
          keyExtractor={this._keyExtractor}
          data={fakeList}
          renderItem={this._renderItem}
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
    marginTop: 50,
    width: '100%',
  },
  textInput: {
    marginLeft: 13,
    marginRight: 13,
    marginTop: 27,
    paddingTop: 0,
    paddingBottom: 0,
    textAlign: 'center',
    borderRadius: 15,
    borderColor: '#95989A',
    borderWidth: 1
  },
  itemContainer: {
    flexDirection: 'row'
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
    top: 48,
    right: 15,
    height: 4
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