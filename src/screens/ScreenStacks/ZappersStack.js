import Zappers from "../Zappers";
import {StackNavigator} from "react-navigation";
import ZapperContent from "../Zappers/ZapperContent"
export default ZappersStack = StackNavigator({
    Zappers: {
        screen: Zappers,
        navigationOptions: ({navigation}) => ({
            header: null,
            gesturesEnabled: false,
        }),
    },
    ZapperContent: {
        screen: ZapperContent,
        navigationOptions: ({navigation}) => ({
            header: null,
            gesturesEnabled: false,
        }),
    }
});