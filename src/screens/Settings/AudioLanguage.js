import React from 'react'
import {
  Text, Switch, View, StyleSheet, FlatList, StatusBar
} from 'react-native'
import { colors } from '../../utils/themeConfig'
import SettingHeader from '../../components/SettingHeader'

export default class AudioLanguage extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  _renderListItem = ({item}) => {
    return (
      <View style={styles.listItemContainer}>
        <Text>{item.title}</Text>
        <Switch value={item.value} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'}/>
      </View>
    )
  }

  _keyExtractor = (item, index) => index

  render() {
    const {navigation} = this.props

    return (
      <View style={styles.container}>
        <StatusBar/>
        <SettingHeader text={'Audio Language'} backButton={true} navigation={navigation}/>
        <FlatList
          style={styles.listContainer}
          keyExtractor={this._keyExtractor}
          horizontal={false}
          renderItem={this._renderListItem}
          data={fakeData}
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
  listContainer: {
    marginTop: 46,
    marginLeft: 32,
    marginRight: 17
  },
  listItemContainer: {
    height: 43,
    flexDirection: 'row',
    alignItems: 'center'
  },
  toggleButton: {
    width: 40,
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
  value: false
},
  {
    title: 'French',
    value: true
  },
  {
    title: 'Spanish',
    value: false
  }]