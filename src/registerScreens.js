import Home from './screens/Home'
import {StackNavigator} from 'react-navigation'

export const ScreenStack = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({navigation}) => ({
      header: null
    }),
  },
});
