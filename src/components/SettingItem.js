import React from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { colors } from '../utils/themeConfig'

export default class SettingItem extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  _renderIcon = (showIcon) => {
    if (showIcon) return <Image source={require('../assets/ic_wifi.png')} style={styles.settingItemIcon}/>
    else return null
  }

  render() {
    const {onPress, item, showIcon} = this.props

    return (
      <View style={styles.settingItemContainer}>
        {this._renderIcon(showIcon)}
        <Text style={styles.settingItemName}>{item.name}</Text>
        <TouchableOpacity style={{marginLeft: 'auto', flexDirection: 'row', alignItems: 'center'}} onPress={onPress}>
          <Text style={styles.settingItemValue}>{item.value}</Text>
          <Image source={require('../assets/ic_right_arrow.png')}/>
        </TouchableOpacity>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  settingItemContainer: {
    width: '100%',
    flexDirection: 'row',
    height: 43,
    alignItems: 'center'
  },
  settingItemName: {
    fontSize: 16,
    color: 'black'
  },
  settingItemValue: {
    fontSize: 14,
    color: colors.greySettingItemText,
    marginRight: 12
  },
  settingItemIcon: {
    marginRight: 23
  }
})