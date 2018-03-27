import React from 'react'
import {
  Text, ImageBackground, View, StyleSheet, FlatList, SectionList, Image, StatusBar,
  TouchableOpacity
} from 'react-native'
import { colors } from '../../utils/themeConfig'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'

export default class Settings extends React.PureComponent {

  constructor(props) {
    super(props)
    console.log("Constructor")
  }

  _keyExtractor = (item, index) => index

  _renderSettingItem = ({item}) => {
    const {navigation} = this.props

    return (
      <View style={styles.settingItemContainer}>
        <Image source={require('../../assets/ic_wifi.png')} style={styles.settingItemIcon}/>
        <Text style={styles.settingItemName}>{item.name}</Text>
        <TouchableOpacity style={{marginLeft: 'auto', flexDirection: 'row', alignItems: 'center'}} onPress={() => navigation.navigate('AudioLanguage', {})}>
          <Text style={styles.settingItemValue}>{item.value}</Text>
          <Image source={require('../../assets/ic_right_arrow.png')}/>
        </TouchableOpacity>

      </View>
    )
  }

  _renderSection = ({item}) => {
    console.log("renderSection")
    console.log(item)
    return (
      <View style={styles.container}>
        <FlatList
          data={item.list}
          renderItem={this._renderSettingItem}
          keyExtractor = {this._keyExtractor}
        />
      </View>
    )
  }

  _renderSectionHeader = ({section}) => {
    if (section.showHeader) {
      return (
        <View style={styles.headerSectionContainer}>
          <PinkRoundedLabel text={section.title} style={styles.headerSection}/>
        </View>
      )
    } else {
      return null
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <StatusBar/>
        <View style={styles.headerContainer}>
          <Text style={styles.headerLabel}>Settings</Text>
        </View>
        <SectionList
          style={styles.sectionListContainer}
          keyExtractor={this._keyExtractor}
          stickySectionHeadersEnabled={false}
          onEndReachedThreshold={20}
          renderSectionHeader={this._renderSectionHeader}
          showsVerticalScrollIndicator={false}
          sections={[
            {data: [fakeData],showHeader: true, title: "ON TV", renderItem: this._renderSection},
            {data: [fakeData],showHeader: true, title: "ON TV", renderItem: this._renderSection},
            {data: [fakeData],showHeader: true, title: "ON TV", renderItem: this._renderSection},
            {data: [fakeData],showHeader: true, title: "ON TV", renderItem: this._renderSection},
          ]}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent'
  },
  sectionListContainer: {
    marginLeft: 15,
    marginRight: 15
  },
  headerContainer: {
    marginTop: 15,
    height: 36,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  headerLabel: {
    fontSize: 17,
    color: colors.greySettingLabel,
  },
  settingItemContainer: {
    width: '100%',
    flexDirection: 'row',
    height: 43,
    alignItems: 'center'
  },
  settingItemName: {
    fontSize: 16,
    color: colors.textMainBlack
  },
  settingItemValue: {
    fontSize: 14,
    color: colors.greySettingItemText,
    marginRight: 12
  },
  headerSection: {
    fontSize: 10,
    color: colors.whitePrimary
  },
  settingItemIcon: {
    marginRight: 23
  },
  headerSectionContainer: {
    flexDirection: 'row',
    marginBottom: 10
  }
})

const fakeData = {
  title: "ON TV",
  list: [
    {
      name: "Test",
      value: "Value"
    },
    {
      name: "Test",
      value: "Value"
    },
    {
      name: "Test",
      value: "Value"
    }]
}