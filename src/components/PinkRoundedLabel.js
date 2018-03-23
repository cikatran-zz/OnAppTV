import React from 'react'
import {
  StyleSheet, Text, Platform
} from 'react-native'
import {colors} from '../utils/themeConfig'
class PinkRoundedButton extends React.PureComponent{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <Text style={styles.labelStyle} >
        {this.props.text}
      </Text>

    )
  }
}
const styles = StyleSheet.create({
  labelStyle: {
    borderRadius: (Platform.OS === 'ios') ? 15 : 30,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: colors.mainPink,
    fontSize: 10,
    color: colors.textWhitePrimary,
      overflow: "hidden",
  },
});

export default PinkRoundedButton;
