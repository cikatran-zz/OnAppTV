import React from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { colors } from '../utils/themeConfig'

export default class SettingHeader extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  _renderBack = () => {
    const {backButton, navigation} = this.props

    if (backButton) {
      return (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Image source={require('../assets/ic_left_arrow.png')} />
        </TouchableOpacity>
      )
    }
    else return null
  }

  render() {

    return (
      <View style={styles.headerContainer}>
        {this._renderBack()}
        <Text style={styles.headerLabel}>{this.props.text}</Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({
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
  }
})