import React from 'react'
import {
  Text, Switch, View, StyleSheet, FlatList, StatusBar, Platform
} from 'react-native'
import { colors } from '../../utils/themeConfig'
import ChoosingScreen from '../../components/ChoosingScreen'

export default class AudioLanguage extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  _keyExtractor = (item, index) => index

  render() {
    const {navigation} = this.props

    return (
      <View style={styles.container}>
          <StatusBar
              translucent={true}
              backgroundColor='#00000000'
              barStyle='dark-content' />
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
});