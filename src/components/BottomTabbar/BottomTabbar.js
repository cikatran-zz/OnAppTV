import React from 'react'
import {
  StyleSheet, Text, View, TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import {colors, textWhiteDefault} from '../../utils/themeConfig'
import BlurView from '../BlurView'
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const tabs = [
  'Home',
  'Zappers',
  'Video',
  'Book',
  'Setting',
];



class BottomTabbar extends React.PureComponent {
  constructor(props){
    super(props);
  }

  componentDidMount() {

  }
  _renderTab = (tab, i) => {
    const {navigation} = this.props;
    let {index} = navigation.state;
    if (i == 2) {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate("VideoControlModal")}
          style={styles.tab}
          key={tab}
        >
          <AnimatedCircularProgress size={30} width={1} fill={75} tintColor={colors.whitePrimary}/>
        </TouchableOpacity>
      )
    } else {
      if (i > 2)
        index++;
      let isActive = i === index;
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(tab);
          }}
          style={styles.tab}
          key={tab}
        >
          <Text style={isActive ? styles.tabTextActive : styles.tabTextInActive}>{tab}</Text>
        </TouchableOpacity>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <BlurView blurRadius={100} overlayColor={1} style={styles.blurview}/>
        {tabs.map((tab, i) =>
          this._renderTab(tab, i)
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    right: 0,
    left: 0,
    bottom:0,
    backgroundColor: colors.greyOpacity,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    height: '8%'
  },
  blurview: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right:0,
    height: '100%'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'transparent'
  },
  tabTextActive: {
    color: colors.textWhitePrimary,
    fontSize: 11,
    backgroundColor:'transparent'
  },
  tabTextInActive: {
    color: colors.greyOpacity,
    fontSize: 11,
    backgroundColor:'transparent'
  }
})
BottomTabbar.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default BottomTabbar