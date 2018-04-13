import Zappers from "../Zappers";
import {StackNavigator} from "react-navigation";
import defaultNavigationOptions from "../../utils/navigationOption";

export default ZappersStack = StackNavigator({
    Zappers: {
        screen: Zappers,
        navigationOptions: ({navigation}) => ({
            header: null,
            gesturesEnabled: false,
        }),
    }
});