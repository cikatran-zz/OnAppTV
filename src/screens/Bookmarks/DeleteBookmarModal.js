import React, { Component } from 'react';

import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  StyleSheet, Image, TouchableOpacity, Switch
}
  from 'react-native'
import { colors } from '../../utils/themeConfig'
import BlurView from '../../components/BlurView'

export default class DeleteBookmarkModal extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  _renderBookmarkContent = (data) => {

    if (data.videoData)
      return (
        <View style={styles.contentContainer}>
          <Image source={{uri: data.url}} style={styles.banner}/>
          <Text style={styles.title}>{data.videoData.title}</Text>
          <View style={styles.deleteBookmarkContainer}>
            <Text style={styles.deleteText}>Delete this bookmark</Text>
            <Switch style={styles.switchToggle}/>
          </View>
        </View>
      )
    else return null
  }

  _renderRecordContent = (data) => {

    if (data.videoData)
      return (
        <View style={styles.contentContainer}>
          <Image source={{uri: data.url}} style={styles.banner}/>
          <Text style={styles.title}>{data.videoData.title}</Text>
          <View style={styles.deleteRecordContainer}>
            <Text style={styles.deleteText}>Edit the title</Text>
            <Switch style={styles.switchToggle}/>
          </View>
          <View style={styles.deleteRecordContainer}>
            <Text style={styles.deleteText}>Delete</Text>
            <Switch style={styles.switchToggle}/>
          </View>
        </View>
      )
    else return null
  }

  _renderContent = () => {
    if (this.props.type === 'bookmark')
      return this._renderBookmarkContent(this.props.data)
    else return this._renderRecordContent(this.props.data)
  }

  render() {

    return (
      <Modal animationType={this.props.animationType} transparent={this.props.transparent}
      visible={this.props.visible} onRequestClose={() => console.log('Modal close')}>
        <View style={styles.modal}>
          <BlurView blurRadius={30} style={styles.blurView} overlayColor={0}/>
          <TouchableOpacity style={styles.close} onPress={this.props.onClosePress}>
            <Image source={require('../../assets/ic_modal_close.png')} />
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
    alignItems: 'center'
  },
  blurView: {
    width: '100%',
    height: '100%'
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