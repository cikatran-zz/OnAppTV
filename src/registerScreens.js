import React from 'react'
import Home from './screens/Home'
import VideoControlModal from './screens/VideoControlModal'
import {StackNavigator, TabNavigator} from 'react-navigation'
import BottomTabbar from './components/BottomTabbar'
import Bookmark from './screens/Bookmarks/Bookmark'
import RecordList from './screens/Bookmarks/RecordList'
import Book from './screens/Bookmarks/Book'
//import STBConnection from  './screens/STBConnection'

const TabNav = TabNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({navigation}) => ({
      header: null
    }),
  },
  Zapper: {
    screen: Home,
    navigationOptions: ({navigation}) => ({
      header: null
    })
  },
  Book: {
    screen: Book,
    navigationOptions: ({navigation}) => ({
      header: null
    })
  }
}, {
  tabBarComponent: ({navigation}) => <BottomTabbar navigation={navigation}/>,
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  lazyload: true,
  animationEnabled: false
})

export const ScreenStack = StackNavigator({
  //Home: {
    //screen: STBConnection,
    // navigationOptions: ({navigation}) => ({
    //   header: null
    // }),
  //},
  Root: {
    screen: TabNav,
    navigationOptions: ({navigation}) => ({
      header: null
    }),
  },
  VideoControlModal: {
    screen: Book
  },
  Bookmark: {
    screen: Bookmark
  },
  Book: {
    screen: Book
  },
  RecordList: {
    screen: RecordList
  }


}, {
  mode: 'modal',
  headerMode: 'none',
});