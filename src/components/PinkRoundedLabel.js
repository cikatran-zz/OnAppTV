import React, {Component} from 'react'
import {
  StyleSheet, Text
} from 'react-native'
import {colors} from '../utils/themeConfig'
class PinkRoundedButton extends React.PureComponent{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <Text style={styles.labelStyle}>
        {this.props.text}
      </Text>

    )
  }
}
const styles = StyleSheet.create({
  labelStyle: {
    borderRadius: 30,
    padding: 8,
    backgroundColor: colors.mainPink,
    fontSize: 13,
    color: colors.textWhitePrimary
  },
});

export default PinkRoundedButton;