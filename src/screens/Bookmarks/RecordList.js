import React from 'react'
import {
  Text, View, SectionList, TextInput, StyleSheet, FlatList, TouchableOpacity, Platform,
  Image
} from 'react-native'
import HorizontalVideoThumbnail from '../../components/HorizontalVideoThumbnail'
import PinkRoundedLabel  from '../../components/PinkRoundedLabel'
import { colors } from '../../utils/themeConfig'
import Modal from './DeleteBookmarModal'

export default class RecordList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      textAlign: 'center',
      openModal: false,
      data: {}
    }
  };

  _toggleModal = (data) => {
    const {openModal} = this.state

    console.log('Toggle ' + data)

    this.setState({
      openModal: !openModal,
      data: data
    })
  }

  _keyExtractor = (item, index) => index

  _renderItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <HorizontalVideoThumbnail item={item}/>
        <TouchableOpacity style={styles.optionIcon} onPress={() => this._toggleModal(item)}>
          <Image source={require('../../assets/three_dot.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  _inputOnFocus = () => {
    this.setState({
      textAlign: 'left'
    })
  }

  _onBlurInput = () => {
    this.setState({
      textAlign: 'center'
    })
  }

  render() {
    const {header} = this.props;

    return (
      <View style={styles.container}>
        <Modal animationType={'fade'} transparent={true} visible={this.state.openModal} type={'record'} onClosePress={() => this._toggleModal({})} data={this.state.data}/>
        <PinkRoundedLabel text={header} style={styles.headerLabel}/>
        <TextInput style={[styles.textInput, { textAlign: this.state.textAlign }]}
                   placeholder={'Search'}
                   underlineColorAndroid='rgba(0,0,0,0)'
                   inlineImageLeft='ic_search'
                   inlineImagePadding={0}
                   onFocus={this._inputOnFocus}
                    onBlur={this._onBlurInput}
        />
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
    marginTop: 20,
    width: '100%',
  },
  textInput: {
    marginLeft: 13,
    marginRight: 13,
    marginTop: 27,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
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