import React from 'react'
import {
  Text, Switch, View, StyleSheet, FlatList, StatusBar, Platform
} from 'react-native'
import { colors } from '../../utils/themeConfig'
import SettingHeader from '../../components/NavigationHeader'

export default class AudioLanguage extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  _renderSwitch(item) {
      if (Platform.OS == "ios") {
          return (<Switch value={item.value} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'}/>)
      }
      return (<Switch value={item.value} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'} thumbTintColor={'#ffffff'}/>)
  }

  _renderListItem = ({item}) => {
    return (
      <View style={styles.listItemContainer}>
        <Text>{item.title}</Text>
          {
              this._renderSwitch(item)
          }

      </View>
    )
  }

  _keyExtractor = (item, index) => index

  render() {
    const {navigation} = this.props

    return (
      <View style={styles.container}>
        <StatusBar/>
        <FlatList
          style={styles.listContainer}
          keyExtractor={this._keyExtractor}
          horizontal={false}
          renderItem={this._renderListItem}
          data={fakeData}
          ItemSeparatorComponent={ () => <View style={{ width: "90%", height: 1, backgroundColor: 'red'}}/> }
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff'
  },
  listContainer: {
    marginTop: 46,
    marginLeft: 32,
    marginRight: 17
  },
  listItemContainer: {
    height: 43,
    flexDirection: 'row',
    alignItems: 'center',
      backgroundColor: "#ffffff"
  },
  toggleButton: {
    width: 45,
    height: 26,
    marginLeft: 'auto',
    marginRight: 17
  },
  itemName: {
    fontSize: 16,
    color: colors.textMainBlack,
  }
})

const fakeData = [{
  title: 'English',
  value: true
},
  {
    title: 'French',
    value: false
  },
  {
    title: 'Spanish',
    value: false
  }]