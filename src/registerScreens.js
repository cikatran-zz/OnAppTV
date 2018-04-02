import React from 'react'
import Home from './screens/Home'
import VideoControlModal from './screens/VideoControlModal'
import {StackNavigator, TabNavigator} from 'react-navigation'
import BottomTabbar from './components/BottomTabbar'
import Zappers from "./screens/Zappers";
import Settings from "./screens/Settings";
import STBConnection from  './screens/STBConnection'
import Book from './screens/Bookmarks/Book'

const TabNav = TabNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({navigation}) => ({
      header: null
    }),
  },
    Zappers: {
        screen: Zappers,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    },
  Book: {
    screen: Book,
    navigationOptions: ({navigation}) => ({
      header: null
    })
  },
    Setting: {
        screen: Settings,
        navigationOptions: ({navigation}) => ({
            header: null
        })
    }
}, {
  tabBarComponent: ({navigation}) => <BottomTabbar navigation={navigation}/>,
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: false
})

export const ScreenStack = StackNavigator({
  Root: {
    screen: STBConnection
  },
  Home: {
    screen: TabNav,
    navigationOptions: ({navigation}) => ({
      header: null
    }),
  },
  VideoControlModal: {
    screen: VideoControlModal
  }

}, {
  mode: 'modal',
  headerMode: 'none'
});