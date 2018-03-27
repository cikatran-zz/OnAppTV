import React from 'react'
import {
  Text, Switch, View, StyleSheet, FlatList, Image, StatusBar,
  TouchableOpacity
} from 'react-native'
import { colors } from '../../utils/themeConfig'

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
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Root')} style={styles.backIcon}>
            <Image source={require('../../assets/ic_left_arrow.png')} />
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Audio Language</Text>
        </View>
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
  backIcon: {
    position: 'absolute',
    left: 18
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