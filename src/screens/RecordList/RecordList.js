import React from 'react'
import {Dimensions, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native'
import HorizontalVideoThumbnail from '../../components/HorizontalVideoThumbnail'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import Modal from '../../components/DeleteBookmarModal'

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

  _keyExtractor = (item, index) => index

  _renderItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <HorizontalVideoThumbnail item={item.metaData}/>
        <TouchableOpacity style={styles.optionIcon} onPress={() => this._toggleModal(item)}>
          <Image source={require('../../assets/three_dot.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderListFooter = () => (
    <View style={{width: '100%', height: Dimensions.get("window").height*0.08 + 20, backgroundColor:'transparent'}}/>
  )

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
    const {header, books} = this.props;
    if (books.data) {
      if (!this.state.listData || books.data.length < this.state.listData.length) {
        this.setState({
          listData: books.data
        })
      }
    }

    return (
      <View style={styles.container}>
        <Modal animationType={'fade'} transparent={true} visible={this.state.openModal} type={'record'} onClosePress={this._toggleModal} data={this.state.data}/>
        <PinkRoundedLabel text={header} style={styles.headerLabel}/>
        <TextInput style={[styles.textInput, { textAlign: this.state.textAlign }]}
                   placeholder={'Search'}
                   underlineColorAndroid='rgba(0,0,0,0)'
                   onFocus={this._inputOnFocus}
                    onBlur={this._onBlurInput}
        />
        <FlatList
          style={styles.list}
          horizontal={false}
          keyExtractor={this._keyExtractor}
          data={books.data}
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