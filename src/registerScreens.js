import React from 'react'
import Home from './screens/Home'
import VideoControlModal from './screens/VideoControlModal'
import {StackNavigator, TabNavigator} from 'react-navigation'
import BottomTabbar from './components/BottomTabbar'
import Zappers from "./screens/Zappers";
import Settings from "./screens/Settings";
import STBConnection from  './screens/STBConnection'
import Book from './screens/Book'
import AudioLanguage from './screens/Settings/AudioLanguage'
import Subtitles from './screens/Settings/Subtitles'
import Resolution from './screens/Settings/Resolution'
import VideoFormat from "./screens/Settings/VideoFormat";
import Messages from './screens/Settings/Messages'
import MySubscription from './screens/Settings/MySubscription'
import ParentalControlLock from './screens/Settings/ParentalControlLock'
import ParentalControl from './screens/Settings/ParentalControl'
import PersonalInformation from './screens/Settings/PersionalInformations'
import SignIn from './screens/Settings/SignIn'
import {colors} from "./utils/themeConfig";
import {Image, TouchableOpacity} from "react-native";
import MyCategories from "./screens/MyCategories";
import Category from "./screens/Category";


const defaultNavigationOptions =  (title, navigation, canBack=false)=> {
  var backButton = {
      headerLeft: <TouchableOpacity onPress={() => navigation.goBack(null)} style={{marginLeft: 18, paddingVertical: 10, paddingHorizontal: 10}} >
          <Image source={require('./assets/ic_left_arrow.png')}/>
      </TouchableOpacity>
  };
  if (!canBack) {
    backButton = {};
  }
  return {
      title: title,
      headerStyle: {
          backgroundColor: '#ffffff',
          shadowOpacity: 0,
          shadowOffset: {
              height: 0,
              width: 0
          },
          shadowColor: '#ffffff',
          shadowRadius: 0,
          elevation: 0,
          borderBottomWidth: 0
      },
      headerTitleStyle: {
          color: colors.greySettingLabel,
          textAlign: 'center',
          justifyContent: 'space-between',
          fontSize: 17,
          alignSelf: 'center',
          fontWeight: "normal"
      },
      ...backButton
  }
};

const HomeStack = StackNavigator({
    Home: {
        screen: Home,
        navigationOptions: ({navigation}) => ({
            header: null,
            gesturesEnabled: false
        }),
    },
    MyCategories: {
        screen: MyCategories,
        navigationOptions:({navigation}) => ({
            ...defaultNavigationOptions("My Categories", navigation, true)
        })
    },
    Category: {
        screen: Category,
        navigationOptions:({navigation}) => ({
            header: null,
            gesturesEnabled: false
        })
    }
});

const SettingsStack = StackNavigator({
    Setting: {
        screen: Settings,
        navigationOptions:({navigation}) => ({
            ...defaultNavigationOptions("Settings", navigation),
            gesturesEnabled: false
        })
    },
    AudioLanguage: {
        screen: AudioLanguage,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Audio Language", navigation, true)
        })
    },
    Subtitles: {
        screen: Subtitles,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Subtitles", navigation, true)
        })
    },
    Resolution: {
        screen: Resolution,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Resolution", navigation, true)
        })
    },
    VideoFormat: {
        screen: VideoFormat,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Video Format", navigation, true)
        })
    },
    Messages: {
        screen: Messages,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Messages", navigation, true)
        })
    },
    MySubscription: {
        screen: MySubscription,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("My Subscription", navigation, true)
        })
    },
    ParentalControlLock: {
        screen: ParentalControlLock,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("", navigation, true)
        })
    },
    ParentalControl: {
        screen: ParentalControl,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Parental Control", navigation, true)
        })
    },
    PersonalInformation: {
        screen: PersonalInformation,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Personal informations", navigation, true)
        })
    },
    SignIn: {
        screen: SignIn,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Sign in", navigation, true)
        })
    }
});

const TabNav = TabNavigator({
  Home: {
    screen: HomeStack,
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
        screen: SettingsStack,
        navigationOptions: ({navigation}) => ({
            header: null
        })
    }
}, {
  tabBarComponent: ({navigation}) => <BottomTabbar navigation={navigation}/>,
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: false
});

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
  },
}, {
  mode: 'modal',
  headerMode: 'none'
});