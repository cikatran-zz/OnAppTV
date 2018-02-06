import React from 'react'
import Home from './screens/Home'
import {StackNavigator, TabNavigator} from 'react-navigation'
import BottomTabbar from './components/BottomTabbar'

const TabNav = TabNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({navigation}) => ({
      header: null
    }),
  },
}, {
  tabBarComponent: ({navigation}) => <BottomTabbar navigation={navigation}/>,
  tabBarPosition: 'bottom'
})

export const ScreenStack = StackNavigator({
  Root: {
    screen: TabNav,
    navigationOptions: ({navigation}) => ({
      header: null
    }),
  },
});