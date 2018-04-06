import React from 'react'
import {
  Text, View, StyleSheet, StatusBar, Switch,
  FlatList
} from 'react-native'
import { colors } from '../../utils/themeConfig'
import SettingHeader from '../../components/NavigationHeader'

export default class ParentalControl extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  _keyExtractor = (item, index) => index

  _renderOption = ({item, index}) => {
    return (
      <View style={[styles.option, { marginLeft: index === 0 ? 0 : 12}]}>
        <Text style={styles.optionText}>{item.value}</Text>
      </View>
    )
  }

  _renderListOption = (data) => {
    return (
      <FlatList
        keyExtractor={this._keyExtractor}
        style={{width: '100%'}}
        horizontal={true}
        data={data}
        renderItem={this._renderOption}
      />
    )
  }

  render() {
    const {navigation} = this.props

    return (
      <View style={styles.container}>
        <StatusBar/>
        <View style={styles.mainContainer}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchHeaderText}>Parental Control</Text>
            <Switch value={true} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'}/>
          </View>
          <View style={styles.optionsContainer}>
            {this._renderListOption(fakeData)}
          </View>
        </View>
        <Text style={styles.textBelow}>Select the level of parental control</Text>
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
  mainContainer: {
    margin: 45,
    marginBottom: 0,
    borderRadius: 13,
    height: '60%',
    width: '75%',
    backgroundColor: colors.greyParentalLock,
  },
  switchContainer: {
    margin: 23,
    paddingBottom: 23,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.whitePrimary
  },
  switchHeaderText: {
    fontSize: 15,
    color: colors.whitePrimary
  },
  toggleButton: {
    width: 40,
    height: 26,
    marginRight: 15
  },
  optionsContainer: {
    marginTop: 120,
    marginLeft: 23,
    marginRight: 23,
    width: '100%',
  },
  option: {
    width: 50,
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.whitePrimary
  },
  optionText: {
    color: colors.whitePrimary,
    fontSize: 26
  },
  textBelow: {
    marginTop: 15,
    alignSelf: 'center',
    fontSize: 13,
    color: colors.greyTextBelowParentControl
  }
})

const fakeData = [{
  value: 18
},
  {
    value: 16
  },
  {
    value: 12
  },
  {
    value: 10
  }]
