import React from 'react'
import Home from './screens/Home'
import VideoControlModal from './screens/VideoControlModal'
import {StackNavigator, TabNavigator} from 'react-navigation'
import BottomTabbar from './components/BottomTabbar'
import STBConnection from  './screens/STBConnection'

const TabNav = TabNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({navigation}) => ({
      header: null
    }),
  },
}, {
  tabBarComponent: ({navigation}) => <BottomTabbar navigation={navigation}/>,
  tabBarPosition: 'bottom',
})

export const ScreenStack = StackNavigator({
  Root: {
    screen: STBConnection,
    // navigationOptions: ({navigation}) => ({
    //   header: null
    // }),
  },
  VideoControlModal: {
    screen: VideoControlModal
  },
    Home: {
        screen: TabNav,
        navigationOptions: ({navigation}) => ({
          header: null
        }),
    }

}, {
  mode: 'modal',
  headerMode: 'none',
});