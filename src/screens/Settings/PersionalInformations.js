import React from 'react'
import {
  Text, Switch, View, StyleSheet, FlatList, StatusBar
} from 'react-native'
import { colors } from '../../utils/themeConfig'
import SettingHeader from '../../components/SettingHeader'
import SettingItem from '../../components/SettingItem'

export default class PersonalInformation extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  _renderItem = ({item}) => {

    return (<SettingItem item={item}/>)
  }

  _keyExtractor = (item, index) => index

  render() {
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <SettingHeader text={'Personal Informations'} backButton={true} navigation={navigation}/>
          <FlatList
            style={styles.listContainer}
            horizontal={false}
            keyExtractor={this._keyExtractor}
            data={fakeData.list}
            renderItem={this._renderItem}
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
    marginTop: 60,
    marginLeft: 32,
    marginRight: 17
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