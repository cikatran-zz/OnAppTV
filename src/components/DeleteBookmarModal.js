import React from 'react';

import {Image, Modal, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native'
import {colors} from '../utils/themeConfig'
import BlurView from './BlurView'
import {getBlurRadius} from '../utils/blurRadius'
import {DotsLoader} from 'react-native-indicator';


export default class DeleteBookmarkModal extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      deleteSwitch: false,
      editTitle: false
    }
  }



  _renderBookmarkContent = (data) => {
    if (!data) return null

    let metaData = data.metaData
    console.log(data)

    if (metaData)
      return (
        <View style={styles.contentContainer}>
          <Image source={{uri: metaData.image}} style={styles.banner}/>
          <Text style={styles.title}>{metaData.title}</Text>
          <View style={styles.deleteBookmarkContainer}>
            <Text style={styles.deleteText}>Delete this bookmark</Text>
            <Switch style={styles.switchToggle} value={this.state.deleteSwitch} onValueChange={(value) => { this.setState({deleteSwitch: value}) }}/>
          </View>
        </View>
      )
    else return null
  }

  _renderDeleteScreen = () => {
    this.props.onClosePress()
    console.log('delete screen')
      return (
        <View style={{flexDirection: 'column', alignItems: 'center', position: 'absolute', width: '100%'}}>
          <Text style={{fontSize: 15, color: colors.whiteBackground, marginBottom: 20}}>Deleting</Text>
          <DotsLoader color={colors.textWhitePrimary} size={20} betweenSpace={10} style={{width: '100%'}}/>
        </View>
      )
  }

  _renderRecordContent = (data) => {
      if (!data) return null
    if (data.originalImages) {

      return (
        <View style={styles.contentContainer}>
          <Image source={{uri: data.originalImages[0].url}} style={styles.banner}/>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.deleteRecordContainer}>
            <Text style={styles.deleteText}>Edit the title</Text>
            <Switch style={styles.switchToggle} value={this.state.editTitle}
                    onValueChange={(value) => { console.log(value) }}/>
          </View>
          <View style={styles.deleteRecordContainer}>
            <Text style={styles.deleteText}>Delete</Text>
            <Switch style={styles.switchToggle} value={this.state.deleteSwitch}
                    onValueChange={(value) => { this.setState({deleteSwitch: value}) }}/>
          </View>
        </View>
      )
    } else return null
  }

  _renderContent = () => {
    if (this.state.deleteSwitch === true) {
      return this._renderDeleteScreen()
    }
    else if (this.props.type === 'bookmark')
      return this._renderBookmarkContent(this.props.data)
    else return this._renderRecordContent(this.props.data)
  }

  render() {

    return (
      <Modal animationType={this.props.animationType} transparent={this.props.transparent}
      visible={this.props.visible} onRequestClose={() => console.log('Modal close')}>
        <View style={styles.modal}>
          <BlurView blurRadius={getBlurRadius(30)} style={styles.blurView} overlayColor={0x75000000}/>
          <TouchableOpacity style={styles.close} onPress={() => this.props.onClosePress(-1)}>
            <Image source={require('../assets/ic_modal_close.png')} />
          </TouchableOpacity>
          {this._renderContent()}
        </View>
      </Modal>
    )
  }

}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative'
  },
  modal: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  blurView: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  close: {
    position: 'absolute',
    top: 30,
    right: 30
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    width: '75%',
    height: '47%',
    top: '23%',
    left: '12%',
    backgroundColor: colors.whitePrimary,
    borderRadius: 13,
  },
  close: {
    position: 'absolute',
    top: 30,
    right: 30
  },
  banner: {
    width: '55%',
    height: '23%',
    marginTop: 60
  },
  title: {
    fontSize: 15,
    color: '#ACACAC',
    marginTop: 20
  },
  deleteBookmarkContainer: {
    flexDirection: 'row',
    height: 26,
    marginLeft: 50,
    marginRight: 20,
    marginTop: 50,
    width: 208,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  deleteRecordContainer: {
    flexDirection: 'row',
    height: 26,
    marginLeft: 50,
    marginRight: 20,
    marginTop: 20,
    width: 208,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  deleteText: {
    fontSize: 15,
    color: 'black'
  },
  switchToggle: {
    width: 44,
    height: 26,
    marginLeft: 22
  }
})