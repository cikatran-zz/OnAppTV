import {StackNavigator} from "react-navigation";
import Zappers from '../../screens/Zappers'

export default ZapperStack = StackNavigator({
    Zappers: {
        screen: Zappers,
        navigationOptions: ({navigation}) => ({
            header: null,
            gesturesEnabled: false,
        }),
    },
});