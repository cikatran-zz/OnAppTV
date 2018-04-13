import React from 'react'
import {
  Text, View, StyleSheet, TextInput, ImageBackground, Image, FlatList, TouchableOpacity
} from 'react-native'
import { colors } from '../../utils/themeConfig'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import SettingItem from '../../components/SettingItem'
import SettingHeader from '../../components/NavigationHeader'

export default class Messages extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      openedIndex : -1,
      message : 'default message'
    }
  }

  _toggleOpen = (index, message) => {
    const {openedIndex} = this.state

    if (openedIndex === index) this.setState({ openedIndex : -1, message : 'default message' })
    else this.setState({ openedIndex : index, message: message })
  }

  _renderMessageContent = (isOpen, message) => {
    if (isOpen) {
      return <Text style={styles.itemMessageText}>{message}</Text>
    }
    else return null
  }

  _renderMessage = ({item,  index}) => {
    const {openedIndex} = this.state

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => this._toggleOpen(index, item.message)}>
        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require('../../assets/ic_pincode_pink.png')}/>
          <Text style={styles.itemNameText}>{item.name}</Text>
          <Image source={require('../../assets/ic_three_dots.png')} style={styles.itemThreeDots}/>
        </View>
        {this._renderMessageContent(openedIndex === index, item.message)}
      </TouchableOpacity>
    )
  }

  render() {

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.listMess}
          horizontal={false}
          renderItem={this._renderMessage}
          keyExtractor={(item, index) => index}
          data={fakeData}
          extraData={this.state}
        />
        <View >
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteBackground,
    position: 'relative',
    flexDirection: 'column',
  },
  listMess: {
    width: '100%',
    marginTop: 40,
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 17,
    minHeight: 42,
  },
  itemNameText: {
    fontSize: 16,
    color: 'black',
    marginRight: 'auto',
    marginLeft: 12
  },
  itemMessageText: {
    fontSize: 17,
    color: 'black',
    marginTop: 24,
    marginBottom: 24
  },
  itemCircle: {
    tintColor: colors.mainPink
  },
  itemThreeDots: {
    marginRight: 15
  }
})

const fakeData = [{
  name: 'Bein Sport Free for 3 months',
  message: '03/04/2017\n' +
  '\n' +
  'Dear Subscriber,\n' +
  '\n' +
  'National Geographic is now part of your bouquet \n' +
  'for the same price.\n' +
  'We are sure you will enjoy to watch the encredible \n' +
  'wild documentaries. \n' +
  '\n' +
  '\n' +
  'Sincerely,\n' +
  '\n' +
  'ON TV'
},
  {
    name: 'Hardware Version',
    message: '03/04/2017\n' +
    '\n' +
    'Dear Subscriber,\n' +
    '\n' +
    'National Geographic is now part of your bouquet \n' +
    'for the same price.\n' +
    'We are sure you will enjoy to watch the encredible \n' +
    'wild documentaries. \n' +
    '\n' +
    '\n' +
    'Sincerely,\n' +
    '\n' +
    'ON TV'
  },
  {
    name: 'Bootloader Version',
    message: '03/04/2017\n' +
    '\n' +
    'Dear Subscriber,\n' +
    '\n' +
    'National Geographic is now part of your bouquet \n' +
    'for the same price.\n' +
    'We are sure you will enjoy to watch the encredible \n' +
    'wild documentaries. \n' +
    '\n' +
    '\n' +
    'Sincerely,\n' +
    '\n' +
    'ON TV'
  },
  {
    name: 'Your August\' invoice',
    message: '03/04/2017\n' +
    '\n' +
    'Dear Subscriber,\n' +
    '\n' +
    'National Geographic is now part of your bouquet \n' +
    'for the same price.\n' +
    'We are sure you will enjoy to watch the encredible \n' +
    'wild documentaries. \n' +
    '\n' +
    '\n' +
    'Sincerely,\n' +
    '\n' +
    'ON TV'
  },
  {
    name: 'A new channel in your bouquet',
    message: '03/04/2017\n' +
    '\n' +
    'Dear Subscriber,\n' +
    '\n' +
    'National Geographic is now part of your bouquet \n' +
    'for the same price.\n' +
    'We are sure you will enjoy to watch the encredible \n' +
    'wild documentaries. \n' +
    '\n' +
    '\n' +
    'Sincerely,\n' +
    '\n' +
    'ON TV'
  }]