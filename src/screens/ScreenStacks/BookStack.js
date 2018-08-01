import Book from "../Book";
import {StackNavigator} from "react-navigation";
import defaultNavigationOptions from "../../utils/navigationOption";

export default BookStack = StackNavigator({
    Book: {
        screen: Book,
        navigationOptions: ({navigation}) => ({
            header: null,
            gesturesEnabled: false,
        }),
    }
});