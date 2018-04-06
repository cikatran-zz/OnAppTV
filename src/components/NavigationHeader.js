import React from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { colors } from '../utils/themeConfig'

export default class NavigationHeader extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  render() {

    return (
      <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => {this.props.onPress()}} style={styles.backIcon}>
              <Image source={require('../assets/ic_left_arrow.png')} />
          </TouchableOpacity>
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