import React from 'react'
import { Text, ImageBackground, View, StyleSheet, FlatList } from 'react-native'
import { colors } from '../../utils/themeConfig'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'

export default class Settings extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  _renderSettingItem = ({item}) => {
    return (
      <View style={styles.settingItemContainer}>
        <Text style={styles.settingItemName}>Sample Text</Text>
      </View>
    )
  }

  _renderSection = ({data}) => {
    return (
      <View style={styles.container}>
        <PinkRoundedLabel text={data ? data.title : "ON TV"}/>
        <FlatList
          data={data.list}
          renderItem={this._renderSettingItem}
        />
      </View>
    )
  }

  render() {

    return (
      <View style={styles.container}>
        {this._renderSection(fakeData)}
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
  headerLabel: {
    width: '100%',
    textAlign: 'center',
    fontSize: 17,
    color: colors.greySettingLabel
  },
  settingItemContainer: {
    width: '100%',
    flexDirection: 'row',
    height: 43
  },
  settingItemName: {
    fontSize: 16,
    color: colors.textMainBlack
  },
  settingItemValue: {
    fontSize: 14,
    color: colors.greySettingItemText
  }
})

const fakeData = [{
  title: "ON TV",
  list: [
    {
    test: "Test"
    },
    {
      test: "Test"
    },
    {
      test: "Test"
    }]
}]