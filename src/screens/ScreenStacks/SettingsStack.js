import ParentalControlLock from "../Settings/ParentalControlLock";
import PersonalInformation from "../Settings/PersionalInformations";
import Resolution from "../Settings/Resolution";
import MySubscription from "../Settings/MySubscription";
import ParentalControl from "../Settings/ParentalControl";
import AudioLanguage from "../Settings/AudioLanguage";
import Messages from "../Settings/Messages";
import Subtitles from "../Settings/Subtitles";
import Settings from "../Settings";
import {StackNavigator} from "react-navigation";
import VideoFormat from "../Settings/VideoFormat";
import SignIn from "../Settings/SignIn";
import defaultNavigationOptions from "../../utils/navigationOption";

export default SettingsStack = StackNavigator({
    Setting: {
        screen: Settings,
        navigationOptions: ({navigation}) => ({
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