import Home from "../Home";
import {StackNavigator} from "react-navigation";
import defaultNavigationOptions from "../../utils/navigationOption";
import SignIn from '../SignUp/SignIn'
import SignUp from '../SignUp'
import CreateAccount from '../SignUp/CreateAccount'

export default IdentityStack = StackNavigator({
  SignUp: {
    screen: SignUp,
    navigationOptions: ({navigation}) => ({
      ...defaultNavigationOptions("Sign Up", navigation, true),
      header: null
    })
  },
  SignIn: {
    screen: SignIn,
    navigationOptions: ({navigation}) => ({
      ...defaultNavigationOptions("Sign In", navigation, true),
      header: null
    })
  },
  CreateAccount: {
    screen: CreateAccount,
    navigationOptions: ({navigation}) => ({
      ...defaultNavigationOptions("Create Account", navigation, true),
      header: null
    })
  }
})