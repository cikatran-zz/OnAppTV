import React from 'react'
import VideoControlModal from './screens/VideoControlModal'
import {StackNavigator, TabNavigator} from 'react-navigation'
import BottomTabbar from './components/BottomTabbar'
import STBConnection from './screens/STBConnection'
import HomeStack from './screens/ScreenStacks/HomeStack';
import ZappersStack from "./screens/ScreenStacks/ZappersStack";
import SettingsStack from "./screens/ScreenStacks/SettingsStack";
import BookStack from "./screens/ScreenStacks/BookStack";

const TabNav = TabNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: ({navigation}) => ({
            header: null,
        }),
    },
    Zappers: {
        screen: ZappersStack,
        navigationOptions: ({navigation}) => ({
            header: null,
        }),
    },
    Book: {
        screen: BookStack,
        navigationOptions: ({navigation}) => ({
            header: null
        })
    },
    Setting: {
        screen: SettingsStack,
        navigationOptions: ({navigation}) => ({
            header: null
        })
    }
}, {
    tabBarComponent: ({navigation}) => <BottomTabbar navigation={navigation}/>,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
});

export const ScreenStack = StackNavigator({
    Root: {
        screen: STBConnection
    },
    Home: {
        screen: TabNav,
    },
    VideoControlModal: {
        screen: VideoControlModal
    },
}, {
    mode: 'modal',
    headerMode: 'none'
});