import Home from './screens/Home'
import Category from './screens/Category'
import {StackNavigator} from 'react-navigation'

export const ScreenStack = StackNavigator({
  // Home: {
    //       screen: Home,
    //       navigationOptions: ({navigation}) => ({
    //           header: null
    //       }),
    //   },
    Category: {
        screen: Category,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    },
});
