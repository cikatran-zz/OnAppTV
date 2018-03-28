import React from 'react'
import {
  Text, View, StyleSheet, FlatList, SectionList, StatusBar
} from 'react-native'
import { colors } from '../../utils/themeConfig'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import SettingItem from '../../components/SettingItem'
import SettingHeader from '../../components/SettingHeader'

export default class MySubscription extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  _keyExtractor = (item, index) => index

  _renderInfoItem = ({item}) => {
    return (
      <SettingItem item={item} showIcon={false}/>
    )
  }

  _renderInfoSection = (data) => {
    console.log(data)
    return (
      <FlatList
        keyExtractor={this._keyExtractor}
        style={styles.listInfoContainer}
        horizontal={false}
        data={data}
        renderItem={this._renderInfoItem}
      />
    )
  }

  _renderPackagesSection = ({data}) => {

  }

  render() {
    return (
      <View style={styles.container}>
        <SettingHeader text={'My Subscription'} backButton={true} navigation={this.props.navigation}/>
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
  listInfoContainer: {
    marginTop: 60,
    marginLeft: 32,
    marginRight: 17
  },
  sectionListContainer: {
    marginLeft: 15,
    marginRight: 15
  },

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