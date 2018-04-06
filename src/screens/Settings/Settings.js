import React from 'react'
import {
  Text, View, StyleSheet, FlatList, SectionList, StatusBar
} from 'react-native'
import { colors } from '../../utils/themeConfig'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import SettingItem from '../../components/SettingItem'
import SettingHeader from '../../components/SettingHeader'
import { rootViewTopPadding } from '../../utils/rootViewTopPadding'

export default class Settings extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  _keyExtractor = (item, index) => index

  _renderSettingItem = ({item}) => {
    const {navigation} = this.props

    return (<SettingItem showIcon={true} onPress={() => navigation.navigate(item.raw, {})} item={item}/>)
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
        <SettingHeader text={'Settings'}/>
        <SectionList
          style={styles.sectionListContainer}
          keyExtractor={this._keyExtractor}
          stickySectionHeadersEnabled={false}
          onEndReachedThreshold={20}
          renderSectionHeader={this._renderSectionHeader}
          showsVerticalScrollIndicator={false}
          sections={[
            {data: [fakeData],showHeader: true, title: "ON TV", renderItem: this._renderSection}
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
    backgroundColor: 'transparent',
    paddingTop: rootViewTopPadding()
  },
  sectionListContainer: {
    marginLeft: 15,
    marginRight: 15
  },
  headerSection: {
    fontSize: 10,
    color: colors.whitePrimary
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
      name: "Audio Language",
      value: "English",
      raw: 'AudioLanguage'
    },
    {
      name: "Parental Control",
      value: "",
      raw: 'ParentalControlLock'
    },
    {
      name: "Personal Information",
      value: "",
      raw: 'PersonalInformation'
    },
    {
      name: 'My Messages',
      value: '',
      raw: 'Messages'
    },
    {
      name: 'My Subscription',
      value: '',
      raw: 'MySubscription'
    },
    {
      name: 'Sign In',
      value: '',
      raw: 'SignIn'
    }]
}