import PersonalInformation from "../Settings/PersonalInformation";
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
import Privacy from "../Settings/Privacy";
import Authorization from "../Settings/Authorization";
import STBSelfTests from "../Settings/STBSelfTests";
import SelectOperator from "../Settings/SelectOperator";
import FormatHDD from "../Settings/FormatHDD";
import AtennaTests from "../Settings/AtennaTests";
import TimeShiftConfig from "../Settings/TimeShiftConfig";

export default SettingsStack = StackNavigator({
    Setting: {
        screen: Settings,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Settings", navigation),
            gesturesEnabled: false
        })
    },
    FormatHDD: {
        screen: FormatHDD,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Format HDD", navigation, true)
        })
    },
    AtennaTests: {
        screen: AtennaTests,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Athena tests", navigation, true)
        })
    },
    TimeShiftConfig: {
        screen: TimeShiftConfig,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Timeshift config", navigation, true)
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
            ...defaultNavigationOptions("My personal information", navigation, true)
        })
    },
    SignIn: {
        screen: SignIn,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Sign in", navigation, true)
        })
    },
    Privacy: {
        screen: Privacy,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Privacy", navigation, true)
        })
    },
    Authorization: {
        screen: Authorization,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Authorization", navigation, true)
        })
    },
    STBSelfTests: {
        screen: STBSelfTests,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("STB self tests", navigation, true)
        })
    },
    SelectOperator: {
        screen: SelectOperator,
        navigationOptions: ({navigation}) => ({
            ...defaultNavigationOptions("Select Operator", navigation, true)
        })
    },
});